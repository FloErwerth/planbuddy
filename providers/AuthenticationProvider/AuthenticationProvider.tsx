import { useQueryClient } from "@tanstack/react-query";
import { SplashScreen } from "expo-router";
import { createContext, type PropsWithChildren, useContext, useEffect, useState } from "react";
import { supabase } from "@/api/supabase";
import { getUserSupabaseQuery } from "@/api/user/getUser/query";
import { type User, userSchema } from "@/api/user/types";

type AuthenticationContextType = {
	isAuthenticatedWithSupabase: boolean;
	user: User;
	logout: () => void;
	setUser: (user: User | null) => void;
	setIsAuthenticatedWithSupabase: (isAuthenticatedWithSupabase: boolean) => void;
	recheckLoginState: () => void;
};

const AuthenticationContext = createContext<AuthenticationContextType | undefined>(undefined);

export const useAuthenticationContext = () => {
	const context = useContext(AuthenticationContext);
	if (!context) {
		throw new Error("AuthenticationContext must be used within a AuthenticationProvider");
	}
	return context;
};

export const AuthenticationProvider = ({ children }: PropsWithChildren) => {
	const [isAuthenticatedWithSupabase, setIsAuthenticatedWithSupabase] = useState(false);
	const [user, setUser] = useState<User | null>(null);
	const queryClient = useQueryClient();

	const resetAuthenticationFields = () => {
		setIsAuthenticatedWithSupabase(false);
		setUser(null);
	};

	const logout = async () => {
		const result = await supabase.auth.signOut();

		if (result.error) {
			// login failed
			return;
		}

		resetAuthenticationFields;
		await queryClient.invalidateQueries();
	};

	const recheckLoginState = () => {
		supabase.auth
			.getUser()
			.then(async (user) => {
				if (user === null || user.data.user === null) {
					resetAuthenticationFields();
					return;
				}
				setIsAuthenticatedWithSupabase(true);
				const userFromDb = await getUserSupabaseQuery(user.data.user.id);
				const parsedUserFromDb = userSchema.safeParse(userFromDb.data);
				if (parsedUserFromDb.success) {
					setUser(parsedUserFromDb.data);
				} else {
					setUser(null);
				}
			})
			.catch((e) => {
				console.log(e);
			})
			.finally(() => {
				setTimeout(() => {
					void SplashScreen.hideAsync();
				}, 500);
			});
	};

	/**
	 * Checks if the user is authenticated with Supabase and fetches the user from the database
	 * case 1: user session is not found by supabase: reset authentication fields
	 * case 2: user session is found by supabase but user is not in db: set authentication flag to true, set user to null
	 * case 3: user session is found by supabase and user is found in the database: set user
	 */
	// biome-ignore lint/correctness/useExhaustiveDependencies: reason
	useEffect(() => {
		recheckLoginState();
	}, []);

	return (
		// @ts-expect-error user is not null, since we have proteced routes
		<AuthenticationContext.Provider value={{ setUser, isAuthenticatedWithSupabase, logout, user, setIsAuthenticatedWithSupabase, recheckLoginState }}>
			{children}
		</AuthenticationContext.Provider>
	);
};

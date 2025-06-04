export type User = {
  id?: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  eventIds: string[];
  wasOnboarded: boolean;
};

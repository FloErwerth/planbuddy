import type { resources } from "@/translation/i18n/config";

declare module "i18next" {
	interface CustomTypeOptions {
		resources: (typeof resources)["de"];
	}
}

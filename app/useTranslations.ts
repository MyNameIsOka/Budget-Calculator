import { useCallback } from "react";
import { translations } from "./translations";
import type { Language, TranslationKeys } from "./types";

export const useTranslations = (language: Language) => {
	const t = useCallback(
		(key: string, placeholders?: Record<string, string>) => {
			const keys = key.split(".");
			let value: any = translations[language];

			for (const k of keys) {
				if (value && typeof value === "object" && k in value) {
					value = value[k];
				} else {
					return key;
				}
			}

			if (typeof value === "string" && placeholders) {
				return value.replace(
					/\{(\w+)\}/g,
					(_, key) => placeholders[key] || `{${key}}`,
				);
			}

			return value || key;
		},
		[language],
	);

	return t;
};

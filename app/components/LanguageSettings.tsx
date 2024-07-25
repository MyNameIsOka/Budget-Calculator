import type React from "react";
import { useEffect, useState } from "react";
import { Box, Flex, Text, Heading, Card, RadioGroup } from "@radix-ui/themes";
import { useTranslation } from "react-i18next";

const LanguageSettings: React.FC = () => {
	const { t, i18n } = useTranslation();
	const [currentLanguage, setCurrentLanguage] = useState(i18n.language);

	useEffect(() => {
		// Update the current language when i18n.language changes
		setCurrentLanguage(i18n.language);
	}, [i18n.language]);

	const changeLanguage = (lng: string) => {
		i18n.changeLanguage(lng);
		localStorage.setItem("i18nextLng", lng);
	};

	return (
		<Card className="w-full">
			<Box>
				<Heading size="3" mb="2">
					{t("languageSettings.title")}
				</Heading>
				<RadioGroup.Root
					value={currentLanguage.startsWith("en") ? "en" : currentLanguage}
					onValueChange={changeLanguage}
				>
					<Flex direction="column" gap="2">
						<Text as="label" size="2">
							<Flex gap="2" align="center">
								<RadioGroup.Item value="en" /> {t("languageSettings.en")}
							</Flex>
						</Text>
						<Text as="label" size="2">
							<Flex gap="2" align="center">
								<RadioGroup.Item value="ja" /> {t("languageSettings.ja")}
							</Flex>
						</Text>
					</Flex>
				</RadioGroup.Root>
			</Box>
		</Card>
	);
};

export default LanguageSettings;

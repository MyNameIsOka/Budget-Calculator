import type React from "react";
import { Box, Flex, Text, Heading, Card, RadioGroup } from "@radix-ui/themes";
import type { Language } from "~/types";

type LanguageSettingsProps = {
	language: Language;
	setLanguage: (language: Language) => void;
	t: (key: string, placeholders?: Record<string, string>) => string;
};

const LanguageSettings: React.FC<LanguageSettingsProps> = ({
	language,
	setLanguage,
	t,
}) => {
	return (
		<Card style={{ width: "100%" }}>
			<Box>
				<Heading size="3" mb="2">
					{t("languageSettings.title")}
				</Heading>
				<RadioGroup.Root
					value={language}
					onValueChange={(value) => setLanguage(value as Language)}
				>
					<Flex gap="2" direction="column">
						<Text as="label" size="2">
							<Flex gap="2">
								<RadioGroup.Item value="en" /> {t("languageSettings.en")}
							</Flex>
						</Text>
						<Text as="label" size="2">
							<Flex gap="2">
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

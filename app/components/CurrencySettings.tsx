import { Box, Text, RadioGroup, Flex, Heading } from "@radix-ui/themes";
import { useTranslation } from "react-i18next";

type CurrencySettingsProps = {
	foreignCurrency: string;
	setForeignCurrency: (currency: string) => void;
	exchangeRate: number;
};

export default function CurrencySettings({
	foreignCurrency,
	setForeignCurrency,
	exchangeRate,
}: CurrencySettingsProps) {
	const { t } = useTranslation();

	const displayExchangeRate = () => {
		return `1 ${foreignCurrency} = ${exchangeRate.toFixed(2)} JPY`;
	};

	return (
		<Box>
			<Heading size="3" mb="3">
				{t("currencySettings.title")}
			</Heading>
			<RadioGroup.Root
				value={foreignCurrency}
				onValueChange={setForeignCurrency}
			>
				<Flex gap="2">
					<Text as="label" size="2">
						<Flex gap="2">
							<RadioGroup.Item value="USD" /> USD
						</Flex>
					</Text>
					<Text as="label" size="2">
						<Flex gap="2">
							<RadioGroup.Item value="EUR" /> EUR
						</Flex>
					</Text>
				</Flex>
			</RadioGroup.Root>
			<Text size="2">{displayExchangeRate()}</Text>
		</Box>
	);
}

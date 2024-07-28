import { Flex, Text } from "@radix-ui/themes";
import { useEffect, useState } from "react";
import { getExchangeRates } from "~/utils/exchangeRate";

export default function ExchangeRateDisplay({
	foreignCurrency,
}: {
	foreignCurrency: string;
}) {
	const [exchangeRate, setExchangeRate] = useState<number | null>(null);

	useEffect(() => {
		const fetchExchangeRate = async () => {
			const rates = await getExchangeRates();
			setExchangeRate(rates.USD);
		};
		fetchExchangeRate();
	}, []);

	if (exchangeRate === null) {
		return <Text size="2">Loading exchange rate...</Text>;
	}

	return (
		<Flex align="center" gap="2">
			<Text size="2">1 {foreignCurrency} =</Text>
			<Text size="2">{exchangeRate.toFixed(2)} USD</Text>
		</Flex>
	);
}

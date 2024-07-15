import type React from "react";
import { Box, Flex, Text, TextField } from "@radix-ui/themes";

type BitcoinPricesProps = {
	btcPurchasePrice: number;
	btcSalePrice: number;
	setBtcPurchasePrice: (price: number) => void;
	setBtcSalePrice: (price: number) => void;
	foreignCurrency: string;
};

const BitcoinPrices: React.FC<BitcoinPricesProps> = ({
	btcPurchasePrice,
	btcSalePrice,
	setBtcPurchasePrice,
	setBtcSalePrice,
	foreignCurrency,
}) => {
	return (
		<Box mb="6">
			<Text as="h2" size="5" weight="bold" mb="4">
				Bitcoin Prices
			</Text>
			<Flex direction="column" gap="4">
				<Box>
					<Text as="label" size="2" weight="bold" mb="2">
						BTC Purchase Price ({foreignCurrency}):
					</Text>
					<TextField.Root
						type="number"
						value={btcPurchasePrice}
						onChange={(e) => setBtcPurchasePrice(Number(e.target.value) || 0)}
					/>
				</Box>
				<Box>
					<Text as="label" size="2" weight="bold" mb="2">
						BTC Sale Price ({foreignCurrency}):
					</Text>
					<TextField.Root
						type="number"
						value={btcSalePrice}
						onChange={(e) => setBtcSalePrice(Number(e.target.value) || 0)}
					/>
				</Box>
			</Flex>
		</Box>
	);
};

export default BitcoinPrices;

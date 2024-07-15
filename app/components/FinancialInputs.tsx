import type React from "react";
import { Box, Flex, Text, TextField } from "@radix-ui/themes";

type FinancialInputsProps = {
	yearlyIncome: number;
	setYearlyIncome: (income: number) => void;
	btcPurchasePrice: number;
	setBtcPurchasePrice: (price: number) => void;
	btcSalePrice: number;
	setBtcSalePrice: (price: number) => void;
	foreignCurrency: string;
};

const formatNumberWithCommas = (value: string) => {
	const numericValue = value.replace(/[^0-9]/g, "");
	return numericValue.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

const FinancialInputs: React.FC<FinancialInputsProps> = ({
	yearlyIncome,
	setYearlyIncome,
	btcPurchasePrice,
	setBtcPurchasePrice,
	btcSalePrice,
	setBtcSalePrice,
	foreignCurrency,
}) => {
	return (
		<Box mb="6">
			<Text as="h2" size="5" weight="bold" mb="4">
				Financial Inputs
			</Text>
			<Flex direction="column" gap="4">
				<Box>
					<Text as="label" size="2" weight="bold" mb="2">
						Yearly Income (JPY):
					</Text>
					<TextField.Root
						value={formatNumberWithCommas(yearlyIncome.toString())}
						onChange={(e) =>
							setYearlyIncome(Number(e.target.value.replace(/,/g, "")))
						}
					/>
				</Box>
				<Box>
					<Text as="label" size="2" weight="bold" mb="2">
						BTC Purchase Price ({foreignCurrency}):
					</Text>
					<TextField.Root
						value={formatNumberWithCommas(btcPurchasePrice.toString())}
						onChange={(e) =>
							setBtcPurchasePrice(Number(e.target.value.replace(/,/g, "")))
						}
					/>
				</Box>
				<Box>
					<Text as="label" size="2" weight="bold" mb="2">
						BTC Sale Price ({foreignCurrency}):
					</Text>
					<TextField.Root
						value={formatNumberWithCommas(btcSalePrice.toString())}
						onChange={(e) =>
							setBtcSalePrice(Number(e.target.value.replace(/,/g, "")))
						}
					/>
				</Box>
			</Flex>
		</Box>
	);
};

export default FinancialInputs;

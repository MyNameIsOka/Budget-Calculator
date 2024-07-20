import type React from "react";
import { Box, Flex, Text, TextField, Heading, Card } from "@radix-ui/themes";

type FinancialInputsProps = {
	yearlyIncome: number;
	setYearlyIncome: (income: number) => void;
	btcPurchasePrice: number;
	setBtcPurchasePrice: (price: number) => void;
	btcSalePrice: number;
	setBtcSalePrice: (price: number) => void;
	loanAmountJPY: number;
	setLoanAmountJPY: (amount: number) => void;
	loanAmountForeign: number;
	setLoanAmountForeign: (amount: number) => void;
	foreignCurrency: string;
	exchangeRate: number;
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
	loanAmountJPY,
	setLoanAmountJPY,
	loanAmountForeign,
	setLoanAmountForeign,
	foreignCurrency,
	exchangeRate,
}) => {
	const handleLoanJPYChange = (value: string) => {
		const amount = Number(value.replace(/,/g, ""));
		setLoanAmountJPY(amount);
		setLoanAmountForeign(Number((amount / exchangeRate).toFixed(2)));
	};

	const handleLoanForeignChange = (value: string) => {
		const amount = Number(value.replace(/,/g, ""));
		setLoanAmountForeign(amount);
		setLoanAmountJPY(Number((amount * exchangeRate).toFixed(0)));
	};

	return (
		<Card style={{ width: "100%" }}>
			<Heading size="3" mb="3">
				Financial Inputs
			</Heading>
			<Flex direction="column" gap="2">
				<Box>
					<Text as="label" size="1" weight="bold">
						Yearly Income (JPY)
					</Text>
					<TextField.Root
						size="1"
						value={formatNumberWithCommas(yearlyIncome.toString())}
						onChange={(e) =>
							setYearlyIncome(Number(e.target.value.replace(/,/g, "")))
						}
					/>
				</Box>
				<Box>
					<Text as="label" size="1" weight="bold">
						BTC Purchase Price ({foreignCurrency})
					</Text>
					<TextField.Root
						size="1"
						value={formatNumberWithCommas(btcPurchasePrice.toString())}
						onChange={(e) =>
							setBtcPurchasePrice(Number(e.target.value.replace(/,/g, "")))
						}
					/>
				</Box>
				<Box>
					<Text as="label" size="1" weight="bold">
						BTC Sale Price ({foreignCurrency})
					</Text>
					<TextField.Root
						size="1"
						value={formatNumberWithCommas(btcSalePrice.toString())}
						onChange={(e) =>
							setBtcSalePrice(Number(e.target.value.replace(/,/g, "")))
						}
					/>
				</Box>
				<Box>
					<Text as="label" size="1" weight="bold">
						Loan Amount (JPY)
					</Text>
					<TextField.Root
						size="1"
						value={formatNumberWithCommas(loanAmountJPY.toString())}
						onChange={(e) => handleLoanJPYChange(e.target.value)}
					/>
				</Box>
				<Box>
					<Text as="label" size="1" weight="bold">
						Loan Amount ({foreignCurrency})
					</Text>
					<TextField.Root
						size="1"
						value={formatNumberWithCommas(loanAmountForeign.toString())}
						onChange={(e) => handleLoanForeignChange(e.target.value)}
					/>
				</Box>
			</Flex>
		</Card>
	);
};

export default FinancialInputs;

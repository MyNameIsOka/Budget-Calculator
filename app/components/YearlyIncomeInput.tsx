import type React from "react";
import { Box, Flex, Text, TextField } from "@radix-ui/themes";
import { formatCurrency } from "../utils/calculations";

type YearlyIncomeInputProps = {
	yearlyIncome: number;
	setYearlyIncome: (income: number) => void;
};

const YearlyIncomeInput: React.FC<YearlyIncomeInputProps> = ({
	yearlyIncome,
	setYearlyIncome,
}) => {
	return (
		<Box mb="6">
			<Text as="h2" size="5" weight="bold" mb="4">
				Yearly Income
			</Text>
			<Flex direction="row" gap="4" align="center">
				<Box flex="1">
					<Text as="label" size="2" weight="bold" mb="2">
						Yearly Income (JPY):
					</Text>
					<TextField.Root
						type="number"
						value={yearlyIncome}
						onChange={(e) => setYearlyIncome(Number(e.target.value) || 0)}
					/>
				</Box>
				<Box>
					<Text size="2">
						Current yearly income: {formatCurrency(yearlyIncome)}
					</Text>
				</Box>
			</Flex>
		</Box>
	);
};

export default YearlyIncomeInput;

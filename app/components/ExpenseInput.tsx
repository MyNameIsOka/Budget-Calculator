import type React from "react";
import {
	Box,
	Card,
	Flex,
	Grid,
	Heading,
	Text,
	TextField,
} from "@radix-ui/themes";
import type { Expense, ExpenseItems } from "~/types";
import { formatCurrency } from "~/utils/calculations";

type ExpenseInputProps = {
	expenses: Expense;
	expenseItems: ExpenseItems;
	handleExpenseChange: (key: string, value: number) => void;
	exchangeRate: number;
	foreignCurrency: string;
};

const ExpenseInput: React.FC<ExpenseInputProps> = ({
	expenses,
	expenseItems,
	handleExpenseChange,
	exchangeRate,
	foreignCurrency,
}) => {
	return (
		<Grid columns={{ initial: "1", sm: "2", md: "3" }} gap="4">
			{Object.entries(expenses).map(([key, value]) => (
				<Card key={key}>
					<Flex direction="column" gap="3">
						<Heading size="3">
							{key.charAt(0).toUpperCase() + key.slice(1)}
						</Heading>
						<Flex align="center" gap="2">
							<TextField.Root
								type="text"
								value={value.toLocaleString()}
								onChange={(e) =>
									handleExpenseChange(
										key,
										Number.parseFloat(e.target.value.replace(/,/g, "")) || 0,
									)
								}
							/>
							<Text size="2">JPY/month</Text>
						</Flex>
						<Box>
							<Text
								size="2"
								as="ul"
								style={{ listStyleType: "disc", paddingLeft: "1rem" }}
							>
								{expenseItems[key].map((item) => (
									<li key={item}>{item}</li>
								))}
							</Text>
						</Box>
						<Box
							mt="auto"
							pt="3"
							style={{ borderTop: "1px solid var(--gray-5)" }}
						>
							<Text size="2" as="div">
								Yearly: {formatCurrency(value * 12)} |{" "}
								{formatCurrency((value * 12) / exchangeRate, foreignCurrency)}
							</Text>
							<Text size="2" as="div">
								5 Years: {formatCurrency(value * 12 * 5)} |{" "}
								{formatCurrency(
									(value * 12 * 5) / exchangeRate,
									foreignCurrency,
								)}
							</Text>
						</Box>
					</Flex>
				</Card>
			))}
		</Grid>
	);
};

export default ExpenseInput;

import type React from "react";
import {
	Box,
	Card,
	Flex,
	Grid,
	Heading,
	Text,
	TextField,
	Table,
} from "@radix-ui/themes";
import type { Expense, ExpenseItems } from "~/types";
import { formatCurrency } from "~/utils/calculations";
import { useTranslation } from "react-i18next";

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
	const { t, i18n } = useTranslation();

	const formatAmount = (amount: number, isForeign = false) => {
		if (isForeign) {
			return (amount / exchangeRate).toFixed(2);
		}
		return amount.toLocaleString();
	};

	const handleInputChange = (
		key: string,
		value: string,
		period: string,
		currency: "JPY" | "foreign",
	) => {
		const numericValue = Number(value.replace(/,/g, ""));
		let monthlyValue: number;

		if (currency === "foreign") {
			monthlyValue = numericValue * exchangeRate;
		} else {
			monthlyValue = numericValue;
		}

		switch (period) {
			case "monthly":
				break;
			case "yearly":
				monthlyValue /= 12;
				break;
			case "5years":
				monthlyValue /= 12 * 5;
				break;
		}

		handleExpenseChange(key, monthlyValue);
	};

	return (
		<Grid columns={{ initial: "1", sm: "2" }} gap="4">
			{Object.entries(expenses).map(([key, value]) => (
				<Card key={key}>
					<Heading size="3" mb="2">
						{t(`expenseCards.${key}`)}
					</Heading>
					<Table.Root>
						<Table.Header>
							<Table.Row>
								<Table.ColumnHeaderCell />
								<Table.ColumnHeaderCell>JPY</Table.ColumnHeaderCell>
								<Table.ColumnHeaderCell>
									{foreignCurrency}
								</Table.ColumnHeaderCell>
							</Table.Row>
						</Table.Header>
						<Table.Body>
							<Table.Row>
								<Table.Cell>{t("expenseCards.monthly")}</Table.Cell>
								<Table.Cell>
									<TextField.Root
										size="1"
										value={formatAmount(value)}
										onChange={(e) =>
											handleInputChange(key, e.target.value, "monthly", "JPY")
										}
									/>
								</Table.Cell>
								<Table.Cell>
									<TextField.Root
										size="1"
										value={formatAmount(value, true)}
										onChange={(e) =>
											handleInputChange(
												key,
												e.target.value,
												"monthly",
												"foreign",
											)
										}
									/>
								</Table.Cell>
							</Table.Row>
							<Table.Row>
								<Table.Cell>{t("expenseCards.yearly")}</Table.Cell>
								<Table.Cell>
									<TextField.Root
										size="1"
										value={formatAmount(value * 12)}
										onChange={(e) =>
											handleInputChange(key, e.target.value, "yearly", "JPY")
										}
									/>
								</Table.Cell>
								<Table.Cell>
									<TextField.Root
										size="1"
										value={formatAmount(value * 12, true)}
										onChange={(e) =>
											handleInputChange(
												key,
												e.target.value,
												"yearly",
												"foreign",
											)
										}
									/>
								</Table.Cell>
							</Table.Row>
							<Table.Row>
								<Table.Cell>{t("expenseCards.fiveYears")}</Table.Cell>
								<Table.Cell>
									<TextField.Root
										size="1"
										value={formatAmount(value * 12 * 5)}
										onChange={(e) =>
											handleInputChange(key, e.target.value, "5years", "JPY")
										}
									/>
								</Table.Cell>
								<Table.Cell>
									<TextField.Root
										size="1"
										value={formatAmount(value * 12 * 5, true)}
										onChange={(e) =>
											handleInputChange(
												key,
												e.target.value,
												"5years",
												"foreign",
											)
										}
									/>
								</Table.Cell>
							</Table.Row>
						</Table.Body>
					</Table.Root>
					<Box mt="3">
						<Text
							size="2"
							as="ul"
							style={{ listStyleType: "disc", paddingLeft: "1rem" }}
						>
							{expenseItems[key].map((item, index) => (
								<li key={index}>{item[i18n.language as "en" | "ja"]}</li>
							))}
						</Text>
					</Box>
				</Card>
			))}
		</Grid>
	);
};

export default ExpenseInput;

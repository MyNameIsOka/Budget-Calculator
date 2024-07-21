import type React from "react";
import { useState } from "react";
import {
	Box,
	Card,
	Grid,
	Heading,
	Text,
	TextField,
	Table,
} from "@radix-ui/themes";
import type { Expense, ExpenseItems, CustomExpenseTitles } from "~/types";
import { formatCurrency } from "~/utils/calculations";
import { useTranslation } from "react-i18next";
import AddExpenseModal from "./AddExpenseModal";

type ExpenseInputProps = {
	expenses: Expense;
	expenseItems: ExpenseItems;
	customExpenseTitles: CustomExpenseTitles;
	handleExpenseChange: (key: string, value: number) => void;
	exchangeRate: number;
	foreignCurrency: string;
	onAddExpense: (newExpense: {
		title: { en: string; ja: string };
		items: Array<{ en: string; ja: string }>;
	}) => void;
};

const ExpenseInput: React.FC<ExpenseInputProps> = ({
	expenses,
	expenseItems,
	customExpenseTitles,
	handleExpenseChange,
	exchangeRate,
	foreignCurrency,
	onAddExpense,
}) => {
	const { t, i18n } = useTranslation();
	const [isModalOpen, setIsModalOpen] = useState(false);

	const getLocalizedText = (text: { en: string; ja: string }) => {
		const currentLanguage = i18n.language as "en" | "ja";
		const fallbackLanguage = currentLanguage === "en" ? "ja" : "en";
		return text[currentLanguage] || text[fallbackLanguage] || "";
	};

	const getExpenseTitle = (key: string) => {
		if (customExpenseTitles[key]) {
			return getLocalizedText(customExpenseTitles[key]);
		}
		return t(`expenseCards.${key}`);
	};

	const formatAmount = (amount: number, isForeign = false) => {
		if (isForeign) {
			return Math.round(amount / exchangeRate).toLocaleString();
		}
		return Math.round(amount).toLocaleString();
	};

	const handleInputChange = (
		key: string,
		value: string,
		period: string,
		currency: "JPY" | "foreign",
	) => {
		const numericValue = Number(value.replace(/[^\d]/g, ""));
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

		handleExpenseChange(key, Math.round(monthlyValue));
	};

	return (
		<>
			<Grid columns={{ initial: "1", sm: "2" }} gap="4">
				{Object.entries(expenses).map(([key, value]) => (
					<Card key={key}>
						<Heading size="3" mb="2">
							{getExpenseTitle(key)}
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
								{expenseItems[key]?.map((item, index) => (
									<li key={index}>{getLocalizedText(item)}</li>
								)) ?? []}
							</Text>
						</Box>
					</Card>
				))}
			</Grid>
			<Box mt="6">
				<AddExpenseModal
					open={isModalOpen}
					onOpenChange={setIsModalOpen}
					onAddExpense={onAddExpense}
				/>
			</Box>
		</>
	);
};

export default ExpenseInput;

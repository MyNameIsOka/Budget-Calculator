import type React from "react";
import { useState, useEffect } from "react";
import {
	Box,
	Card,
	Grid,
	Heading,
	Text,
	TextField,
	Table,
	IconButton,
	Button,
} from "@radix-ui/themes";
import { Cross2Icon, PlusIcon } from "@radix-ui/react-icons";
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
	onRemoveExpense: (key: string) => void;
	removedExpenses: string[];
};

const ExpenseInput: React.FC<ExpenseInputProps> = ({
	expenses,
	expenseItems,
	customExpenseTitles,
	handleExpenseChange,
	exchangeRate,
	foreignCurrency,
	onAddExpense,
	onRemoveExpense,
	removedExpenses,
}) => {
	const { t, i18n } = useTranslation();
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [visibleExpenses, setVisibleExpenses] = useState<string[]>([]);

	useEffect(() => {
		const expenseKeys = Object.keys(expenses);
		const updatedVisibleExpenses = expenseKeys.filter(
			(key) => !removedExpenses.includes(key),
		);
		setVisibleExpenses(updatedVisibleExpenses);
	}, [expenses, removedExpenses]);

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

	const handleRemoveExpense = (key: string) => {
		onRemoveExpense(key);
	};

	const handleAddExpenseWrapper = (newExpense: {
		title: { en: string; ja: string };
		items: Array<{ en: string; ja: string }>;
	}) => {
		onAddExpense(newExpense);
		setIsModalOpen(false);
	};

	return (
		<>
			<Grid columns={{ initial: "1", sm: "2" }} gap="4">
				{visibleExpenses.map((key) => (
					<Card key={key}>
						<Heading size="3" mb="2">
							{getExpenseTitle(key)}
							<IconButton
								size="1"
								variant="ghost"
								color="gray"
								style={{ float: "right" }}
								onClick={() => handleRemoveExpense(key)}
							>
								<Cross2Icon />
							</IconButton>
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
											value={formatAmount(expenses[key])}
											onChange={(e) =>
												handleInputChange(key, e.target.value, "monthly", "JPY")
											}
										/>
									</Table.Cell>
									<Table.Cell>
										<TextField.Root
											size="1"
											value={formatAmount(expenses[key], true)}
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
											value={formatAmount(expenses[key] * 12)}
											onChange={(e) =>
												handleInputChange(key, e.target.value, "yearly", "JPY")
											}
										/>
									</Table.Cell>
									<Table.Cell>
										<TextField.Root
											size="1"
											value={formatAmount(expenses[key] * 12, true)}
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
											value={formatAmount(expenses[key] * 12 * 5)}
											onChange={(e) =>
												handleInputChange(key, e.target.value, "5years", "JPY")
											}
										/>
									</Table.Cell>
									<Table.Cell>
										<TextField.Root
											size="1"
											value={formatAmount(expenses[key] * 12 * 5, true)}
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
					onAddExpense={handleAddExpenseWrapper}
				/>
			</Box>
		</>
	);
};

export default ExpenseInput;

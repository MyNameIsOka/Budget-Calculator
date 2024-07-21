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
	Flex,
	Dialog,
} from "@radix-ui/themes";
import { Cross2Icon, PlusIcon, MinusIcon } from "@radix-ui/react-icons";
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
	deactivatedExpenses: string[];
	onToggleExpense: (key: string) => void;
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
	deactivatedExpenses,
	onToggleExpense,
}) => {
	const { t, i18n } = useTranslation();
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [visibleExpenses, setVisibleExpenses] = useState<string[]>([]);
	const [expenseToDelete, setExpenseToDelete] = useState<string | null>(null);

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
		setExpenseToDelete(key);
	};

	const confirmRemoveExpense = () => {
		if (expenseToDelete) {
			onRemoveExpense(expenseToDelete);
			setExpenseToDelete(null);
		}
	};

	const handleToggleExpense = (key: string) => {
		onToggleExpense(key);
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
					<Card
						key={key}
						style={{
							opacity: deactivatedExpenses.includes(key) ? 0.5 : 1,
						}}
					>
						<Flex justify="between" align="center" mb="2">
							<Heading size="3">{getExpenseTitle(key)}</Heading>
							<Flex gap="2">
								<IconButton
									size="1"
									variant="ghost"
									color="gray"
									onClick={() => handleToggleExpense(key)}
								>
									{deactivatedExpenses.includes(key) ? (
										<PlusIcon />
									) : (
										<MinusIcon />
									)}
								</IconButton>
								<IconButton
									size="1"
									variant="ghost"
									color="gray"
									onClick={() => handleRemoveExpense(key)}
								>
									<Cross2Icon />
								</IconButton>
							</Flex>
						</Flex>
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
											disabled={deactivatedExpenses.includes(key)}
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
											disabled={deactivatedExpenses.includes(key)}
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
											disabled={deactivatedExpenses.includes(key)}
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
											disabled={deactivatedExpenses.includes(key)}
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
											disabled={deactivatedExpenses.includes(key)}
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
											disabled={deactivatedExpenses.includes(key)}
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
			<Dialog.Root
				open={expenseToDelete !== null}
				onOpenChange={() => setExpenseToDelete(null)}
			>
				<Dialog.Content style={{ maxWidth: 450 }}>
					<Dialog.Title>{t("deleteExpense.title")}</Dialog.Title>
					<Dialog.Description size="2">
						{t("deleteExpense.description")}
					</Dialog.Description>

					<Flex gap="3" mt="4" justify="end">
						<Dialog.Close>
							<Button variant="soft" color="gray">
								{t("deleteExpense.cancel")}
							</Button>
						</Dialog.Close>
						<Dialog.Close>
							<Button onClick={confirmRemoveExpense} color="red">
								{t("deleteExpense.confirm")}
							</Button>
						</Dialog.Close>
					</Flex>
				</Dialog.Content>
			</Dialog.Root>
		</>
	);
};

export default ExpenseInput;

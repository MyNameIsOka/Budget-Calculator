import type React from "react";
import { useState, useEffect, useRef, useCallback } from "react";
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
import {
	Cross2Icon,
	PlusIcon,
	MinusIcon,
	Pencil1Icon,
	CheckIcon,
} from "@radix-ui/react-icons";
import type { Expense, ExpenseItems, CustomExpenseTitles } from "~/types";
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
	timeFrame: number;
	onUpdateExpenseItems: (
		key: string,
		items: Array<{ en: string; ja: string }>,
	) => void;
	onUpdateExpenseTitle: (
		key: string,
		title: { en: string; ja: string },
	) => void;
	isSmallScreen: boolean;
};

export default function ExpenseInput({
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
	timeFrame,
	onUpdateExpenseItems,
	onUpdateExpenseTitle,
	isSmallScreen,
}: ExpenseInputProps) {
	const { t, i18n } = useTranslation();
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [visibleExpenses, setVisibleExpenses] = useState<string[]>([]);
	const [expenseToDelete, setExpenseToDelete] = useState<string | null>(null);
	const [editingExpenseItem, setEditingExpenseItem] = useState<{
		key: string;
		index: number;
	} | null>(null);
	const [newItemText, setNewItemText] = useState({ en: "", ja: "" });
	const [editingTitle, setEditingTitle] = useState<string | null>(null);
	const [newTitle, setNewTitle] = useState({ en: "", ja: "" });
	const editInputRef = useRef<HTMLInputElement>(null);
	const editTitleRef = useRef<HTMLInputElement>(null);

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
		let timeFrameValue: number;

		switch (period) {
			case "monthly":
				timeFrameValue = numericValue * 12 * timeFrame;
				break;
			case "yearly":
				timeFrameValue = numericValue * timeFrame;
				break;
			case "timeFrame":
				timeFrameValue = numericValue;
				break;
			default:
				timeFrameValue = 0;
		}

		if (currency === "foreign") {
			timeFrameValue *= exchangeRate;
		}

		handleExpenseChange(key, Math.round(timeFrameValue));
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

	const handleEditExpenseItem = (key: string, index: number) => {
		setEditingExpenseItem({ key, index });
		setNewItemText(expenseItems[key][index]);
	};

	const handleSaveExpenseItem = useCallback(() => {
		if (editingExpenseItem) {
			const { key, index } = editingExpenseItem;
			const newItems = [...expenseItems[key]];
			newItems[index] = newItemText;
			onUpdateExpenseItems(key, newItems);
			setEditingExpenseItem(null);
			setNewItemText({ en: "", ja: "" });
		}
	}, [editingExpenseItem, newItemText, onUpdateExpenseItems, expenseItems]);

	// biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
	const getExpenseTitle = useCallback(
		(key: string) => {
			if (customExpenseTitles[key]) {
				return getLocalizedText(customExpenseTitles[key]);
			}
			return t(`expenseCards.${key}`);
		},
		[customExpenseTitles, t],
	);

	const handleEditTitle = (key: string) => {
		setEditingTitle(key);
		setNewTitle(
			customExpenseTitles[key] || {
				en: t(`expenseCards.${key}`),
				ja: t(`expenseCards.${key}`),
			},
		);
	};

	const handleSaveTitle = useCallback(() => {
		if (editingTitle) {
			onUpdateExpenseTitle(editingTitle, newTitle);
			setEditingTitle(null);
		}
	}, [editingTitle, newTitle, onUpdateExpenseTitle]);

	const handleClickOutside = useCallback(
		(event: MouseEvent) => {
			if (
				editTitleRef.current &&
				!editTitleRef.current.contains(event.target as Node)
			) {
				handleSaveTitle();
			}
			if (
				editInputRef.current &&
				!editInputRef.current.contains(event.target as Node)
			) {
				handleSaveExpenseItem();
			}
		},
		[handleSaveTitle, handleSaveExpenseItem],
	);

	useEffect(() => {
		if (editingTitle || editingExpenseItem) {
			document.addEventListener("mousedown", handleClickOutside);
		} else {
			document.removeEventListener("mousedown", handleClickOutside);
		}

		return () => {
			document.removeEventListener("mousedown", handleClickOutside);
		};
	}, [editingTitle, editingExpenseItem, handleClickOutside]);

	const handleAddExpenseItem = (key: string) => {
		if (expenseItems[key].length < 5) {
			const newItems = [...expenseItems[key], { en: "", ja: "" }];
			onUpdateExpenseItems(key, newItems);
		}
	};

	const handleRemoveExpenseItem = (key: string, index: number) => {
		const newItems = expenseItems[key].filter((_, i) => i !== index);
		onUpdateExpenseItems(key, newItems);
	};

	return (
		<>
			<Grid
				columns={{ initial: "1", sm: "2" }}
				gap="4"
				className={isSmallScreen ? "items-center" : ""}
			>
				{visibleExpenses.map((key) => (
					<Flex key={key} justify={isSmallScreen ? "center" : "start"}>
						<Card
							className={`${
								deactivatedExpenses.includes(key) ? "opacity-50" : ""
							}`}
							style={{ width: "300px", height: "300px" }}
						>
							<Flex justify="between" align="center" mb="2">
								{editingTitle === key ? (
									<Flex align="center" style={{ flexGrow: 1 }}>
										<IconButton
											size="1"
											onClick={handleSaveTitle}
											variant="ghost"
											className="mr-1"
										>
											<CheckIcon />
										</IconButton>
										<TextField.Root
											size="2"
											value={newTitle[i18n.language as "en" | "ja"]}
											onChange={(e) =>
												setNewTitle({
													...newTitle,
													[i18n.language]: e.target.value,
												})
											}
											style={{ flexGrow: 1 }}
											ref={editTitleRef}
										/>
									</Flex>
								) : (
									<Flex align="center">
										<IconButton
											size="1"
											onClick={() => handleEditTitle(key)}
											variant="ghost"
											className="mr-1"
											disabled={deactivatedExpenses.includes(key)}
										>
											<Pencil1Icon />
										</IconButton>
										<Heading size="3">{getExpenseTitle(key)}</Heading>
									</Flex>
								)}
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
										<Table.Cell>
											<Text style={{ whiteSpace: "nowrap" }}>
												{t("expenseCards.monthly")}
											</Text>
										</Table.Cell>
										<Table.Cell>
											<TextField.Root
												size="1"
												value={formatAmount(expenses[key] / (12 * timeFrame))}
												onChange={(e) =>
													handleInputChange(
														key,
														e.target.value,
														"monthly",
														"JPY",
													)
												}
												disabled={deactivatedExpenses.includes(key)}
											/>
										</Table.Cell>
										<Table.Cell>
											<TextField.Root
												size="1"
												value={formatAmount(
													expenses[key] / (12 * timeFrame),
													true,
												)}
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
										<Table.Cell>
											<Text style={{ whiteSpace: "nowrap" }}>
												{t("expenseCards.yearly")}
											</Text>
										</Table.Cell>
										<Table.Cell>
											<TextField.Root
												size="1"
												value={formatAmount(expenses[key] / timeFrame)}
												onChange={(e) =>
													handleInputChange(
														key,
														e.target.value,
														"yearly",
														"JPY",
													)
												}
												disabled={deactivatedExpenses.includes(key)}
											/>
										</Table.Cell>
										<Table.Cell>
											<TextField.Root
												size="1"
												value={formatAmount(expenses[key] / timeFrame, true)}
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
									{timeFrame > 1 && (
										<Table.Row>
											<Table.Cell>
												<Text style={{ whiteSpace: "nowrap" }}>
													{t("expenseCards.timeFrame", { timeFrame })}
												</Text>
											</Table.Cell>
											<Table.Cell>
												<TextField.Root
													size="1"
													value={formatAmount(expenses[key])}
													onChange={(e) =>
														handleInputChange(
															key,
															e.target.value,
															"timeFrame",
															"JPY",
														)
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
															"timeFrame",
															"foreign",
														)
													}
													disabled={deactivatedExpenses.includes(key)}
												/>
											</Table.Cell>
										</Table.Row>
									)}
								</Table.Body>
							</Table.Root>
							<Box mt="3">
								<Text size="2" as="div" mb="2">
									{i18n.language === "en" ? "e.g.:" : "例:"}
								</Text>
								{expenseItems[key]?.map((item, index) => (
									<Flex key={index} align="center" mb="1">
										{editingExpenseItem?.key === key &&
										editingExpenseItem?.index === index ? (
											<>
												<IconButton
													size="1"
													onClick={handleSaveExpenseItem}
													variant="ghost"
													className="mr-1"
												>
													<CheckIcon />
												</IconButton>
												<TextField.Root
													size="1"
													value={newItemText[i18n.language as "en" | "ja"]}
													onChange={(e) =>
														setNewItemText({
															...newItemText,
															[i.language]: e.target.value,
														})
													}
													style={{ flexGrow: 1 }}
													ref={editInputRef}
												/>
											</>
										) : (
											<>
												<IconButton
													size="1"
													onClick={() => handleEditExpenseItem(key, index)}
													variant="ghost"
													className="mr-1"
													disabled={deactivatedExpenses.includes(key)}
												>
													<Pencil1Icon />
												</IconButton>
												<Text size="2" style={{ flexGrow: 1 }}>
													{getLocalizedText(item)}
												</Text>
												{index > 0 && (
													<IconButton
														size="1"
														onClick={() => handleRemoveExpenseItem(key, index)}
														variant="ghost"
														disabled={deactivatedExpenses.includes(key)}
													>
														<Cross2Icon />
													</IconButton>
												)}
											</>
										)}
									</Flex>
								))}
								{expenseItems[key].length < 5 && (
									<Flex justify="center" mt="2">
										<IconButton
											size="1"
											variant="ghost"
											color="gray"
											onClick={() => handleAddExpenseItem(key)}
											disabled={deactivatedExpenses.includes(key)}
										>
											<PlusIcon />
										</IconButton>
									</Flex>
								)}
							</Box>
						</Card>
					</Flex>
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
}

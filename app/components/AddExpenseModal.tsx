import type React from "react";
import { useState } from "react";
import { Dialog, Flex, TextField, Button, Text } from "@radix-ui/themes";
import { PlusIcon, Cross2Icon } from "@radix-ui/react-icons";
import { useTranslation } from "react-i18next";

type ExpenseItem = {
	en: string;
	ja: string;
};

type NewExpense = {
	title: {
		en: string;
		ja: string;
	};
	items: ExpenseItem[];
};

type AddExpenseModalProps = {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	onAddExpense: (newExpense: NewExpense) => void;
};

const AddExpenseModal: React.FC<AddExpenseModalProps> = ({
	open,
	onOpenChange,
	onAddExpense,
}) => {
	const { t } = useTranslation();
	const [newExpense, setNewExpense] = useState<NewExpense>({
		title: { en: "", ja: "" },
		items: [{ en: "", ja: "" }],
	});

	const handleAddItem = () => {
		if (newExpense.items.length < 5) {
			setNewExpense((prev) => ({
				...prev,
				items: [...prev.items, { en: "", ja: "" }],
			}));
		}
	};

	const handleRemoveItem = (index: number) => {
		setNewExpense((prev) => ({
			...prev,
			items: prev.items.filter((_, i) => i !== index),
		}));
	};

	const handleSubmit = () => {
		const finalExpense: NewExpense = {
			title: {
				en: newExpense.title.en || newExpense.title.ja,
				ja: newExpense.title.ja || newExpense.title.en,
			},
			items: newExpense.items.map((item) => ({
				en: item.en || item.ja,
				ja: item.ja || item.en,
			})),
		};
		onAddExpense(finalExpense);
		onOpenChange(false);
		setNewExpense({ title: { en: "", ja: "" }, items: [{ en: "", ja: "" }] });
	};

	return (
		<Dialog.Root open={open} onOpenChange={onOpenChange}>
			<Dialog.Trigger>
				<Button>
					<PlusIcon /> {t("addExpense.submit")}
				</Button>
			</Dialog.Trigger>
			<Dialog.Content style={{ maxWidth: 450 }}>
				<Dialog.Title>{t("addExpense.title")}</Dialog.Title>
				<Flex direction="column" gap="3">
					<Flex gap="3">
						<TextField.Root
							placeholder={t("addExpense.titleEn")}
							value={newExpense.title.en}
							onChange={(e) =>
								setNewExpense((prev) => ({
									...prev,
									title: { ...prev.title, en: e.target.value },
								}))
							}
						/>
						<TextField.Root
							placeholder={t("addExpense.titleJa")}
							value={newExpense.title.ja}
							onChange={(e) =>
								setNewExpense((prev) => ({
									...prev,
									title: { ...prev.title, ja: e.target.value },
								}))
							}
						/>
					</Flex>
					{newExpense.items.map((item, index) => (
						<Flex key={index} gap="3" align="center">
							<TextField.Root
								style={{ flexGrow: 1 }}
								placeholder={`${t("addExpense.itemEn")} ${index + 1}`}
								value={item.en}
								onChange={(e) => {
									const newItems = [...newExpense.items];
									newItems[index] = {
										...newItems[index],
										en: e.target.value,
									};
									setNewExpense((prev) => ({ ...prev, items: newItems }));
								}}
							/>
							<TextField.Root
								style={{ flexGrow: 1 }}
								placeholder={`${t("addExpense.itemJa")} ${index + 1}`}
								value={item.ja}
								onChange={(e) => {
									const newItems = [...newExpense.items];
									newItems[index] = {
										...newItems[index],
										ja: e.target.value,
									};
									setNewExpense((prev) => ({ ...prev, items: newItems }));
								}}
							/>
							{index > 0 && (
								<Button
									color="red"
									variant="soft"
									onClick={() => handleRemoveItem(index)}
								>
									<Cross2Icon />
								</Button>
							)}
						</Flex>
					))}
					{newExpense.items.length < 5 && (
						<Button onClick={handleAddItem}>
							<PlusIcon /> {t("addExpense.addItem")}
						</Button>
					)}
				</Flex>
				<Flex gap="3" mt="4" justify="end">
					<Dialog.Close>
						<Button variant="soft" color="gray">
							{t("addExpense.cancel")}
						</Button>
					</Dialog.Close>
					<Dialog.Close>
						<Button onClick={handleSubmit}>{t("addExpense.submit")}</Button>
					</Dialog.Close>
				</Flex>
			</Dialog.Content>
		</Dialog.Root>
	);
};

export default AddExpenseModal;

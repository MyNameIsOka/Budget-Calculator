import type React from "react";
import { Box, Heading, Table, Text } from "@radix-ui/themes";
import type { TaxBreakdownItem } from "~/types";
import { formatCurrency } from "~/utils/calculations";
import { useTranslation } from "react-i18next";

type TaxBreakdownProps = {
	taxBreakdown: TaxBreakdownItem[];
	taxAmount: number;
	startingBracket: string;
	exchangeRate: number;
	foreignCurrency: string;
};

const TaxBreakdown: React.FC<TaxBreakdownProps> = ({
	taxBreakdown,
	taxAmount,
	startingBracket,
	exchangeRate,
	foreignCurrency,
}) => {
	const { t } = useTranslation();

	const formatAmounts = (jpyAmount: string): string => {
		const numericAmount = Number.parseFloat(
			jpyAmount.replace(/[^0-9.-]+/g, ""),
		);
		if (isNaN(numericAmount) || !exchangeRate || !foreignCurrency) {
			return jpyAmount; // Return original string if conversion is not possible
		}
		const foreignAmount = numericAmount / exchangeRate;
		const formattedJPY = formatCurrency(numericAmount, "JPY");
		const formattedForeign = formatCurrency(foreignAmount, foreignCurrency);
		return `${formattedJPY} (${formattedForeign})`;
	};

	if (!taxBreakdown.length || !exchangeRate || !foreignCurrency) {
		return (
			<Box>
				<Heading size="5" mb="3">
					{t("taxBreakdown.title")}
				</Heading>
				<Text size="2">{t("taxBreakdown.noData")}</Text>
			</Box>
		);
	}

	return (
		<Box>
			<Heading size="5" mb="3">
				{t("taxBreakdown.title")}
			</Heading>
			<Text size="2" mb="3">
				{t("taxBreakdown.startingBracket", {
					bracket: startingBracket || t("taxBreakdown.notCalculated"),
				})}
			</Text>
			<Box style={{ overflowX: "auto" }}>
				<Table.Root style={{ borderCollapse: "collapse", width: "100%" }}>
					<Table.Header>
						<Table.Row>
							<Table.ColumnHeaderCell>
								{t("taxBreakdown.bracket")}
							</Table.ColumnHeaderCell>
							<Table.ColumnHeaderCell>
								{t("taxBreakdown.rate")}
							</Table.ColumnHeaderCell>
							<Table.ColumnHeaderCell>
								{t("taxBreakdown.taxableAmount")}
							</Table.ColumnHeaderCell>
							<Table.ColumnHeaderCell>
								{t("taxBreakdown.taxAmount")}
							</Table.ColumnHeaderCell>
						</Table.Row>
					</Table.Header>
					<Table.Body>
						{taxBreakdown.map((item, index) => (
							<Table.Row key={index}>
								<Table.Cell>{item.bracket}</Table.Cell>
								<Table.Cell>{item.rate}</Table.Cell>
								<Table.Cell>{formatAmounts(item.taxableAmount)}</Table.Cell>
								<Table.Cell>{formatAmounts(item.taxAmount)}</Table.Cell>
							</Table.Row>
						))}
						{taxAmount > 0 && (
							<Table.Row>
								<Table.Cell colSpan={3}>
									<Text weight="bold">{t("taxBreakdown.municipalTax")}</Text>
								</Table.Cell>
								<Table.Cell>
									<Text weight="bold">
										{formatAmounts(
											formatCurrency(
												taxAmount -
													taxBreakdown.reduce(
														(sum, item) =>
															sum +
															Number.parseFloat(
																item.taxAmount.replace(/[^0-9.-]+/g, ""),
															),
														0,
													),
												"JPY",
											),
										)}
									</Text>
								</Table.Cell>
							</Table.Row>
						)}
					</Table.Body>
				</Table.Root>
			</Box>
		</Box>
	);
};

export default TaxBreakdown;

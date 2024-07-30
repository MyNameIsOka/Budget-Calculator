import type React from "react";
import { Box, Heading, Table, Text, Flex } from "@radix-ui/themes";
import type { TaxBreakdownItem } from "~/types";
import { formatCurrency } from "~/utils/calculations";
import { useTranslation } from "react-i18next";
import { ExplanationTooltip } from "./ExplanationTooltip";

type TaxBreakdownProps = {
	taxBreakdown: TaxBreakdownItem[];
	taxAmount: number;
	startingBracket: string;
	exchangeRate: number;
	foreignCurrency: string;
	yearlyIncomeTax: number;
};

export default function TaxBreakdown({
	taxBreakdown,
	taxAmount,
	startingBracket,
	exchangeRate,
	foreignCurrency,
	yearlyIncomeTax,
}: TaxBreakdownProps) {
	const { t } = useTranslation();

	const formatAmounts = (jpyAmount: string): string => {
		const numericAmount = Number.parseFloat(
			jpyAmount.replace(/[^0-9.-]+/g, ""),
		);
		if (Number.isNaN(numericAmount) || !exchangeRate || !foreignCurrency) {
			return jpyAmount; // Return original string if conversion is not possible
		}
		const foreignAmount = numericAmount / exchangeRate;
		const formattedJPY = formatCurrency(numericAmount, "JPY");
		const formattedForeign = formatCurrency(foreignAmount, foreignCurrency);
		return `${formattedJPY} (${formattedForeign})`;
	};

	if (!taxBreakdown.length || !exchangeRate || !foreignCurrency) {
		return (
			<Box className="w-full">
				<Heading size="5" mb="3" className="text-center md:text-left">
					{t("taxBreakdown.title")}
				</Heading>
				<Text size="2">{t("taxBreakdown.noData")}</Text>
			</Box>
		);
	}

	return (
		<Box className="w-full">
			<Heading size="5" mb="3" className="text-center md:text-left">
				{t("taxBreakdown.title")}
			</Heading>
			<Text size="2" mb="3">
				{t("taxBreakdown.startingBracket", {
					bracket: startingBracket || t("taxBreakdown.notCalculated"),
				})}
			</Text>
			<ExplanationTooltip
				explanation={t("taxBreakdown.explanationStartingBracket")}
			/>
			<Box className="overflow-x-auto">
				<Table.Root>
					<Table.Header>
						<Table.Row>
							<Table.ColumnHeaderCell className="whitespace-nowrap">
								{t("taxBreakdown.bracket")}
							</Table.ColumnHeaderCell>
							<Table.ColumnHeaderCell className="whitespace-nowrap">
								{t("taxBreakdown.rate")}
							</Table.ColumnHeaderCell>
							<Table.ColumnHeaderCell className="whitespace-nowrap">
								{t("taxBreakdown.taxableAmount")}
							</Table.ColumnHeaderCell>
							<Table.ColumnHeaderCell className="whitespace-nowrap">
								{t("taxBreakdown.deduction")}
								<ExplanationTooltip
									explanation={t("taxBreakdown.explanationDeduction")}
								/>
							</Table.ColumnHeaderCell>
							<Table.ColumnHeaderCell className="whitespace-nowrap">
								{t("taxBreakdown.taxAmount")}
							</Table.ColumnHeaderCell>
						</Table.Row>
					</Table.Header>
					<Table.Body>
						{taxBreakdown.map((item, index) => (
							<Table.Row key={index}>
								<Table.Cell className="whitespace-nowrap">
									{item.bracket}
								</Table.Cell>
								<Table.Cell>{item.rate}</Table.Cell>
								<Table.Cell>{formatAmounts(item.taxableAmount)}</Table.Cell>
								<Table.Cell>{formatAmounts(item.deduction)}</Table.Cell>
								<Table.Cell>{formatAmounts(item.taxAmount)}</Table.Cell>
							</Table.Row>
						))}
						{taxAmount > 0 && (
							<Table.Row>
								<Table.Cell colSpan={4} className="font-bold">
									{t("taxBreakdown.municipalTax")}
									<ExplanationTooltip
										explanation={t("taxBreakdown.explanationMunicipalTax")}
									/>
								</Table.Cell>
								<Table.Cell className="font-bold">
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
								</Table.Cell>
							</Table.Row>
						)}
					</Table.Body>
				</Table.Root>
			</Box>
			<Box mt="4">
				<Text size="2" weight="bold">
					{t("taxBreakdown.estimatedYearlyIncomeTax")}
				</Text>
				<Text size="2">
					{formatAmounts(formatCurrency(yearlyIncomeTax, "JPY"))}
					<ExplanationTooltip
						explanation={t("taxBreakdown.explanationYearlyIncomeTax")}
					/>
				</Text>
			</Box>
		</Box>
	);
}

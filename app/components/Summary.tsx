import { Box, Heading, Table } from "@radix-ui/themes";
import { formatCurrency } from "~/utils/calculations";
import { useTranslation } from "react-i18next";
import { ExplanationTooltip } from "./ExplanationTooltip";

type SummaryProps = {
	totalExpenses: number;
	loanAmountJPY: number;
	btcSalePrice: number;
	exchangeRate: number;
	foreignCurrency: string;
	taxAmount: number;
	timeFrame: number;
	gains: number;
};
export default function Summary({
	totalExpenses,
	loanAmountJPY,
	btcSalePrice,
	exchangeRate,
	foreignCurrency,
	taxAmount,
	timeFrame,
	gains,
}: SummaryProps) {
	const { t } = useTranslation();

	const amountToSell = totalExpenses - loanAmountJPY;
	const btcToSell = amountToSell / (btcSalePrice * exchangeRate);
	const btcForTaxes = taxAmount / (btcSalePrice * exchangeRate);
	const totalBtcNeeded = btcToSell + btcForTaxes;
	const effectiveTaxRate = (taxAmount / amountToSell) * 100;

	return (
		<Box className="w-full overflow-x-auto">
			<Heading size="5" mb="3" className="text-center md:text-left">
				{t("summary.title")}
			</Heading>
			<Table.Root>
				<Table.Header>
					<Table.Row>
						<Table.ColumnHeaderCell className="whitespace-nowrap">
							{t("summary.description")}
						</Table.ColumnHeaderCell>
						<Table.ColumnHeaderCell className="whitespace-nowrap">
							JPY
						</Table.ColumnHeaderCell>
						<Table.ColumnHeaderCell className="whitespace-nowrap">
							{foreignCurrency}
						</Table.ColumnHeaderCell>
						<Table.ColumnHeaderCell className="whitespace-nowrap">
							BTC
						</Table.ColumnHeaderCell>
					</Table.Row>
				</Table.Header>
				<Table.Body>
					<Table.Row>
						<Table.Cell className="whitespace-nowrap">
							{t("summary.totalExpenses", { timeFrame })}
						</Table.Cell>
						<Table.Cell>{formatCurrency(totalExpenses)}</Table.Cell>
						<Table.Cell>
							{formatCurrency(totalExpenses / exchangeRate, foreignCurrency)}
						</Table.Cell>
						<Table.Cell>
							{(totalExpenses / (btcSalePrice * exchangeRate)).toFixed(4)}
						</Table.Cell>
					</Table.Row>
					<Table.Row>
						<Table.Cell className="whitespace-nowrap">
							{t("summary.loanAmount")}
						</Table.Cell>
						<Table.Cell>{formatCurrency(loanAmountJPY)}</Table.Cell>
						<Table.Cell>
							{formatCurrency(loanAmountJPY / exchangeRate, foreignCurrency)}
						</Table.Cell>
						<Table.Cell>
							{(loanAmountJPY / (btcSalePrice * exchangeRate)).toFixed(4)}
						</Table.Cell>
					</Table.Row>
					<Table.Row>
						<Table.Cell className="whitespace-nowrap">
							{t("summary.amountToSell1")}
							<ExplanationTooltip explanation={t("summary.amountToSell2")} />
						</Table.Cell>
						<Table.Cell>{formatCurrency(amountToSell)}</Table.Cell>
						<Table.Cell>
							{formatCurrency(amountToSell / exchangeRate, foreignCurrency)}
						</Table.Cell>
						<Table.Cell>{btcToSell.toFixed(4)}</Table.Cell>
					</Table.Row>
					<Table.Row>
						<Table.Cell className="whitespace-nowrap">
							{t("summary.gains")}
							<ExplanationTooltip explanation={t("summary.explanationGains")} />
						</Table.Cell>
						<Table.Cell>{formatCurrency(gains)}</Table.Cell>
						<Table.Cell>
							{formatCurrency(gains / exchangeRate, foreignCurrency)}
						</Table.Cell>
						<Table.Cell>
							{(gains / (btcSalePrice * exchangeRate)).toFixed(4)}
						</Table.Cell>
					</Table.Row>
					<Table.Row>
						<Table.Cell className="whitespace-nowrap">
							{t("summary.taxesFromSelling")}
							<ExplanationTooltip
								explanation={t("summary.explanationTaxesFromSelling")}
							/>
						</Table.Cell>
						<Table.Cell>{formatCurrency(taxAmount)}</Table.Cell>
						<Table.Cell>
							{formatCurrency(taxAmount / exchangeRate, foreignCurrency)}
						</Table.Cell>
						<Table.Cell>{btcForTaxes.toFixed(4)}</Table.Cell>
					</Table.Row>
					<Table.Row>
						<Table.Cell className="whitespace-nowrap">
							{t("summary.totalBTCNeeded")}
						</Table.Cell>
						<Table.Cell>
							{formatCurrency(totalBtcNeeded * btcSalePrice * exchangeRate)}
						</Table.Cell>
						<Table.Cell>
							{formatCurrency(totalBtcNeeded * btcSalePrice, foreignCurrency)}
						</Table.Cell>
						<Table.Cell>{totalBtcNeeded.toFixed(4)}</Table.Cell>
					</Table.Row>
					<Table.Row>
						<Table.Cell className="whitespace-nowrap">
							{t("summary.effectiveTaxRate")}
							<ExplanationTooltip
								explanation={t("summary.explanationEffectiveTaxRate")}
							/>
						</Table.Cell>
						<Table.Cell colSpan={3}>{effectiveTaxRate.toFixed(2)}%</Table.Cell>
					</Table.Row>
				</Table.Body>
			</Table.Root>
		</Box>
	);
}

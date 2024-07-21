import type React from "react";
import { Box, Heading, Table } from "@radix-ui/themes";
import { formatCurrency } from "~/utils/calculations";
import { useTranslation } from "react-i18next";

type BitcoinInfoBoxProps = {
	totalExpenses: number;
	taxAmount: number;
	btcSalePrice: number;
	btcPurchasePrice: number;
	exchangeRate: number;
	foreignCurrency: string;
	loanAmountJPY: number;
};

const BitcoinInfoBox: React.FC<BitcoinInfoBoxProps> = ({
	totalExpenses,
	taxAmount,
	btcSalePrice,
	btcPurchasePrice,
	exchangeRate,
	foreignCurrency,
	loanAmountJPY,
}) => {
	const { t } = useTranslation();

	const totalNeeded = totalExpenses + taxAmount - loanAmountJPY;
	const btcNeeded = totalNeeded / (btcSalePrice * exchangeRate);
	const btcForExpenses =
		(totalExpenses - loanAmountJPY) / (btcSalePrice * exchangeRate);
	const btcForTaxes = taxAmount / (btcSalePrice * exchangeRate);

	return (
		<Box className="w-full overflow-x-auto">
			<Heading size="4" mb="3" className="text-center md:text-left">
				{t("bitcoinInfo.title")}
			</Heading>
			<Table.Root>
				<Table.Body>
					<Table.Row>
						<Table.Cell className="whitespace-nowrap font-medium">
							{t("bitcoinInfo.btcForExpenses")}
						</Table.Cell>
						<Table.Cell className="text-right">
							{btcForExpenses.toFixed(4)} BTC
						</Table.Cell>
					</Table.Row>
					<Table.Row>
						<Table.Cell className="whitespace-nowrap font-medium">
							{t("bitcoinInfo.btcForTaxes")}
						</Table.Cell>
						<Table.Cell className="text-right">
							{btcForTaxes.toFixed(4)} BTC
						</Table.Cell>
					</Table.Row>
					<Table.Row>
						<Table.Cell className="whitespace-nowrap font-medium">
							{t("bitcoinInfo.totalBTCToSell")}
						</Table.Cell>
						<Table.Cell className="text-right">
							{btcNeeded.toFixed(4)} BTC
						</Table.Cell>
					</Table.Row>
					<Table.Row>
						<Table.Cell className="whitespace-nowrap font-medium">
							{t("bitcoinInfo.equivalentInForeignCurrency", {
								currency: foreignCurrency,
							})}
						</Table.Cell>
						<Table.Cell className="text-right">
							{formatCurrency(btcNeeded * btcSalePrice, foreignCurrency)}
						</Table.Cell>
					</Table.Row>
				</Table.Body>
			</Table.Root>
		</Box>
	);
};

export default BitcoinInfoBox;

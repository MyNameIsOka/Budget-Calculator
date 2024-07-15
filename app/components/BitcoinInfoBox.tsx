import type React from "react";
import { styled } from "@stitches/react";
import { formatCurrency } from "../utils/calculations";

const BitcoinInfoWrapper = styled("div", {
	backgroundColor: "#f0f8ff",
	border: "1px solid #3498db",
	borderRadius: "4px",
	padding: "1rem",
	marginTop: "1rem",
});

const BitcoinTable = styled("table", {
	width: "100%",
	borderCollapse: "separate",
	borderSpacing: "0 0.5rem",
});

const BitcoinTableRow = styled("tr", {
	"& td": {
		padding: "0.25rem 0",
	},
	"& td:first-child": {
		fontWeight: "bold",
		paddingRight: "0.5rem",
	},
	"& td:last-child": {
		textAlign: "right",
	},
});

interface BitcoinInfoBoxProps {
	totalExpenses: number;
	taxAmount: number;
	btcSalePrice: number;
	btcPurchasePrice: number;
	exchangeRate: number;
	foreignCurrency: string;
}

const BitcoinInfoBox: React.FC<BitcoinInfoBoxProps> = ({
	totalExpenses,
	taxAmount,
	btcSalePrice,
	btcPurchasePrice,
	exchangeRate,
	foreignCurrency,
}) => {
	const btcForExpenses = totalExpenses / (btcSalePrice * exchangeRate);
	const btcForTaxes = taxAmount / (btcSalePrice * exchangeRate);
	const totalBtcNeeded = btcForExpenses + btcForTaxes;

	return (
		<BitcoinInfoWrapper>
			<h3>Bitcoin Calculations</h3>
			<BitcoinTable>
				<tbody>
					<BitcoinTableRow>
						<td>BTC needed for 5 years of expenses:</td>
						<td>{btcForExpenses.toFixed(4)} BTC</td>
					</BitcoinTableRow>
					<BitcoinTableRow>
						<td>BTC needed to pay for taxes:</td>
						<td>{btcForTaxes.toFixed(4)} BTC</td>
					</BitcoinTableRow>
					<BitcoinTableRow>
						<td>Total BTC needed to sell:</td>
						<td>{totalBtcNeeded.toFixed(4)} BTC</td>
					</BitcoinTableRow>
					<BitcoinTableRow>
						<td>Equivalent in {foreignCurrency} (at sale price):</td>
						<td>
							{formatCurrency(totalBtcNeeded * btcSalePrice, foreignCurrency)}
						</td>
					</BitcoinTableRow>
					<BitcoinTableRow>
						<td>Potential profit:</td>
						<td>
							{formatCurrency(
								(btcSalePrice - btcPurchasePrice) * totalBtcNeeded,
								foreignCurrency,
							)}
						</td>
					</BitcoinTableRow>
				</tbody>
			</BitcoinTable>
		</BitcoinInfoWrapper>
	);
};

export default BitcoinInfoBox;

import type React from "react";
import { styled } from "@stitches/react";

const Grid = styled("div", {
	display: "grid",
	gridTemplateColumns: "1fr 1fr",
	gap: "1rem",
	marginBottom: "1rem",
});

const InputWrapper = styled("div", {
	display: "flex",
	alignItems: "center",
	"& label": {
		marginRight: "0.5rem",
		fontWeight: "bold",
	},
	"& input": {
		flex: 1,
		padding: "0.5rem",
		border: "1px solid #3498db",
		borderRadius: "4px",
		fontSize: "1rem",
	},
});

interface BitcoinPricesProps {
	btcPurchasePrice: number;
	btcSalePrice: number;
	setBtcPurchasePrice: (price: number) => void;
	setBtcSalePrice: (price: number) => void;
	foreignCurrency: string;
}

const BitcoinPrices: React.FC<BitcoinPricesProps> = ({
	btcPurchasePrice,
	btcSalePrice,
	setBtcPurchasePrice,
	setBtcSalePrice,
	foreignCurrency,
}) => {
	return (
		<>
			<h2>Bitcoin Prices</h2>
			<Grid>
				<InputWrapper>
					<label htmlFor="btcPurchasePrice">
						BTC Purchase Price ({foreignCurrency}):
					</label>
					<input
						id="btcPurchasePrice"
						type="number"
						value={btcPurchasePrice}
						onChange={(e) =>
							setBtcPurchasePrice(Number.parseFloat(e.target.value) || 0)
						}
					/>
				</InputWrapper>
				<InputWrapper>
					<label htmlFor="btcSalePrice">
						BTC Sale Price ({foreignCurrency}):
					</label>
					<input
						id="btcSalePrice"
						type="number"
						value={btcSalePrice}
						onChange={(e) =>
							setBtcSalePrice(Number.parseFloat(e.target.value) || 0)
						}
					/>
				</InputWrapper>
			</Grid>
		</>
	);
};

export default BitcoinPrices;

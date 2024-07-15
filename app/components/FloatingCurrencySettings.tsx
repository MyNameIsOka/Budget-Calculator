import type React from "react";
import { styled } from "@stitches/react";
import * as RadioGroup from "@radix-ui/react-radio-group";

const FloatingSettingsWrapper = styled("div", {
	position: "fixed",
	bottom: "20px",
	right: "20px",
	backgroundColor: "white",
	borderRadius: "8px",
	padding: "1rem",
	boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
	border: "1px solid #3498db",
	zIndex: 1000,
	width: "250px",
});

const SettingsTitle = styled("h3", {
	margin: "0 0 1rem 0",
	color: "#3498db",
});

const StyledRadioGroup = styled(RadioGroup.Root, {
	display: "flex",
	gap: "1rem",
	marginBottom: "1rem",
});

const StyledRadioItem = styled(RadioGroup.Item, {
	backgroundColor: "white",
	width: "25px",
	height: "25px",
	borderRadius: "100%",
	border: "1px solid #3498db",
	"&:hover": { backgroundColor: "#f0f8ff" },
	"&:focus": { boxShadow: "0 0 0 2px #3498db" },
});

const StyledRadioIndicator = styled(RadioGroup.Indicator, {
	display: "flex",
	alignItems: "center",
	justifyContent: "center",
	width: "100%",
	height: "100%",
	position: "relative",
	"&::after": {
		content: '""',
		display: "block",
		width: "11px",
		height: "11px",
		borderRadius: "50%",
		backgroundColor: "#3498db",
	},
});

const RadioLabel = styled("label", {
	display: "flex",
	alignItems: "center",
	gap: "0.5rem",
});

const ExchangeRateInput = styled("input", {
	width: "60px",
	padding: "0.5rem",
	border: "1px solid #3498db",
	borderRadius: "4px",
	fontSize: "13px",
	"&:focus": {
		outline: "none",
		boxShadow: `0 0 0 2px #3498db`,
	},
});

const ExchangeRateWrapper = styled("div", {
	display: "flex",
	alignItems: "center",
	gap: "0.5rem",
});

interface FloatingCurrencySettingsProps {
	foreignCurrency: string;
	exchangeRate: number;
	onCurrencyChange: (value: string) => void;
	onExchangeRateChange: (value: number) => void;
}

const FloatingCurrencySettings: React.FC<FloatingCurrencySettingsProps> = ({
	foreignCurrency,
	exchangeRate,
	onCurrencyChange,
	onExchangeRateChange,
}) => (
	<FloatingSettingsWrapper>
		<SettingsTitle>Currency Settings</SettingsTitle>
		<StyledRadioGroup value={foreignCurrency} onValueChange={onCurrencyChange}>
			<RadioLabel>
				<StyledRadioItem value="USD" id="r1">
					<StyledRadioIndicator />
				</StyledRadioItem>
				<label htmlFor="r1">USD</label>
			</RadioLabel>
			<RadioLabel>
				<StyledRadioItem value="EUR" id="r2">
					<StyledRadioIndicator />
				</StyledRadioItem>
				<label htmlFor="r2">EUR</label>
			</RadioLabel>
		</StyledRadioGroup>
		<ExchangeRateWrapper>
			<label htmlFor="exchangeRate">1 {foreignCurrency} =</label>
			<ExchangeRateInput
				id="exchangeRate"
				type="number"
				value={exchangeRate}
				onChange={(e) => onExchangeRateChange(Number(e.target.value))}
			/>
			<span>JPY</span>
		</ExchangeRateWrapper>
	</FloatingSettingsWrapper>
);

export default FloatingCurrencySettings;

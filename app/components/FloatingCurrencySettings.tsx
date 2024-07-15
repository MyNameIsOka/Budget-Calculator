import type React from "react";
import {
	Box,
	Card,
	Flex,
	Heading,
	RadioGroup,
	Text,
	TextField,
} from "@radix-ui/themes";

type FloatingCurrencySettingsProps = {
	foreignCurrency: string;
	exchangeRate: number;
	onCurrencyChange: (value: string) => void;
	onExchangeRateChange: (value: number) => void;
};

const FloatingCurrencySettings: React.FC<FloatingCurrencySettingsProps> = ({
	foreignCurrency,
	exchangeRate,
	onCurrencyChange,
	onExchangeRateChange,
}) => (
	<Card
		style={{
			position: "fixed",
			bottom: "20px",
			right: "20px",
			width: "250px",
			zIndex: 1000,
		}}
	>
		<Flex direction="column" gap="3">
			<Heading size="3">Currency Settings</Heading>
			<RadioGroup.Root value={foreignCurrency} onValueChange={onCurrencyChange}>
				<Flex gap="2">
					<Text as="label" size="2">
						<Flex gap="2">
							<RadioGroup.Item value="USD" /> USD
						</Flex>
					</Text>
					<Text as="label" size="2">
						<Flex gap="2">
							<RadioGroup.Item value="EUR" /> EUR
						</Flex>
					</Text>
				</Flex>
			</RadioGroup.Root>
			<Flex align="center" gap="2">
				<Text size="2">1 {foreignCurrency} =</Text>
				<TextField.Root
					type="number"
					value={exchangeRate}
					onChange={(e) => onExchangeRateChange(Number(e.target.value))}
					style={{ width: "80px" }}
				/>
				<Text size="2">JPY</Text>
			</Flex>
		</Flex>
	</Card>
);

export default FloatingCurrencySettings;

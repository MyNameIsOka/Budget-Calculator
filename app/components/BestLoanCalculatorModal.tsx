import type React from "react";
import { useState, useMemo } from "react";
import {
	Dialog,
	Flex,
	TextField,
	Button,
	Text,
	Card,
	Table,
	Heading,
	Box,
	RadioGroup,
} from "@radix-ui/themes";
import {
	ComposedChart,
	Line,
	XAxis,
	YAxis,
	CartesianGrid,
	Tooltip,
	ResponsiveContainer,
	Area,
} from "recharts";
import { calculateTax } from "~/utils/calculations";
import { useTranslation } from "react-i18next";

type BestLoanCalculatorModalProps = {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	totalExpenses: number;
	btcSalePrice: number;
	btcPurchasePrice: number;
	exchangeRate: number;
	yearlyIncome: number;
	timeFrame: number;
	foreignCurrency: string;
};

const BestLoanCalculatorModal: React.FC<BestLoanCalculatorModalProps> = ({
	open,
	onOpenChange,
	totalExpenses,
	btcSalePrice,
	btcPurchasePrice,
	exchangeRate,
	yearlyIncome,
	timeFrame,
	foreignCurrency,
}) => {
	const { t } = useTranslation();
	const [interestRate, setInterestRate] = useState<string>("5");
	const [ltv, setLtv] = useState<number>(50);
	const [selectedCurrency, setSelectedCurrency] = useState<string>("JPY");

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const value = e.target.value;
		if (/^\d*\.?\d*$/.test(value)) {
			// Allow only numbers and a single decimal point
			setInterestRate(value);
		}
	};

	const getCurrencySymbol = (currency: string) => {
		switch (currency) {
			case "USD":
				return "$";
			case "EUR":
				return "€";
			default:
				return "¥";
		}
	};

	const chartData = useMemo(() => {
		if (!totalExpenses || !btcSalePrice || !exchangeRate || !btcPurchasePrice)
			return [];

		const data = [];
		const steps = 20;
		const step = totalExpenses / steps;

		for (let i = 0; i <= steps; i++) {
			const loanAmount = i * step;
			try {
				const btcToSell =
					(totalExpenses - loanAmount) / (btcSalePrice * exchangeRate);
				const gains =
					btcToSell * (btcSalePrice - btcPurchasePrice) * exchangeRate;
				const taxResult = calculateTax(gains, yearlyIncome);
				const btcTaxes =
					taxResult.capitalGainsTax + taxResult.municipalTaxFromCapitalGains;
				const compoundedAmount =
					loanAmount * (1 + Number(interestRate) / 100) ** timeFrame;
				const interestTaxes = compoundedAmount - loanAmount;
				const totalTaxes = btcTaxes + interestTaxes;
				const btcForTaxes = btcTaxes / (btcSalePrice * exchangeRate);
				const btcNeededForLoan =
					loanAmount / (btcSalePrice * exchangeRate * (ltv / 100));
				const totalBtcNeeded = btcToSell + btcForTaxes + btcNeededForLoan;

				const convertAmount = (amount: number) =>
					selectedCurrency === "JPY"
						? Math.round(amount)
						: Math.round(amount / exchangeRate);

				data.push({
					loanAmount: convertAmount(loanAmount),
					btcSaleAmount: convertAmount(totalExpenses - loanAmount),
					btcTaxes: convertAmount(btcTaxes),
					interestTaxes: convertAmount(interestTaxes),
					totalTaxes: convertAmount(totalTaxes),
					btcNeeded: btcNeededForLoan,
					btcForTaxes: btcForTaxes,
					totalBtcNeeded: totalBtcNeeded,
				});
			} catch (error) {
				console.error("Error calculating chart data:", error);
			}
		}
		return data;
	}, [
		interestRate,
		ltv,
		totalExpenses,
		btcSalePrice,
		btcPurchasePrice,
		exchangeRate,
		yearlyIncome,
		timeFrame,
		selectedCurrency,
	]);

	const optimalLoanData = useMemo(() => {
		if (chartData.length === 0) return null;
		const optimalLoan = chartData.reduce((prev, current) =>
			prev.totalTaxes < current.totalTaxes ? prev : current,
		);

		const btcToSell =
			optimalLoan.totalBtcNeeded -
			optimalLoan.btcForTaxes -
			optimalLoan.btcNeeded;

		return {
			optimalLoanAmount: optimalLoan.loanAmount,
			btcToSell: btcToSell,
			btcNeededForLoan: optimalLoan.btcNeeded,
			totalBtcNeeded: optimalLoan.totalBtcNeeded,
			totalTaxes: optimalLoan.totalTaxes,
			btcTaxes: optimalLoan.btcTaxes,
			interestTaxes: optimalLoan.interestTaxes,
			btcForTaxes: optimalLoan.btcForTaxes,
		};
	}, [chartData]);

	const formatAxisTick = (value: number) => `${(value / 1000).toFixed(0)}k`;

	const CustomTooltip = ({ active, payload, label }: any) => {
		if (active && payload && payload.length) {
			return (
				<Card
					style={{
						backgroundColor: "rgba(255, 255, 255, 0.8)",
						padding: "8px",
					}}
				>
					<Flex direction="column" gap="1">
						{payload.map((pld: any, index: number) => (
							<Text
								key={index}
								style={{ color: pld.color, whiteSpace: "nowrap" }}
							>
								{`${pld.name} : ${getCurrencySymbol(selectedCurrency)}${Number(pld.value).toLocaleString()}`}
							</Text>
						))}
					</Flex>
				</Card>
			);
		}
		return null;
	};

	const CustomLegend = () => (
		<Flex direction="row" justify="center" mt="4">
			<Box mr="6">
				<Text weight="bold">Areas (Right y-Axis)</Text>
				<Flex align="center">
					<Box
						width="12px"
						height="12px"
						mr="2"
						style={{ backgroundColor: "#8884d8" }}
					/>
					<Text>Loan Amount ({getCurrencySymbol(selectedCurrency)})</Text>
				</Flex>
				<Flex align="center">
					<Box
						width="12px"
						height="12px"
						mr="2"
						style={{ backgroundColor: "#82ca9d" }}
					/>
					<Text>BTC Sale Amount</Text>
				</Flex>
			</Box>
			<Box>
				<Text weight="bold">Lines (Left y-Axis)</Text>
				<Flex align="center">
					<Box
						width="12px"
						height="2px"
						mr="2"
						style={{ backgroundColor: "#8884d8" }}
					/>
					<Text>BTC Sale Taxes</Text>
				</Flex>
				<Flex align="center">
					<Box
						width="12px"
						height="2px"
						mr="2"
						style={{ backgroundColor: "#82ca9d" }}
					/>
					<Text>Interest over Time Frame period</Text>
				</Flex>
				<Flex align="center">
					<Box
						width="12px"
						height="2px"
						mr="2"
						style={{ backgroundColor: "#ff7300" }}
					/>
					<Text>Total Taxes</Text>
				</Flex>
			</Box>
		</Flex>
	);

	return (
		<Dialog.Root open={open} onOpenChange={onOpenChange}>
			<Dialog.Content style={{ maxWidth: 800 }}>
				<Dialog.Title>{t("bestLoanCalculator.title")}</Dialog.Title>

				<Card my="4">
					<Heading size="3" mb="2">
						{t("bestLoanCalculator.explanation.title")}
					</Heading>
					<Text as="p" mb="2">
						{t("bestLoanCalculator.explanation.paragraph1")}
					</Text>
					<Text as="p" mb="2">
						{t("bestLoanCalculator.explanation.paragraph2")}
					</Text>
					<Text as="p">{t("bestLoanCalculator.explanation.paragraph3")}</Text>
				</Card>

				<Flex direction="column" gap="3">
					<Flex align="center" gap="2">
						<Text>{t("bestLoanCalculator.interestRate")}</Text>
						<TextField.Root
							type="text" // Use text to allow the user to type a decimal point
							value={interestRate}
							onChange={handleChange}
							onBlur={() => {
								// Convert to number on blur
								setInterestRate(
									Number.parseFloat(interestRate).toString() || "0",
								);
							}}
						/>

						<Text>{t("bestLoanCalculator.loanToValue")}</Text>
						<TextField.Root
							type="number"
							value={ltv.toString()}
							onChange={(e) => setLtv(Number(e.target.value))}
						/>
						<Text>({(100 / ltv).toFixed(2)}x over-collateralized)</Text>
					</Flex>
					<Flex align="center" gap="2">
						<Text>Currency:</Text>
						<RadioGroup.Root
							value={selectedCurrency}
							onValueChange={setSelectedCurrency}
						>
							<Flex gap="2">
								<Text as="label" size="2">
									<Flex gap="2" align="center">
										<RadioGroup.Item value="JPY" /> JPY
									</Flex>
								</Text>
								<Text as="label" size="2">
									<Flex gap="2" align="center">
										<RadioGroup.Item value={foreignCurrency} />{" "}
										{foreignCurrency}
									</Flex>
								</Text>
							</Flex>
						</RadioGroup.Root>
					</Flex>
					{chartData.length > 0 ? (
						<Box>
							<ResponsiveContainer width="100%" height={400}>
								<ComposedChart
									data={chartData}
									margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
								>
									<CartesianGrid strokeDasharray="3 3" />
									<XAxis
										dataKey="loanAmount"
										tickFormatter={formatAxisTick}
										interval={4}
										label={{
											value: t("bestLoanCalculator.loanAmount"),
											position: "insideBottom",
											offset: -10,
										}}
									/>
									<YAxis
										yAxisId="left"
										tickFormatter={formatAxisTick}
										label={{
											value: t("bestLoanCalculator.taxesToPay"),
											angle: -90,
											position: "insideLeft",
											offset: -5,
										}}
									/>
									<YAxis
										yAxisId="right"
										orientation="right"
										tickFormatter={formatAxisTick}
										label={{
											value: t("bestLoanCalculator.expenses"),
											angle: 90,
											position: "insideRight",
											offset: 5,
										}}
									/>
									<Tooltip content={<CustomTooltip />} />
									<Area
										type="monotone"
										dataKey="loanAmount"
										stackId="1"
										fill="#8884d8"
										stroke="#8884d8"
										yAxisId="right"
										name="Loan Amount"
									/>
									<Area
										type="monotone"
										dataKey="btcSaleAmount"
										stackId="1"
										fill="#82ca9d"
										stroke="#82ca9d"
										yAxisId="right"
										name="BTC Sale Amount"
									/>
									<Line
										type="monotone"
										dataKey="btcTaxes"
										stroke="#8884d8"
										yAxisId="left"
										name="BTC Sale Taxes"
									/>
									<Line
										type="monotone"
										dataKey="interestTaxes"
										stroke="#82ca9d"
										yAxisId="left"
										name="Interest over Time Frame period"
									/>
									<Line
										type="monotone"
										dataKey="totalTaxes"
										stroke="#ff7300"
										yAxisId="left"
										name="Total Taxes"
									/>
								</ComposedChart>
							</ResponsiveContainer>
							<CustomLegend />
						</Box>
					) : (
						<Text>No data available to display chart.</Text>
					)}
					{optimalLoanData && (
						<Card>
							<Text size="5" weight="bold" mb="2">
								{t("bestLoanCalculator.optimalLoanSummary")}
							</Text>
							<Table.Root>
								<Table.Body>
									<Table.Row>
										<Table.Cell>
											{t("bestLoanCalculator.optimalLoanAmount")}
										</Table.Cell>
										<Table.Cell>
											{getCurrencySymbol(selectedCurrency)}
											{optimalLoanData.optimalLoanAmount.toLocaleString()}
										</Table.Cell>
									</Table.Row>
									<Table.Row>
										<Table.Cell>{t("bestLoanCalculator.btcToSell")}</Table.Cell>
										<Table.Cell>
											{optimalLoanData.btcToSell.toFixed(4)} BTC
										</Table.Cell>
									</Table.Row>
									<Table.Row>
										<Table.Cell>
											{t("bestLoanCalculator.btcForTaxes")}
										</Table.Cell>
										<Table.Cell>
											{optimalLoanData.btcForTaxes.toFixed(4)} BTC
										</Table.Cell>
									</Table.Row>
									<Table.Row>
										<Table.Cell>
											{t("bestLoanCalculator.btcNeededForLoan")}
										</Table.Cell>
										<Table.Cell>
											{optimalLoanData.btcNeededForLoan.toFixed(4)} BTC
										</Table.Cell>
									</Table.Row>
									<Table.Row>
										<Table.Cell>
											{t("bestLoanCalculator.totalBtcNeeded")}
										</Table.Cell>
										<Table.Cell>
											{optimalLoanData.totalBtcNeeded.toFixed(4)} BTC
										</Table.Cell>
									</Table.Row>
									<Table.Row>
										<Table.Cell>
											{t("bestLoanCalculator.totalTaxes")}
										</Table.Cell>
										<Table.Cell>
											{getCurrencySymbol(selectedCurrency)}
											{optimalLoanData.totalTaxes.toLocaleString()}
										</Table.Cell>
									</Table.Row>
									<Table.Row>
										<Table.Cell>
											{t("bestLoanCalculator.btcSaleTaxes")}
										</Table.Cell>
										<Table.Cell>
											{getCurrencySymbol(selectedCurrency)}
											{optimalLoanData.btcTaxes.toLocaleString()}
										</Table.Cell>
									</Table.Row>
									<Table.Row>
										<Table.Cell>
											{t("bestLoanCalculator.interestTaxes")}
										</Table.Cell>
										<Table.Cell>
											{getCurrencySymbol(selectedCurrency)}
											{optimalLoanData.interestTaxes.toLocaleString()}
										</Table.Cell>
									</Table.Row>
								</Table.Body>
							</Table.Root>
						</Card>
					)}
				</Flex>
				<Flex justify="end" mt="4">
					<Dialog.Close>
						<Button variant="soft">{t("bestLoanCalculator.close")}</Button>
					</Dialog.Close>
				</Flex>
			</Dialog.Content>
		</Dialog.Root>
	);
};

export default BestLoanCalculatorModal;

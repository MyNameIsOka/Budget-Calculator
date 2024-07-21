import type React from "react";
import { Box, Heading } from "@radix-ui/themes";
import {
	PieChart,
	Pie,
	Cell,
	ResponsiveContainer,
	Legend,
	Tooltip,
} from "recharts";
import type { Expense, CustomExpenseTitles } from "~/types";
import { formatCurrency } from "~/utils/calculations";
import { useTranslation } from "react-i18next";

const COLORS = [
	"#0088FE",
	"#00C49F",
	"#FFBB28",
	"#FF8042",
	"#8884D8",
	"#82CA9D",
	"#A4DE6C",
	"#D0ED57",
	"#FFA07A",
	"#20B2AA",
	"#B0C4DE",
	"#DDA0DD",
	"#CD5C5C",
	"#4682B4",
	"#DAA520",
];

type ExpenseDistributionProps = {
	expenses: Expense;
	customExpenseTitles: CustomExpenseTitles;
};

const ExpenseDistribution: React.FC<ExpenseDistributionProps> = ({
	expenses,
	customExpenseTitles,
}) => {
	const { t, i18n } = useTranslation();

	const getExpenseTitle = (key: string) => {
		if (customExpenseTitles[key]) {
			return (
				customExpenseTitles[key][i18n.language as "en" | "ja"] ||
				customExpenseTitles[key]["en"] ||
				customExpenseTitles[key]["ja"]
			);
		}
		return t(`expenseCards.${key}`);
	};

	const pieChartData = Object.entries(expenses).map(([key, value]) => ({
		name: getExpenseTitle(key),
		value: value * 12 * 5,
	}));

	return (
		<Box>
			<Heading size="6" mb="4">
				{t("expenseDistribution.title")}
			</Heading>
			<Box style={{ height: 400, width: "100%" }}>
				<ResponsiveContainer>
					<PieChart>
						<Pie
							data={pieChartData}
							cx="50%"
							cy="50%"
							labelLine={false}
							outerRadius={150}
							fill="#8884d8"
							dataKey="value"
							label={({ name, percent }) =>
								`${name} ${(percent * 100).toFixed(0)}%`
							}
						>
							{pieChartData.map((entry, index) => (
								<Cell
									key={`cell-${index}`}
									fill={COLORS[index % COLORS.length]}
								/>
							))}
						</Pie>
						<Tooltip formatter={(value: number) => formatCurrency(value)} />
						<Legend />
					</PieChart>
				</ResponsiveContainer>
			</Box>
		</Box>
	);
};

export default ExpenseDistribution;

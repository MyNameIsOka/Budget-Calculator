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
export default function ExpenseDistribution({
	expenses,
	customExpenseTitles,
}: ExpenseDistributionProps) {
	const { t, i18n } = useTranslation();

	const getExpenseTitle = (key: string) => {
		if (customExpenseTitles[key]) {
			return (
				customExpenseTitles[key][i18n.language as "en" | "ja"] ||
				customExpenseTitles[key].en ||
				customExpenseTitles[key].ja
			);
		}
		return t(`expenseCards.${key}`);
	};

	const pieChartData = Object.entries(expenses).map(([key, value]) => ({
		name: getExpenseTitle(key),
		value,
	}));

	const CustomLabel = ({
		cx,
		cy,
		midAngle,
		innerRadius,
		outerRadius,
		percent,
		index,
	}: any) => {
		const RADIAN = Math.PI / 180;
		const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
		const x = cx + radius * Math.cos(-midAngle * RADIAN);
		const y = cy + radius * Math.sin(-midAngle * RADIAN);

		return (
			<text
				x={x}
				y={y}
				fill="white"
				textAnchor={x > cx ? "start" : "end"}
				dominantBaseline="central"
				className="text-xs md:text-sm"
			>
				{`${(percent * 100).toFixed(0)}%`}
			</text>
		);
	};

	return (
		<Box className="w-full">
			<Heading size="4" mb="4" className="text-center">
				{t("expenseDistribution.title")}
			</Heading>
			<Box className="h-64 md:h-96 w-full">
				<ResponsiveContainer width="100%" height="100%">
					<PieChart>
						<Pie
							data={pieChartData}
							cx="50%"
							cy="50%"
							labelLine={false}
							label={CustomLabel}
							outerRadius="80%"
							fill="#8884d8"
							dataKey="value"
						>
							{pieChartData.map((entry, index) => (
								<Cell
									key={`cell-${index}`}
									fill={COLORS[index % COLORS.length]}
								/>
							))}
						</Pie>
						<Tooltip formatter={(value: number) => formatCurrency(value)} />
						<Legend layout="vertical" align="right" verticalAlign="middle" />
					</PieChart>
				</ResponsiveContainer>
			</Box>
		</Box>
	);
}

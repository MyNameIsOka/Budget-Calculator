import type React from "react";
import {
	PieChart,
	Pie,
	Cell,
	ResponsiveContainer,
	Legend,
	Tooltip,
} from "recharts";
import type { Expense } from "../types";
import { formatCurrency } from "../utils/calculations";

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

interface ExpenseDistributionProps {
	expenses: Expense;
}

const ExpenseDistribution: React.FC<ExpenseDistributionProps> = ({
	expenses,
}) => {
	const pieChartData = Object.entries(expenses).map(([key, value]) => ({
		name: key.charAt(0).toUpperCase() + key.slice(1),
		value: value * 12 * 5,
	}));

	return (
		<>
			<h2>Expense Distribution</h2>
			<div
				style={{
					height: 400,
					width: "100%",
					backgroundColor: "white",
					borderRadius: "0.5rem",
					padding: "1rem",
				}}
			>
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
			</div>
		</>
	);
};

export default ExpenseDistribution;

import type React from "react";
import { styled } from "@stitches/react";
import type { TaxBreakdownItem } from "../types";
import { formatCurrency } from "../utils/calculations";

const Table = styled("table", {
	width: "100%",
	fontSize: "0.875rem",
	borderCollapse: "collapse",
	color: "#333",
	backgroundColor: "white",
	borderRadius: "0.5rem",
	overflow: "hidden",
});

const Th = styled("th", {
	textAlign: "left",
	padding: "0.75rem",
	backgroundColor: "#3498db",
	color: "white",
});

const Td = styled("td", {
	padding: "0.75rem",
	borderBottom: "1px solid #e0e0e0",
});

interface TaxBreakdownProps {
	taxBreakdown: TaxBreakdownItem[];
	taxAmount: number;
}

const TaxBreakdown: React.FC<TaxBreakdownProps> = ({
	taxBreakdown,
	taxAmount,
}) => {
	return (
		<>
			<h2>Tax Breakdown</h2>
			<div style={{ overflowX: "auto" }}>
				<Table>
					<thead>
						<tr>
							<Th>Bracket</Th>
							<Th>Rate</Th>
							<Th>Taxable Amount</Th>
							<Th>Tax Amount</Th>
						</tr>
					</thead>
					<tbody>
						{taxBreakdown.map((item, index) => (
							<tr
								key={index}
								style={{
									backgroundColor: index % 2 === 0 ? "#f0f8ff" : "white",
								}}
							>
								<Td>{item.bracket}</Td>
								<Td>{item.rate}</Td>
								<Td>{item.taxableAmount}</Td>
								<Td>{item.taxAmount}</Td>
							</tr>
						))}
						<tr style={{ backgroundColor: "#e6f3ff", fontWeight: "bold" }}>
							<Td colSpan={3}>Municipal Tax (10% flat rate)</Td>
							<Td>
								{formatCurrency(
									taxAmount -
										taxBreakdown.reduce(
											(sum, item) =>
												sum +
												Number.parseFloat(
													item.taxAmount.replace(/[^0-9.-]+/g, ""),
												),
											0,
										),
								)}
							</Td>
						</tr>
					</tbody>
				</Table>
			</div>
		</>
	);
};

export default TaxBreakdown;

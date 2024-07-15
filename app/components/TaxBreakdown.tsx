import type React from "react";
import { Box, Heading, Table, Text } from "@radix-ui/themes";
import type { TaxBreakdownItem } from "~/types";
import { formatCurrency } from "~/utils/calculations";

type TaxBreakdownProps = {
	taxBreakdown: TaxBreakdownItem[];
	taxAmount: number;
	startingBracket: string;
};

const TaxBreakdown: React.FC<TaxBreakdownProps> = ({
	taxBreakdown,
	taxAmount,
	startingBracket,
}) => {
	return (
		<Box>
			<Heading size="5" mb="3">
				Tax Breakdown
			</Heading>
			<Text size="2" mb="3">
				Starting tax bracket: {startingBracket}
			</Text>
			<Box style={{ overflowX: "auto" }}>
				<Table.Root style={{ borderCollapse: "collapse", width: "100%" }}>
					<Table.Header>
						<Table.Row>
							<Table.ColumnHeaderCell
								style={{ border: "1px solid var(--gray-6)", padding: "8px" }}
							>
								Bracket
							</Table.ColumnHeaderCell>
							<Table.ColumnHeaderCell
								style={{ border: "1px solid var(--gray-6)", padding: "8px" }}
							>
								Rate
							</Table.ColumnHeaderCell>
							<Table.ColumnHeaderCell
								style={{ border: "1px solid var(--gray-6)", padding: "8px" }}
							>
								Taxable Amount
							</Table.ColumnHeaderCell>
							<Table.ColumnHeaderCell
								style={{ border: "1px solid var(--gray-6)", padding: "8px" }}
							>
								Tax Amount
							</Table.ColumnHeaderCell>
						</Table.Row>
					</Table.Header>
					<Table.Body>
						{taxBreakdown.map((item, index) => (
							<Table.Row key={index}>
								<Table.Cell
									style={{ border: "1px solid var(--gray-6)", padding: "8px" }}
								>
									{item.bracket}
								</Table.Cell>
								<Table.Cell
									style={{ border: "1px solid var(--gray-6)", padding: "8px" }}
								>
									{item.rate}
								</Table.Cell>
								<Table.Cell
									style={{ border: "1px solid var(--gray-6)", padding: "8px" }}
								>
									{item.taxableAmount}
								</Table.Cell>
								<Table.Cell
									style={{ border: "1px solid var(--gray-6)", padding: "8px" }}
								>
									{item.taxAmount}
								</Table.Cell>
							</Table.Row>
						))}
						<Table.Row>
							<Table.Cell
								colSpan={3}
								style={{ border: "1px solid var(--gray-6)", padding: "8px" }}
							>
								<Text weight="bold">Municipal Tax (10% flat rate)</Text>
							</Table.Cell>
							<Table.Cell
								style={{ border: "1px solid var(--gray-6)", padding: "8px" }}
							>
								<Text weight="bold">
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
								</Text>
							</Table.Cell>
						</Table.Row>
					</Table.Body>
				</Table.Root>
			</Box>
		</Box>
	);
};

export default TaxBreakdown;

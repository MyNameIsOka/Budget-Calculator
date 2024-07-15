import type React from "react";
import { Box, Heading, Table, Text } from "@radix-ui/themes";
import type { TaxBreakdownItem } from "~/types";
import { formatCurrency } from "~/utils/calculations";

type TaxBreakdownProps = {
	taxBreakdown: TaxBreakdownItem[];
	taxAmount: number;
};

const TaxBreakdown: React.FC<TaxBreakdownProps> = ({
	taxBreakdown,
	taxAmount,
}) => {
	return (
		<Box>
			<Heading size="5" mb="3">
				Tax Breakdown
			</Heading>
			<Box style={{ overflowX: "auto" }}>
				<Table.Root>
					<Table.Header>
						<Table.Row>
							<Table.ColumnHeaderCell>Bracket</Table.ColumnHeaderCell>
							<Table.ColumnHeaderCell>Rate</Table.ColumnHeaderCell>
							<Table.ColumnHeaderCell>Taxable Amount</Table.ColumnHeaderCell>
							<Table.ColumnHeaderCell>Tax Amount</Table.ColumnHeaderCell>
						</Table.Row>
					</Table.Header>
					<Table.Body>
						{taxBreakdown.map((item, index) => (
							<Table.Row key={index}>
								<Table.Cell>{item.bracket}</Table.Cell>
								<Table.Cell>{item.rate}</Table.Cell>
								<Table.Cell>{item.taxableAmount}</Table.Cell>
								<Table.Cell>{item.taxAmount}</Table.Cell>
							</Table.Row>
						))}
						<Table.Row>
							<Table.Cell colSpan={3}>
								<Text weight="bold">Municipal Tax (10% flat rate)</Text>
							</Table.Cell>
							<Table.Cell>
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

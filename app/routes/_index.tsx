import type { MetaFunction } from "@remix-run/node";
import { Theme } from "@radix-ui/themes";
import BudgetCalculator from "~/components/BudgetCalculator";

export const meta: MetaFunction = () => {
	return [
		{ title: "5-Year Budget Calculator for Japan" },
		{
			name: "description",
			content: "Budget calculator with Bitcoin tax and currency conversion",
		},
	];
};

export default function Index() {
	return (
		<Theme
			appearance="light"
			accentColor="blue"
			grayColor="slate"
			radius="medium"
			scaling="100%"
		>
			<BudgetCalculator />
		</Theme>
	);
}

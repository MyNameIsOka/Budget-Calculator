import type { MetaFunction } from "@remix-run/node";
import BudgetCalculator from "~/components/BudgetCalculator";

export const meta: MetaFunction = () => {
  return [
    { title: "5-Year Budget Calculator for Japan" },
    { name: "description", content: "Budget calculator with Bitcoin tax and currency conversion" },
  ];
};

export default function Index() {
  return <BudgetCalculator />;
}
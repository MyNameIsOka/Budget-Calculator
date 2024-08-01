import type React from "react";
import { Button } from "@radix-ui/themes";
import { ResetIcon } from "@radix-ui/react-icons";
import { useTranslation } from "react-i18next";

type ResetButtonProps = {
	onReset: () => void;
};
export default function ResetButton({ onReset }: ResetButtonProps) {
	const { t } = useTranslation();

	return (
		<Button onClick={onReset} color="red" variant="soft">
			<ResetIcon />
			{t("reset.button")}
		</Button>
	);
}

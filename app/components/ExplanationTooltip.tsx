import type React from "react";
import * as Tooltip from "@radix-ui/react-tooltip";
import { QuestionMarkCircledIcon } from "@radix-ui/react-icons";

type ExplanationTooltipProps = {
	explanation: string;
};

export const ExplanationTooltip: React.FC<ExplanationTooltipProps> = ({
	explanation,
}) => {
	return (
		<Tooltip.Provider>
			<Tooltip.Root>
				<Tooltip.Trigger asChild>
					<QuestionMarkCircledIcon className="inline-block ml-1 text-gray-500 cursor-help" />
				</Tooltip.Trigger>
				<Tooltip.Portal>
					<Tooltip.Content
						className="bg-white p-2 rounded shadow-lg border border-gray-200 max-w-xs text-sm"
						sideOffset={5}
					>
						{explanation}
						<Tooltip.Arrow className="fill-white" />
					</Tooltip.Content>
				</Tooltip.Portal>
			</Tooltip.Root>
		</Tooltip.Provider>
	);
};

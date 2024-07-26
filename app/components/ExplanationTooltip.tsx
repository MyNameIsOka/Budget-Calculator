import type React from "react";
import { useState } from "react";
import * as Tooltip from "@radix-ui/react-tooltip";
import * as Popover from "@radix-ui/react-popover";
import { QuestionMarkCircledIcon } from "@radix-ui/react-icons";

type ExplanationTooltipProps = {
	explanation: string;
};

export const ExplanationTooltip: React.FC<ExplanationTooltipProps> = ({
	explanation,
}) => {
	const [isPopoverOpen, setIsPopoverOpen] = useState(false);

	const Content = ({ children }: { children: React.ReactNode }) => (
		<div className="bg-white p-2 rounded shadow-lg border border-gray-200 max-w-xs text-sm">
			{children}
		</div>
	);

	return (
		<Tooltip.Provider>
			<Tooltip.Root>
				<Popover.Root open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
					<Tooltip.Trigger asChild>
						<Popover.Trigger asChild>
							<QuestionMarkCircledIcon
								className="inline-block ml-1 text-gray-500 cursor-help"
								onClick={(e) => {
									e.preventDefault();
									setIsPopoverOpen(true);
								}}
							/>
						</Popover.Trigger>
					</Tooltip.Trigger>

					<Tooltip.Portal>
						<Tooltip.Content
							side="top"
							sideOffset={5}
							onPointerDownOutside={(e) => e.preventDefault()}
						>
							<Content>{explanation}</Content>
							<Tooltip.Arrow className="fill-white" />
						</Tooltip.Content>
					</Tooltip.Portal>

					<Popover.Portal>
						<Popover.Content side="top" sideOffset={5}>
							<Content>{explanation}</Content>
							<Popover.Arrow className="fill-white" />
						</Popover.Content>
					</Popover.Portal>
				</Popover.Root>
			</Tooltip.Root>
		</Tooltip.Provider>
	);
};

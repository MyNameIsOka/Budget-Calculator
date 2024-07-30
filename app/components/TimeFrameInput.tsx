import type React from "react";
import { Box, Flex, Text, TextField, Heading, Card } from "@radix-ui/themes";
import { useTranslation } from "react-i18next";
import { ExplanationTooltip } from "./ExplanationTooltip";

type TimeFrameInputProps = {
	timeFrame: number;
	setTimeFrame: (years: number) => void;
};

const TimeFrameInput: React.FC<TimeFrameInputProps> = ({
	timeFrame,
	setTimeFrame,
}) => {
	const { t } = useTranslation();

	return (
		<Card className="w-full">
			<Heading size="3" mb="3">
				{t("timeFrame.title")}
			</Heading>
			<Flex direction="column" gap="2">
				<Box>
					<Text as="label" size="2" weight="bold">
						{t("timeFrame.label")}
					</Text>
					<ExplanationTooltip explanation={t("timeFrame.explanation")} />
					<TextField.Root
						size="2"
						value={timeFrame.toString()}
						onChange={(e) => setTimeFrame(Number(e.target.value))}
					/>
				</Box>
			</Flex>
		</Card>
	);
};

export default TimeFrameInput;

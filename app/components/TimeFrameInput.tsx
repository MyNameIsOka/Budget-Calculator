import type React from "react";
import { useState, useEffect } from "react";
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
	const [inputValue, setInputValue] = useState(timeFrame.toString());

	useEffect(() => {
		setInputValue(timeFrame.toString());
	}, [timeFrame]);

	const handleInputChange = (value: string) => {
		setInputValue(value);
		const numValue = Number.parseInt(value, 10);
		if (!Number.isNaN(numValue) && numValue > 0) {
			setTimeFrame(numValue);
		} else if (value === "") {
			setTimeFrame(1);
		}
	};

	const handleBlur = () => {
		if (inputValue === "" || Number.parseInt(inputValue, 10) < 1) {
			setInputValue("1");
			setTimeFrame(1);
		}
	};

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
						value={inputValue}
						onChange={(e) => handleInputChange(e.target.value)}
						onBlur={handleBlur}
					/>
				</Box>
			</Flex>
		</Card>
	);
};

export default TimeFrameInput;

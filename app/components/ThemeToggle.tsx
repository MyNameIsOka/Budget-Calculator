import type React from "react";
import { Flex, Switch, Text } from "@radix-ui/themes";
import { MoonIcon, SunIcon } from "@radix-ui/react-icons";
import { useTranslation } from "react-i18next";

type ThemeToggleProps = {
	theme: "light" | "dark";
	setTheme: (theme: "light" | "dark") => void;
};

const ThemeToggle: React.FC<ThemeToggleProps> = ({ theme, setTheme }) => {
	const { t } = useTranslation();

	const toggleTheme = () => {
		setTheme(theme === "light" ? "dark" : "light");
	};

	return (
		<Flex align="center" gap="2">
			<Switch checked={theme === "dark"} onCheckedChange={toggleTheme} />
			<Flex gap="2" align="center">
				{theme === "light" ? <SunIcon /> : <MoonIcon />}
				<Text size="2">{t(`settings.${theme}Mode`)}</Text>
			</Flex>
		</Flex>
	);
};

export default ThemeToggle;

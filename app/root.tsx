import type { LinksFunction } from "@remix-run/node";
import {
	Links,
	LiveReload,
	Meta,
	Outlet,
	Scripts,
	ScrollRestoration,
} from "@remix-run/react";
import { Theme } from "@radix-ui/themes";
import styles from "@radix-ui/themes/styles.css?url";
import { I18nextProvider } from "react-i18next";
import i18n from "./i18n";
import { useEffect } from "react";
import { getExchangeRates } from "~/utils/exchangeRate";
import customStyles from "~/styles/custom.css?url";

// Import Tailwind CSS
import tailwindStyles from "./tailwind.css?url";

export const links: LinksFunction = () => [
	{ rel: "stylesheet", href: tailwindStyles },
	{ rel: "stylesheet", href: styles },
	{ rel: "stylesheet", href: customStyles },
];

export default function App() {
	useEffect(() => {
		// Initialize exchange rates
		getExchangeRates().catch(console.error);

		// Set default language if not already set
		if (!localStorage.getItem("i18nextLng")) {
			localStorage.setItem("i18nextLng", "en-GB");
			i18n.changeLanguage("en-GB");
		}
	}, []);

	return (
		<html lang="en" className="h-full">
			<head>
				<meta charSet="utf-8" />
				<meta name="viewport" content="width=device-width,initial-scale=1" />
				<Meta />
				<Links />
			</head>
			<body className="h-full">
				<I18nextProvider i18n={i18n}>
					<Theme
						accentColor="blue"
						grayColor="sand"
						radius="medium"
						scaling="95%"
					>
						<Outlet />
					</Theme>
				</I18nextProvider>
				<ScrollRestoration />
				<Scripts />
				<LiveReload />
			</body>
		</html>
	);
}

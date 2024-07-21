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
import styles from "@radix-ui/themes/styles.css";
import { I18nextProvider } from "react-i18next";
import i18n from "./i18n";

export const links: LinksFunction = () => [
	{ rel: "stylesheet", href: styles },
	// Add any other stylesheets here
];

export default function App() {
	return (
		<html lang="en">
			<head>
				<Meta />
				<Links />
			</head>
			<body>
				<I18nextProvider i18n={i18n}>
					<Theme>
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

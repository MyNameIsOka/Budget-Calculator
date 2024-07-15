import type { MetaFunction } from "@remix-run/node";
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "@remix-run/react";
import { styled } from "@stitches/react";

export const meta: MetaFunction = () => [{
  charset: "utf-8",
  title: "5-Year Budget Calculator for Japan",
  viewport: "width=device-width,initial-scale=1",
}];

const AppWrapper = styled("div", {
  minHeight: "100vh",
  backgroundColor: "#f0f8ff",
  padding: "2rem",
  fontFamily: "Arial, sans-serif",
});

export default function App() {
  return (
    <html lang="en">
      <head>
        <Meta />
        <Links />
      </head>
      <body>
        <AppWrapper>
          <Outlet />
        </AppWrapper>
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}
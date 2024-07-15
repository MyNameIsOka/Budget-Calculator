import { Outlet } from "@remix-run/react";
import { styled } from "@stitches/react";

const AppWrapper = styled("div", {
  minHeight: "100vh",
  backgroundColor: "#f0f8ff",
  padding: "2rem",
  fontFamily: "Arial, sans-serif",
});

export default function Root() {
  return (
    <AppWrapper>
      <Outlet />
    </AppWrapper>
  );
}
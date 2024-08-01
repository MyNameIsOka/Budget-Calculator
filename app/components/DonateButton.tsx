import { Box, Link } from "@radix-ui/themes";
import { useTranslation } from "react-i18next";

type DonateButtonProps = {
	donationLink: string;
};

export default function DonateButton({ donationLink }: DonateButtonProps) {
	const { t } = useTranslation();

	return (
		<Box
			style={{
				display: "flex",
				justifyContent: "center",
			}}
		>
			<Link
				href={donationLink}
				target="_blank"
				rel="noopener noreferrer"
				style={{
					display: "inline-block",
					lineHeight: 0,
					fontSize: 0,
				}}
			>
				<img
					src="/images/donate-bitcoin-button.png"
					alt={t("donate.alt")}
					style={{
						width: "auto",
						height: "50px",
						display: "block",
						cursor: "pointer",
					}}
				/>
			</Link>
		</Box>
	);
}

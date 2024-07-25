import type React from "react";
import { Card, Text, Link, Flex } from "@radix-ui/themes";
import { useTranslation } from "react-i18next";

type ContactNoteProps = {
	socialMediaLink: string;
	socialMediaPlatform: string;
	donationLink: string;
};

const ContactNote: React.FC<ContactNoteProps> = ({
	socialMediaLink,
	socialMediaPlatform,
	donationLink,
}) => {
	const { t } = useTranslation();

	return (
		<Card style={{ maxWidth: "600px", margin: "20px auto" }}>
			<Flex direction="column" gap="2">
				<Text size="2">{t("contactNote.text")}</Text>
				<Text size="2">
					{t("contactNote.contactMe")}{" "}
					<Link
						href={socialMediaLink}
						target="_blank"
						rel="noopener noreferrer"
					>
						{socialMediaPlatform}
					</Link>
				</Text>
				<Text size="2">
					{t("contactNote.donation")}{" "}
					<Link href={donationLink} target="_blank" rel="noopener noreferrer">
						{t("contactNote.zapMe")}
					</Link>
				</Text>
			</Flex>
		</Card>
	);
};

export default ContactNote;

import {
	createStyles,
	Text,
	Container,
	ActionIcon,
	Group,
	useMantineColorScheme,
	Image,
} from "@mantine/core";
import Logo from "../../assets/Logo.png";
import { BrandInstagram, BrandTwitter, BrandGithub } from "tabler-icons-react";
import { useState } from "react";
// import { IconBrandTwitter, IconBrandYoutube, IconBrandInstagram } from '@tabler/icons';
// import { MantineLogo } from '@mantine/ds';

interface FooterLinksProps {
	data: {
		title: string;
		links: { label: string; link: string }[];
	}[];
}

function Footer({ data }: FooterLinksProps) {
	
	const [currentPage, setCurrentPage] = useState<any>();
	
	const { colorScheme, toggleColorScheme } = useMantineColorScheme();
	const useStyles = createStyles((theme) => ({
		footer: {
			marginTop: 0,
			paddingTop: theme.spacing.xl * 2,
			paddingBottom: theme.spacing.xl * 2,
			backgroundColor:
				colorScheme === "dark"
					? theme.colors.dark[6]
					: theme.colors.gray[2],
			borderTop: `1px solid ${
				colorScheme === "dark"
					? theme.colors.dark[5]
					: theme.colors.gray[2]
			}`,
		},

		logo: {
			maxWidth: 200,

			[theme.fn.smallerThan("sm")]: {
				display: "flex",
				flexDirection: "column",
				alignItems: "center",
			},
		},

		description: {
			marginTop: 5,

			[theme.fn.smallerThan("sm")]: {
				marginTop: theme.spacing.xs,
				textAlign: "center",
			},
		},

		inner: {
			display: "flex",
			justifyContent: "space-between",

			[theme.fn.smallerThan("sm")]: {
				flexDirection: "column",
				alignItems: "center",
			},
		},

		groups: {
			display: "flex",
			flexWrap: "wrap",

			[theme.fn.smallerThan("sm")]: {
				display: "none",
			},
		},

		wrapper: {
			width: 160,
		},

		link: {
			display: "block",
			color:
				colorScheme === "dark"
					? theme.colors.dark[1]
					: theme.colors.gray[6],
			fontSize: theme.fontSizes.sm,
			paddingTop: 3,
			paddingBottom: 3,

			"&:hover": {
				textDecoration: "underline",
			},
		},

		title: {
			fontSize: theme.fontSizes.lg,
			fontWeight: 700,
			fontFamily: `Greycliff CF, ${theme.fontFamily}`,
			marginBottom: theme.spacing.xs / 2,
			color: colorScheme === "dark" ? theme.white : theme.black,
		},

		afterFooter: {
			display: "flex",
			justifyContent: "space-between",
			alignItems: "center",
			marginTop: theme.spacing.xl,
			paddingTop: theme.spacing.xl,
			paddingBottom: theme.spacing.xl,
			borderTop: `1px solid ${
				colorScheme === "dark"
					? theme.colors.dark[4]
					: theme.colors.gray[2]
			}`,

			[theme.fn.smallerThan("sm")]: {
				flexDirection: "column",
			},
		},

		social: {
			[theme.fn.smallerThan("sm")]: {
				marginTop: theme.spacing.xs,
			},
		},
	}));
	
	const { classes } = useStyles();

	const groups = data.map((group) => {
		
		const links = group.links.map((link, index) => (
			<Text<"a">
				key={index}
				className={classes.link}
				component="a"
				href={link.link}
				target="_blank"
				// onClick={(event) => event.preventDefault()}
			>
				{link.label}
			</Text>
		));

		return (
			<div className={classes.wrapper} key={group.title}>
				<Text className={classes.title}>{group.title}</Text>
				{links}
			</div>
		);
	});

	return (
		<footer className={classes.footer}>
			<Container className={classes.inner}>
				<div className={classes.logo}>
					{/* <MantineLogo size={30} /> */}
					<Image src={Logo} width={40} fit="contain" />
					<Text
						size="xs"
						color="dimmed"
						className={classes.description}
					>
						Your favourite place to collect cards.
					</Text>
				</div>
				<div className={classes.groups}>{groups}</div>
			</Container>
			<Container className={classes.afterFooter}>
				<Text color="dimmed" size="sm">
					© 2022 The Card Captor.
				</Text>

				<Group
					spacing={10}
					className={classes.social}
					position="right"
					noWrap
				>
					<ActionIcon size="lg">
						<BrandInstagram size={32} />
					</ActionIcon>
					<ActionIcon size="lg">
						<BrandTwitter size={32} />
					</ActionIcon>
					<ActionIcon size="lg">
						<BrandGithub size={32} />
					</ActionIcon>
				</Group>
			</Container>
		</footer>
	);
}

export default Footer;
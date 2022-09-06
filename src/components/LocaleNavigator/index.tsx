import { useState, useContext, useEffect } from "react";
import i18n from "../../i18n";
import LocaleContext from "../../LocaleContext";
import { useTranslation } from "react-i18next";
// import {
//     createStyles,
//     UnstyledButton,
//     Menu,
//     Image,
//     Group,
//     useMantineColorScheme,
// } from "@mantine/core";
import {
    createStyles,
    UnstyledButton,
    Menu,
    Image,
    Group,
    useMantineColorScheme,
} from "@mantine/core";
import { ChevronDown } from "tabler-icons-react";
import enIcon from "../../assets/en.png";
import ptIcon from "../../assets/pt.png";

const data = [
    { label: "English", image: enIcon, lang: "en" },
    { label: "Português", image: ptIcon, lang: "pt" },
];

export default function LanguagePicker(props:any) {
    
    useEffect(() => {
        
        if (props.lang == "en") {
            changeLocale("en")
            setSelected(data[0])
        } else if (props.lang == "pt") {
            changeLocale("pt")
            setSelected(data[1])
        }
        
    }, [props.lang])
    
    const { colorScheme, toggleColorScheme } = useMantineColorScheme();
    const { t } = useTranslation();
    const { locale } = useContext(LocaleContext);
    
    const useStyles = createStyles((theme, { opened }: { opened: boolean }) => ({
        control: {
            width: 80,
            height: 42,
            boxShadow: theme.shadows.sm,
            // marginRight: 10,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "10px 15px",
            borderRadius: theme.radius.md,
            border: `1px solid ${
                colorScheme === "dark"
                    ? theme.colors.dark[6]
                    : theme.colors.gray[2]
            }`,
            transition: "background-color 150ms ease",
            backgroundColor:
                colorScheme === "dark"
                    ? theme.colors.dark[opened ? 5 : 6]
                    : opened
                    ? theme.colors.gray[0]
                    : theme.white,
    
            "&:hover": {
                backgroundColor:
                    colorScheme === "dark"
                        ? theme.colors.dark[5]
                        : theme.colors.gray[0],
            },
        },
    
        label: {
            fontWeight: 500,
            fontSize: theme.fontSizes.sm,
        },
    
        icon: {
            transition: "transform 150ms ease",
            transform: opened ? "rotate(180deg)" : "rotate(0deg)",
            color: colorScheme === "dark"
                    ? theme.colors.gray[2]
                    : theme.colors.dark[6]
        },
    }));
    
    function changeLocale(l: any) {
        if (locale !== l) {
            i18n.changeLanguage(l);
            localStorage.setItem("lang", l);
        }
    }

    const [opened, setOpened] = useState(false);
    const { classes } = useStyles({ opened });
    const [selected, setSelected] = useState(data[0]);
    const items = data.map((item) => (
        <Menu.Item
            icon={<Image src={item.image} width={18} height={18} />}
            onClick={() => {setSelected(item); changeLocale(item.lang)}}
            key={item.label}
        >
            {item.label}
        </Menu.Item>
    ));

    return (
        <Menu
            onOpen={() => setOpened(true)}
            onClose={() => setOpened(false)}
            radius="md"
            width="target"
        >
            <Menu.Target>
                <UnstyledButton className={classes.control}>
                    <Group spacing="xs">
                        <Image src={selected.image} width={22} height={22} />
                        {/* <span className={classes.label}>{selected.label}</span> */}
                    </Group>
                    <ChevronDown
                        size={16}
                        className={classes.icon}
                        // stroke={1.5}
                    />
                </UnstyledButton>
            </Menu.Target>
            <Menu.Dropdown sx={{ width: "150px !important", marginRight: "20px !important" }}>{items}</Menu.Dropdown>
        </Menu>
    );
}

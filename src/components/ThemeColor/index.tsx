import { useMantineColorScheme, ActionIcon, Group, ColorSchemeProvider } from "@mantine/core";
import { Sun, Moon } from "tabler-icons-react";

export function ActionToggle() {
    // const toggleColorScheme = (value?: ColorScheme) => setColorScheme(value || (colorScheme === 'dark' ? 'light' : 'dark'));
    
    const { colorScheme, toggleColorScheme } = useMantineColorScheme();

    return (
        <ColorSchemeProvider colorScheme={colorScheme} toggleColorScheme={toggleColorScheme}>
            <Group position="center" my="xl">
                <ActionIcon
                    onClick={() => toggleColorScheme()}
                    size="xl"
                    sx={(theme:any) => ({
                        backgroundColor:
                            colorScheme === "dark"
                                ? theme.colors.dark[6]
                                : theme.white,
                        color:
                            colorScheme === "dark"
                                ? theme.colors.yellow[4]
                                : theme.colors.blue[6],
                        borderRadius: theme.radius.md,
                        boxShadow: theme.shadows.xl,
                        
                        "&:hover": {
                            backgroundColor:
                                colorScheme === "dark"
                                ? theme.colors.dark[5]
                                : theme.colors.gray[0],
                        }
                    })}
                >
                    {colorScheme === "dark" ? (
                        <Sun size={18} />
                    ) : (
                        <Moon size={18} />
                    )}
                </ActionIcon>
            </Group>
        </ColorSchemeProvider>
    );
}
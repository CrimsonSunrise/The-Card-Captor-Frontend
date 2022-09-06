import {
    Container,
    Grid,
    SimpleGrid,
    Skeleton,
    useMantineTheme,
    Image
} from "@mantine/core";
import "./style.scss"

const PRIMARY_COL_HEIGHT = 500;

export function MarketHighlights() {
    const theme = useMantineTheme();
    const SECONDARY_COL_HEIGHT = PRIMARY_COL_HEIGHT / 2 - theme.spacing.md / 2;

    return (
        <Container my="xl" fluid className="market-highlight-container">
            
            <SimpleGrid
                cols={2}
                spacing="md"
                breakpoints={[{ maxWidth: "sm", cols: 1 }]}
            >
                <Skeleton
                    height={PRIMARY_COL_HEIGHT}
                    radius="md"
                    animate={true}
                    sx={(theme) => ({ boxShadow: theme.shadows.xl })}
                />
                {/* <Image
                    radius="md"
                    height={PRIMARY_COL_HEIGHT}
                    src={null}
                    alt="With default placeholder"
                    withPlaceholder
                /> */}
                
                <Grid gutter="md">
                    
                    <Grid.Col>
                        <Skeleton
                            height={SECONDARY_COL_HEIGHT}
                            radius="md"
                            animate={true}
                            sx={(theme) => ({ boxShadow: theme.shadows.xl })}
                        />
                    </Grid.Col>
                    
                    <Grid.Col span={6}>
                        <Skeleton
                            height={SECONDARY_COL_HEIGHT}
                            radius="md"
                            animate={true}
                            sx={(theme) => ({ boxShadow: theme.shadows.xl })}
                        />
                    </Grid.Col>
                    
                    <Grid.Col span={6}>
                        <Skeleton
                            height={SECONDARY_COL_HEIGHT}
                            radius="md"
                            animate={true}
                            sx={(theme) => ({ boxShadow: theme.shadows.xl })}
                        />
                    </Grid.Col>
                    
                </Grid>
            </SimpleGrid>
        </Container>
    );
}

import {
    ActionIcon,
    Button,
    Container,
    Text,
    Space,
    TextInput,
    useMantineColorScheme,
    useMantineTheme,
    Anchor,
    Title,
} from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import axios from "axios";
import React, { useCallback, useEffect, useRef, useState } from "react";
import {
    ArrowLeft,
    ArrowRight,
    RectangleVertical,
    Search,
    X,
} from "tabler-icons-react";
import Card from "../../components/Card";
import { IP_ADDRESS } from "../../connection";
import "./style.scss";

export default function Albums(props: any) {
    const { colorScheme, toggleColorScheme } = useMantineColorScheme();
    const isMobile = useMediaQuery("(max-width: 1300px)");

    const [searchSentence, setSearchSentence] = useState<any>("");
    const searchInput = useRef(null);
    const [scrollBlocked, setScrollBlocked] = useState(false);

    const theme = useMantineTheme();

    const [selectedAlbum, setSelectedAlbum] = useState<any>(null);
    const [selectedCollection, setSelectedCollection] = useState<any>(null);
	
	const [albums, setAlbums] = useState<any>({});
	const [cards, setCards] = useState([]);
	// const [cardCount, setCardCount] = useState(null);
	const [albumNames, setAlbumNames] = useState([]);
	
    useEffect(() => {
		
		// console.log(props.user.cards)
		setCards(props.user.cards)
		
		axios.get(IP_ADDRESS + "/getAlbums").then(res => {
			setAlbumNames(res.data)
		}).catch(err => {
			console.log(err)
		})
		
        axios.get(IP_ADDRESS + "/getFiles")
            .then((res) => {
                if (res.data != "err") {
                    let nAlbums = {} as any;

                    res.data.cards.map((card: any) => {
                        if (card.fresh) return;

                        const album = card.album;
                        const collection = card.collection;

                        if (!nAlbums?.[album]) nAlbums[album] = {};

                        if (!nAlbums?.[album]?.[collection]) {
                            nAlbums[album][collection] = [card];
                        } else {
                            nAlbums[album][collection].push(card);
                        }
                    });

                    setAlbums(nAlbums);
                    // console.log([nAlbums][0]);

                    // setCards(
                    //     res.data.cards.filter((card: any) => {
                    //         if (card.fresh != true) return card;
                    //     })
                    // );
					
                    // setFreshCards(
                    //     res.data.cards.filter((card: any) => {
                    //         if (card.fresh == true) return card;
                    //     })
                    // );

                    // setLoading(false);
                    // setCardModalOpened(false);
                } else {
                    console.log(res.data);
                }
            })
            .catch((err) => {
                console.log(err);
            });
    }, []);

    const backButton = () => {
        if (selectedCollection) {
            setSelectedCollection(null);
        } else {
            if (selectedAlbum) setSelectedAlbum(null);
        }
    };

    const selectAlbum = (e: string) => {
        setSelectedAlbum(e);
        setScrollBlocked(true);
    };

    const selectCollection = (e: string) => {
        setSelectedCollection(e);
    };

    const CollectionCustomIcon = (p:any) => {
        return (
            <div className="collection-custom-icon">
                <div className="cards-icon">
                    <div></div>
                    <div></div>
                    <div></div>
                </div>
                <Text
                    lineClamp={1}
                    px={20}
                    title={p.title}
                >
                    {p.title}
                </Text>
            </div>
        );
    };

    return (
        <div className={colorScheme == "dark" ? "album dark" : "album light"}>
            <Space h="xl" />

            <Container size="xl" px="xl" className="album-container">
                <div className="album-search">
                    <TextInput
                        ref={searchInput}
                        icon={<Search size={18} strokeWidth={1.5} />}
                        radius="sm"
                        size="md"
                        value={searchSentence}
                        onChange={(e) => {
                            setSearchSentence(e.target.value);
                        }}
                        rightSection={
                            searchSentence != "" ? (
                                <ActionIcon
                                    size={32}
                                    radius="sm"
                                    color={theme.primaryColor}
                                    variant="default"
                                    onClick={() => {
                                        setSearchSentence("");
                                        searchInput.current.focus();
                                    }}
                                >
                                    <X size={18} strokeWidth={1.5} />
                                </ActionIcon>
                            ) : null
                            // 	// <Button variant="gradient" gradient={{ from: '#ed6ea0', to: '#ec8c69', deg: 35 }} sx={(theme) => ({ width: 20, boxShadow: theme.shadows.sm })}><Search size={18} strokeWidth={1.5} /></Button>
                        }
                        placeholder="Search for album, collection or card"
                        type="text"
                        rightSectionWidth={42}
                        // {}
                    />
                </div>

                <div
                    className={
                        scrollBlocked ? "albums scroll-blocked" : "albums"
                    }
                >
                    <div
                        className={
                            selectedAlbum != null
                                ? "album-info active"
                                : "album-info"
                        }
                    >
                        <div className="album-info-header">
                            <Button
                                variant="gradient"
                                gradient={{
                                    from: "#ed6ea0",
                                    to: "#ec8c69",
                                    deg: 35,
                                }}
                                onClick={() => {
                                    backButton();
                                }}
                            >
                                Back
                            </Button>
                            <Space w="xl" />
                            <Title
                                style={{ fontSize: isMobile ? 16 : null }}
                                className={
                                    selectedCollection
                                        ? "collection-selected"
                                        : ""
                                }
                                order={3}
                            >
                                {selectedAlbum} <span></span>
                                {selectedCollection ? selectedCollection : ""}
                            </Title>
                        </div>

                        <div className="album-info-collections">
                            {selectedCollection ? (
                                <div className="cards">
                                    <div className="cards-container">
										
										{
											selectedCollection != null ?
											Object.keys(albums[selectedAlbum][selectedCollection]).map((card:any, index:number) => {
												return (
													<Card
														key={"card"+index}
														animate={false}
														hoverZoom={true}
														id="asd"
														name={albums[selectedAlbum][selectedCollection][index].title}
														price={1}
														image={"https://thecardcaptorbucket.s3.sa-east-1.amazonaws.com/"+albums[selectedAlbum][selectedCollection][index].subject}
														background={"https://thecardcaptorbucket.s3.sa-east-1.amazonaws.com/"+albums[selectedAlbum][selectedCollection][index].background}
														rarity={albums[selectedAlbum][selectedCollection][index].rarity}
														ratationMultiplier={0.1}
														unlocked={ cards.includes(albums[selectedAlbum][selectedCollection][index]._id) ? true : false }
													/>
												)
											})
											: null
										}
                                    </div>
                                </div>
                            ) : null}

                            <div className="collections">
								
								{
									selectedAlbum != null ?
									Object.keys(albums[selectedAlbum]).map((collection:any, index:number) => {
										return (
											<Anchor
												key={"c"+index}
												variant="text"
												tabIndex={
													selectedAlbum &&
													selectedCollection == null
														? null
														: -1
												}
												href=""
												className="collection"
												onClick={(e: any) => {
													e.preventDefault();
													selectCollection(collection);
												}}
											>
												<CollectionCustomIcon title={collection} />
											</Anchor>
										)
									})
									: null
								}
                            </div>
                        </div>
                    </div>
					
					{
						Object.keys(albums).map((album:any, index:number) => {
							let img = "";
							albumNames.map(a => { if (a.name == album) {img = a.img} })
							return (
								<Anchor
									key={"a"+index}
									variant="text"
									tabIndex={selectedAlbum ? -1 : null}
									href=""
									className="album-item"
									onClick={(e: any) => {
										e.preventDefault();
										selectAlbum(album);
									}}
								>
									<div className="album-cover" style={{ backgroundImage: albumNames.length > 0 ? `url(${img}` : "" }}></div>
									<Text
										size="xl"
										lineClamp={1}
										title={album}
									>
										{album}
									</Text>
								</Anchor>
							)
							
						})
					}
                    
                </div>
            </Container>
        </div>
    );
}

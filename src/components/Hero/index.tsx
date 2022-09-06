import { Overlay, Container,  Button, Text, Loader, Modal, Skeleton, HoverCard, Group, Stack, Anchor, ThemeIcon, Space, Title } from "@mantine/core";

import "./style.scss";

import heroCover from "../../assets/hero_cover.png";
import Card from "../Card";
// import { CardData } from "../Card";

import bg1 from "../../assets/bg.png";
import image1 from "../../assets/img.png";
import frame1 from "../../assets/frame.png";

import bg2 from "../../assets/bg2.png";
import image2 from "../../assets/img2.png";
import frame2 from "../../assets/frame2.png";

import bg3 from "../../assets/bg3.png";
import image3 from "../../assets/img3.png";
import frame3 from "../../assets/frame3.png";
import BidsTable from "../BidsTable";
import { useMediaQuery } from "@mantine/hooks";
import { Suspense, useEffect, useState } from "react";
import Loading from "../Loading";
import axios from "axios";
import { IP_ADDRESS } from "../../connection";
import { getCookie } from "../../Controllers/authentication";
import CountUp from 'react-countup';
import { ExclamationMark } from "tabler-icons-react";
import { useTranslation } from "react-i18next";
import { browserName, CustomView } from 'react-device-detect';

const BidSection = (props: any) => {
    const [currentAuction, setCurrentAuction] = useState<any>({});
	const [expiryDate, setExpiryDate] = useState(null);
    const [auctionDuration, setrAuctionDuration] = useState(0);
	const [timeCooldown, setTimeCooldown] = useState(null);
    const [placingBid, setPlacingBid] = useState(false);
    const [placingBidModal, setPlacingBidModal] = useState(false);
    
    const [overrideCanBid, setOverrideCanBid] = useState(true);
	
    let getAuctionInterval = null as any;
	let adjustTimeInterval = null as any;
	
    useEffect(() => {
        
		adjustCooldown();
		
		adjustTimeInterval = setInterval(() => {
			adjustCooldown();
		}, 100)
		
        return () => {
			clearInterval(adjustTimeInterval);
			
		};
    }, [expiryDate]);
    
    useEffect(() => {
        clearInterval(getAuctionInterval);
        decideWhatUpdate()
        // if (props.user == null) {
        //     getAuction();
        //     getAuctionInterval = setInterval(() => {
			
        //         getAuction();
                
        //     }, 3500)
        // } else {
        //     getAuctionLogged();
        //     getAuctionInterval = setInterval(() => {
			
        //         getAuctionLogged();
                
        //     }, 3500)
        // }
        
        return () => {
			clearInterval(getAuctionInterval);
		};
        
    }, [props.user])
    
    const decideWhatUpdate = () => {
        if (props.user == null) {
            getAuction();
            getAuctionInterval = setInterval(() => {
			
                getAuction();
                
            }, 5000)
        } else {
            getAuctionLogged();
            getAuctionInterval = setInterval(() => {
			
                getAuctionLogged();
                
            }, 5000)
        }
    }
	
	const adjustCooldown = () => {
        
		if (expiryDate != null) {
			const millisecondsToAdd = auctionDuration * 1000;

			const expiryDates = new Date(expiryDate.valueOf() + millisecondsToAdd);
			// console.log(expiryDate.valueOf())
			const now = new Date().getTime();
            
			const distance = expiryDates.getTime() - now;
            
			const days = Math.floor(distance / (1000 * 60 * 60 * 24));
			const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
			const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
			const seconds = Math.floor((distance % (1000 * 60)) / 1000);
			
            if (days <= 0 && hours <= 0 && minutes <= 0 && seconds <= 0) {
                setTimeCooldown("Auction ended!");
                setOverrideCanBid(false);
            } else {
                setTimeCooldown(days + "d " + hours + "h " + minutes + "m " + seconds + "s ");
                setOverrideCanBid(true);
            }
            
		}
		
	}
	
    const getAuction = () => {
		// console.log("toaqui")
        axios.get(IP_ADDRESS + "/auction").then((res: any) => {
            // const fullDate = res.data.auction.startedAt
            // const dia = fullDate.substr(0, 2)
			const exp = new Date(res.data.auction.startedAt);
            // console.log(dia)
			setExpiryDate(exp);
            setrAuctionDuration(res.data.auction.auctionTime);
			adjustCooldown();
            setCurrentAuction(res.data.auction);
        });
    };
    
    const getAuctionLogged = () => {
		// console.log("toaqui")
        const token = getCookie("token");
        // console.log(token)
        axios.post(IP_ADDRESS + "/auctionLogged", { username: props.user.username }, { headers: { authorization: token } }).then((res: any) => {
            const exp = new Date(res.data.auction.startedAt);
			setExpiryDate(exp);
            setrAuctionDuration(res.data.auction.auctionTime);
			adjustCooldown();
            setCurrentAuction(res.data.auction);
        });
    };
    
    const [bidValue, setBidValue] = useState(0);
    const [bidAnimationDuration, setBidAnimationDuration] = useState(1.5);
    const [canClose, setCanClose] = useState(false);
    
    const bid = (item:any) => {
        
        if (canClose == true) return;
        
        // console.log(item)
        setPlacingBid(true);
        setPlacingBidModal(true);
        
        const token = getCookie("token");
        if (token != "") {
            axios.post(IP_ADDRESS+"/bid", { auction: item, auctionId: currentAuction._id }, { headers: { authorization: token } }).then(res => {
                // console.log(res.data);
                setBidValue(res.data.value);
                decideWhatUpdate()
                setTimeout(() => {
                    setCanClose(true);
                }, bidAnimationDuration * 1000)
            })
        }
    }
    
    const SkeletonAuction = () => {
        const animateSkeleton = true;
        
        return (
            <div className="skeleton-cards-container">
                <div className="auctionItem">
                    <Skeleton radius={10} animate={animateSkeleton} visible={true} width={220} height={340}>
                        
                    </Skeleton>
                    {/* <Card
                        animate={true}
                        hoverZoom={true}
                        id="asd"
                        name={""}
                        price={1}
                        image={""}
                        background=""
                        rarity={0}
                        ratationMultiplier={0.1}
                    /> */}
                    
                    <Skeleton animate={animateSkeleton} visible={true} width={200} height={35}>
                        
                    </Skeleton>
                    
                    <Skeleton radius={10} style={{ marginTop: "-5px" }} animate={animateSkeleton} visible={true} width={220} height={100}>
                        
                    </Skeleton>
                </div>
                <div className="auctionItem">
                    <Skeleton radius={10} animate={animateSkeleton} visible={true} width={220} height={340}>
                        
                    </Skeleton>
                    {/* <Card
                        animate={true}
                        hoverZoom={true}
                        id="asd"
                        name={""}
                        price={1}
                        image={""}
                        background=""
                        rarity={0}
                        ratationMultiplier={0.1}
                    /> */}
                    
                    <Skeleton animate={animateSkeleton} visible={true} width={200} height={35}>
                    </Skeleton>
                    
                    <Skeleton radius={10} style={{ marginTop: "-5px" }} animate={animateSkeleton} visible={true} width={220} height={100}>
                    </Skeleton>
                </div>
                <div className="auctionItem">
                    <Skeleton radius={10} animate={animateSkeleton} visible={true} width={220} height={340}>
                    </Skeleton>
                    {/* <Card
                        animate={true}
                        hoverZoom={true}
                        id="asd"
                        name={""}
                        price={1}
                        image={""}
                        background=""
                        rarity={0}
                        ratationMultiplier={0.1}
                    /> */}
                    
                    <Skeleton animate={animateSkeleton} visible={true} width={200} height={35}>
                    </Skeleton>
                    
                    <Skeleton radius={10} style={{ marginTop: "-5px" }} animate={animateSkeleton} visible={true} width={220} height={100}>
                    </Skeleton>
                </div>
            </div>
        )
    }
    const { t } = useTranslation();

    return (
        <div className="bidSection" style={{ zIndex: 5 }}>
            
            <Modal
                // opened={true}
                opened={placingBidModal}
                lockScroll
                closeOnEscape={false}
                closeOnClickOutside={false}
                withCloseButton={false}
                onClose={() => setPlacingBidModal(false)}
                className="bid-modal"
                // title="Introduce yourself!"
            >
                <div className="bid-result">
                    
                    <Text>Your bid is...</Text>
                    
                    {
                        bidValue != null ?
                        <CountUp className="bid-value" decimals={2} decimal="." duration={bidAnimationDuration} end={bidValue} />
                        :
                        "0"
                    }
                    
                    <Button onClick={() => {setPlacingBidModal(false); setPlacingBid(false); setCanClose(false); setBidValue(0)}} disabled={!canClose}>Close</Button>
                    
                </div>
                
            </Modal>
            
            {/* <Skeleton radius={10} style={{ marginTop: "-5px" }} animate={true} visible={true} width={220} height={100}>
            </Skeleton> */}
            
            {
                timeCooldown != null ?
                    <div className="auction-time">
                        
                        <HoverCard position="bottom" width={320} shadow="md" withArrow openDelay={200} closeDelay={400}>
                            <HoverCard.Target>
                                {/* <Button>Hover to reveal the card</Button> */}
                                <ThemeIcon variant="light" radius="xl" color="dark" size={22}>
                                    <ExclamationMark size={18}/>
                                </ThemeIcon>
                            </HoverCard.Target>
                            <HoverCard.Dropdown>
                                <Group>
                                    {/* <Avatar src="https://avatars.githubusercontent.com/u/79146003?s=200&v=4" radius="xl" /> */}
                                    <Stack spacing={5}>
                                        <Text size="sm" weight={700} sx={{ lineHeight: 1 }}>
                                            How bid works
                                        </Text>
                                    </Stack>
                                </Group>

                                <Text size="xs" mt="md">
                                    You can choose 1 card to bid once a day.
                                </Text>

                                <Text size="xs" mt="md">
                                    Your bid will be free. The bid amount will be decided by the server and can be between 0 and 100.
                                </Text>
                                
                                <Text size="xs" mt="md">
                                    Once you have bid, you will only be able to place another bid when the auction is over and a new random group of cards is chosen.
                                </Text>
                                
                                <Text size="xs" mt="md">
                                    You cannot cancel a bid placed.
                                </Text>
                            </HoverCard.Dropdown>
                        </HoverCard>
                        <Space w={2} />
                        {
                            timeCooldown == "Auction ended!" ? <div>{timeCooldown}</div> : <>{t("hero8")} <div>{timeCooldown}</div></>
                        }
                    </div>
                :
                <Skeleton style={{ marginRight: "10px" }} animate={true} visible={true} width={260} height={40}>
                    
                </Skeleton>
            }

            <div className="auctionItems">
				
				{
					currentAuction.items ?
					currentAuction.items.map((auctionItem:any, index:number) => {
						
						return (
							<div className="auctionItem" key={index}>
								<Card
									animate={true}
									hoverZoom={true}
									id="asd"
									name={auctionItem.item.title}
									price={1}
									image={"https://thecardcaptorbucket.s3.sa-east-1.amazonaws.com/" + auctionItem.item.subject}
									background={"https://thecardcaptorbucket.s3.sa-east-1.amazonaws.com/" + auctionItem.item.background}
									rarity={auctionItem.item.rarity}
									ratationMultiplier={0.1}
                                    unlocked
								/>
								
									{currentAuction.showButton ? (
										<div className="bidAction">
                                            {
                                                currentAuction == null ?
                                                <Loader size="xs"/>
                                                :
                                                <Button
                                                    loading={currentAuction == null || placingBid ? true : false}
                                                    disabled={currentAuction.canBid == true && overrideCanBid == true ? false : true}
                                                    variant={currentAuction.hasMe == false ? "gradient" : "default" }
                                                    gradient={{
                                                        from: "#ed6ea0",
                                                        to: "#ec8c69",
                                                        deg: 35,
                                                    }}
                                                    onClick={() => { bid(index) }}
                                                >
                                                    Place bid
                                                </Button>
                                            }
											
										</div>
									) : null}
									
								<div className="bids">
									<BidsTable bids={auctionItem.bids} user={props.user} theme={props.theme} />
								</div>
							</div>
						)
						
					})
					
					:
					<SkeletonAuction/>
				}
            </div>
        </div>
    );
};

export function HeroContentLeft(props: any) {
    // const { classes } = useStyles();
    
    const isMobile = useMediaQuery("(max-width: 1300px)");
    const { t } = useTranslation();

    return (
        <div
            className="hero"
            style={{ backgroundImage: "url(" + heroCover + ")" }}
        >
            <Overlay
                gradient={ isMobile ? "linear-gradient(180deg, rgba(0, 0, 0, 0.8) 30%, rgba(0, 0, 0, .2) 100%)" : "linear-gradient(90deg, rgba(0, 0, 0, 0.8) 30%, rgba(0, 0, 0, .2) 100%)" }
                opacity={1}
                zIndex={0}
            />

            {/* <svg className="weekly-auction-wave" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320">
				<path fill="#222" fillOpacity="1" d="M0,64L48,85.3C96,107,192,149,288,144C384,139,480,85,576,90.7C672,96,768,160,864,192C960,224,1056,224,1152,192C1248,160,1344,96,1392,64L1440,32L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
			</svg> */}

            <svg
                className="weekly-auction-wave"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 1440 320"
            >
                <path
                    fill={props.theme == "light" ? "#F8F9FA" : "#222"}
                    fillOpacity="1"
                    d="M0,224L34.3,218.7C68.6,213,137,203,206,208C274.3,213,343,235,411,234.7C480,235,549,213,617,181.3C685.7,149,754,107,823,122.7C891.4,139,960,213,1029,224C1097.1,235,1166,181,1234,165.3C1302.9,149,1371,171,1406,181.3L1440,192L1440,320L1405.7,320C1371.4,320,1303,320,1234,320C1165.7,320,1097,320,1029,320C960,320,891,320,823,320C754.3,320,686,320,617,320C548.6,320,480,320,411,320C342.9,320,274,320,206,320C137.1,320,69,320,34,320L0,320Z"
                ></path>
            </svg>

            <Container className="container" size="xl" style={{ zIndex: 2 }}>
                <div className="titleContainer">
                    <div>
                        <Title className="title">
                            {t("hero1")} {''}
                            <Space></Space>
                            <Text
                                component="span"
                                inherit
                                variant="gradient"
                                gradient={{ from: '#ed6ea0', to: '#ec8c69', deg: 35 }}
                            >
                                {t("hero2")}
                            </Text>
                        </Title>
                        
                        <Text className="description" size="xl" mt="xl">
                            {t("hero3")}
                        </Text>
                    </div>
                    
                    {
                        props.user != null ?
                        
                        null
                        :
                        <div className="call-to-action">
                            <Button fullWidth={false} variant="gradient" gradient={{ from: '#ed6ea0', to: '#ec8c69', deg: 35 }} size="xl" radius="xl" onClick={() => { props.setIsRegistering(true); props.setSelectedPage("login") }}>
                                {t("hero4")}
                            </Button>
                            <Text size="xs" mx={20} my={10} color="white">{t("hero5")} <Anchor>{t("hero6")}</Anchor> {t("hero7")}.</Text>
                        </div>
                    }
                    
                </div>

                <BidSection user={props.user} theme={props.theme} />
            </Container>
        </div>
    );
}

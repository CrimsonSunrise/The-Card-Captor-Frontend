// import { createStyles } from "@mantine/core";
import { useMantineColorScheme, Image } from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import { useEffect, useRef } from "react";
import "./style.scss";
import { BsFillStarFill } from "react-icons/bs";

interface CardData {
    id?: string;
    animate?: boolean;
    hoverZoom?: boolean,
    name?: string;
    price?: number;
    image?: string;
    background?: string;
    rarity?: number;
    ratationMultiplier?: number;
    unlocked?: boolean;
    onClick?: () => void
}

// interface CardsProps {
//     cards: CardData[];
// }

// const useStyles = createStyles((theme) => ({
    // card: {
	// 	transition: "0.2s all",
		
    //     "&:hover": {
    //         transform: "scale(1.1)",
    //     },
		
	// 	padding: 10,
	// 	width: 260,
	// 	backgroundColor: "transparent",
	// 	perspective: 1800
    // },

    // cardContainer: {
    //     borderRadius: 8,
    //     boxShadow: "5px 5px 20px -5px rgba(0, 0, 0, 0.6)",
    //     display: "inline-block",
    //     width: 260,
    //     height: 400,
    //     overflow: "hidden",
    //     perspective: 1200,
    //     position: "relative",
    //     transformStyle: "preserve-3d",
    //     transform: "translatez(35px)",
    //     transition: "transform 200ms ease-out",
    //     textAlign: "center",
    //     backgroundColor: "transparent",
	// 	pointerEvents: "none",
    // },
	
	// active: {
	// 	boxShadow: "0 0 5px 0 white"
	// },

    
// }));

const Card: React.FC<CardData> = (props: CardData) => {
    // const { classes } = useStyles();
    const { colorScheme, toggleColorScheme } = useMantineColorScheme();
    const isMobile = useMediaQuery('(max-width: 600px)');
    
    // useEffect(() => {
    //     if (props.rarity != null) {
            
    //         let rarityArray = [] as any;
            
    //         for( let i = 0 ; i < props.rarity; i++) {
    //             rarityArray.push("")
    //         }
            
    //         setRarity(rarityArray)
            
    //     }
    // }, [])
    
    let timeout: any;
	let backToNormal: any;
    
	// function offset(el:any) {
    //     var rect = el.getBoundingClientRect(),
    //     scrollLeft = window.pageXOffset || document.documentElement.scrollLeft,
    //     scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    //     return { top: rect.top + scrollTop, left: rect.left + scrollLeft }
    // }
    
    function getOffset(el:any) {
        const rect = el.getBoundingClientRect();
        return {
            left: rect.left + window.scrollX,
            top: rect.top + window.scrollY
        };
    }
    
	const Move = (o:any, x:number, y:number) => {
		
        // let xVal = ((x - getOffset(o.target).left) - (o.target.getBoundingClientRect().width/2));
		// let yVal = ((y - getOffset(o.target).top) - (o.target.getBoundingClientRect().height/2));
        
        // console.log({xVal, yVal})
        
        // return;
        
        if (props.animate == false) return;
        
        // console.log(document.querySelector("body").clientWidth)
        
        let widthAdjust = 0
        
        if (document.querySelector("body").clientWidth < 700) {
            widthAdjust = 1.8
        } else {
            widthAdjust = 1.1
        }
             
		clearInterval(backToNormal);
		
		if (timeout) {
			window.cancelAnimationFrame(timeout);
		}
		
		timeout = window.requestAnimationFrame(() => {
			// let xVal = x - (o.target.getBoundingClientRect().left) - (o.target.getBoundingClientRect().width/2);
			// let yVal = y - (o.target.getBoundingClientRect().height);
            let xVal = ((x - getOffset(o.target).left) - (o.target.getBoundingClientRect().width/2));
			let yVal = ((y - getOffset(o.target).top) - (o.target.getBoundingClientRect().height/2));
			o.target.querySelector(".cardContainer").classList.add('active');
			o.target.querySelector(".cardContainer").style.transform = `rotateX(${-yVal * props.ratationMultiplier}deg) rotateY(${xVal * props.ratationMultiplier}deg)`;
			o.target.querySelector(".cardContainer>.image").style.transform = `scale(1.05) translateX(${xVal / 20}px) translateY(${yVal/(isMobile ? 80 : 20)}px)`
			o.target.querySelector(".cardContainer>.background").style.transform = `scale(1.25) translateX(${-xVal/10}px) translateY(${-yVal/20}px)`
            o.target.querySelector(".cardContainer>.plate>.plate-text").style.transform = `scale(1) translateX(${xVal / 15}px) translateY(${yVal/20}px)`
		});
	}
	
	const transformBack = (o:any) => {
		if (backToNormal) {
			window.cancelAnimationFrame(backToNormal);
		}
		
		backToNormal = window.requestAnimationFrame(() => {
			o.target.querySelector(".cardContainer").classList.remove('active');
			o.target.querySelector(".cardContainer").style.transform = `rotateX(0deg) rotateY(0deg)`;
			o.target.querySelector(".cardContainer>.image").style.transform = `scale(1.05) translateX(0px) translateY(0px)`
			o.target.querySelector(".cardContainer>.background").style.transform = `scale(1.1) translateX(0px) translateY(0px)`
            o.target.querySelector(".cardContainer>.plate>.plate-text").style.transform = `scale(1) translateX(0px) translateY(0px)`
		})
	}
	
    const hoverZoomClass = props.hoverZoom ? "hover-zoom" : ""
    const unlocked = props.unlocked ? "unlocked" : ""
    
    return (
        
        <div className={colorScheme == "dark" ? `card dark${" "+hoverZoomClass}${" "+unlocked}` : `card light${" "+hoverZoomClass}${" "+unlocked}`} onMouseMove={e => {Move(e, e.pageX, e.pageY)}} onMouseLeave={e => {transformBack(e)}}>
            <div className="cardContainer">
                {/* <img alt="" src={props.frame} className={classes.frame}></img> */}
                {/* <img alt="" src={props.image} className={classes.image}></img> */}
                <div
                    style={{ backgroundImage: "url(" + props.background + ")" }}
                    className="background"
                >
                    { !props.background && !props.image && <Image
                            width="102%"
                            
                            height={340}
                            src={null}
                            alt=""
                            withPlaceholder
                        />
                    }
                    
                </div>
                <div
                    style={{ backgroundImage: "url(" + props.image + ")" }}
                    className="image"
                >
                    
                </div>
                {/* <div
                    style={{ backgroundImage: "url(" + props.frame + ")" }}
                    className="frame"
                ></div> */}
                <div className="plate">
                    <div className="plate-text">
                        <div className="rarity">
                            
                            {
                                props.rarity >= 1 ? <BsFillStarFill size={22} color="#222222" strokeWidth={0.5} fill="#FFD24F"/> : null
                            }
                            {
                                props.rarity >= 2 ? <BsFillStarFill size={22} color="#222222" strokeWidth={0.5} fill="#FFD24F"/> : null
                            }
                            {
                                props.rarity >= 3 ? <BsFillStarFill size={22} color="#222222" strokeWidth={0.5} fill="#FFD24F"/> : null
                            }
                            {
                                props.rarity >= 4 ? <BsFillStarFill size={22} color="#222222" strokeWidth={0.5} fill="#FFD24F"/> : null
                            }
                            {
                                props.rarity >= 5 ? <BsFillStarFill size={22} color="#222222" strokeWidth={0.5} fill="#FFD24F"/> : null
                            }
                            
                        </div>
                        {props.name}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Card;

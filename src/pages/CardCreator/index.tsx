import { Container, Space, Timeline, Text, Slider, Button, Input, useMantineColorScheme, Anchor, Checkbox } from "@mantine/core";
import { useCallback, useEffect, useLayoutEffect, useState } from "react";
import {
	Minus,
	Plus,
	Share,
} from "tabler-icons-react";
import Card from "../../components/Card";
import "./style.scss";
import Cropper from "react-easy-crop";
import Hero_cover from "../../assets/hero_cover.png";
import getCroppedImg from "./cropImage";
import { Dropzone } from "@mantine/dropzone";
import axios from "axios";
import confetti from "canvas-confetti";
import { IP_ADDRESS } from "../../connection";

export default function CardCreator(props:any) {
	const [creationStep, setCreationStep] = useState(0);
	
	const [cardTitle, setCardTitle] = useState("Card title");
	
	const { colorScheme, toggleColorScheme } = useMantineColorScheme();
	
	const [loading, setLoading] = useState(false);
	const [success, setSuccess] = useState(false);
	
	// BACKGROUND
	// let imageBackgroundFile = null as any;
	const [imageBackgroundFile, setImageBackgroundFile] = useState(null);
	const [imageBackground, setImageBackground] = useState(null);
    const [cropBackground, setCropBackground] = useState({ x: 0, y: 0 });
	const [rotationBackground, setRotationBackground] = useState(0);
	const [zoomBackground, setZoomBackground] = useState(1);
	const [croppedImageBackground, setCroppedImageBackground] = useState(null);
	const [restrictBackground, setRestrictBackground] = useState(false);
	
	let newcroppedAreaBackground = null as any;
	
	const fileToDataUriBackground = (file:any) => new Promise((resolve, reject) => {
		const reader = new FileReader();
		
		reader.onload = (event) => {
			resolve(event.target.result)
			setImageBackground(event.target.result);
			document.querySelector("#blob-image-background").setAttribute("value", event.target.result.toString())
		};
		
		// imageBackgroundFile = file;
		setImageBackgroundFile(file);
		console.log(imageBackgroundFile)
		reader.readAsDataURL(file);
	})
	
	const makeDataUri = (file:any) => new Promise((resolve, reject) => {
		const reader = new FileReader();
		
		reader.onload = (event) => {
			resolve(event.target.result)
			return event.target.result
		};
		reader.readAsDataURL(file);
	})
	
	const onCropCompleteBackground = useCallback((croppedArea: any, croppedAreaPixels: any) => {
		newcroppedAreaBackground = croppedAreaPixels;
		setBackgroundImage();
		
	}, [])
	
	const setBackgroundImage = useCallback(async () => {
		const imgUrl = document.querySelector("#blob-image-background").getAttribute("value")
		// const croppedString = JSON.parse(document.querySelector("#cropped-background").getAttribute("value"))
		// console.log("a " + JSON.stringify(newcroppedAreaBackground))
		try {
			const croppedImage = await getCroppedImg(
				imgUrl,
				newcroppedAreaBackground,
				rotationBackground
			)
			setCroppedImageBackground(croppedImage)
		} catch (e) {
			console.error(e)
		}
	}, [newcroppedAreaBackground, rotationBackground, imageBackground])
	
	
	// SUBJECT
	const [imageSubjectFile, setImageSubjectFile] = useState(null);
	const [imageSubject, setImageSubject] = useState(null);
    const [cropSubject, setCropSubject] = useState({ x: 0, y: 0 });
	const [rotationSubject, setRotationSubject] = useState(0);
	const [zoomSubject, setZoomSubject] = useState(1);
	const [croppedImageSubject, setCroppedImageSubject] = useState(null);
	const [restrictSubject, setRestrictSubject] = useState(false);
	
	let newcroppedAreaSubject = null as any;
	
	const fileToDataUriSubject = (file:any) => new Promise((resolve, reject) => {
		const reader = new FileReader();
		
		reader.onload = (event) => {
			resolve(event.target.result)
			setImageSubject(event.target.result);
			document.querySelector("#blob-image-subject").setAttribute("value", event.target.result.toString())
		};
		
		setImageSubjectFile(file);
		reader.readAsDataURL(file);
	})

	const onCropCompleteSubject = useCallback((croppedArea: any, croppedAreaPixels: any) => {
		newcroppedAreaSubject = croppedAreaPixels;
		setSubjectImage();
	}, [])
	
	const setSubjectImage = useCallback(async () => {
		const imgUrl = document.querySelector("#blob-image-subject").getAttribute("value")
		
		try {
			const croppedImage = await getCroppedImg(
				imgUrl,
				newcroppedAreaSubject,
				rotationSubject
			)
			setCroppedImageSubject(croppedImage)
		} catch (e) {
			console.error(e)
		}
	}, [newcroppedAreaSubject, rotationSubject, imageSubject])
	
	async function postImage({background, subject, title}:any) {
		const formData = new FormData();
		formData.append("background", background, "bg.png");
		formData.append("subject", subject, "sj.png");
		formData.append("title", title);
		formData.append("createdBy", props.user.username);
		
		await axios.post(IP_ADDRESS+'/saveCard', formData).then(res => {
			if (res.data == "OK") {
				setLoading(false);
				setSuccess(true);
				return 200;
			} else {
				setLoading(false);
				return "err";
			}
		})
	  }
	
	const uploadCard = async (event:any) => {
		
		setLoading(true)
		const title = cardTitle;
		const background = await fetch(croppedImageBackground).then(r => r.blob());
		const subject = await fetch(croppedImageSubject).then(r => r.blob());
		
		
		if (title != "Card title" && background != null && subject != null) {
			const result = await postImage({background: background, subject: subject, title})
			confetti();
		} else {
			setLoading(false)
			console.log("error")
		}
		
	}
	
	const clearCardInfo = () => {
		setSuccess(false);
		setImageBackground(null);
		setCroppedImageBackground(null);
		setImageSubject(null);
		setCroppedImageSubject(null);
		setCardTitle("Card title");
		setLoading(false);
		setCreationStep(0);
	}
	
	const sendForm = () => {
		console.log(imageBackgroundFile)
		document.querySelector("#background-file").setAttribute("value", croppedImageBackground)
		document.querySelector("#subject-file").setAttribute("value", String(new File(croppedImageSubject, "image.png")))
	}
	
    return (
        <div className={colorScheme == "dark" ? "card-creator dark" : "card-creator light"}>
            <Space h="lg"></Space>
			
			<input type="text" id="blob-image-background" style={{ display: "none" }}/>
			<input type="text" id="blob-image-subject" style={{ display: "none" }}/>
			
            <Container className={success ? "card-creator-container success" : "card-creator-container"} size="xl">
                <div className="card-preview">
                    <Card
                        animate={true}
						hoverZoom={true}
                        id="asd"
                        name={cardTitle}
                        price={1}
                        image={croppedImageSubject}
                        background={croppedImageBackground}
                        rarity={0}
                        ratationMultiplier={0.1}
                    />
                </div>
				
				<div className="card-success">
					
					<h1>Congratulations!</h1>
					<h3>Your card was created!</h3>
					<Button variant="subtle" onClick={() => clearCardInfo()}>
						Create a new card
					</Button>
					
				</div>

                <div className="card-inputs">
                    <Timeline
                        active={creationStep}
                        bulletSize={24}
                        lineWidth={2}
                    >
                        <Timeline.Item bullet={"1"} title="Background" style={{ cursor: loading ? "not-allowed" : "pointer", color: colorScheme == "dark" ? "#F8F9FA" : "#222" }} onClick={() => loading ? null : setCreationStep(0)}>
                            <div
                                className={
                                    creationStep == 0
                                        ? "input-background active"
                                        : "input-background"
                                }
                            >
								
								{
									imageBackground == null ?
									<>
										<Dropzone multiple={false} accept={{'image/*': []}} onDrop={(event) => fileToDataUriBackground(event[0] || null)} onReject={(files) => console.log('rejected files', files)}>
											<Text align="center" color={colorScheme == "dark" ? "#F8F9FA" : "#222"}>Drop your background here</Text>
										</Dropzone>
									
										{/* {imageBackground} */}
									</>
									
									
									
									
									:
									<>
										<div className="change-image-wrapper">
											<Button className="change-background-image" onClick={() => {setImageBackground(null);setCroppedImageBackground(null)}}>Change background image</Button>
										</div>
										<Cropper
											style={{ containerStyle: { width: 500, height: 400 } }}
											image={imageBackground}
											crop={cropBackground}
											rotation={rotationBackground}
											zoom={zoomBackground}
											showGrid={false}
											aspect={13 / 20}
											zoomWithScroll={false}
											restrictPosition={restrictBackground}
											onCropChange={(e) => {setCropBackground(e)}}
											onRotationChange={setRotationBackground}
											onCropComplete={onCropCompleteBackground}
											onZoomChange={setZoomBackground}
										/>
										
										<div className="change-image-settings">
											
											<Checkbox
												onChange={(event) => setRestrictBackground(event.currentTarget.checked)}
												checked={restrictBackground}
												label="Restrict image position"
											/>
											
											<div className="zoom-wrapper">
												
												<Button onClick={() => { zoomBackground > 0.1 ? setZoomBackground(zoomBackground - 0.05) : setZoomBackground(0.1) }}>
													<Minus size={18}/>
												</Button>
												
												<Slider
													className="zoom-slider"
													min={0.1}
													max={10}
													step={0.1}
													value={parseFloat(zoomBackground.toFixed(1))}
													onChange={setZoomBackground}
												/>
												
												<Button onClick={() => { zoomBackground < 10 ? setZoomBackground(zoomBackground + 0.05) : setZoomBackground(10) }}>
													<Plus size={18}/>
												</Button>
												
											</div>
											
											<Text>Zoom</Text>
											
										</div>
										
									</>
								}
								
                            </div>

                            {/* <div className="card-mockup"></div> */}
                        </Timeline.Item>

                        <Timeline.Item
                            bullet={"2"}
                            title="Subject"
							style={{ cursor: loading ? "not-allowed" : "pointer", color: colorScheme == "dark" ? "#F8F9FA" : "#222" }}
							onClick={() => loading ? null : setCreationStep(1)}
                        >
							
							<div
                                className={
                                    creationStep == 1
                                        ? "input-background active"
                                        : "input-background"
                                }
                            >
								
								{
									imageSubject == null ?
									<>
										<Dropzone multiple={false} accept={{'image/*': []}} onDrop={(event) => fileToDataUriSubject(event[0] || null)} onReject={(files) => console.log('rejected files', files)}>
											<Text align="center" color={colorScheme == "dark" ? "#F8F9FA" : "#222"}>Drop your subject here</Text>
										</Dropzone>
									
										{/* {imageSubject} */}
									</>
									:
									<>
										<div className="change-image-wrapper">
											<Button onClick={() => {setImageSubject(null);setCroppedImageSubject(null)}}>Change subject image</Button>
										</div>
											
										<Cropper
											image={imageSubject}
											crop={cropSubject}
											rotation={rotationSubject}
											zoom={zoomSubject}
											showGrid={false}
											aspect={13 / 20}
											zoomWithScroll={false}
											restrictPosition={restrictSubject}
											onCropChange={(e) => {setCropSubject(e)}}
											onRotationChange={setRotationSubject}
											onCropComplete={onCropCompleteSubject}
											onZoomChange={setZoomSubject}
										/>
										
										
										<div className="change-image-settings">
											
											<Checkbox
												onChange={(event) => setRestrictSubject(event.currentTarget.checked)}
												checked={restrictSubject}
												label="Restrict image position"
											/>
											
											<div className="zoom-wrapper">
												
												<Button onClick={() => { zoomSubject > 0.1 ? setZoomSubject(zoomSubject - 0.05) : setZoomSubject(0.1) }}>
													<Minus size={18}/>
												</Button>
												
												<Slider
													className="zoom-slider"
													min={0.1}
													max={10}
													step={0.1}
													value={parseFloat(zoomSubject.toFixed(1))}
													onChange={setZoomSubject}
												/>
												
												<Button onClick={() => { zoomSubject < 10 ? setZoomSubject(zoomSubject + 0.05) : setZoomSubject(10) }}>
													<Plus size={18}/>
												</Button>
												
											</div>
											
											<Text>Zoom</Text>
											
										</div>
									</>
								}
								
                            </div>
							
						</Timeline.Item>

                        <Timeline.Item
                            title="Title"
                            bullet={"3"}
							style={{ cursor: loading ? "not-allowed" : "pointer", color: colorScheme == "dark" ? "#F8F9FA" : "#222" }}
                            lineVariant="dashed"
							onClick={() => loading ? null : setCreationStep(2)}
                        >
							<div
                                className={
                                    creationStep == 2
                                        ? "input-background active"
                                        : "input-background"
                                } style={{ alignItems: "flex-start" }}
                            >
								<Input
									style={{ width: "500px" }}
									value={cardTitle}
									onChange={(e:any) => setCardTitle(e.target.value)}
									placeholder="Card title"
								/>
							</div>
						</Timeline.Item>

                        <Timeline.Item
                            title="Share"
                            bullet={"4"}
							style={{ cursor: loading ? "not-allowed" : "pointer", color: colorScheme == "dark" ? "#F8F9FA" : "#222" }}
							onClick={() => loading ? null : setCreationStep(3)}
                        >
							<div
                                className={
                                    creationStep == 3
                                        ? "input-background active"
                                        : "input-background"
                                } style={{ alignItems: "flex-start" }}
                            >
								<Button loading={loading} onClick={uploadCard} leftIcon={<Share />}>
									Create my card!
								</Button>
							</div>
							
						</Timeline.Item>
                    </Timeline>
                </div>
            </Container>
        </div>
    );
}

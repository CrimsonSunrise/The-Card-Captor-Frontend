import { Button, Container, Space, Text, Title } from "@mantine/core";
import axios from "axios";
import React, { Suspense, useEffect, useState } from "react";
import Card from "../../components/Card";
import { MarketHighlights } from "../../components/MarketHighlights";
import { IP_ADDRESS } from "../../connection";
import "./style.scss";

export default function Market(props:any) {
    const [cards, setCards] = useState([]);
    const [img, setImg] = useState("");
    const [loading, setLoading] = useState(false);

    const [backgrounds, setBackgrounds] = useState([]);
    const [subjects, setSubjects] = useState([]);

    const getBlobFromUrl = (url: string, type: string) => {
        const result = fetch(
            "https://thecardcaptorbucket.s3.sa-east-1.amazonaws.com/" +
                url
        ).then((res) => {
            res.text().then((text) => text);
        });
        console.log(result);
    };

    const prepareCards = (cards: any) => {
        cards.map((card: any) => {});

        setLoading(false);
    };
	
	useEffect(() => {
		carregar()
	}, [])

    const carregar = async () => {
        // setLoading(true);
        // axios
        //     .get(IP_ADDRESS+"/getFiles")
        //     .then((res) => {
        //         if (res.data != "err") {
        //             setCards(res.data.cards);
        //             setLoading(false);
        //         } else {
        //             console.log(res.data);
        //         }
        //     })
        //     .catch((err) => {
        //         console.log(err);
        //     });
    };

    return (
        <div className="market">
            <Container className="market-container" size="xl" px="xl">
                
                {/* <h1>TUDO QUE TEM AQUI NÃO VAI FICAR AQUI!!!</h1> */}
                <Title order={1}>Coming soon</Title>
                
                {/* <Button loading={loading} onClick={carregar}>
                    Carregar
                </Button> */}
                <Space h="xl"></Space>
                
                <MarketHighlights/>

                {/* <div className="cards">
                    {cards.length > 0
                        ? cards.map((card, index) => {

                              return (
                                  <Card
                                      key={index}
                                      animate={true}
                                      hoverZoom={true}
                                      id="asd"
                                      name={card.title}
                                      price={1}
                                      image={
                                          "https://thecardcaptorbucket.s3.sa-east-1.amazonaws.com/" +
                                          card.subject
                                      }
                                      background={
                                          "https://thecardcaptorbucket.s3.sa-east-1.amazonaws.com/" +
                                          card.background
                                      }
                                      rarity={card.rarity}
                                      ratationMultiplier={0.1}
                                  />
                              );
                          })
                        : null}
                </div> */}
                
                <Container size="xl" mt={25} className="market-listings">
                    
                    
                    
                </Container>

            </Container>
        </div>
    );
}

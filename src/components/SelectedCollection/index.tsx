import { ActionIcon, Modal, TextInput, Title, useMantineTheme } from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import React, { useState } from "react";
import { ArrowBackUp } from "tabler-icons-react";
import Card from "../Card";
import "./style.scss";

export default function SelectedCollection(props:any) {
    const [collectionTitle, setCollectionTitle] = useState<any>(props.collection);
    const theme = useMantineTheme();
    const [opened, setOpened] = useState(false);
    const isMobile = useMediaQuery('(max-width: 600px)');
    
    const closeCollection = () => {
        props.closeCollection()
    }
    
    const keypressed = (key:any) => {
        console.log(key)
    }
    
    return <div className="selected-collection" onKeyDown={(e) => keypressed(e)}>
        
        <div className="selected-collection-header">
            
            <ActionIcon className="search-button" size={48} radius="sm" color={theme.primaryColor} variant="default" onClick={() => closeCollection()}>
                <ArrowBackUp size={24} strokeWidth={1.5} />
            </ActionIcon>
            
            <Title order={2}>{collectionTitle}</Title>
            
        </div>
        
        <div className="selected-collection-cards">
            
            <div className="collection-card" onClick={() => setOpened(true)}></div>
            <div className="collection-card"></div>
            <div className="collection-card"></div>
            <div className="collection-card"></div>
            <div className="collection-card"></div>
            <div className="collection-card"></div>
            <div className="collection-card"></div>
            
        </div>
        
        <Modal
            // fullScreen
            // centered
            className="modal-card"
            overlayBlur={3}
            withCloseButton={false}
            opened={opened}
            onClose={() => setOpened(false)}
        >
            
            <Card
                animate={true}
                hoverZoom={true}
                id="asd"
                name="Marco, A Fênix"
                price={1}
                image={"image1"}
                background={"bg1"}
                rarity={1}
                ratationMultiplier={0.15}
            />
            
            
        </Modal>
        
    </div>
}
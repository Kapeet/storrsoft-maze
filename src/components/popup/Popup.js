import React from 'react';
import styles from './Popup.module.css';
import {useGameContext} from "../../GameContext";

const Notification = () => {
    const {isPlaying, maze, isPortraitMode} = useGameContext();
    return (
        (!isPlaying && !isPortraitMode) ?
        <div className={styles.root}>
            {maze ? 'GAME OVER' : null}<br/>
            PUSH START BUTTON
        </div> : (isPortraitMode) ? <div className={styles.root}>PLEASE TILT YOUR SCREEN!</div> : ''
    );
}

export default Notification;

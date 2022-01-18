import React from 'react';
import styles from './Popup.module.css';
import {useGameContext} from "../../GameContext";

const Notification = () => {
    const {isPlaying, maze} = useGameContext();
    return (
        (!isPlaying) &&
        <div className={styles.root}>
            {maze ? 'GAME OVER' : null}<br/>
            PUSH START BUTTON
        </div>
    );
}

export default Notification;

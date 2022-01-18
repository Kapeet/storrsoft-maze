import {useEffect, useRef, useState} from "react";
import styles from './Board.module.css';
import {useGameContext} from "../../GameContext";
import MazeDrawer from "./MazeDrawer";
import {useWindowSize} from "@react-hook/window-size";
import useImage from "use-image";
import logoSrc from './logo.svg';
import lolipopImage from './lollipop.svg';
import iceCreamImage from './ice_cream.svg';
import useInterval from "@use-it/interval";

const Board = () => {
    const {maze, currentCell, start, goal, prizes} = useGameContext();
    const [showGoal, setShowGoal] = useState(true);
    const containerRef = useRef(null);
    const canvasRef = useRef(null);
    const [width, height] = useWindowSize();
    const [shouldDraw, setShouldDraw] = useState(false);
    const [logo] = useImage(logoSrc)    
    const [prizeImage] = useImage(lolipopImage);
    const [prizeImage2] = useImage(iceCreamImage);    
    useEffect(() => {
        const handleResize = () => {
            const rect = containerRef.current.getBoundingClientRect();
            const scale = window.devicePixelRatio;
            canvasRef.current.width = Math.floor(rect.width * scale);
            canvasRef.current.height = Math.floor(rect.height * scale);
            setShouldDraw(true);
        }

        setTimeout(handleResize, 100);
    }, [width, height]);

    useInterval(() => {
        setShowGoal(!showGoal);
    }, 750)

    useEffect(() => {
        if (shouldDraw) {
            setShouldDraw(false);
        }
        if (!maze) {
            return;
        }
        const mazeDrawer = new MazeDrawer(canvasRef.current, maze, logo, currentCell, showGoal && goal, new Object({coords: prizes, img: [prizeImage, prizeImage2]}));
        mazeDrawer.draw();

    }, [shouldDraw, maze, logo, currentCell, start, goal, showGoal, prizes])

    return (
        <div ref={containerRef} className={styles.root}>
            <canvas className={styles.canvas} ref={canvasRef}/>
        </div>
    )
};

export default Board;

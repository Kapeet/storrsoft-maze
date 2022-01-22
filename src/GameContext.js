import {createContext, useContext, useEffect, useReducer} from "react";
import useInterval from "@use-it/interval";
import useSound from "use-sound";
import Maze from "./maze/Maze";
import levelMusic from './audio/maze.mp3';
import levelEndMusic from './audio/level_end.mp3';
import { useWindowHeight, useWindowWidth } from "@react-hook/window-size";
const ROWS = parseInt(process.env.REACT_APP_ROWS);
const COLUMNS = parseInt(process.env.REACT_APP_COLUMNS);
const ROUND_TIME = parseInt(process.env.REACT_APP_ROUND_TIME);
const KEY_DIRECTIONS = {
    'ArrowLeft': 'west',
    'ArrowRight': 'east',
    'ArrowUp': 'north',
    'ArrowDown': 'south'
}
const INITIAL_STATE = {
    time: ROUND_TIME,
    maze: undefined,
    currentCell: undefined,
    start: undefined,
    goal: undefined,
    round: 1,
    score: 0,
    highScore: 0,
    betweenRounds: false,
    prizes: [],
    isPortraitMode: false,
}

const GameContext = createContext({
    ...INITIAL_STATE,
    isPlaying: false
});

export const useGameContext = () => useContext(GameContext);

const reducer = (state, action) => {
    switch (action.type) {
        case 'portraitMode': {
            return {
                ...state,
                isPortraitMode: action.payload.isPortraitMode
            }
        }
        case 'startGame': {
            return {
                ...state,
                isPlaying: true,
                time: ROUND_TIME,
                maze: action.payload.maze,
                currentCell: action.payload.maze.start,
                score: 0,
                round: 1,
                start: action.payload.maze.start,
                goal: action.payload.maze.goal,
                prizes: action.payload.maze.prizes
            }
        }
        case 'decrementTime': {
            return {
                ...state,
                time: state.time - 1
            }
        }
        case 'move': {
            const newScore = state.score + action.payload.points;
            return {
                ...state,
                currentCell: action.payload.nextCell,
                score: newScore,
                highScore: Math.max(state.highScore, newScore)
            }
        }
        case 'finishLevel': {
            return {
                ...state,
                betweenRounds: true
            }
        }
        case 'roundUp': {
            return {
                ...state,
                time: ROUND_TIME,
                maze: action.payload.maze,
                currentCell: action.payload.maze.start,
                start: action.payload.maze.start,
                goal: action.payload.maze.goal,
                round: state.round + 1,
                betweenRounds: false,
                prizes: action.payload.maze.prizes
            }
        }
        case 'claimPrize': {
            return {
                ...state,
                time: action.payload.time,
                prizes: action.payload.prizes,
                score: action.payload.score
            }
        }
        default:
            throw new Error('Unknown action');
    }
}

export const GameProvider = ({children}) => {
    const [state, dispatch] = useReducer(reducer, INITIAL_STATE);
    const [playLevelMusic, {stop: stopLevelMusic}] = useSound(levelMusic, {
        loop: true
    });
    const [playLevelEndMusic] = useSound(levelEndMusic)

    const isPlaying = !!state.maze && state.time > 0;

    const checkIfPrizeClaimed = (nextCell) => {
        let newPrizes = [];
        for(let i = 0; i < state.prizes.length ; i++)
        {
            if (nextCell.toString() === state.prizes[i].coordinates.toString())
            {
                for (let j = 0; j < state.prizes.length; j++)
                {
                    if (i === j) {
                        newPrizes.push({
                            coordinates: state.prizes[j].coordinates,
                            isClaimed: true
                        });
                    }
                    else
                    {
                        newPrizes.push({
                            coordinates: state.prizes[j].coordinates,
                            isClaimed: state.prizes[j].isClaimed ? true : false
                        });
                    }
                }
                dispatch({type: 'claimPrize', payload: {prizes: newPrizes, score: state.score + parseInt(process.env.REACT_APP_PRIZE_POINTS), time: state.time + 10}});
            }
        }
    }

    const checkIfPlayerMoved = (key) => {
        const nextCell = state.maze.tryMove(state.currentCell, KEY_DIRECTIONS[key]);
        if (!nextCell) {
            return;
        }
        dispatch({type: 'move', payload: {nextCell, points: state.round * 10}});
        if (nextCell.toString() === state.goal.toString()) {
            dispatch({type: 'finishLevel'});
            stopLevelMusic();
            playLevelEndMusic();
            setTimeout(() => {
                dispatch({type: 'roundUp', payload: {maze: new Maze(ROWS, COLUMNS)}});
                playLevelMusic();
            }, 2300)
        }
        else
        {
            checkIfPrizeClaimed(nextCell);
        }
    }
    const width = useWindowWidth();
    const height = useWindowHeight();
    
    useEffect(() => {
        if (height > width)
        {
            dispatch({type: 'portraitMode', payload: {isPortraitMode: true}});
        }
        else
        {
            dispatch({type: 'portraitMode', payload: {isPortraitMode: false}});
        }
    },[width,height])
    useInterval(() => {
        if (!state.isPortraitMode)
        {
            dispatch({type: 'decrementTime'});
        }
    }, isPlaying && !state.betweenRounds ? 1000 : null);

    const onKeyDown = ({key}) => {
        if (state.isPortraitMode)
        {
            return;
        }
        if (key === 'Enter' && !isPlaying) {
            playLevelMusic();
            dispatch({type: 'startGame', payload: {maze: new Maze(ROWS, COLUMNS)}})
        } else if (Object.keys(KEY_DIRECTIONS).indexOf(key) > -1 && isPlaying && !state.betweenRounds) {
            checkIfPlayerMoved(key);
            
        }
    }
    useEffect(() => {        

        window.addEventListener('keydown', onKeyDown);

        return () => window.removeEventListener('keydown', onKeyDown)
    }, [isPlaying, state, playLevelMusic, playLevelEndMusic, stopLevelMusic]);

    useEffect(() => {
        if (state.time === 0) {
            stopLevelMusic();
        }
    }, [state, stopLevelMusic])

    let arrowButtons = Object.keys(KEY_DIRECTIONS).map((key, index) => {
        let direction = Object.values(KEY_DIRECTIONS)[index];
    return <button key={key} className={key} onClick={() => checkIfPlayerMoved(key)}>Move {direction}</button>
    });
        
    return (
        <GameContext.Provider value={{
            ...state,
            isPlaying,
        }}>
            {children}
            {state.isPlaying && !state.isPortraitMode ? <div className="ArrowButton">{arrowButtons}</div> : (!state.isPortraitMode) ? <button className="StartButton" onClick={() => {
            playLevelMusic();
            dispatch({type: 'startGame', payload: {maze: new Maze(ROWS, COLUMNS)}})}}>Start!</button> : ''}
        </GameContext.Provider>
    )
}

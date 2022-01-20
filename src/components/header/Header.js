import styles from './Header.module.css';
import {useGameContext} from "../../GameContext";

const Header = () => {
    const {time, round, score, highScore, isPortraitMode} = useGameContext();
    const formatTime = () => {
        return (time !== undefined)
            ? time.toString().padStart(2, ' ')
            : null
    };

    return (
            (!isPortraitMode) &&
        <header>
            <div className={styles.row}>
                <p>Welcome to the StorrSoft maze!</p>
                <p>Hi-Score <span className={styles.score}>{highScore.toString().padStart(5, ' ')}</span></p>
            </div>
            <div>
                1UP <span className={styles.score}>{score.toString().padStart(5, ' ')}</span>&nbsp;&nbsp;
                ROUND <span className={styles.score}>{round.toString().padStart(3, ' ')}</span>&nbsp;&nbsp;
                TIME <span className={styles.score}>{formatTime()}</span>
            </div>
        </header>
    )
}

export default Header;

import styles from './App.module.css';
import Header from "./components/header/Header";
import Popup from "./components/popup/Popup";
import Board from "./components/board/Board";
import { useEffect, useState } from 'react';

const App = () => {

    return (
        <div className={styles.root}>
            <Header/>
            <Board />
            <Popup />
        </div>
    );
}

export default App;

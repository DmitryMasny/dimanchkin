import React, {useEffect, useState} from 'react';
import {DiManchkin, MainMenu} from './components';
import {UNIT} from "./constants";
import s from './App.scss';
import {GameConfigProps, Modes} from "./types";
import './static/fonts/AmaticSC-Regular.ttf';
import './static/fonts/AmaticSC-Bold.ttf';

const App = () => {
    const [config, setConfig] = useState<GameConfigProps | null>(null);

    useEffect(()=>{
        document.documentElement.style.setProperty('--px', `${UNIT}px`);
    })

    const startGame = (heroIdList: string[]) => {
        setConfig({
            mode: Modes.Simple,
            rows: 9,
            cols: 9,
            maxRoomSize: 2,
            chances: {
                door: 60,
                space: 60,
                bottomWall: 20,
                monster: 100,
            },
            heroes: heroIdList
        });
    }

    if (!config) {
        return <MainMenu onSelect={startGame}/>
    }

    return (
        <div className={s.app}>
            <DiManchkin config={config}/>
        </div>
    );
}

export default App;

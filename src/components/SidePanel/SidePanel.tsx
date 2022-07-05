import React, {FC} from 'react';
import clsx from "clsx";

import s from "./SidePanel.module.scss";
import {Hero} from "../index";
import {HeroesType, HeroType} from "../../types";
import {MAX_PLAYER_LVL} from "../../constants";

interface SidePanelType {
    turnOrder: string[];
    heroes: HeroesType;
    setHero: (heroId: string, data: Partial<HeroType>) => void;
    activeHeroId: string;
    currentTurn: number;
}

const SidePanel: FC<SidePanelType> = ({turnOrder, heroes, activeHeroId, currentTurn, setHero}: SidePanelType) => {
    const handleUpLvl = (heroId: string) => {
        const newLvl = heroes[heroId].lvl + 1;

        setHero(heroId, {
            lvl: newLvl,
        });
    }
    const handleDownLvl = (heroId: string) => {
        setHero(heroId, {
            lvl: Math.max(heroes[heroId].lvl - 1, 1),
        });
    }

    return (<div className={s.sidePanel}>
        {turnOrder.map((heroId) => <div className={clsx(s.sidePanelItem, heroId === activeHeroId && s.active)}>
            <Hero id={heroId} key={heroId}/>
            <div className={s.lvlText}>{heroes[heroId].lvl}</div>
            <div className={s.buttons}>
                <div className={s.btn} onClick={() => handleUpLvl(heroId)}>+</div>
                <div className={s.btn} onClick={() => handleDownLvl(heroId)}>-</div>
            </div>
        </div>)}
        <div className={s.currentTurn}>ход {currentTurn}</div>
    </div>)
};

export default SidePanel;
export {SidePanel};

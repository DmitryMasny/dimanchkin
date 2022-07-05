import React, {FC, useMemo} from 'react';

import {DiManchkinProps} from 'types';

import s from './DiManchkin.module.scss';
import {UNIT} from "../../constants";
import {FightModal, TurnModal, Hero, SidePanel, ChestModal, FinishScreen} from "components";
import useGameplay from "./useGameplay";
import Map from "../Map";

const DiManchkin: FC<DiManchkinProps> = ({config, onReset}) => {

    const {
        map,
        heroes,
        activeHeroId,
        makeTurn,
        fightModal,
        chestModal,
        turnModal,
        turnOrder,
        currentTurn,
        heroCanOpenDoor,
        setHero,
        finishGame
    } = useGameplay({config});

    const mapSizeStyles = useMemo(() => ({width: UNIT * config.cols, height: UNIT * config.rows}), [config]);

    if (!heroes || !map) {
        return null;
    }
    if (finishGame) {
        return <FinishScreen winner={finishGame} onReset={onReset}/>;
    }

    return (
        <div className={s.root}>
            <div className={s.main}>
                <div className={s.map} style={mapSizeStyles}>
                    <Map map={map} onSelect={makeTurn} disableDoors={!heroCanOpenDoor} activeHeroId={activeHeroId}/>
                </div>
                <div className={s.heroes} style={mapSizeStyles}>
                    <div className={s.heroesWrap}>
                        {heroes && Object.keys(heroes).map((id) => (
                            <Hero id={id} isActive={activeHeroId === id} style={{
                                position: 'absolute',
                                transform: `translate(${heroes[id].x * UNIT}px,${heroes[id].y * UNIT}px)`
                            }} key={id}/>
                        ))}
                    </div>
                </div>
                <FightModal open={Boolean(fightModal)} {...(fightModal || {})} />
                {turnModal?.activeHeroId && <TurnModal open={Boolean(turnModal)} {...(turnModal || {})} />}
                <ChestModal open={Boolean(chestModal)} {...(chestModal || {
                    okCallback: () => {
                    }
                })} />
            </div>
            <SidePanel heroes={heroes} turnOrder={turnOrder} activeHeroId={activeHeroId} currentTurn={currentTurn}
                       setHero={setHero}/>
        </div>
    );
};

export default DiManchkin;
export {DiManchkin};

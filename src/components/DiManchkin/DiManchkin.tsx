import React, {FC, useMemo} from 'react';

import {DiManchkinProps} from 'types';

import s from './DiManchkin.module.scss';
import {UNIT} from "../../constants";
import {FightModal, TurnModal, Hero} from "components";
import useGameplay from "./useGameplay";
import Map from "../Map";

const DiManchkin: FC<DiManchkinProps> = ({config}) => {

    const {map, heroes, activeHeroId, makeTurn, fightModal, turnModal, heroCanOpenDoor} = useGameplay({config});

    const mapSizeStyles = useMemo(() => ({width: UNIT * config.cols, height: UNIT * config.rows}), [config]);

    // useEffect(()=>{
    //     console.info('fightModal', fightModal)
    // }, [fightModal]);

    if (!heroes || !map) {
        return null;
    }

    return (
        <div className={s.root}>
            <div className={s.grid} style={mapSizeStyles}>
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
        </div>
    );
};

export default DiManchkin;
export {DiManchkin};

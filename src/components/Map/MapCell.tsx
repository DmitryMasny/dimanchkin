import React, {FC, memo} from 'react';

import clsx from 'clsx';
import {MapCellContentProps, MapCellProps, MapCellTypes, WallProps} from 'types';

import s from './MapCell.module.scss';
import {WALL} from "../../constants";
import monster from "static/map/map-monster.png";
import chest from "static/map/map-chest.png";

const Wall = memo(({type, side}: WallProps) => {
    // console.info('wall')
    if (type === WALL.SPACE || type === WALL.HIDDEN_DOOR) {
        return null;
    }
    if (type === WALL.CLOSED_DOOR || type === WALL.OPENED_DOOR) {
        return <>
            <div className={clsx(s.wall, s[side])}/>
            <div className={clsx(s.door, s[side])}/>
        </>
    }
    if (type === WALL.WALL) {
        return <div className={clsx(s.wall, s[side])}/>
    }
    return null;
});

const CellContent: FC<MapCellContentProps> = ({type}: MapCellContentProps) => {
    switch (type) {
        case MapCellTypes.Monster:
            return <img src={monster} alt="" className={s.cellContentImg}/>
        // case MapCellTypes.ExMonster:
        //     return <img src={monster} alt="" className={clsx(s.cellContentImg, type === MapCellTypes.ExMonster && s.disabled)}/>

        case MapCellTypes.Treasure:
            return <img src={chest} alt="" className={s.cellContentImg}/>
        // case MapCellTypes.ExTreasure:
        //     return <img src={chest} alt="" className={clsx(s.cellContentImg, type === MapCellTypes.ExTreasure && s.disabled)}/>
        default:
            return null;
    }
};

const Cell: FC<MapCellProps> = ({type, onClick, x, y, isOpen, walls, disabled}: MapCellProps) => {
    return (
        <div className={clsx(s.cell, isOpen && s.open, disabled && s.disabled)} onClick={() => onClick?.({x, y})}>
            {<div className={clsx(s.turnDot, !isOpen && !disabled && s.show)}/>}
            {isOpen && <CellContent type={type}/>}
            {walls && Object.keys(walls).map((key) => <Wall type={walls[key]} side={key} key={key}/>)}
        </div>
    );
};

export default Cell;
export {Cell};

import React, {FC} from 'react';
import {MapProps} from 'types';
import Cell from "./MapCell";
import {WALL} from "../../constants";

const Map: FC<MapProps> = ({map, onSelect, disableDoors, activeHeroId}) => {
    return <>
        {map.map((row) => row.map(({walls, id, isOpen, hero, ...rest}) => {
            const disabled = (hero && hero !== activeHeroId) || //can't move to cell with hero
                (disableDoors && !isOpen) || //can open door only once at turn
                (!isOpen && !Object.keys(walls).some((key) => walls[key] === WALL.CLOSED_DOOR)); // can open room (cell) only if we have viewable door

            return <Cell
                {...rest}
                id={id}
                isOpen={isOpen}
                hero={hero}
                walls={walls}
                onClick={onSelect}
                disabled={disabled}
                key={id}/>;
        }))}
    </>;
};

export default Map;
export {Map};

export interface Dictionary<T = any> {
    [index: string]: T;
}

export enum Modes {
    Simple = 'Simple',
    Advanced = 'Advanced'
}

export enum MapCellTypes {
    Monster = 'Monster',
    Empty = 'Empty',
    Treasure = 'Treasure',
    ExMonster = 'ExMonster',
    ExTreasure = 'ExTreasure',
}

export type HeroesListType =  string[];

export type GameConfigProps = {
    mode: keyof typeof Modes;
    rows: number;
    cols: number;
    maxRoomSize: number;
    chances: {
        door: number;
        space: number;
        bottomWall: number;
        monster: number;
    },
    heroes: HeroesListType;
}

export interface DiManchkinProps {
    config: GameConfigProps;
}
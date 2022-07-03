import {Dictionary, GameConfigProps, MapCellTypes} from "types";
import {ReactNode} from "react";

export type Coordinates = {
    x: number;
    y: number;
};
export type HeroType = {
    id: string;
    lvl: number;
    x: Coordinates['x'];
    y: Coordinates['y'];
    prev?: Coordinates;
};

export interface MapProps {
    map: MapType;
    onSelect?: (coords: Coordinates) => void;
    disableDoors?: boolean;
    activeHeroId?: HeroType['id'];
}

export type WallsType = Record<string, string>;

export type MapCellType = {
    id: string;
    type: MapCellTypes;
    x: number;
    y: number;
    isOpen: boolean;
    walls: WallsType;
    monster?: MonsterType;
    hero: string;
};

export interface MapCellProps extends MapCellType {
    onClick?: (coords: Coordinates) => void;
    disabled: boolean;
}

export interface MapCellContentProps {
    type: MapCellTypes;
}

export interface WallProps {
    type: string;
    side: string;
}

export type HeroesType = Dictionary<HeroType>;
export type MapType = Array<Array<MapCellType>>;

type GoToTheNextCellProps = {
    side: string;
    map: MapType;
    x: number;
    y: number;
}
export type GoToTheNextCellType = (props: GoToTheNextCellProps) => MapCellType | undefined

export type GenerateCellWallsProps = {
    x: number;
    y: number;
    arrayRow: Array<MapCellType>;
    array: MapType;
    config: GameConfigProps;
};
export type MonsterType = {
    lvl: number;
};

export interface ModalWrapperProps {
    open: boolean;
    className?: string;
    children: ReactNode;
    size?: 'sm' | 'md' | 'lg';
}
export interface FightModalProps {
    looseCallback?: () => void;
    leakCallback?: () => void;
    winCallback?: () => void;
    monster?: MonsterType | null
}
export interface ChestModalProps {
    okCallback: () => void;
}
export interface TurnModalProps {
    activeHeroId: HeroType['id'];
    okCallback: () => void;
}
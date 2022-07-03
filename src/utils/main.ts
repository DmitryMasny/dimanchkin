import {
    GameConfigProps,
    GenerateCellWallsProps,
    GoToTheNextCellType,
    MapCellType, MapCellTypes,
    MapType,
    Modes,
    WallsType
} from "types";

import {WALL, MAX_MONSTER_LVL} from "../constants";

export const getRandomInt = (max: number) => {
    return Math.floor(Math.random() * max + 1);
};

const getLvlFromRow = (y: number) => {
    return Math.min(Math.floor(5 - (y + 1) / 2), MAX_MONSTER_LVL);
};


const randomType = (config: GameConfigProps, y: number) => {
    if (Modes.Simple) {
        // if (getRandomInt(100) <= config.chances.monster) {}
        if (y === config.rows - 1) {
            return {
                type: MapCellTypes.Empty,
            }
        }
        return {
            type: MapCellTypes.Monster,
            monster: {
                lvl: getLvlFromRow(y)
            }
        }
    }
    return {
        type: MapCellTypes.Empty,
    }

};

export const genWall = (side: string = '', config: GameConfigProps): string => {
    if (side === 'bottom' && getRandomInt(100) <= config.chances.bottomWall) {
        return WALL.WALL;
    }
    if (getRandomInt(100) <= config.chances.door) {
        return WALL.HIDDEN_DOOR;
    }
    if (getRandomInt(100) <= config.chances.space) {
        return WALL.SPACE;
    }
    return WALL.WALL;
};

// if some wall have door or space return true
export const checkRoomHaveDoors = (walls: WallsType): boolean => Object.keys(walls).some((key) => walls[key] === WALL.HIDDEN_DOOR || walls[key] === WALL.CLOSED_DOOR || walls[key] === WALL.SPACE)

// const generateCellWalls = ({x, y}: GenerateCellWallsProps): WallsType => {
export const generateCellWalls = ({x, y, arrayRow, array, config}: GenerateCellWallsProps): WallsType => {
    if (y === config.rows - 1) {
        return {
            top: WALL.CLOSED_DOOR,
            right: x === config.cols - 1 ? WALL.WALL : WALL.SPACE,
            bottom: WALL.WALL,
            left: x === 0 ? WALL.WALL : WALL.SPACE,
        }
    }
    const result: Record<string, string> = {
        top: y === 0 ? WALL.WALL : array[y - 1][x].walls.bottom || WALL.SPACE,
        right: x === config.cols - 1 ? WALL.WALL : genWall(undefined, config),
        bottom: y === config.rows - 2 ? WALL.CLOSED_DOOR : genWall('bottom', config),
        left: x === 0 ? WALL.WALL : arrayRow[x - 1].walls.right || WALL.SPACE,
    }

    // if room have not doors
    if (!checkRoomHaveDoors(result)) {
        result.bottom = WALL.HIDDEN_DOOR;
    }

    return result;
};

export const generateMap = (config: GameConfigProps) => {
    const array: MapType = [];
    for (let y = 0; y < config.rows; y++) {
        const arrayRow: Array<MapCellType> = [];
        for (let x = 0; x < config.cols; x++) {
            arrayRow.push({
                id: `${x}-${y}`,
                x,
                y,
                hero: '',
                isOpen: y === config.rows - 1,
                walls: generateCellWalls({x, y, arrayRow, array, config}),
                ...randomType(config, y),
            });
        }
        array.push(arrayRow);
    }
    return array;
};

export const goToTheNextCell: GoToTheNextCellType = ({side, map, x, y}) => {
    switch (side) {
        case 'top':
            return map[y - 1]?.[x];
        case 'right':
            return map[y][x + 1];
        case 'bottom':
            return map[y + 1]?.[x];
        case 'left':
            return map[y][x - 1];
        default:
            return;
    }
}
export const mirrorWall = (side: string): string => {
    switch (side) {
        case 'top':
            return 'bottom';
        case 'right':
            return 'left';

        case 'bottom':
            return 'top';

        case 'left':
            return 'right';

        default:
            return '';
    }
}

// when open door we need change cell-wall doors and set isOpen to 'true'
export const openDoor = (mapProp: MapType, xProp: number, yProp: number, config: GameConfigProps): MapType => {
    let roomSize = 0;

    const openDoorRecursion = (map: MapType, x: number, y: number): MapType => {
        const openedCell = map[y][x];

        if (openedCell) {
            const goToNextCell = (side: string) => goToTheNextCell({side, map, x, y});

            openedCell.isOpen = true;
            roomSize++;

            ['top', 'right', 'bottom', 'left'].map((key) => {
                const wall = openedCell.walls[key];

                if (wall === WALL.CLOSED_DOOR) {
                    openedCell.walls[key] = WALL.OPENED_DOOR;
                }
                if (wall === WALL.WALL) {
                    return key;

                }
                let nextCell: MapCellType | undefined = goToNextCell(key);
                if (nextCell?.isOpen === false) {
                    if (wall === WALL.HIDDEN_DOOR) {
                        openedCell.walls[key] = WALL.CLOSED_DOOR;
                        nextCell.walls[mirrorWall(key)] = WALL.CLOSED_DOOR;
                    }
                    if (wall === WALL.SPACE) {
                        if (roomSize < config.maxRoomSize) {
                            map = openDoorRecursion(map, nextCell.x, nextCell.y);
                        } else {
                            const reWall = checkRoomHaveDoors(openedCell.walls) ? WALL.WALL : WALL.CLOSED_DOOR

                            openedCell.walls[key] = reWall;
                            nextCell.walls[mirrorWall(key)] = reWall;
                        }
                    }
                }

                return key;
            });
        }

        return map;
    }
    return openDoorRecursion(mapProp, xProp, yProp);
};
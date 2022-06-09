import { FC, useCallback, useEffect, useState } from 'react';

import clsx from 'clsx';
import { Dictionary } from 'types';

import s from './DiManchkin.module.scss';

// const MAP = [
//     [1, 2, 3],
//     [1, 2, 5],
//     [1, 2, 5],
// ]

type Coordinates = {
    x: number;
    y: number;
};
type HeroType = Coordinates & {};

type MapCellType = {
    id: string;
    type: string;
    x: number;
    y: number;
    isOpen: boolean;
    doors?: Record<string, boolean> | null;
};
interface MapCellProps extends MapCellType {
    onClick?: (coords: Coordinates) => void;
}

type HeroesType = Dictionary<HeroType>;
type MapType = Array<Array<MapCellType>>;

const UNIT = 64;
const ROWS = 6;
const COLS = 6;
const DOORS_CHANCE = 88; // %

const getRandomInt = (max: number) => {
    return Math.floor(Math.random() * max);
};

const generateMap = () => {
    const array = [];
    for (let y = 0; y < ROWS; y++) {
        const arrayRow = [];
        for (let x = 0; x < COLS; x++) {
            arrayRow.push({
                id: `${x}-${y}`,
                x,
                y,
                type: String(getRandomInt(100)),
                isOpen: y === ROWS - 1,
                doors:
                    y === ROWS - 2
                        ? {
                              bottom: true,
                          }
                        : undefined,
            });
        }
        array.push(arrayRow);
    }
    return array;
};
const makeCell = (cell: MapCellType, x: number, y: number) => {
    if (!cell.isOpen) {
        if (x === cell.x && y === cell.y) {
            return {
                ...cell,
                // doors: null,
                isOpen: true,
            };
        }
        const doors = {
            left: false,
            right: false,
            bottom: false,
        };

        if (x === cell.x - 1 && y === cell.y) {
            doors.left = getRandomInt(100) <= DOORS_CHANCE;
        }
        if (x === cell.x + 1 && y === cell.y) {
            doors.right = getRandomInt(100) <= DOORS_CHANCE;
        }
        if (x === cell.x && y === cell.y + 1) {
            doors.bottom = getRandomInt(100) <= DOORS_CHANCE - 10;
        }
        if (doors.left || doors.right || doors.bottom) {
            return {
                ...cell,
                doors,
            };
        }
    }

    return cell;
};
const mapSizeStyles = { width: UNIT * COLS, height: UNIT * ROWS };

const Cell: FC<MapCellProps> = ({ type, onClick, x, y, isOpen, doors }: MapCellProps) => {
    return (
        <div className={clsx(s.cell, isOpen && s.open, !doors && s.disabled)} onClick={() => onClick?.({ x, y })}>
            {/*{isOpen && type}*/}
            {doors && Object.keys(doors).map((key) => (doors[key]) && <div className={clsx(s.door, s[key])} key={key} />)}
        </div>
    );
};
const DiManchkin: FC = () => {
    const [map, setMap] = useState<MapType>(generateMap());
    const [heroes, setHeroes] = useState<HeroesType | null>(null);
    const [activeHero, setActiveHero] = useState<string>('');
    console.info('activeHero', activeHero);
    useEffect(() => {
        setActiveHero('hero-id');
        setHeroes({
            'hero-id': {
                x: 0,
                y: ROWS - 1,
            },
        });
    }, []);

    const handleClick = useCallback(
        ({ x, y }: Coordinates) => {
            // if (!checkCanOpen({ map, x, y })) {
            //     console.info('x, y', x, y);
            //     return;
            // }
            setHeroes((h) => {
                const newActiveHero = {
                    ...h,
                    x,
                    y,
                };
                return {
                    ...(h || {}),
                    [activeHero]: newActiveHero,
                };
            });
            if (!map[y][x].isOpen) {
                setMap(map.map((row) => row.map((cell) => makeCell(cell, x, y))));
            }
        },
        [activeHero, map],
    );

    if (!heroes) {
        return null;
    }

    const ah = heroes[activeHero];

    return (
        <div className={s.root}>
            <div className={s.grid} style={mapSizeStyles}>
                {map.map((row) => row.map((data) => <Cell {...data} onClick={handleClick} key={data.id} />))}
            </div>
            <div className={s.heroes} style={mapSizeStyles}>
                <div className={s.heroesWrap}>
                    <div className={s.hero} style={{ transform: `translate(${ah.x * UNIT}px,${ah.y * UNIT}px)` }}>
                        <div className={s.body} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DiManchkin;
export { DiManchkin };

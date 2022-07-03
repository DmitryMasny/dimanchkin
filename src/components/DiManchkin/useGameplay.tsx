import React, {useCallback, useEffect, useMemo, useState} from "react";
import {
    ChestModalProps,
    Coordinates, FightModalProps,
    GameConfigProps,
    HeroesListType,
    HeroesType,
    HeroType, MapCellType,
    MapCellTypes,
    MapType,
    MonsterType, TurnModalProps
} from "types";
import {generateMap, openDoor} from "utils";
import {MAX_PLAYER_LVL, START_PLAYER_LVL} from "../../constants";

interface Props {
    config: GameConfigProps;
}

const useGameplay = ({config}: Props) => {
    const [turnOrder, setTurnOrder] = useState<string[]>([]);
    const [currentTurn, setCurrentTurn] = useState(0);
    const [map, setMap] = useState<MapType | null>(null);
    const [heroes, setHeroes] = useState<HeroesType | null>(null);
    const [activeHeroId, setActiveHeroId] = useState<string>('');

    const [fightModal, setFightModal] = useState<FightModalProps | null>(null);
    const [chestModal, setChestModal] = useState<ChestModalProps | null>(null);
    const [turnModal, setTurnModal] = useState<TurnModalProps | null>(null);
    const [heroTurnEnd, setHeroTurnEnd] = useState<boolean>(false);

    const [heroCanMove, setHeroCanMove] = useState<boolean>(true);
    const [heroCanOpenDoor, setHeroCanOpenDoor] = useState<boolean>(true);
console.info('heroCanMove', heroCanMove)
    console.info('heroCanOpenDoor', heroCanOpenDoor)
    useEffect(() => {
        if (!map) {
            setMap(generateMap(config));

            const randomHeroesOrder: HeroesListType = config.heroes.sort(() => Math.round((.5 - Math.random()) * 10));

            setActiveHeroId(randomHeroesOrder[0]);
            setTurnOrder(randomHeroesOrder);
            setCurrentTurn(1);
            setHeroes(config.heroes.reduce((a, id) => ({
                ...a, [id]: {
                    id,
                    lvl: START_PLAYER_LVL,
                    x: Math.floor((config.cols - config.heroes.length) / 2) + Object.keys(a).length,
                    y: config.rows - 1,
                }
            }), {}))
        }
    }, [config, map]);

    useEffect(() => {
        if (!heroCanMove && !heroCanOpenDoor && heroTurnEnd) {
            setCurrentTurn((current) => current + 1);
        } else if (heroCanMove && heroCanOpenDoor && !heroTurnEnd) {
            setTurnModal({
                activeHeroId,
                okCallback: () => {
                    setTurnModal(null);
                }
            })
        }
    }, [heroCanMove, heroCanOpenDoor, activeHeroId, heroTurnEnd]);

    useEffect(() => {
        const index = (currentTurn - 1) % turnOrder.length;
        if (index || index === 0) {
            setActiveHeroId(turnOrder[index]);
            setHeroCanMove(true);
            setHeroCanOpenDoor(true);
            setHeroTurnEnd(false);
        }
    }, [currentTurn, turnOrder]);

    const heroLeakBack = useCallback(
        (heroId: string, isLoose: boolean = false) => {
            setHeroes((h) => {
                if (!h) return null;
                const prevX = h[heroId].prev!.x;
                const prevY = h[heroId].prev!.y;

                setMap((map) => {
                    if (map) {
                        map[prevY][prevX].hero = heroId;
                        map[h[heroId].y][h[heroId].x].hero = '';
                    }
                    return map;
                });

                const newActiveHero: HeroType = {
                    ...h[heroId],
                    x: prevX,
                    y: prevY,
                    ...(isLoose ? {lvl: Math.min(h[heroId].lvl - 1, 1)} : {}),
                };
                return {
                    ...h,
                    [heroId]: newActiveHero,
                };
            });
        },
        [],
    );

    const fight = useCallback(
        ({monster, x, y}: MapCellType) => {
            if (monster) {
                setFightModal({
                    monster,
                    looseCallback: () => {
                        setFightModal(null);
                        heroLeakBack(activeHeroId, true);
                        setHeroCanMove(false);
                        setHeroCanOpenDoor(false);
                        setHeroTurnEnd(true);
                    },
                    leakCallback: () => {
                        setFightModal(null);
                        heroLeakBack(activeHeroId);
                        setHeroTurnEnd(true);
                    },
                    winCallback: () => {
                        setFightModal(null);
                        setHeroes((h) => {
                            if (!h) return null;

                            const newLvl = h[activeHeroId].lvl + 1;

                            if (newLvl >= MAX_PLAYER_LVL) {
                                alert(`Герой ${activeHeroId} победил`)
                            }

                            return {
                                ...h,
                                [activeHeroId]: {
                                    ...h[activeHeroId],
                                    lvl: newLvl
                                }
                            };
                        });
                        setMap((m) => {
                            m![y][x].type = MapCellTypes.ExMonster;
                            m![y][x].monster = undefined;
                            return m;
                        });
                        setHeroTurnEnd(true);
                    },
                });
            }
        },
        [activeHeroId, heroLeakBack],
    );
    const openChest = useCallback(
        ({x, y}: MapCellType) => {
            setChestModal({
                okCallback: () => {
                    setChestModal(null);
                    setMap((m) => {
                        m![y][x].type = MapCellTypes.ExTreasure;
                        return m;
                    });
                },
            });
        },
        [],
    );

    const makeTurn = useCallback(
        ({x, y}: Coordinates) => {
            if (!map) return;

            console.info('cell', map[y][x])
            setHeroes((h) => {
                if (!h) {
                    return null;
                }
                const prevX = h[activeHeroId].x;
                const prevY = h[activeHeroId].y;
                const newActiveHero: HeroType = {
                    ...h[activeHeroId],
                    x, y,
                    prev: {
                        x: prevX,
                        y: prevY,
                    }
                };
                map[prevY][prevX].hero = '';
                map[y][x].hero = activeHeroId;
                return {
                    ...h,
                    [activeHeroId]: newActiveHero,
                };
            });
            if (!map[y][x].isOpen && heroCanOpenDoor) {
                setHeroCanOpenDoor(false);
                setMap(openDoor(map, x, y, config));
            } else {
                setHeroCanMove(false);
            }
            switch (map[y][x].type) {
                case MapCellTypes.Monster:
                    setHeroTurnEnd(false);
                    setTimeout(() => {
                        fight(map[y][x])
                    }, 300);
                    break;
                case MapCellTypes.Treasure:
                    setHeroTurnEnd(false);
                    setTimeout(() => {
                        openChest(map[y][x])
                    }, 300);
                    break;
            }
        },
        [activeHeroId, config, fight, heroCanOpenDoor, map, openChest],
    );


    return ({
        turnOrder,
        currentTurn,
        makeTurn,
        map,
        heroes,
        activeHeroId,
        activeHero: heroes?.[activeHeroId],
        fightModal,
        chestModal,
        turnModal,
        heroCanOpenDoor
    })
};

export default useGameplay;
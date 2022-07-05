import React, {FC, useCallback, useState} from 'react';


import {ReactComponent as Logo} from "static/Dimanchkin.svg";
import s from "./MainMenu.module.scss";
import {Button, Hero} from "components";
import {MAX_PLAYERS} from "../../../constants";

interface MainMenuProps {
    onSelect: (idList: string[]) => void;
}

const tempAvatars = ['👹', '👻', '👽', '🤖', '😼', '🕺', '🦊', '🦦', '🐲'];


const MainMenu: FC<MainMenuProps> = ({onSelect}) => {
    const [selectedHeroes, setSelectedHeroes] = useState<Record<string, boolean>>({});
    const [warning, setWarning] = useState<string>('');

    const handleStart = useCallback(() => {
        const selected = Object.keys(selectedHeroes);
        if (selected.length <= MAX_PLAYERS) {
            if (selected.length > 1) {
                onSelect(selected);
            } else {
                setWarning(`Выберите хотя бы 2 героя`)
            }
        } else {
            setWarning(`Выберите не более ${MAX_PLAYERS} героев`)
        }
    }, [onSelect, selectedHeroes])

    return <div className={s.root}>
        <div className={s.logo}>
            <Logo/>
        </div>
        <div className={s.heroesGrid}>
            {tempAvatars.map((id)=><Hero id={id} key={id} withBg isActive={selectedHeroes[id]} onClick={() => setSelectedHeroes({
                ...selectedHeroes,
                [id]: !selectedHeroes[id],
            })}/>)}
        </div>
        <div className={s.warning}>
            {warning}
        </div>
        <div className={s.buttons}>
            <Button onClick={handleStart}>
                Старт
            </Button>
        </div>
    </div>
};

export default MainMenu;
export {MainMenu};

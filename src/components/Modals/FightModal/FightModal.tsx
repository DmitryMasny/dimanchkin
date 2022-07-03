import React, {FC, useMemo} from 'react';

import s from "./FightModal.module.scss";
import mob1 from "static/monsters/m1.png";
import mob2 from "static/monsters/m2.png";
import mob3 from "static/monsters/m3.png";
import mob4 from "static/monsters/m4.png";
import {FightModalProps, MonsterType} from "types";
import {Button} from "components";
import ModalWrapper from "../ModalWrapper";

const MobImg = ({lvl}: { lvl: MonsterType['lvl'] }) => {
    switch (lvl) {
        case 1:
            return <img src={mob1} alt="" className={s.img}/>
        case 2:
            return <img src={mob2} alt="" className={s.img}/>
        case 3:
            return <img src={mob3} alt="" className={s.img}/>
        case 4:
            return <img src={mob4} alt="" className={s.img}/>
        default:
            return null;
    }
}

const FightModal: FC<FightModalProps & { open: boolean }> = ({
                                                                 open,
                                                                 monster,
                                                                 looseCallback,
                                                                 leakCallback,
                                                                 winCallback
                                                             }) => {
    const buttons = useMemo(() => {
        return (<div className={s.buttons}>
            <Button color="success" className={s.button} onClick={() => winCallback?.()}>Победа</Button>
            <Button className={s.button} onClick={() => leakCallback?.()}>Смывка</Button>
            <Button color="danger" onClick={() => looseCallback?.()}>Поражение</Button>
        </div>)
    }, [looseCallback, leakCallback, winCallback]);

    const content = useMemo(() => {
        if (!open || !monster) {
            return null;
        }
        return (<div className={s.content}>
            <MobImg lvl={monster.lvl}/>
            <div className={s.text}>Уровень {monster.lvl}</div>
            {buttons}
        </div>)
    }, [open, monster, buttons]);

    return (
        <ModalWrapper open={open} className={monster ? s[`lvl${monster.lvl || ''}`] : ''}>
            {content}
        </ModalWrapper>
    );
};

export default FightModal;
export {FightModal};

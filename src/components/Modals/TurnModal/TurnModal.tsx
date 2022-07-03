import React, {FC} from 'react';

import s from "./TurnModal.module.scss";
import {TurnModalProps} from "types";
import {Button, Hero} from "components";
import ModalWrapper from "../ModalWrapper";


const TurnModal: FC<TurnModalProps & { open: boolean }> = ({open, okCallback, activeHeroId}) => {
    return (
        <ModalWrapper open={open}>
            <div className={s.content}>
                <Hero id={activeHeroId} />
                <div className={s.text}>Ваш ход</div>
                <div className={s.buttons}>
                    <Button onClick={() => okCallback?.()}>Ok</Button>
                </div>
            </div>
        </ModalWrapper>
    )
};

export default TurnModal;
export {TurnModal};

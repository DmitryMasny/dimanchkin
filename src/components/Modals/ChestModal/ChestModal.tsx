import React, {FC} from 'react';

import s from "./ChestModal.module.scss";
import {ChestModalProps} from "types";
import {Button} from "components";
import ModalWrapper from "../ModalWrapper";


const ChestModal: FC<ChestModalProps & { open: boolean }> = ({open, okCallback}) => {
    return (
        <ModalWrapper open={open}>
            <div className={s.content}>
                <div className={s.img}>💎</div>
                <div className={s.text}>Возьмите карту двери</div>
                <div className={s.buttons}>
                    <Button onClick={() => okCallback?.()}>Ok</Button>
                </div>
            </div>
        </ModalWrapper>
    )
};

export default ChestModal;
export {ChestModal};

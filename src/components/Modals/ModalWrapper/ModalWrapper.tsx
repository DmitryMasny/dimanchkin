import React, {FC} from 'react';
import clsx from "clsx";

import s from "./ModalWrapper.module.scss";
import {ModalWrapperProps} from "types";


const ModalWrapper: FC<ModalWrapperProps> = ({open, className, children, size = 'sm'}) => {
    return (<div className={clsx(s.modal, open && s.open, s[size])}>
        <div className={clsx(s.modalWrap, className)}>
            {children}
        </div>
    </div>)
};

export default ModalWrapper;
export {ModalWrapper};

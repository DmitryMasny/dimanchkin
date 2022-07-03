import React, {FC, ReactNode} from 'react';
import clsx from "clsx";

import s from "./Button.module.scss";

interface ButtonType {
    onClick: () => void;
    children?: ReactNode;
    className?: string;
    color?: 'warning' | 'success' | 'danger'
}

const Button: FC<ButtonType> = ({children, onClick, className, color}) => {
    return (<div className={clsx(s.button, color && s[color], className)} onClick={onClick}>
        {children}
    </div>)
};

export default Button;
export {Button};

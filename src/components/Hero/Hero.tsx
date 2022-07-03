import React, {FC, CSSProperties} from 'react';


import s from "./Hero.module.scss";
import clsx from "clsx";

interface HeroProps {
    id: string
    withBg?: boolean;
    isActive?: boolean;
    onClick?: () => void;
    style?: CSSProperties;
}

const Hero: FC<HeroProps> = ({id, withBg, onClick, isActive, style}) => {
    return (
        <div className={clsx(s.heroWrap, isActive && s.active, withBg && s.withBg, onClick && s.pointer)} onClick={onClick} style={style}>
            <div className={s.circle}/>
            <div className={s.hero} onClick={onClick}>
                {id}
            </div>
        </div>
    )
};

export default Hero;
export {Hero};

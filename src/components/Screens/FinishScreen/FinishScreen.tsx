import React, {FC} from 'react';

import s from './FinishScreen.module.scss';
import { Hero,  Button} from "components";

interface FinishScreenProps {
    winner: string;
    onReset: () => void;
}

const Rays: FC = () => {
    return (<div className={s.rays}>
        <div className={s.ray}/>
        <div className={s.ray}/>
        <div className={s.ray}/>
        <div className={s.ray}/>
    </div>);
};

const FinishScreen: FC<FinishScreenProps> = ({winner, onReset}) => {
    return (<div className={s.root}>
        <div className={s.heroWrap}>
            <Hero id={winner}/>
            <Rays/>
        </div>
        <div className={s.infoWrap}>
            <div className={s.header}>
                Победитель!
            </div>
            <Button onClick={() => onReset()}>Меню</Button>
        </div>
    </div>);
};

export default FinishScreen;
export {FinishScreen};

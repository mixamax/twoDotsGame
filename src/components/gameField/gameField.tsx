import styles from "./gameField.module.css";
import { GameComponent } from "../gameComponent";
import { scoreDot, Dot } from "../../game/elements";
import { useRef, useEffect, useState } from "react";

type Props = {
    setListOfDots: React.Dispatch<React.SetStateAction<scoreDot[]>>;
    setMoveNumber: React.Dispatch<React.SetStateAction<number>>;
    setSelectedDots: (selectedDots: Dot[]) => void;
    setSelectedDotsNumber: React.Dispatch<React.SetStateAction<number>>;
    numberOfRestart: number;
};
export const GameField = (props: Props) => {
    const ref = useRef<HTMLDivElement>(null);
    const [width, setWidth] = useState(1000);
    useEffect(() => {
        if (!ref.current) return;
        const width = ref.current.clientWidth;
        setWidth(width);
    }, []);
    return (
        <div ref={ref} className={styles["gameField-container"]}>
            <GameComponent
                width={width}
                setListOfDots={props.setListOfDots}
                setMoveNumber={props.setMoveNumber}
                setSelectedDots={props.setSelectedDots}
                setSelectedDotsNumber={props.setSelectedDotsNumber}
                numberOfRestart={props.numberOfRestart}
            />
        </div>
    );
};

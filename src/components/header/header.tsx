import { ScoreField } from "../scoreField";
import { MenuField } from "../menuField";
import styles from "./header.module.css";
import { DotsHeaderField } from "../dotsHeaderField";
import { scoreDot } from "../../game/elements";

type Props = {
    listOfDots: scoreDot[];
    moveNumber: number;
};
export const Header = (props: Props) => {
    return (
        <header className={styles["header-container"]}>
            <ScoreField moveNumber={props.moveNumber} />
            <DotsHeaderField listOfDots={props.listOfDots} />
            <MenuField />
        </header>
    );
};

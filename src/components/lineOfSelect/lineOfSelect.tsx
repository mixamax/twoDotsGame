import styles from "./lineOfSelect.module.css";
import { Dot } from "../../game/elements";

type Props = {
    selectedDots: Dot[];
    selectedDotsNumber: number;
};
export const LineOfSelect = (props: Props) => {
    console.log("RENDER LINE");
    // console.log(props.selectedDots);
    const color = props.selectedDots[0]?.color || "black";
    const width = props.selectedDotsNumber * 70;
    console.log(color, width);
    return (
        <div className={styles["line-of-select-container"]}>
            <div
                className={styles["line-of-select"]}
                style={{ width: `${width}px`, backgroundColor: color }}
            ></div>
        </div>
    );
};

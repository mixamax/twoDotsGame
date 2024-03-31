import styles from "./pageLayout.module.css";
import { ReactNode, FC } from "react";

type Props = {
    children: ReactNode;
};
export const PageLayout: FC<Props> = ({ children }) => {
    return <div className={styles["pageLayout-container"]}>{children}</div>;
};

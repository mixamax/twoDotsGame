import { useEffect, useRef } from "react";
import {
    onMouseDownHandler,
    onMoveMouseHandler,
    onMouseUpHandler,
    init,
    loop,
    scoreDot,
    Dot,
} from "../../game/elements";

type Props = {
    setListOfDots: React.Dispatch<React.SetStateAction<scoreDot[]>>;
    setMoveNumber: React.Dispatch<React.SetStateAction<number>>;
    setSelectedDots: (selectedDots: Dot[]) => void;
    setSelectedDotsNumber: React.Dispatch<React.SetStateAction<number>>;
    width: number;
    numberOfRestart: number;
};

export const GameComponent = (props: Props) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const selectDotsRef = useRef(0);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;
        const mouseDownHandler = (e: MouseEvent) => {
            e.preventDefault();
            onMouseDownHandler(ctx);
        };
        const mouseUpHandler = () => {
            const score = onMouseUpHandler();
            props.setListOfDots(score.scoreMatrix);
            props.setMoveNumber(score.scoreOfMove);
            props.setSelectedDotsNumber(0);
        };
        const mouseMoveHandler = (e: MouseEvent) => {
            const selectedDots = onMoveMouseHandler(canvas, e, ctx);
            if (selectDotsRef.current !== selectedDots.length) {
                selectDotsRef.current = selectedDots.length;
                props.setSelectedDots(selectedDots);
            }
        };
        window.addEventListener("pointerdown", mouseDownHandler);
        window.addEventListener("pointerup", mouseUpHandler);
        canvas.addEventListener("pointermove", mouseMoveHandler);

        const scoreMatrix = init(canvas, props.width, 20);
        props.setMoveNumber(20);
        props.setListOfDots(scoreMatrix);
        loop(ctx);
        return () => {
            window.removeEventListener("pointerdown", () => mouseDownHandler);
            window.removeEventListener("pointerup", () => mouseUpHandler);
            canvas.removeEventListener("pointermove", () => mouseMoveHandler);
        };
    }, [props.width, props.numberOfRestart]);

    return <canvas ref={canvasRef} height={300} />;
};

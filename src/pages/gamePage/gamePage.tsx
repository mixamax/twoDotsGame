import { Footer } from "../../components/footer";
import { GameField } from "../../components/gameField";
import { Header } from "../../components/header";
import { PageLayout } from "../../components/pageLayout";
import { useEffect, useState } from "react";
import { scoreDot, Dot } from "../../game/elements";
import { LineOfSelect } from "../../components/lineOfSelect/lineOfSelect";

const points = (array: scoreDot[]) => {
    const tail = array.reduce((acc, el) => acc + el.startScore, 0);
    return array.length * 15 - tail;
};
const isWin = (array: scoreDot[]) => {
    if (array.every((el) => el.startScore === 0)) {
        return true;
    }
    return false;
};

export const GamePage = () => {
    const [listOfDots, setListOfDots] = useState<scoreDot[]>([]);
    const [moveNumber, setMoveNumber] = useState(20);
    const [selectedDots, setSelectedDots] = useState<Dot[]>([]);
    const [seletedDotsNumber, setSelectedDotsNumber] = useState(0);
    const [numberOfRestart, setNumberOfRestart] = useState(0);
    const pointScore = points(listOfDots);

    const func = (selectedD: Dot[]) => {
        if (selectedD.length !== selectedDots.length) {
            setSelectedDotsNumber(selectedD.length);
            setSelectedDots(selectedD);
        }
    };

    useEffect(() => {
        if (!isWin(listOfDots) && moveNumber === 0) {
            alert("Try again!");
            setNumberOfRestart((state) => state + 1);
        }
        if (isWin(listOfDots) && listOfDots.length > 0) {
            alert("You win! Your score: " + pointScore);
            setNumberOfRestart((state) => state + 1);
        }
    }, [moveNumber]);

    return (
        <PageLayout>
            <Header listOfDots={listOfDots} moveNumber={moveNumber} />
            <LineOfSelect
                selectedDots={selectedDots}
                selectedDotsNumber={seletedDotsNumber}
            />
            <GameField
                setListOfDots={setListOfDots}
                setMoveNumber={setMoveNumber}
                setSelectedDots={func}
                setSelectedDotsNumber={setSelectedDotsNumber}
                numberOfRestart={numberOfRestart}
            />
            <Footer points={pointScore} />
        </PageLayout>
    );
};

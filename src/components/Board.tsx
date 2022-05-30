import React from "react";
import { BoardInformation } from "../types/BoardInformation";
import { Square } from "./Square";

interface BoardProps {
    boardInformation: BoardInformation;
    onClick: (index: number) => void;
}

const UnmemoizedBoard = (props: BoardProps): JSX.Element | null => {
    const renderSquare = (index: number): JSX.Element => {
        return <Square
            value={props.boardInformation.squares[index]}
            isHighlighted={props.boardInformation.valueAtIndexIsInWinningLine(index)}
            onClick={() => { props.onClick(index); }}
        />;
    };

    return (
        <div>
            <div className="board-row">
                {renderSquare(0)}
                {renderSquare(1)}
                {renderSquare(2)}
            </div>
            <div className="board-row">
                {renderSquare(3)}
                {renderSquare(4)}
                {renderSquare(5)}
            </div>
            <div className="board-row">
                {renderSquare(6)}
                {renderSquare(7)}
                {renderSquare(8)}
            </div>
        </div>
    );
};

export const Board = React.memo(UnmemoizedBoard);
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
            key={index}
            value={props.boardInformation.squares[index]}
            isHighlighted={props.boardInformation.valueAtIndexIsInWinningLine(index)}
            onClick={() => { props.onClick(index); }}
        />;
    };

    const renderRow = (startIndex: number, endIndex: number): JSX.Element => {
        const squares: JSX.Element[] = [];
        for (let index = startIndex; index < endIndex; index++) {
            const square = renderSquare(index);
            squares.push(square);
        }

        return <div className="board-row" key={startIndex}>
            {squares}
        </div>;
    };

    const renderBoard = (boardHeight: number, boardWidth: number): JSX.Element => {
        const rows: JSX.Element[] = [];
        for (let rowIndex = 0; rowIndex < boardHeight; rowIndex++) {
            const startIndex = rowIndex * boardWidth;
            const endIndex = startIndex + boardWidth;
            const row = renderRow(startIndex, endIndex);
            rows.push(row);
        }

        return <div>
            {rows}
        </div>;
    };

    return renderBoard(3, 3)
};

export const Board = React.memo(UnmemoizedBoard);
import { useState } from "react";

import { calculateWinnerInformation } from "../shared/calculateWinnerInformation.function";
import { convertSquareValueToLabel } from "../shared/convertSquareValueToLabel.function";
import { SquareValue } from "../types/SquareValue.enum";
import { Board } from "./Board";

interface BoardState {
    squares: SquareValue[];
};

export const Game = (): JSX.Element | null => {
    const [currentMoveNumber, setCurrentMoveNumber] = useState<number>(0);

    const [xIsNext, setXIsNext] = useState<boolean>(true);

    const [boardHistory, setBoardHistory] = useState<BoardState[]>([
        {
            squares: [
                SquareValue.None, SquareValue.None, SquareValue.None,
                SquareValue.None, SquareValue.None, SquareValue.None,
                SquareValue.None, SquareValue.None, SquareValue.None,
            ]
        }
    ]);

    const handleClick = (index: number) => {
        const newBoardHistory = boardHistory.slice(0, currentMoveNumber + 1);
        const newBoard = newBoardHistory[newBoardHistory.length - 1];

        if (
            calculateWinnerInformation(newBoard.squares).winner !== SquareValue.None
            || newBoard.squares[index] !== SquareValue.None
        ) {
            return;
        }

        const updatedSquares = [...newBoard.squares];
        updatedSquares[index] = xIsNext ? SquareValue.X : SquareValue.O;

        setBoardHistory([...newBoardHistory, { squares: updatedSquares }]);
        setCurrentMoveNumber(newBoardHistory.length);
        setXIsNext(!xIsNext);
    };

    const jumpTo = (moveNumber: number) => {
        setCurrentMoveNumber(moveNumber);
        setXIsNext(moveNumber % 2 === 0);
    };

    const currentBoard = boardHistory[currentMoveNumber];
    const winnerInformation = calculateWinnerInformation(currentBoard.squares);

    const moves = boardHistory.map((board, moveNumber) => {
        const label = moveNumber === 0
            ? `Go to game start`
            : `Go to move #${moveNumber}`;

        return (
            <li key={moveNumber}>
                <button onClick={() => { jumpTo(moveNumber); }}>
                    {label}
                </button>
            </li>
        );
    });

    let highlightedSquareIndexes: number[] = [];
    let status: string;

    if (winnerInformation.winner !== SquareValue.None) {
        highlightedSquareIndexes = [
            ...highlightedSquareIndexes,
            ...winnerInformation.winningLineIndexes
        ];
        const winnerLabel = convertSquareValueToLabel(winnerInformation.winner);
        status = `Winner: ${winnerLabel}`;
    }
    else {
        status = currentBoard.squares.includes(SquareValue.None)
            ? `Next player: ${xIsNext ? 'X' : 'O'}`
            : `Draw`;
    }

    return (
        <div className="game">
            <div className="game-board">
                <Board
                    squares={currentBoard.squares}
                    highlightedSquareIndexes={highlightedSquareIndexes}
                    onClick={(index) => { handleClick(index); }}
                />
            </div>
            <div className="game-info">
                <div>{status}</div>
                <ol>{moves}</ol>
            </div>
        </div>
    );

};
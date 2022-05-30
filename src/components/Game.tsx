import { useState } from "react";

import { convertSquareValueToLabel } from "../shared/convertSquareValueToLabel.function";
import { BoardInformation } from "../types/BoardInformation";
import { SquareValue } from "../types/SquareValue.enum";
import { Board } from "./Board";

export const Game = (): JSX.Element | null => {
    const [currentMoveNumber, setCurrentMoveNumber] = useState<number>(0);

    const [xIsNext, setXIsNext] = useState<boolean>(true);

    const [boardHistory, setBoardHistory] = useState<BoardInformation[]>([
        new BoardInformation()
    ]);

    const handleClick = (index: number) => {
        const newBoardHistory = boardHistory.slice(0, currentMoveNumber + 1);
        const newBoard = newBoardHistory[newBoardHistory.length - 1];

        if (!newBoard.isClickableAtIndex(index)) {
            return;
        }

        const updatedSquares = [...newBoard.squares];
        updatedSquares[index] = xIsNext ? SquareValue.X : SquareValue.O;

        setBoardHistory([...newBoardHistory, new BoardInformation(updatedSquares)]);
        setCurrentMoveNumber(newBoardHistory.length);
        setXIsNext(!xIsNext);
    };

    const jumpTo = (moveNumber: number) => {
        setCurrentMoveNumber(moveNumber);
        setXIsNext(moveNumber % 2 === 0);
    };

    const currentBoard = boardHistory[currentMoveNumber];

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

    if (currentBoard.hasWinner) {
        highlightedSquareIndexes = currentBoard.winningLineIndexes;
        const winnerLabel = convertSquareValueToLabel(currentBoard.winner);
        status = `Winner: ${winnerLabel}`;
    }
    else {
        status = currentBoard.isFullyMarked
            ? `Draw`
            : `Next player: ${xIsNext ? 'X' : 'O'}`;
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
import { useState } from "react";

import { convertSquareValueToLabel } from "../shared/convertSquareValueToLabel.function";
import { BoardInformation } from "../types/BoardInformation";
import { SquareValue } from "../types/SquareValue.enum";
import { Board } from "./Board";

export const Game = (): JSX.Element | null => {
    const [currentMove, setCurrentMove] = useState<number>(0);

    const [boardHistory, setBoardHistory] = useState<BoardInformation[]>([
        new BoardInformation()
    ]);

    const handleClick = (index: number) => {
        const newBoardHistory = boardHistory.slice(0, currentMove + 1);
        const newBoard = newBoardHistory[newBoardHistory.length - 1];

        if (!newBoard.isClickableAtIndex(index)) {
            return;
        }

        const updatedSquares = [...newBoard.squares];
        updatedSquares[index] = nextSquareValue();

        setBoardHistory([...newBoardHistory, new BoardInformation(updatedSquares)]);
        setCurrentMove(newBoardHistory.length);
    };

    const jumpTo = (moveNumber: number) => {
        setCurrentMove(moveNumber);
    };

    const nextSquareValue = (): SquareValue.X | SquareValue.O => {
        return currentMove % 2 === 0 ? SquareValue.X : SquareValue.O;
    }

    const currentBoard = boardHistory[currentMove];

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
            : `Next player: ${convertSquareValueToLabel(nextSquareValue())}`;
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
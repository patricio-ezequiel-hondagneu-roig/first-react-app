import { useState } from "react";

import { convertSquareValueToLabel } from "../shared/convertSquareValueToLabel.function";
import { BoardInformation } from "../types/BoardInformation";
import { MoveInformation } from "../types/MoveInformation";
import { SquareValue } from "../types/SquareValue.enum";
import { Board } from "./Board";

export const Game = (): JSX.Element | null => {
    const [currentMoveNumber, setCurrentMoveNumber] = useState<number>(0);

    const [moveHistory, setMoveHistory] = useState<MoveInformation[]>([]);

    const [boardHistory, setBoardHistory] = useState<BoardInformation[]>([
        new BoardInformation()
    ]);

    const handleClick = (index: number) => {
        const newBoardHistory = boardHistory.slice(0, currentMoveNumber + 1);
        const newMoveHistory = moveHistory.slice(0, currentMoveNumber);
        const newBoard = newBoardHistory[newBoardHistory.length - 1];

        if (!newBoard.isClickableAtIndex(index)) {
            return;
        }

        const updatedSquares = [...newBoard.squares];
        updatedSquares[index] = nextSquareValue();

        setBoardHistory([...newBoardHistory, new BoardInformation(updatedSquares)]);
        setMoveHistory([...newMoveHistory, new MoveInformation(nextSquareValue(), index)]);
        setCurrentMoveNumber(newBoardHistory.length);
    };

    const jumpToMove = (moveNumber: number): void => {
        setCurrentMoveNumber(moveNumber);
    };

    const nextSquareValue = (): SquareValue.X | SquareValue.O => {
        return currentMoveNumber % 2 === 0 ? SquareValue.X : SquareValue.O;
    };

    const currentBoard: BoardInformation = boardHistory[currentMoveNumber];

    const moveComponents: JSX.Element[] = boardHistory.map((board, moveNumber) => {
        let label: string;
        const buttonIsDisabled = currentMoveNumber === moveNumber;

        if (moveNumber === 0) {
            label = 'Go to game start';
        } else {
            const move = moveHistory[moveNumber - 1];
            label = `Go to move #${moveNumber} (${move.playerName} at ${move.row}, ${move.column})`;
        }

        return (
            <li key={moveNumber}>
                <button
                    className="move"
                    disabled={buttonIsDisabled}
                    onClick={() => { jumpToMove(moveNumber); }}
                >
                    {label}
                </button>
            </li>
        );
    });

    let status: string;

    if (currentBoard.hasWinner) {
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
                    boardInformation={currentBoard}
                    onClick={(index) => { handleClick(index); }}
                />
            </div>
            <div className="game-info">
                <div>{status}</div>
                <ul className="move-list">{moveComponents}</ul>
            </div>
        </div>
    );

};
import { useState } from "react";

import { calculateWinnerInformation } from "../shared/calculateWinnerInformation.function";
import { convertSquareValueToLabel } from "../shared/convertSquareValueToLabel.function";
import { SquareValue } from "../types/SquareValue.enum";
import { Board } from "./Board";

interface GameState {
    boardHistory: {
        squares: SquareValue[];
    }[],
    currentMoveNumber: number;
    xIsNext: boolean;
}

export const Game = (): JSX.Element | null => {
    const [state, setState] = useState<GameState>({
        boardHistory: [{
            squares: [
                SquareValue.None, SquareValue.None, SquareValue.None,
                SquareValue.None, SquareValue.None, SquareValue.None,
                SquareValue.None, SquareValue.None, SquareValue.None,
            ]
        }],
        currentMoveNumber: 0,
        xIsNext: true
    });

    const handleClick = (index: number) => {
        const boardHistory = state.boardHistory.slice(0, state.currentMoveNumber + 1);
        const currentBoard = boardHistory[boardHistory.length - 1];

        if (calculateWinnerInformation(currentBoard.squares).winner !== SquareValue.None || currentBoard.squares[index] !== SquareValue.None) {
            return;
        }

        const updatedSquares = [...currentBoard.squares];
        updatedSquares[index] = state.xIsNext ? SquareValue.X : SquareValue.O;

        setState({
            boardHistory: [...boardHistory, { squares: updatedSquares }],
            currentMoveNumber: boardHistory.length,
            xIsNext: !state.xIsNext,
        });
    };

    const jumpTo = (moveNumber: number) => {
        setState({
            ...state,
            currentMoveNumber: moveNumber,
            xIsNext: (moveNumber % 2) === 0,
        });
    };

    const boardHistory = state.boardHistory;
    const currentBoard = boardHistory[state.currentMoveNumber];
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
            ? `Next player: ${state.xIsNext ? 'X' : 'O'}`
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
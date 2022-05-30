import React from "react";

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

export class Game extends React.Component<{}, GameState> {
    constructor(props: {}) {
        super(props);
        this.state = {
            boardHistory: [{
                squares: [
                    SquareValue.None, SquareValue.None, SquareValue.None,
                    SquareValue.None, SquareValue.None, SquareValue.None,
                    SquareValue.None, SquareValue.None, SquareValue.None,
                ]
            }],
            currentMoveNumber: 0,
            xIsNext: true
        };
    }

    handleClick = (index: number) => {
        const boardHistory = this.state.boardHistory.slice(0, this.state.currentMoveNumber + 1);
        const currentBoard = boardHistory[boardHistory.length - 1];

        if (calculateWinnerInformation(currentBoard.squares).winner !== SquareValue.None || currentBoard.squares[index] !== SquareValue.None) {
            return;
        }

        const updatedSquares = [...currentBoard.squares];
        updatedSquares[index] = this.state.xIsNext ? SquareValue.X : SquareValue.O;

        this.setState({
            boardHistory: [...boardHistory, { squares: updatedSquares }],
            currentMoveNumber: boardHistory.length,
            xIsNext: !this.state.xIsNext,
        });
    };

    jumpTo = (moveNumber: number) => {
        this.setState({
            currentMoveNumber: moveNumber,
            xIsNext: (moveNumber % 2) === 0,
        });
    };

    render = (): JSX.Element => {
        const boardHistory = this.state.boardHistory;
        const currentBoard = boardHistory[this.state.currentMoveNumber];
        const winnerInformation = calculateWinnerInformation(currentBoard.squares);

        const moves = boardHistory.map((board, moveNumber) => {
            const label = moveNumber === 0
                ? `Go to game start`
                : `Go to move #${moveNumber}`;

            return (
                <li key={moveNumber}>
                    <button onClick={() => { this.jumpTo(moveNumber); }}>
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
                ? `Next player: ${this.state.xIsNext ? 'X' : 'O'}`
                : `Draw`;
        }

        return (
            <div className="game">
                <div className="game-board">
                    <Board
                        squares={currentBoard.squares}
                        highlightedSquareIndexes={highlightedSquareIndexes}
                        onClick={(index) => { this.handleClick(index); }}
                    />
                </div>
                <div className="game-info">
                    <div>{status}</div>
                    <ol>{moves}</ol>
                </div>
            </div>
        );
    };
}
import { useState } from "react";

import { convertSquareValueToLabel } from "../shared/convertSquareValueToLabel.function";
import { BoardInformation } from "../types/BoardInformation";
import { MoveInformation } from "../types/MoveInformation";
import { SortOrderType } from "../types/SortOrderType.enum";
import { SquareValue } from "../types/SquareValue.enum";
import { Board } from "./Board";

export const Game = (): JSX.Element | null => {
    const [currentMoveNumber, setCurrentMoveNumber] = useState<number>(0);

    const [moveHistory, setMoveHistory] = useState<MoveInformation[]>([]);

    const [boardHistory, setBoardHistory] = useState<BoardInformation[]>([
        new BoardInformation()
    ]);

    const [moveHistorySortOrder, setMoveHistorySortOrder] = useState<SortOrderType>(SortOrderType.Ascending);

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

    const switchMoveHistorySortOrder = (): void => {
        if (moveHistorySortOrder === SortOrderType.Ascending) {
            setMoveHistorySortOrder(SortOrderType.Descending);
        }
        else {
            setMoveHistorySortOrder(SortOrderType.Ascending);
        }
    };

    const nextSquareValue = (): SquareValue.X | SquareValue.O => {
        return currentMoveNumber % 2 === 0 ? SquareValue.X : SquareValue.O;
    };

    const getMoveListItems = (): JSX.Element[] => {
        const items: JSX.Element[] = boardHistory.map((board, moveNumber) => {
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

        if (moveHistorySortOrder === SortOrderType.Ascending) {
            return items;
        }
        else {
            return items.reverse();
        }
    };

    const currentBoard: BoardInformation = boardHistory[currentMoveNumber];
    const moveListItems: JSX.Element[] = getMoveListItems();

    let moveHistorySortOrderLabel = moveHistorySortOrder === SortOrderType.Ascending
        ? 'Newest last 🠟'
        : 'Newest first 🠝';

    let gameStatus: JSX.Element;

    if (currentBoard.hasWinner) {
        const winnerLabel = convertSquareValueToLabel(currentBoard.winner);
        gameStatus = <>Winner: <strong>{winnerLabel}</strong></>;
    }
    else {
        gameStatus = currentBoard.isFullyMarked
            ? <>Draw</>
            : <>Next player: <strong>{convertSquareValueToLabel(nextSquareValue())}</strong></>;
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
                <header className="game-info-header">
                    <div>{gameStatus}</div>
                    <button
                        className="move-list-sort-button"
                        onClick={() => { switchMoveHistorySortOrder(); }}
                    >
                        {moveHistorySortOrderLabel}
                    </button>
                </header>
                <ul className="move-list">{moveListItems}</ul>
            </div>
        </div>
    );

};
import { SquareValue } from "./SquareValue.enum";
import { WinnerInformation } from "./WinnerInformation.interface";

const defaultSquareMatrix: SquareValue[] = [
    SquareValue.None, SquareValue.None, SquareValue.None,
    SquareValue.None, SquareValue.None, SquareValue.None,
    SquareValue.None, SquareValue.None, SquareValue.None,
];

export class BoardInformation {
    private _squares: SquareValue[];
    private _winner: SquareValue;
    private _winningLineIndexes: number[];
    private _winnerInformationIsOutdated: boolean;

    constructor(
        squares: SquareValue[] = defaultSquareMatrix,
    ) {
        this._squares = squares;
        this._winner = SquareValue.None;
        this._winningLineIndexes = [];
        this._winnerInformationIsOutdated = true;

        this.updateWinnerInformation();
    }

    get squares(): SquareValue[] {
        return this._squares;
    }
    set squares(value: SquareValue[]) {
        this._squares = value;
        this._winnerInformationIsOutdated = true;
    }

    get hasWinner(): boolean {
        return this.winner !== SquareValue.None;
    }

    get winner(): SquareValue {
        if (this._winnerInformationIsOutdated) {
            this.updateWinnerInformation();
        }

        return this._winner;
    }

    get winningLineIndexes(): number[] {
        if (this._winnerInformationIsOutdated) {
            this.updateWinnerInformation();
        }

        return this._winningLineIndexes;
    }

    get isFullyMarked(): boolean {
        return this._squares.every((square) => square !== SquareValue.None);
    }

    valueAtIndexIs(index: number, value: SquareValue): boolean {
        this.assertIndexIsInRange(index);
        return this._squares[index] === value;
    }

    isMarkedAtIndex(index: number): boolean {
        this.assertIndexIsInRange(index);
        return this._squares[index] !== SquareValue.None;
    }

    isClickableAtIndex(index: number): boolean {
        return !this.hasWinner && !this.isMarkedAtIndex(index);
    }

    private updateWinnerInformation() {
        const winnerInformation = this.calculateWinnerInformation(this._squares);
        this._winner = winnerInformation.winner;
        this._winningLineIndexes = winnerInformation.winningLineIndexes;

        this._winnerInformationIsOutdated = false;
    }

    private calculateWinnerInformation = (squares: SquareValue[]): WinnerInformation => {
        const possibleWinningLineIndexes: [number, number, number][] = [
            [0, 1, 2],
            [3, 4, 5],
            [6, 7, 8],
            [0, 3, 6],
            [1, 4, 7],
            [2, 5, 8],
            [0, 4, 8],
            [2, 4, 6],
        ];

        const winningLineIndexes = possibleWinningLineIndexes.find(([firstIndex, secondIndex, thirdIndex]) => {
            return (
                squares[firstIndex] !== SquareValue.None &&
                squares[firstIndex] === squares[secondIndex] &&
                squares[secondIndex] === squares[thirdIndex]
            );
        });

        if (winningLineIndexes !== undefined) {
            return {
                winner: squares[winningLineIndexes[0]],
                winningLineIndexes: winningLineIndexes
            };
        }
        else {
            return {
                winner: SquareValue.None,
                winningLineIndexes: []
            };
        }
    };

    private assertIndexIsInRange(index: number) {
        if (index < 0 || index > 8) {
            throw Error(`Invalid square index [${index}]. The index must be between 0 and 8.`);
        }
    }
}
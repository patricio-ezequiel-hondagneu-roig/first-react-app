import { SquareValue } from './SquareValue.enum';

export interface WinnerInformation {
	winner: SquareValue;
	winningLineIndexes: number[];
};
import { SquareValue } from "../types/SquareValue.enum";
import { WinnerInformation } from "../types/WinnerInformation.interface";

export const calculateWinnerInformation = (squares: SquareValue[]): WinnerInformation => {
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
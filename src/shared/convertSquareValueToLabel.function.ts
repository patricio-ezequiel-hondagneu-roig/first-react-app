import { SquareValue } from "../types/SquareValue.enum";

export const convertSquareValueToLabel = (squareValue: SquareValue) => {
	switch (squareValue) {
		case SquareValue.X: {
			return 'X';
		}
		case SquareValue.O: {
			return 'O';
		}
		case SquareValue.None: {
			return '';
		}
	}
};
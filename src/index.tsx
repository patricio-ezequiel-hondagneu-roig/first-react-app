import React from 'react';
import ReactDOM from 'react-dom/client';

import './index.css';

type SquareValue = 'X' | 'O' | null;

type WinnerInformation =
	| {
		winner: null;
		winningLineIndexes: [];
	}
	| {
		winner: 'X' | 'O';
		winningLineIndexes: [number, number, number];
	};

interface SquareProps {
	value: SquareValue;
	isHighlighted: boolean;
	onClick: () => void;
}

const Square = (props: SquareProps): JSX.Element | null => {
	const buttonCssClass = props.isHighlighted
		? "square highlighted"
		: "square";

	return (
		<button
			className={buttonCssClass}
			onClick={() => { props.onClick(); }}
		>
			{props.value}
		</button>
	);
};

interface BoardProps {
	squares: SquareValue[];
	highlightedSquareIndexes: number[];
	onClick: (index: number) => void;
}

const Board = (props: BoardProps): JSX.Element | null => {
	const renderSquare = (index: number): JSX.Element => {
		return <Square
			value={props.squares[index]}
			isHighlighted={props.highlightedSquareIndexes.includes(index)}
			onClick={() => { props.onClick(index); }}
		/>;
	};

	return (
		<div>
			<div className="board-row">
				{renderSquare(0)}
				{renderSquare(1)}
				{renderSquare(2)}
			</div>
			<div className="board-row">
				{renderSquare(3)}
				{renderSquare(4)}
				{renderSquare(5)}
			</div>
			<div className="board-row">
				{renderSquare(6)}
				{renderSquare(7)}
				{renderSquare(8)}
			</div>
		</div>
	);
};

interface GameState {
	boardHistory: {
		squares: SquareValue[];
	}[],
	currentMoveNumber: number;
	xIsNext: boolean;
}

class Game extends React.Component<{}, GameState> {
	constructor(props: {}) {
		super(props);
		this.state = {
			boardHistory: [{
				squares: [
					null, null, null,
					null, null, null,
					null, null, null,
				]
			}],
			currentMoveNumber: 0,
			xIsNext: true
		};
	}

	handleClick = (index: number) => {
		const boardHistory = this.state.boardHistory.slice(0, this.state.currentMoveNumber + 1);
		const currentBoard = boardHistory[boardHistory.length - 1];

		if (calculateWinnerInformation(currentBoard.squares).winner !== null || currentBoard.squares[index] !== null) {
			return;
		}

		const updatedSquares = [...currentBoard.squares];
		updatedSquares[index] = this.state.xIsNext ? 'X' : 'O';

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

		if (winnerInformation.winner) {
			highlightedSquareIndexes = [
				...highlightedSquareIndexes,
				...winnerInformation.winningLineIndexes
			];
			status = `Winner: ${winnerInformation.winner}`;
		}
		else {
			status = currentBoard.squares.includes(null)
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

// ========================================

const rootElement = document.getElementById('root');

if (rootElement === null) {
	throw new Error('Root element not found.');
}

ReactDOM.createRoot(rootElement).render(
	<React.StrictMode>
		<Game />
	</React.StrictMode>
);

const calculateWinnerInformation = (squares: SquareValue[]): WinnerInformation => {
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
			squares[firstIndex] !== null &&
			squares[firstIndex] === squares[secondIndex] &&
			squares[secondIndex] === squares[thirdIndex]
		);
	});

	if (winningLineIndexes !== undefined) {
		return {
			winner: squares[winningLineIndexes[0]] as 'X' | 'O',
			winningLineIndexes: winningLineIndexes
		};
	}
	else {
		return {
			winner: null,
			winningLineIndexes: []
		};
	}
};
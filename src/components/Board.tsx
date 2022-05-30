import { SquareValue } from "../types/SquareValue.enum";
import { Square } from "./Square";

interface BoardProps {
    squares: SquareValue[];
    highlightedSquareIndexes: number[];
    onClick: (index: number) => void;
}

export const Board = (props: BoardProps): JSX.Element | null => {
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
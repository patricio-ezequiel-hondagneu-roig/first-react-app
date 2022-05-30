import { convertSquareValueToLabel } from "../shared/convertSquareValueToLabel.function";
import { SquareValue } from "../types/SquareValue.enum";

interface SquareProps {
	value: SquareValue;
	isHighlighted: boolean;
	onClick: () => void;
}

export const Square = (props: SquareProps): JSX.Element | null => {
	const buttonCssClass = props.isHighlighted
		? "square highlighted"
		: "square";

	let displayValue = convertSquareValueToLabel(props.value);

	return (
		<button
			className={buttonCssClass}
			onClick={() => { props.onClick(); }}
		>
			{displayValue}
		</button>
	);
};
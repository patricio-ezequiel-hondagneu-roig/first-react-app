import { convertSquareValueToLabel } from "../shared/convertSquareValueToLabel.function";
import { SquareValue } from "./SquareValue.enum";

export class MoveInformation {
    readonly playerName: string;
    readonly row: number;
    readonly column: number;

    constructor(
        player: SquareValue.X | SquareValue.O,
        index: number,
    ) {
        this.playerName = convertSquareValueToLabel(player);
        this.row = Math.floor(index / 3) + 1;
        this.column = index % 3 + 1;
    }
}
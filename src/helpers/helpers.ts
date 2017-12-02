import { Point } from "phaser";

export class Helpers {
    public static alignToGrid(point: Point, gridWidth: number = 32, gridHeight: number = 32): Point {
        return new Point(
            Math.round(point.x / gridWidth) * gridWidth,
            Math.round(point.y / gridHeight) * gridHeight
        );
    }
}
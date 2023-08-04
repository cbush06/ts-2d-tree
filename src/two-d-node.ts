import { Point } from "./point";

export default class TwoDNode {

    private readonly _point: Point;

    private _parent?: TwoDNode;
    get parent() { return this._parent; }
    set parent(val: TwoDNode) { this._parent = val; }

    private  _left?: TwoDNode;
    get left() { return this._left; }
    set left(val: TwoDNode) { this._left = val; }

    private _right?: TwoDNode;
    get right() { return this._right; }
    set right(val: TwoDNode) { this._right = val; }

    private _depth: number;
    get depth() { return this._depth; }
    set depth(val: number) { this._depth = val; }

    get point() { return this._point; }
    get x() { return this._point[0]; }
    get y() { return this._point[1]; }

    constructor(point: Point, parent?: TwoDNode, left?: TwoDNode, right?: TwoDNode) {
        this._point = [...point];
        this._depth = parent ? parent.depth + 1 : 0;
        this.parent = parent;
        
        this._left = left;
        if(left) left.parent = this;
        
        this._right = right;
        if(right) right.parent = this;
    }

    hasChild(side?: 'left' | 'right') {
        if(!side) {
            return !!this.left || !!this.right;
        } else {
            return !!this[side];
        }
    }

    getChildPoints(array?: Array<Point>): Array<Point> {
        const points = array ?? new Array<Point>();
        if(this.left) points.push(this.left.point, ...this.left.getChildPoints(array));
        if(this.right) points.push(this.right.point, ...this.right.getChildPoints(array));
        return points;
    }

}
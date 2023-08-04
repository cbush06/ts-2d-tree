import { setUncaughtExceptionCaptureCallback } from "process";
import { Point } from "./point";
import PointSet from "./point-set";
import TwoDNode from "./two-d-node";

export default class TwoDTree {

    private root?: TwoDNode;

    private pointSet: PointSet;

    constructor(points: Point[]) {
        this.root = this.buildStack(points, 0);
        this.pointSet = new PointSet(points);
    }

    private buildStack(points: Point[], depth: number, parent?: TwoDNode): TwoDNode {
        const axis = this.getAxisIndex(depth);
        const xy = this.getAxis(depth);

        points.sort((p1, p2) => p1[axis] - p2[axis]);
        
        const median = Math.floor((points.length - 1) / 2);
        
        if(points.length > 0) {
            const node = new TwoDNode(points[median], parent);
            const left = points.slice(0, median);
            const right = points.slice(median + 1);
            
            node.left = this.buildStack(left, depth + 1, node);
            node.right = this.buildStack(right, depth + 1, node);
            return node;
        }

        return undefined;
    }

    /**
     * Add a point to the 2-d Tree. The tree acts as a set and will ignore any duplicates added.
     * @param point 
     * @returns 
     */
    add(point: Point) {
        if(this.pointSet.has(point)) {
            return;
        }

        this.pointSet.add(point);

        let node = this.root;

        if(!node) this.root = new TwoDNode(point);

        for(let depth = 0; node; depth++) {
            const axis = this.getAxis(depth); // x-axis or y-axis?

            // Go left
            if(point[0] <= node[axis]) {
                if(!node.hasChild('left')) {
                    node = node.left = new TwoDNode(point, node);
                }
                node = node.left;
            } 
            // Go right
            else {
                if(!node.hasChild('right')) {
                    node = node.right = new TwoDNode(point, node);
                }
                node = node.right;
            }
        }
    }

    /**
     * Remove a point from the 2-d Tree.
     * @param point 
     * @returns 
     */
    remove(point: Point) {
        const [node, depth] = this.findNode(point);
        
        if(node === this.root) {
            this.root = undefined;
            return;
        }

        this.removeNode(node);
        this.pointSet.delete(point);
    }

    private removeNode(node: TwoDNode) {
        const xy = this.getAxis(node.depth);

        const replacement = 
            node.right ? 
                this.findMin(node.right, xy) : 
            node.left ? 
                this.findMin(node.left, xy) : 
            undefined;

        const which = node.parent.left === node ? 'left' : 'right';
        node.parent[which] = replacement ? new TwoDNode(replacement.point, node.parent, node.left, node.right) : undefined;

        if(replacement) {
            this.removeNode(replacement);
        }
    }

    /**
     * Perform an <strong>inclusive</strong> range search. All points contained by the orthogonal 2-dimensional range
     * specified by points p1 and p2 will be returned. This includes points that lie on the edges of the rectangle.
     * @param min 
     * @param max 
     * @returns 
     */
    rangeSearch(p1: Point, p2: Point): Array<Point> {
        let discovered = new PointSet();
        let stack = new Array<TwoDNode>(this.root);

        const results = new Array<Point>();

        const min = [Math.min(p1[0], p2[0]), Math.min(p1[1], p2[1])];
        const max = [Math.max(p1[0], p2[0]), Math.max(p1[1], p2[1])];
        
        while(stack.length) {
            const next = stack.pop();
            const axisIndex = this.getAxisIndex(next.depth);

            if(!discovered.has(next.point)) {
                discovered.add(next.point);

                // Add it?
                if(next.x >= min[0] && next.y >= min[1]
                    && next.x <= max[0] && next.y <= max[1]
                ) {
                    results.push(next.point);
                }
                
                // Which way from here?
                if(next.left && min[axisIndex] <= next.point[axisIndex]) {
                    stack.push(next.left);
                }

                if(next.right && max[axisIndex] >= next.point[axisIndex]) {
                    stack.push(next.right);
                }
            }
        }

        return results;
    }

    private readonly distanceFunction = (p1: Point, p2: Point) => Math.pow(p1[0] - p2[0], 2) + Math.pow(p1[1] - p2[1], 2);

    nearestNeighborsSearch(p: Point, distance: number, limit?: number): Array<Point> {
        const dSquared = distance * distance;

        let discovered = new PointSet();
        let stack = new Array<TwoDNode>(this.root);

        const results = new Array<[number, Point]>();

        while(stack.length) {
            const next = stack.pop();
            const axisIndex = this.getAxisIndex(next.depth);

            if(!discovered.has(next.point)) {
                discovered.add(next.point);

                // Add it?
                const distanceToNext = this.distanceFunction(p, next.point);
                if(distanceToNext <= dSquared) {
                    results.push([distanceToNext, next.point]);
                }
                
                // Which way from here?
                if(next.left 
                    && (
                        (p[axisIndex] - next.point[axisIndex]) <= 0 // Do we need to shift left?
                        || this.distanceFunction(p, this.toAxialPoint(p, next.left.point, axisIndex)) <= dSquared // If not, is there a candidate at left?
                    )
                ) {
                    stack.push(next.left);
                }
                if(next.right 
                    && (
                        (p[axisIndex] - next.point[axisIndex]) >= 0 // Do we need to shift right?
                        || this.distanceFunction(p, this.toAxialPoint(p, next.right.point, axisIndex)) <= dSquared) // If not, is there a candidate at right?
                ) {
                    stack.push(next.right);
                }
            }
        }

        return results
            .sort((a, b) => a[0] - b[0])
            .map(a => a[1])
            .slice(0, limit);
    }

    private toAxialPoint(p: Point, query: Point, axisIndex: number): Point {
        if(axisIndex === 0) {
            return [query[0], p[1]];
        } else {
            return [p[0], query[1]];
        }
    }

    private findMin(subtree: TwoDNode, axis: 'x' | 'y'): TwoDNode {
        let discovered = new PointSet();
        let stack = new Array<TwoDNode>(subtree);
        let min = subtree;

        while(stack.length) {
            const next = stack.pop();
            if(!discovered.has(next.point)) {
                discovered.add(next.point);
                if(next.left) stack.push(next.left);
                if(next.right) stack.push(next.right);
                min = next[axis] < min[axis] ? next: min;
            }
        }

        return min;
    }

    private getAxisIndex(depth: number): number {
        return depth % 2;
    }

    private getAxis(depth: number): 'x' | 'y' {
        return this.getAxisIndex(depth) === 0 ? 'x' : 'y';
    }

    private findNode(point: Point): [TwoDNode, number] | undefined {
        let node = this.root;
        let depth = 0;

        while(!this.areEqual(node.point, point)) {
            const axis = depth % 2;
            const xy = depth % 2 == 0 ? 'x' : 'y'; // x-axis or y-axis?

            // Go left
            if(point[axis] <= node[xy]) {
                if(!node.hasChild('left')) return undefined;
                node = node.left;
            }
            // Go right
            else {
                if(!node.hasChild('right')) return undefined;
                node = node.right;
            }

            depth++;
        }
        return [node, depth];
    }

    private areEqual(point1: Point, point2: Point): boolean {
        return point1[0] === point2[0] && point1[1] === point2[1];
    }

}
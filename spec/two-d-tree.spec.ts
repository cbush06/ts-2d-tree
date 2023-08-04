import { Point } from "../src/point";
import TwoDTree from "../src/two-d-tree";

describe('test 2d tree', () => {
    const points = [
        [5.5,0], [1,5], [5,4], [3,1],
        [1,8], [3,4], [3,2], [0,2],
        [0,0], [1,3], [4,6], [0,9],
        [1,6], [4,5], [2,9]
    ] as Point[];

    it('should find all nearest neighbors', () => {
        const tree = new TwoDTree(points);
        expect(tree.nearestNeighborsSearch([1,4], 5, 4))
            .toEqual(jasmine.arrayWithExactContents([[1,5],[1,3],[3,4],[1,6]]));
    });

    it('should find the top x nearest neighbors', () => {
        const tree = new TwoDTree(points);
        expect(tree.nearestNeighborsSearch([0.5,-0.5], 3.2, 2))
            .toEqual(jasmine.arrayWithExactContents([[0,2],[0,0]]));
    });

    it('should find perform a range search', () => {
        const tree = new TwoDTree(points);
        expect(tree.rangeSearch([0,6.5],[2,2.5]))
            .toEqual(jasmine.arrayWithExactContents([[1,3],[1,5],[1,6]]));
    });

    it('should find points on the boundary of range searches', () => {
        const tree = new TwoDTree(points);
        expect(tree.rangeSearch([0,6],[1,2.5]))
            .toEqual(jasmine.arrayWithExactContents([[1,3],[1,5],[1,6]]));
    });

    it('should handle adding points', () => {
        const tree = new TwoDTree(points);
        tree.add([-1,1]);
        expect(tree.nearestNeighborsSearch([0.5,-0.5], 3.2, 2))
            .toEqual(jasmine.arrayWithExactContents([[-1,1],[0,0]]));
    });

    it('should handle removing points', () => {
        const tree = new TwoDTree(points);
        tree.remove([0,2]);
        expect(tree.nearestNeighborsSearch([0.5,-0.5], 3.2, 2))
            .toEqual(jasmine.arrayWithExactContents([[3,1],[0,0]]));
    });
});
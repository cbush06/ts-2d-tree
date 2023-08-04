# TypeScript 2-d Tree

A TypeScript implementation of k-d tree specifically for 2-dimensional uses. This was built to provide fast nearest-neighbor searches of sets of latitude/longitude coordinates, but works for any 2D (x, y) coordinates.

## API

| Method                                                                             | Description                                                                                                                                                                                                              |
| ---------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `TwoDTree(points: Point[])`                                                        | Constructor used to create a new tree with a given set of points.                                                                                                                                                        |
| `add(point: Point)`                                                                | Adds a new point to the tree.                                                                                                                                                                                            |
| `remove(point: Point)`                                                             | Removes a point from the tree and replaces it with the best suitor from the remaining subtree.                                                                                                                           |
| `rangeSearch(p1: Point, p2: Point): Array<Point>`                                  | Performs an orthogonal range search over a rectangle specified by the points `p1` and `p2`. This search is inclusive and will return points on the boundaries of the rectangle.                                          |
| `nearestNeighborsSearch(p: Point, distance: number, limit?: number): Array<Point>` | Performs a nearest-neighbor search around a given point `p` within the radius specified by `distance`. If provided, `limit` will cause the method to return only the _x_ closest results, where _x_ is equal to `limit`. |

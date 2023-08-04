import { Point } from "./point";

export default class PointSet extends Set {
    constructor(values?: Array<Point>) {
        super(values ?? []);
    }

    add(value: Point): this {
        super.add(JSON.stringify(value));
        return this;
    }

    delete(value: Point): boolean {
        return super.delete(JSON.stringify(value));
    }

    has(value: Point): boolean {
        return super.has(JSON.stringify(value));
    }

    forEach(callbackfn: (value: Point, value2: Point, set: PointSet) => void, thisArg?: any): void {
        super.forEach((v, v2, self) => {
            const val = JSON.parse(v);
            callbackfn(v, v, this);
        });
    }

    entries(): IterableIterator<Point> {
        let iterator = super.entries();
        return {
            [Symbol.iterator]() { return this; },
            next() {
                const result = iterator[Symbol.iterator]().next();
                if(result.value) {
                    const parsed = JSON.parse(result.value[0]) as Point;
                    result.value = [parsed, parsed];
                }
                return result;
            }
        }
    }

    keys(): IterableIterator<Point> {
        let iterator = super.keys();
        return {
            [Symbol.iterator]() { return this; },
            next() {
                const result = iterator[Symbol.iterator]().next();
                if(result.value) {
                    const parsed = JSON.parse(result.value) as Point;
                    result.value = parsed;
                }
                return result;
            }
        }
    }

    values(): IterableIterator<Point> {
        return this.keys();
    }
}
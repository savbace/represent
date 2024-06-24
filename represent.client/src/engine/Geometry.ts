import { max, min } from "lodash";

export class Point {
  x: number;
  y: number;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }

  lengthTo(point: Point) {
    const xDiff = point.x - this.x;
    const yDiff = point.y - this.y;

    return Math.sqrt(xDiff * xDiff + yDiff * yDiff);
  }
}

export class Rect {
  a: Point;
  b: Point;
  c: Point;
  d: Point;

  constructor(a: Point, b: Point, c: Point, d: Point) {
    this.a = a;
    this.b = b;
    this.c = c;
    this.d = d;
  }

  getCenter() {
    function middle(x1: number, x2: number) {
      return (x1 + x2) / 2;
    }

    return new Point(middle(this.a.x, this.c.x), middle(this.a.y, this.c.y));
  }

  getHeight() {
    return this.a.lengthTo(this.b);
  }

  getWidth() {
    return this.b.lengthTo(this.c);
  }
}

function getBoundingRect(points: Point[]) {
  const minX = min(points.map((p) => p.x))!;
  const minY = min(points.map((p) => p.y))!;
  const maxX = max(points.map((p) => p.x))!;
  const maxY = max(points.map((p) => p.y))!;

  return new Rect(new Point(minX, minY), new Point(minX, maxY), new Point(maxX, maxY), new Point(maxX, minY));
}

function movePoint(point: Point, center: Point, d: number) {
  return new Point(point.x + d * center.x, point.y + d * center.y);
}

function scalePoints(points: Point[], factor: number, center: Point, targetCenter: Point) {
  function scalePoint(point: Point) {
    return new Point(point.x * factor, point.y * factor);
  }

  const movedToZero = points.map((p) => movePoint(p, center, -1));
  const scaled = movedToZero.map((p) => scalePoint(p));
  const movedToCenter = scaled.map((p) => movePoint(p, targetCenter, 1));

  return movedToCenter;
}

export function scaleIntoRect(sourcePoints: Point[], targetWidth: number, targetHeight: number, scale: number = 1.0) {
  const sourceRect = getBoundingRect(sourcePoints);
  const scaleFactor = scale * Math.min(targetWidth / sourceRect.getWidth(), targetHeight / sourceRect.getHeight());
  const targetCenter = new Point(targetWidth / 2, targetHeight / 2);

  const integerPoints = scalePoints(sourcePoints, scaleFactor, sourceRect.getCenter(), targetCenter).map(
    (p) => new Point(Math.round(p.x), Math.round(p.y))
  );

  return integerPoints;
}

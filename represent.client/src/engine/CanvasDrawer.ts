import { Point } from "./Geometry";

export interface DrawImageOptions {
  sx: number;
  sy: number;
  sw: number;
  sh: number;
  dx: number;
  dy: number;
  dw: number;
  dh: number;
}

export default class CanvasDrawer {
  private canvas: HTMLCanvasElement;

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
  }

  drawPoints(points: Point[], style: string) {
    const ctx = this.canvas.getContext("2d")!;

    ctx.lineWidth = 3;
    ctx.lineJoin = "round";
    ctx.strokeStyle = style;
    ctx.beginPath();
    ctx.moveTo(points[0].x, points[0].y);

    for (let i = 1; i < points.length; i++) {
      ctx.lineTo(points[i].x, points[i].y);
    }

    ctx.stroke();
  }

  drawImage(img: HTMLImageElement, options: DrawImageOptions) {
    const ctx = this.canvas.getContext("2d")!;
    ctx.drawImage(img, options.sx, options.sy, options.sw, options.sh, options.dx, options.dy, options.dw, options.dh);
  }

  drawText(text: string, x: number, y: number, size: number, style: string, textAlign: CanvasTextAlign = "start") {
    const ctx = this.canvas.getContext("2d")!;
    ctx.font = `${size}px Segoe UI`;
    ctx.textAlign = textAlign;
    ctx.fillStyle = style

    // ctx.shadowBlur = 4;
    // ctx.shadowColor = "rgb(0 0 0 / 50%)";

    ctx.fillText(text, x, y);
  }

  fillBackground(color: string){
    const ctx = this.canvas.getContext("2d")!;
    ctx.fillStyle = color;
    ctx.fillRect(0, 0, this.getWidth(), this.getHeight());
  }

  // todo: getViewport/drawingArea
  getWidth() {
    return this.canvas.width;
  }

  getHeight() {
    return this.canvas.height;
  }
}

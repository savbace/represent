export function copyToClipboard(canvas: HTMLCanvasElement) {
  return new Promise((resolve) => {
    canvas.toBlob(async function (blob) {
      const item = new ClipboardItem({ [blob!.type]: blob! });
      await navigator.clipboard.write([item]);
      resolve(undefined);
    });
  });
}

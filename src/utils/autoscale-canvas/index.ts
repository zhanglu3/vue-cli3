/**
 * Retina-enable the given `canvas`.
 *
 * @param {Canvas} canvas
 * @return {Canvas}
 * @api public
 */
function scaleCanvasByPixelRatio(canvas: HTMLCanvasElement): HTMLCanvasElement{
    var ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
    var ratio = window.devicePixelRatio || 1;
    if (1 != ratio) {
      canvas.style.width = canvas.width + 'px';
      canvas.style.height = canvas.height + 'px';
      canvas.width *= ratio;
      canvas.height *= ratio;
      ctx.scale(ratio, ratio);
    }
    return canvas;
}

export {
    scaleCanvasByPixelRatio
}
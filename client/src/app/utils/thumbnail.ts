export function createThumbnail(imageData: ImageData, width: number, height: number): string {
  const thumbnailCanvas = document.createElement('canvas');
  thumbnailCanvas.width = width;
  thumbnailCanvas.height = height;
  const thumbnailCtx = thumbnailCanvas.getContext('2d')!;
  const thumbnailData = thumbnailCtx.createImageData(width, height);

  const xRatio = imageData.width / width;
  const yRatio = imageData.height / height;

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const srcX = Math.floor(x * xRatio);
      const srcY = Math.floor(y * yRatio);
      const srcIndex = (srcY * imageData.width + srcX) * 4;
      const thumbIndex = (y * width + x) * 4;

      thumbnailData.data[thumbIndex] = imageData.data[srcIndex];
      thumbnailData.data[thumbIndex + 1] = imageData.data[srcIndex + 1];
      thumbnailData.data[thumbIndex + 2] = imageData.data[srcIndex + 2];
      thumbnailData.data[thumbIndex + 3] = imageData.data[srcIndex + 3];
    }
  }

  thumbnailCtx.putImageData(thumbnailData, 0, 0);
  return thumbnailCanvas.toDataURL('image/png');
}

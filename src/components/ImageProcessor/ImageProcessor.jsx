import React from 'react';
import './ImgProcessor.scss';

const ImageProcessor = ({ imageSrc, onEncoded }) => {
  const canvasRef = React.useRef(null);
  const [paletteSize, setPaletteSize] = React.useState(16);
  const [paletteWithCodes, setPaletteWithCodes] = React.useState([]);

  const generatePaletteWithCodes = (paletteSize) => {
    const palette = [];
    const step = 255 / (paletteSize - 1);
    const bitsPerColor = Math.ceil(Math.log2(paletteSize ** 3));

    let index = 0;
    for (let r = 0; r < paletteSize; r++) {
      for (let g = 0; g < paletteSize; g++) {
        for (let b = 0; b < paletteSize; b++) {
          const color = [Math.round(r * step), Math.round(g * step), Math.round(b * step)];
          const code = index.toString(2).padStart(bitsPerColor, '0');
          palette.push({ color, code });
          index++;
        }
      }
    }
    return palette;
  };

  const quantizeImageWithCodes = (imageData, paletteWithCodes) => {
    const { data, width, height } = imageData;
    const newData = new Uint8ClampedArray(data.length);
    const encodedPixels = [];

    for (let i = 0; i < data.length; i += 4) {
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];

      let minDistance = Infinity;
      let closestColor = { color: [0, 0, 0], code: '' };

      paletteWithCodes.forEach(({ color, code }) => {
        const distance = Math.sqrt(
          (r - color[0]) ** 2 + (g - color[1]) ** 2 + (b - color[2]) ** 2
        );
        if (distance < minDistance) {
          minDistance = distance;
          closestColor = { color, code };
        }
      });

      newData[i] = closestColor.color[0];
      newData[i + 1] = closestColor.color[1];
      newData[i + 2] = closestColor.color[2];
      newData[i + 3] = 255;

      encodedPixels.push(closestColor.code);
    }

    return {
      quantizedImage: new ImageData(newData, width, height),
      encodedPixels,
    };
  };

  const processImage = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const image = new Image();
    image.src = imageSrc;

    image.onload = () => {
      canvas.width = image.width;
      canvas.height = image.height;
      ctx.drawImage(image, 0, 0);

      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const { quantizedImage, encodedPixels } = quantizeImageWithCodes(imageData, paletteWithCodes);

      ctx.putImageData(quantizedImage, 0, 0);
      onEncoded(encodedPixels, paletteWithCodes, { width: canvas.width, height: canvas.height });
    };
  };

  React.useEffect(() => {
    setPaletteWithCodes(generatePaletteWithCodes(paletteSize));
  }, [paletteSize]);

  return (
    <div>
      <canvas ref={canvasRef} style={{ border: '1px solid black' }}></canvas>
      <div className='properties'>
        <label className='propfield'>
          Количество цветов:
          <input
            type="number"
            value={paletteSize}
            min="2"
            max="256"
            onChange={(e) => setPaletteSize(parseInt(e.target.value, 10))}
          />
        </label>
        <button className="workB" onClick={processImage}>Обработать изображение</button>
      </div>
    </div>
  );
};

export default ImageProcessor;
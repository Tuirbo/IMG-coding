import React from 'react';
import './ImgProcessor.scss';

const ImageProcessor = ({ imageSrc }) => {
  const canvasRef = React.useRef(null);
  const [paletteSize, setPaletteSize] = React.useState(16);
  const [palette, setPalette] = React.useState([]);


  const generatePalette = (paletteSize) => {
    const newPalette = [];
    const step = 255 / (paletteSize - 1);
    for (let r = 0; r < paletteSize; r++) {
      for (let g = 0; g < paletteSize; g++) {
        for (let b = 0; b < paletteSize; b++) {
          newPalette.push([Math.round(r * step), Math.round(g * step), Math.round(b * step)]);
        }
      }
    }
    return newPalette;
  };


  const quantizeImage = (imageData, palette) => {
    const { data } = imageData;


    const newData = new Uint8ClampedArray(data.length);


    for (let i = 0; i < data.length; i += 4) {
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];

      let minDistance = Infinity;
      let closestColor = [0, 0, 0];

      for (let j = 0; j < palette.length; j++) {
        const [pr, pg, pb] = palette[j];
        const distance = Math.sqrt(
          Math.pow(r - pr, 2) + Math.pow(g - pg, 2) + Math.pow(b - pb, 2)
        );

        if (distance < minDistance) {
          minDistance = distance;
          closestColor = palette[j];
        }
      }


      newData[i] = closestColor[0];
      newData[i + 1] = closestColor[1];
      newData[i + 2] = closestColor[2];
      newData[i + 3] = 255;
    }

    return new ImageData(newData, imageData.width, imageData.height);
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
      const quantizedData = quantizeImage(imageData, palette);
      ctx.putImageData(quantizedData, 0, 0);
    };
  };

  React.useEffect(() => {
    setPalette(generatePalette(paletteSize));
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
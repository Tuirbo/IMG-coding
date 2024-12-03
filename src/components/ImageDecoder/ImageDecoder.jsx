import React from 'react';

const ImageDecoder = ({ paletteWithCodes, encodedData, width, height }) => {
  const canvasRef = React.useRef(null);

  const decodeImage = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const decodedImageData = new Uint8ClampedArray(width * height * 4);

    let pixelIndex = 0;
    for (let i = 0; i < encodedData.length; i++) {
      const code = encodedData[i];
      const { color } = paletteWithCodes.find(({ code: c }) => c === code);

      decodedImageData[pixelIndex++] = color[0];
      decodedImageData[pixelIndex++] = color[1];
      decodedImageData[pixelIndex++] = color[2];
      decodedImageData[pixelIndex++] = 255;
    }

    const imageData = new ImageData(decodedImageData, width, height);
    ctx.putImageData(imageData, 0, 0);
  };

  React.useEffect(() => {
    decodeImage();
  }, [encodedData]);

  return <canvas ref={canvasRef} width={width} height={height} />;
};

export default ImageDecoder;
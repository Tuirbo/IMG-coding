import React from 'react';
import ImageUploader from '../components/ImageUploader/ImageUploader';
import ImageProcessor from '../components/ImageProcessor/ImageProcessor';
import './App.scss';

const App = () => {
  const [imageSrc, setImageSrc] = React.useState(null);
  const [encodedData, setEncodedData] = React.useState(null);
  const [paletteWithCodes, setPaletteWithCodes] = React.useState([]);
  const [imageDimensions, setImageDimensions] = React.useState({ width: 0, height: 0 });

  const downloadEncodedData = () => {
    const blob = new Blob([encodedData.join('')], { type: 'text/plain' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'encoded_image.txt';
    link.click();
  };

  return (
    <div className='main'>
      <h1>Кодирование изображений с использованием палитры</h1>
      {!imageSrc ? (
        <ImageUploader onImageUpload={setImageSrc} />
      ) : (
        <ImageProcessor
          imageSrc={imageSrc}
          onEncoded={(data, palette, dimensions) => {
            setEncodedData(data);
            setPaletteWithCodes(palette);
            setImageDimensions(dimensions);
          }}
        />
      )}
      {encodedData && (
        <div className='buttons'>
          <button className="workB" onClick={downloadEncodedData}>
            Скачать закодированные данные
          </button>
          <button className="anotherimg" onClick={() => setImageSrc(null)}>
            Загрузить другое изображение
          </button>
        </div>
        
      )}
      
    </div>
  );
};

export default App;
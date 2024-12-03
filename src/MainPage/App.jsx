import React from 'react';
import ImageUploader from '../components/ImageUploader/ImageUploader';
import ImageProcessor from '../components/ImageProcessor/ImageProcessor';
import "../MainPage/App.scss"

const App = () => {
  const [imageSrc, setImageSrc] = React.useState(null);

  return (
    <div className='main'>
      <h1>Кодирование изображений с использованием палитры</h1>
      {!imageSrc ? (
        <ImageUploader onImageUpload={setImageSrc} />
      ) : (
        <ImageProcessor imageSrc={imageSrc} />
      )}
      {imageSrc && (
        <button className = "anotherimg" onClick={() => setImageSrc(null)}>
          Загрузить изображение
        </button>
      )}
    </div>
  );
};

export default App;
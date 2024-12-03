import React from 'react';
import { useDropzone } from 'react-dropzone';
import './ImgUploader.scss';

const ImageUploader = ({ onImageUpload }) => {
  const { getRootProps, getInputProps } = useDropzone({
    accept: 'image/*',
    onDrop: (acceptedFiles) => {
      const file = acceptedFiles[0];
      const reader = new FileReader();
      reader.onload = () => onImageUpload(reader.result);
      reader.readAsDataURL(file);
    },
  });

  return (
    <div className='uploadposition'>
      <div className='upload' {...getRootProps()}>
        <input {...getInputProps()} />
        <p>Перетащите изображение сюда или нажмите для загрузки</p>
        </div>
    </div>
    
  );
};

export default ImageUploader;
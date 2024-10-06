import React from 'react';

const ImagePreview = ({ preview, backgroundColor, imageRef, cropDimensions }) => {
  // Default dimensions if cropDimensions is undefined
  const defaultWidth = 200;
  const defaultHeight = 200;

  // Convert mm to pixels (assuming 96 DPI for web display)
  const pxPerMm = 96 / 25.4;
  const width = cropDimensions ? Math.round(cropDimensions.width * pxPerMm) : defaultWidth;
  const height = cropDimensions ? Math.round(cropDimensions.height * pxPerMm) : defaultHeight;

  return (
    <div className="w-full h-full flex items-center justify-center">
      <div 
        className="rounded-lg overflow-hidden"
        style={{ 
          backgroundColor,
          width: `${width}px`,
          height: `${height}px`,
          maxWidth: '100%',
          maxHeight: '100%'
        }}
      >
        {preview && (
          <img 
            ref={imageRef}
            src={preview} 
            alt="Image preview" 
            className="w-full h-full object-cover"
          />
        )}
      </div>
    </div>
  );
};

export default ImagePreview;
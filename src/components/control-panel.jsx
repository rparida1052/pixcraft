import React from 'react'
import { Button } from '@/components/ui/button';

const ControlPanel = ({ 
  onRemoveBackground, 
  isFileSelected, 
  onColorChange, 
  backgroundColor,
  onCropDimensionsChange,
  cropDimensions,
  onCropImage,
  onPrint,
  isCropped,
  numCopies,
  onNumCopiesChange,
  addBorder,
  onAddBorderChange
}) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold mb-6 text-gray-800">
        Control Panel
      </h2>
      <div className="space-y-6">
        <Button
          onClick={onRemoveBackground}
          disabled={!isFileSelected}
          className="w-full bg-green-500 hover:bg-green-600">
          Remove Background
        </Button>
        <div>
          <label
            htmlFor="colorPicker"
            className="block text-sm font-medium text-gray-700 mb-2">
            Choose Background Color:
          </label>
          <input
            type="color"
            id="colorPicker"
            value={backgroundColor}
            onChange={(e) => onColorChange(e.target.value)}
            className="w-full h-10 cursor-pointer rounded"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Crop Dimensions (mm):
          </label>
          <div className="flex space-x-2">
            <input
              type="number"
              value={cropDimensions.width}
              onChange={(e) =>
                onCropDimensionsChange({
                  ...cropDimensions,
                  width: Number(e.target.value),
                })
              }
              className="w-1/2 px-3 py-2 border rounded"
              placeholder="Width"
            />
            <input
              type="number"
              value={cropDimensions.height}
              onChange={(e) =>
                onCropDimensionsChange({
                  ...cropDimensions,
                  height: Number(e.target.value),
                })
              }
              className="w-1/2 px-3 py-2 border rounded"
              placeholder="Height"
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Number of Copies:
          </label>
          <input
            type="number"
            value={numCopies}
            onChange={(e) => onNumCopiesChange(Number(e.target.value))}
            className="w-full px-3 py-2 border rounded"
            min="1"
            placeholder="Number of Copies"
          />
        </div>
        <div className="flex items-center">
          <input
            type="checkbox"
            checked={addBorder}
            onChange={(e) => onAddBorderChange(e.target.checked)}
            className="mr-2"
          />
          <label className="text-sm font-medium text-gray-700">
            Add Black Border
          </label>
        </div>
        <Button
          onClick={onCropImage}
          disabled={!isFileSelected}
          className="w-full bg-blue-500 hover:bg-blue-600">
          Crop Image
        </Button>
        <Button
          onClick={onPrint}
          disabled={!isFileSelected || !isCropped}
          className="w-full bg-purple-500 hover:bg-purple-600">
          Print Image
        </Button>
        <p className="text-sm text-gray-500 mt-2">
          Note: To print without headers and footer please disable them in
          your browser's print settings.
        </p>
      </div>
    </div>
  );
}

export default ControlPanel
"use client"
import ControlPanel from '@/components/control-panel'
import ImagePreview from '@/components/image-preview'
import axios from 'axios';
import React from 'react'
import { useState, useCallback, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';

const Dashboard = () => {
  const [selectedFile, setSelectedFile] = useState(null)
  const [preview, setPreview] = useState(null)
  const [status, setStatus] = useState("")
  const [backgroundColor, setBackgroundColor] = useState("#ffffff") // Default white
  const [cropDimensions, setCropDimensions] = useState({ width: 35, height: 45 }) // Default passport size in mm
  const [isCropped, setIsCropped] = useState(false); // New state to track cropping
  const [numCopies, setNumCopies] = useState(1); // New state to track number of copies
  const [addBorder, setAddBorder] = useState(false); // New state to track border addition
  const imageRef = useRef(null)
  const printFrameRef = useRef(null);
  const canvasRef = useRef(null);

  useEffect(() => {
    // Create a hidden iframe for printing
    const iframe = document.createElement('iframe');
    iframe.style.display = 'none';
    document.body.appendChild(iframe);
    printFrameRef.current = iframe;

    return () => {
      document.body.removeChild(iframe);
    };
  }, []);

  const fileChange = (e) =>{
    const file = e.target.files[0];
    console.log(file)
    setSelectedFile(file)
    setPreview(URL.createObjectURL(file))
    setIsCropped(false); // Reset cropping state when a new file is selected
  }

  const handleUpload = async (e) => {
    
    e.preventDefault();
    if (!selectedFile) {
      setStatus("Please select a file first.");
      return;
    }

    setStatus("Removing background...");

    const formData = new FormData();
    formData.append('image_file', selectedFile);
    formData.append('size', 'auto');

    try {
      const response = await axios({
        method: "post",
        url: "https://api.remove.bg/v1.0/removebg",
        data: formData,
        responseType: "arraybuffer",
        headers: {
          "X-Api-Key": NEXT_REMOVE_BG_API_KEY,
        },
      });

      const base64Image = Buffer.from(response.data, 'binary').toString('base64');
      setPreview(`data:image/png;base64,${base64Image}`);
      setStatus("Background removed. Choose a new background or download.");
    } catch (error) {
      console.error("Error removing background:", error);
      setStatus("Error removing background. Please try again.");
    }
  }

  const handleRemoveBackground = async () => {
    if (!selectedFile) {
      setStatus("Please select a file first.");
      return;
    }

    setStatus("Removing background...");

    const formData = new FormData();
    formData.append('image_file', selectedFile);
    formData.append('size', 'auto');

    try {
      const response = await axios({
        method: 'post',
        url: 'https://api.remove.bg/v1.0/removebg',
        data: formData,
        responseType: 'arraybuffer',
        headers: {
          'X-Api-Key': 'B74bHZqRnxBzA6jobJpizaPM',
        },
      });

      const base64Image = Buffer.from(response.data, 'binary').toString('base64');
      setPreview(`data:image/png;base64,${base64Image}`);
      setStatus("Background removed. Choose a new background or download.");
    } catch (error) {
      console.error("Error removing background:", error);
      setStatus("Error removing background. Please try again.");
    }
  }

  const handleColorChange = useCallback((color) => {
    setBackgroundColor(color);
  }, []);

  const handleCropDimensionsChange = useCallback((dimensions) => {
    setCropDimensions(dimensions);
  }, []);

  const handleNumCopiesChange = useCallback((copies) => {
    setNumCopies(copies);
  }, []);

  const handleAddBorderChange = useCallback((checked) => {
    setAddBorder(checked);
  }, []);

  const handleCropImage = useCallback(() => {
    if (!imageRef.current) return;

    const canvas = document.createElement('canvas');
    canvasRef.current = canvas;
    const ctx = canvas.getContext('2d');

    // Convert mm to pixels (assuming 300 DPI)
    const pxPerMm = 300 / 25.4;
    const width = Math.round(cropDimensions.width * pxPerMm);
    const height = Math.round(cropDimensions.height * pxPerMm);

    canvas.width = width;
    canvas.height = height;

    // Fill canvas with selected background color
    ctx.fillStyle = backgroundColor;
    ctx.fillRect(0, 0, width, height);

    // Calculate scaling and positioning to fit and center the image
    const imgAspect = imageRef.current.naturalWidth / imageRef.current.naturalHeight;
    const canvasAspect = width / height;
    let drawWidth, drawHeight, xOffset, yOffset;

    if (imgAspect > canvasAspect) {
      drawHeight = height;
      drawWidth = height * imgAspect;
      xOffset = (width - drawWidth) / 2;
      yOffset = 0;
    } else {
      drawWidth = width;
      drawHeight = width / imgAspect;
      xOffset = 0;
      yOffset = (height - drawHeight) / 2;
    }

    ctx.drawImage(imageRef.current, xOffset, yOffset, drawWidth, drawHeight);

    // Convert canvas to data URL and set as new preview
    const croppedImageDataUrl = canvas.toDataURL('image/png');
    setPreview(croppedImageDataUrl);
    setIsCropped(true); // Set cropping state to true
  }, [cropDimensions, backgroundColor]);

  const handlePrint = useCallback(() => {
    if (!canvasRef.current) {
      alert('Please crop the image before printing.');
      return;
    }

    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      alert('Please allow pop-ups for this website to use the print functionality.');
      return;
    }

    const gap = 5; // Gap in mm between images
    const borderStyle = addBorder ? 'border: 1mm solid black;' : ''; // Add border if checked
    const printContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Print Image</title>
          <style>
            body { margin: 0; display: flex; flex-wrap: wrap; }
            img { width: ${cropDimensions.width}mm; height: ${cropDimensions.height}mm; margin: ${gap / 2}mm; ${borderStyle} }
          </style>
        </head>
        <body>
          ${Array(numCopies).fill(`<img src="${canvasRef.current.toDataURL('image/png')}" />`).join('')}
        </body>
      </html>
    `;

    printWindow.document.write(printContent);
    printWindow.document.close();

    printWindow.onload = () => {
      printWindow.focus();
      printWindow.print();
      printWindow.onafterprint = () => printWindow.close();
    };
  }, [cropDimensions, numCopies, addBorder]);

  return (
    <div className="min-h-screen bg-white p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-gray-800">PixCraft</h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2 bg-gray-100 rounded-lg p-4">
            {!preview && (
              <div className="h-96 flex items-center justify-center border-2 border-dashed border-gray-300 rounded-lg">
                <input
                  type="file"
                  accept="image/*"
                  onChange={fileChange}
                  className="hidden"
                  id="fileInput"
                />
                <label
                  htmlFor="fileInput"
                  className="cursor-pointer bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition">
                  Select an Image
                </label>
              </div>
            )}
            {preview && (
              <div className="h-96">
                <ImagePreview
                  preview={preview}
                  backgroundColor={backgroundColor}
                  imageRef={imageRef}
                  cropDimensions={cropDimensions}
                />
              </div>
            )}
          </div>
          <div>
            <ControlPanel
              onRemoveBackground={handleRemoveBackground}
              isFileSelected={!!selectedFile}
              onColorChange={handleColorChange}
              backgroundColor={backgroundColor}
              onCropDimensionsChange={handleCropDimensionsChange}
              cropDimensions={cropDimensions}
              onCropImage={handleCropImage}
              onPrint={handlePrint}
              isCropped={isCropped} // Pass the isCropped state
              numCopies={numCopies} // Pass the number of copies
              onNumCopiesChange={handleNumCopiesChange} // Pass the function to change number of copies
              addBorder={addBorder} // Pass the addBorder state
              onAddBorderChange={handleAddBorderChange} // Pass the function to change border state
            />
          </div>
        </div>
        {status && (
          <div className="mt-4 p-4 bg-blue-100 text-blue-800 rounded">
            {status}
          </div>
        )}
        <div className='flex items-center justify-center mt-5'>Made by Rahul Parida</div>
      </div>
    </div>
  );
}

export default Dashboard
import React, { useState, useRef } from 'react';
import Quagga from 'quagga';

const BarcodeScanner = ({ onDetected }) => {
  const [isScanning, setIsScanning] = useState(false);
  const videoRef = useRef();

  const startScanner = () => {
    setIsScanning(true);
    Quagga.init({
      inputStream: {
        name: 'Live',
        type: 'LiveStream',
        target: videoRef.current,
        constraints: {
          width: 480,
          height: 320,
          facingMode: 'environment', // Kamera modunu belirleyebilirsiniz
        },
      },
      decoder: {
        readers: ['ean_reader'], // Okunacak barkod türünü belirleyebilirsiniz
      },
    }, (err) => {
      if (err) {
        console.error('Error initializing Quagga:', err);
        return;
      }
      Quagga.start();
    });

    Quagga.onDetected((data) => {
      onDetected(data.codeResult.code);
      setIsScanning(false);
      Quagga.stop();
    });
  };

  const stopScanner = () => {
    setIsScanning(false);
    Quagga.stop();
  };

  return (
    <div>
      {isScanning ? (
        <div>
          <video ref={videoRef} />
          <button onClick={stopScanner}>Stop Scanning</button>
        </div>
      ) : (
        <button onClick={startScanner}>Start Scanning</button>
      )}
    </div>
  );
};

export default BarcodeScanner;
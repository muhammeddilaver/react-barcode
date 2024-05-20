import React, { useEffect, useRef, useState } from 'react';
import Quagga from 'quagga';

const BarcodeScanner = () => {
  const [scannedCode, setScannedCode] = useState(null);
  const videoRef = useRef(null);

  useEffect(() => {
    Quagga.init({
      inputStream: {
        type: 'LiveStream',
        target: videoRef.current, // Or '#yourElement' (optional)
        constraints: {
          width: 640,
          height: 480,
          facingMode: 'environment' // or user for the front camera
        },
      },
      locator: {
        patchSize: 'medium', // x-small, small, medium, large, x-large
        halfSample: true,
      },
      decoder: {
        readers: [
          'code_39_reader',
          'code_128_reader',
          'ean_reader',
          'ean_8_reader',
        ],
      },
      locate: true,
      debug: {
        drawBoundingBox: true,
        showFrequency: true,
        drawScanline: true,
        showPattern: true
      }
    }, (err) => {
    if (err) {
      console.error(err);
      return;
    }
    Quagga.start();
  });

  Quagga.onDetected((data) => {
    if (data.codeResult.code.toString().length() === 13) {
      setScannedCode(data.codeResult.code);
    }
    //Quagga.stop();
  });

  return () => {
    Quagga.offDetected();
    //Quagga.stop();
  };
}, []);

return (
  <div>
    {scannedCode && <div>Scanned Code: {scannedCode}</div>}
    <div ref={videoRef} style={{ width: '100%', height: 'auto' }}></div>
  </div>
);
};

export default BarcodeScanner;

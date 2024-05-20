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
      decoder: {
        readers: ['code_128_reader', 'ean_reader', 'ean_8_reader', 'code_39_reader', 'code_39_vin_reader', 'upc_reader', 'upc_e_reader', 'i2of5_reader'],
      },
    }, (err) => {
      if (err) {
        console.error(err);
        return;
      }
      Quagga.start();
    });

    Quagga.onDetected((data) => {
      setScannedCode(data.codeResult.code);
      Quagga.stop();
    });

    return () => {
      Quagga.offDetected();
      Quagga.stop();
    };
  }, []);

  return (
    <div>
      <div ref={videoRef} style={{ width: '100%', height: 'auto' }}></div>
      {scannedCode && <div>Scanned Code: {scannedCode}</div>}
    </div>
  );
};

export default BarcodeScanner;

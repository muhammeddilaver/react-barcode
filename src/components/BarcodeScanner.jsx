import React, { useRef, useEffect } from 'react';
import Quagga from 'quagga';

const BarcodeScanner = () => {
  const videoRef = useRef();

  useEffect(() => {
    const initCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      } catch (err) {
        console.error('Error accessing the camera:', err);
      }
    };

    initCamera();

    Quagga.init({
      inputStream: {
        name: 'Live',
        type: 'LiveStream',
        target: videoRef.current,
        constraints: {
          width: 640,
          height: 480,
          facingMode: 'environment', // or 'user' for front camera
        },
      },
      locator: {
        patchSize: 'medium',
        halfSample: true,
      },
      decoder: {
        readers: ['ean_reader', 'upc_reader', 'code_128_reader', 'code_39_reader', 'code_39_vin_reader', 'codabar_reader', 'qr_reader', 'code_93_reader'],
      },
      numOfWorkers: navigator.hardwareConcurrency || 4,
      locate: true,
    }, (err) => {
      if (err) {
        console.error('Error initializing Quagga:', err);
        return;
      }
      Quagga.start();
    });

    return () => {
      Quagga.stop();
    };
  }, []);

  return (
    <div>
      <video ref={videoRef} width="100%" height="auto" playsInline />
    </div>
  );
};

export default BarcodeScanner;
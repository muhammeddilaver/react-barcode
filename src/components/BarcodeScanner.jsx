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

    Quagga.onProcessed((result) => {
      if (result) {
        const drawingCtx = Quagga.canvas.ctx.overlay;
        const drawingCanvas = Quagga.canvas.dom.overlay;

        if (result.boxes) {
          drawingCtx.clearRect(0, 0, drawingCanvas.width, drawingCanvas.height);
          result.boxes.filter(box => box !== result.box)
            .forEach(box => {
              Quagga.ImageDebug.drawPath(box, { x: 0, y: 1 }, drawingCtx, { color: 'green', lineWidth: 2 });
            });
        }

        if (result.box) {
          Quagga.ImageDebug.drawPath(result.box, { x: 0, y: 1 }, drawingCtx, { color: 'blue', lineWidth: 2 });
        }

        if (result.codeResult && result.codeResult.code) {
          drawingCtx.font = "24px Arial";
          drawingCtx.fillStyle = "red";
          drawingCtx.fillText(result.codeResult.code, 10, 20);
        }
      }
    });

    Quagga.onDetected((data) => {
      const code = data.codeResult.code;
      const accuracy = data.codeResult.decodedCodes
        .filter(decoded => decoded.error !== undefined)
        .reduce((sum, decoded) => sum + decoded.error, 0) / data.codeResult.decodedCodes.length;

      // Adjust the accuracy threshold as needed
      if (accuracy < 0.15) {
        if (code.toString().length === 13) {
          setScannedCode(code);
        }
        //Quagga.stop();
      }
      //Quagga.stop();
    });

    return () => {
      //Quagga.offDetected();
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

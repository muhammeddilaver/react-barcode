import React, { useEffect, useRef, useState } from 'react';
import { BrowserMultiFormatReader, NotFoundException } from '@zxing/library';

const BarcodeScanner = () => {
  const [scannedCode, setScannedCode] = useState(null);
  const videoRef = useRef(null);

  useEffect(() => {
    const codeReader = new BrowserMultiFormatReader();
    codeReader
      .listVideoInputDevices()
      .then(videoInputDevices => {
        const firstDeviceId = videoInputDevices[0].deviceId;
        codeReader
          .decodeFromVideoDevice(firstDeviceId, videoRef.current, (result, err) => {
            if (result) {
              setScannedCode(result.getText());
            }
            if (err && !(err instanceof NotFoundException)) {
              console.error(err);
            }
          })
          .catch(err => {
            console.error(err);
          });
      })
      .catch(err => {
        console.error(err);
      });

    return () => {
      codeReader.reset();
    };
  }, []);

  return (
    <div>
      {scannedCode && <div>Scanned Code: {scannedCode}</div>}
      <video ref={videoRef} style={{ width: '100%', height: 'auto' }}></video>
    </div>
  );
};

export default BarcodeScanner;
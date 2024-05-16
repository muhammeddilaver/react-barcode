import React, { useState } from 'react';
import BarcodeScanner from './components/BarcodeScanner';

const App = () => {
  const [barcode, setBarcode] = useState(null);

  const handleBarcodeDetected = (barcode) => {
    setBarcode(barcode);
  };

  return (
    <div>
      <h1>Barcode Scanner</h1>
      <BarcodeScanner onDetected={handleBarcodeDetected} />
      {barcode && <p>Detected Barcode: {barcode}</p>}
    </div>
  );
};

export default App;

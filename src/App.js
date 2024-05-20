import React from 'react';
import './App.css';
import BarcodeScanner from './components/BarcodeScanner';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>Barcode Scanner</h1>
        <BarcodeScanner />
      </header>
    </div>
  );
}

export default App;

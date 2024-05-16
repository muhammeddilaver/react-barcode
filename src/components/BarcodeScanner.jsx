import React, { useEffect, useRef } from 'react';
import Quagga from 'quagga';

const BarcodeScanner = ({ onDetected }) => {
    const videoRef = useRef();

    useEffect(() => {
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
            Quagga.stop();
        });

        return () => {
            Quagga.stop();
        };
    }, [onDetected]);

    return <video ref={videoRef} />;
};

export default BarcodeScanner;
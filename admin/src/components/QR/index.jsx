import React, {useRef} from 'react';
import {QRCodeSVG} from 'qrcode.react';

import html2canvas from "html2canvas";


const Index = ({ qrValue, tableNumber, restaurantName }) => {
    const qrCardRef = useRef();

    const downloadQRCode = () => {
        html2canvas(qrCardRef.current).then((canvas) => {
            const image = canvas.toDataURL('image/png', 1.0);
            const downloadLink = document.createElement('a');
            downloadLink.download = `${restaurantName.replace(/\s+/g, '_')}_Table_${tableNumber}.png`;
            downloadLink.href = image;
            downloadLink.click();
        });
    };

    const url =`https://muhammedtarikucar.com/`
    return (
        <>
            <div ref={qrCardRef} className="flex justify-center items-center rounded-2xl shadow-2xl">
                <div className="overflow-hidden shadow-lg rounded-2xl h-90 w-64 md:w-80 bg-white p-5">
                    <div className="w-full block h-full">
                        <div className="bg-yellow-400 w-full h-20 rounded-t-lg flex justify-center items-center">
                            <p className="text-white text-md font-bold">
                                West room U1 table
                            </p>
                        </div>
                        <div className="w-full h-full flex justify-center items-center ">
                            <QRCodeSVG
                                id={`qr-code-${tableNumber}`}
                                value={url}
                                size={196}
                                level={"H"}
                                includeMargin={true}
                                bgColor={"#FBF6EE"}
                                fgColor={"#191919"}
                                className="p-2"
                            />
                        </div>
                        <div className="flex flex-col justify-between  leading-normal">
                            <p className="mb-4 text-center font-bold text-lg">Order here</p>
                            <p className="text-center text-gray-700 text-base mb-4">
                                Scan the QR code with your mobile phone
                            </p>
                            <p className="text-center text-xs text-gray-500 mt-4">
                                Powered by upmenu
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <button
                onClick={downloadQRCode}
                className="mt-4 bg-indigo-600 text-white active:bg-indigo-700 w-full font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none ease-linear transition-all duration-150"
            >
                Download QR Code
            </button>

        </>
    );
};
export default Index;


/*

<QRCodeSVG
                id={`qr-code-${tableNumber}`}
                value={qrValue}
                size={196}
                level={"H"}
                includeMargin={true}
                bgColor={"#FFB534"}
                fgColor={"#FBF6EE"}
                className="mb-4"
            />
const downloadCode = () => {
        const canvas = document.getElementById(`qr-code-${keyProp}`);
        if (canvas) {
            const pngUrl = canvas.toDataURL("image/png").replace("image/png", "image/octet-stream");
            let downloadLink = document.createElement("a");
            downloadLink.href = pngUrl;
            downloadLink.download = `qr-code-${keyProp}.png`;
            document.body.appendChild(downloadLink);
            downloadLink.click();
            document.body.removeChild(downloadLink);
        }
    }

    const  url = `http://localhost:5173/${link}`
    return (
        <div className={"h-fit flex flex-col items-center justify-center"}>
            <div style={{ width: '256px', height: '256px' }}>
                <QRCode
                    value={url}
                    size={1024}
                    logoImage="https://muhammedtarikucar.com/logo.png"
                    logoWidth={64}
                    logoHeight={64}
                    logoOpacity={1}
                    enableCORS={true}
                    qrStyle="dots"
                    eyeRadius={10}
                    level={"Q"}
                    id={`qr-code-${1}`}
                    includeMargin={true}
                    style={{ transform: 'scale(0.25000)', transformOrigin: '0 0' }} // 48/512 = 0.09375
                />
                // TODO Menu Adını veya masa numarasını qr kodun altına yazmak,

            </div>
            <Button className={"border-2 border:bg-indigo-500 p-2 rounded hover:text-white hover:bg-indigo-500 ease-in-out duration-300"} onClick={downloadCode}>
                Download Code
            </Button>
        </div>
    );
}*/


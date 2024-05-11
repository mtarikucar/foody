import React from 'react';
import { motion } from 'framer-motion';
import { TwitterPicker } from 'react-color';

const ColorPickerComponent = ({ color, setColor }) => {
    // Renk seçimi yapıldığında çalışacak fonksiyon
    const handleChange = (color) => {
        setColor(color.hex);
    };

    // Renk tonunun aydınlığını kontrol eden fonksiyon
    const isColorLight = (color) => {
        const hex = color.replace("#", "");
        const r = parseInt(hex.substr(0, 2), 16);
        const g = parseInt(hex.substr(2, 2), 16);
        const b = parseInt(hex.substr(4, 2), 16);
        const brightness = (r * 299 + g * 587 + b * 114) / 1000;
        return brightness > 155;
    };

    // Renk tonuna göre yazı rengini ayarlayan fonksiyon
    const textColor = isColorLight(color) ? 'black' : 'white';

    return (
        <motion.div
            initial={{ backgroundColor: "#ffffff" }}
            animate={{ backgroundColor: color }}
            transition={{ duration: 0.5 }}
            style={{ backgroundColor: color, color: textColor }}
            className="rounded p-4"
        >
            <div className='py-4'>
                Menün için bir tema rengi seç
            </div>
            <TwitterPicker
                color={color}
                onChangeComplete={handleChange}
                triangle="hide"
            />
        </motion.div>
    );
};

export default ColorPickerComponent;

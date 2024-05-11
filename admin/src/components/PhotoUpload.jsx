import React, {useRef, useState} from 'react';
import uploadFileToFirebase from "../views/firebase/uploadFileToFirebase";
import ParticleAnimation from "./ParticleAnimation";
import {motion} from "framer-motion";
import {BsFileArrowDown} from "react-icons/bs";

const PhotoUploadComponent = ({onFileDataChange, multiImage = false, size = 32}) => {
    const [images, setImages] = useState([]);
    const [uploadProgress, setUploadProgress] = useState({});
    const fileInputRef = useRef();
    const updateImages = (files) => {
        return multiImage ? [...images, ...files] : [files[0]];
    };

    const sizeClasses = `w-${size} h-${size} `;

    const handleChange = async e => {
        const files = Array.from(e.target.files);
        const newImages = updateImages(files);

        setImages(newImages);
        await Promise.all(newImages.map(file => handleFileUpload(file)));
    };

    const handleFileUpload = async (file) => {
        setUploadProgress(prevProgress => ({...prevProgress, [file.name]: 0}));
        const url = await uploadFileToFirebase(file, (progress) => {
            setUploadProgress(prevProgress => ({...prevProgress, [file.name]: progress}));
        });
        if (url) {
            onFileDataChange(url);
        }
    };

    const renderImages = () => {

        return images.map((imageUrl, index) => (<div key={index} className="image-container">
            {uploadProgress[imageUrl.name] < 100 && uploadProgress[imageUrl.name] > 0 ? (<motion.div
                initial={{opacity: 0}}
                animate={{opacity: 1}}
                exit={{opacity: 0}}
                className="upload-progress-container"
            >
                <div className="particles-background">
                </div>
                <div className={`progress-text ${sizeClasses} relative`}>
                    <ParticleAnimation/>
                    <div className={'absolute top-0 h-full w-full flex justify-center items-center font-bold'}>
                        {uploadProgress[imageUrl?.name]}%
                    </div>
                </div>
            </motion.div>) : (<img
                src={URL.createObjectURL(imageUrl)}
                alt="Uploaded"
                className={` rounded-full ${sizeClasses} object-cover`}
            />)}

        </div>));
    };

    return (<div className="photo-upload-component p-2 flex justify-center items-center flex-col">
        <div
            className={`photo-upload-preview flex flex-col border-2 rounded-full drop-shadow-lg border-spacing-2 border-indigo-400 p-2 ease-in-out duration-300`}
            onClick={() => fileInputRef.current.click()}
        >
            {images.length > 0 ? <>
                {renderImages()}
            </> : (<button className={`photo-placeholder border-2 bg-rose-400 rounded-full bg-white `}>
               <BsFileArrowDown className={"h-16 w-16 m-4"}/>

            </button>)}
        </div>

        <input
            ref={fileInputRef}
            type="file"
            onChange={handleChange}
            multiple={multiImage}
            style={{display: 'none'}}
        />
    </div>);
};

export default PhotoUploadComponent;

import { storage } from './firebase'; // Import storage from your Firebase configuration file
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';

// Function to upload a file to Firebase Storage and get the URL of the uploaded file


const uploadFileToFirebase = async (file, onProgress) => {
    if (!file) return null;

    const fileRef = ref(storage, `images/${file.name}-${Date.now()}`);

    try {
        const uploadTask = uploadBytesResumable(fileRef, file);

        return new Promise((resolve, reject) => {
            uploadTask.on('state_changed',
                (snapshot) => {
                    const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                    if (typeof onProgress === 'function') {
                        onProgress(Math.floor(progress));
                    }
                },
                (error) => {
                    console.error('Firebase file upload error:', error);
                    reject(error);
                },
                async () => {
                    try {
                        const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
                        resolve(downloadURL);
                    } catch (error) {
                        console.error('Error getting download URL:', error);
                        reject(error);
                    }
                }
            );
        });
    } catch (error) {
        console.error('Firebase file upload error:', error);
        return null;
    }
};


/*const uploadFileToFirebase = async (file, onProgress) => {
    if (!file) return null;

    const fileRef = ref(storage, `images/${file.name}-${Date.now()}`);

    try {
        const uploadTask = uploadBytesResumable(fileRef, file);

        return new Promise((resolve, reject) => {
            uploadTask.on('state_changed',
                (snapshot) => {
                    const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                    onProgress(Math.floor(progress));
                },
                (error) => {
                    console.error('Firebase file upload error:', error);
                    reject(error);
                },
                async () => {
                    try {
                        const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
                        resolve(downloadURL);
                    } catch (error) {
                        console.error('Error getting download URL:', error);
                        reject(error);
                    }
                }
            );
        });
    } catch (error) {
        console.error('Firebase file upload error:', error);
        return null;
    }
};*/


export default uploadFileToFirebase;

import React, {useState} from 'react';
import {useMutation} from 'react-query';

import Modal from "../../../../components/modal";
import axios from "../../../../api/axios";

const MailFbModal = ({isOpen, onClose, email}) => {
    const [emailValue, setEmailValue] = useState(email);

    const mutation = useMutation(data => axios.post(`/sendOtp?email=${data.email}`), {
        onSuccess: () => {
            window.location.href = "https://mail.google.com";
        },

    });

    const handleChange = (e) => {
        setEmailValue(e.target.value);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        mutation.mutate({email: emailValue});
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} size="extraLarge"
               title="Şifreni mi unuttun" className="rounded-lg shadow-lg">
            <div>
                <p className="text-sm text-gray-500">
                    Şifreni sıfırlamak için email adresini gir.
                </p>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
                <input
                    type="email"
                    value={emailValue}
                    onChange={handleChange}
                    className="w-full p-2 border rounded"
                />
                <button type="submit" className="w-full p-2 bg-indigo-500 text-white rounded">
                    Gönder
                </button>
            </form>
        </Modal>
    );
};

export default MailFbModal;

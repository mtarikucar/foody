import React, {useState} from 'react';
import nft1 from '../../../../assets/img/nfts/NftBanner1.png';
import {useMutation, useQueryClient} from 'react-query';
import useAxiosPrivate from '../../../../hooks/useAxiosPrivate';
import {toast} from 'react-toastify';
import {motion} from 'framer-motion';
import useAuth from "../../../../hooks/useAuth";
import ColorPickerComponent from "../../../../components/ColorPickerComponent";

const variants = {
    open: {opacity: 1, height: "auto", display: "block"},
    closed: {opacity: 0, height: 0, display: "none"}
};

const Banner1 = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [color, setColor] = useState('#4B0082');

    const auth = useAuth();

    const axiosPrivate = useAxiosPrivate();
    const queryClient = useQueryClient();

    const addMenuMutation = useMutation(
        (menuData) => axiosPrivate.post('/menu', menuData),
        {
            onSuccess: () => {
                setIsOpen(false);
                queryClient.invalidateQueries("menus");
                toast.info("yeni menu olusturuldu");
            },
            onError: (error) => {
                toast.error("birseyler yanlis gitti");
            },
        }
    );

    const handleSubmit = async (event) => {
        event.preventDefault();
        const formData = new FormData(event.target);
        const menuData = {
            menuName: formData.get('menuName'),
            color: color,
            companyId: auth.companyId
        };
        addMenuMutation.mutate(menuData);
    };


    return (

        <div className="flex w-full flex-col rounded-2xl bg-cover px-8 py-8 md:px-16 md:py-14"
             style={{ backgroundImage: `url(${nft1})` }}>
            <div className="w-full " >
                <motion.div
                    initial={false}
                    animate={isOpen ? "open" : "closed"}
                    variants={variants}
                    transition={{duration: 0.5}}
                >
                     <div>
                        <form onSubmit={handleSubmit} className="space-y-4 md:w-1/3 ">
                            <input name="menuName" type="text" placeholder="Menu Name"
                                   className="w-full rounded-md p-2 text-black" required/>
                            <ColorPickerComponent color={color} setColor={setColor}/>
                            <button type="submit"
                                    className="w-full text-white rounded-md  px-4 py-2 text-center font-medium backdrop-blur-md hover:-translate-y-1 ease-in-out duration-300 border shadow-md">
                                Submit
                            </button>
                        </form>

                    </div>
                </motion.div>
                <div className="flex justify-between items-center text-white">
                    <p>Yeni bir menü eklemek ister misiniz?</p>
                    <button
                        onClick={() => setIsOpen(!isOpen)}
                        className={`transform transition-transform ${isOpen ? 'rotate-180' : ''}`}>
                        <svg className='h-6 w-6' xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                             strokeWidth="1.5" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round"
                                  d="M19.5 13.5L12 21m0 0l-7.5-7.5M12 21V3"/>
                        </svg>
                    </button>
                </div>
            </div>
        </div>

    );
};

export default Banner1;

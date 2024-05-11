import React from 'react'
import { AiOutlineHome } from 'react-icons/Ai';
import { BsBasket } from 'react-icons/Bs';
import { BiUser } from 'react-icons/Bi';


import { Link } from 'react-router-dom';
function NavigationBar({ setIsMenuActive, isMenuActive }) {
    return (
        <div className='fixed inset-x-0 bottom-0 z-50  w-full'>


            <div className=" flex items-center justify-center w-full ">
                <div className="w-full max-w-md mx-auto">

                    <div className="px-7 bg-white shadow-lg rounded-t-3xl">
                        <div className="flex">
                            <div className="flex-1 group">
                                <a 
                                onClick={()=> setIsMenuActive(false)} 
                                href="#" className="flex items-end justify-center text-center mx-auto px-4 pt-2 w-full text-black group-hover:text-rose-500 ease-in duration-300">
                                    <span className="block px-1 pt-1 pb-1">
                                    <AiOutlineHome className="  inline-block  text-xl" />
                                        <span className="block text-xs pb-2">Home</span>
                                        <span className="block w-5 mx-auto h-1 group-hover:bg-rose-500 rounded-full"></span>
                                    </span>
                                </a>
                            </div>
                            <div className="flex-1 group">
                                <a href="#" className="flex items-end justify-center text-center mx-auto px-4 pt-2 w-full text-black group-hover:text-rose-500 ease-in duration-300">
                                    <span className="block px-1 pt-1 pb-1">
                                    <BsBasket onClick={() => setIsMenuActive(!isMenuActive)}
                                            className=" inline-block text-xl" />
                                        <span className="block text-xs pb-2">Basket</span>
                                        <span className="block w-5 mx-auto h-1 group-hover:bg-rose-500 rounded-full"></span>
                                    </span>
                                </a>
                            </div>
                            
                            <div className="flex-1 group">
                                <a
                                onClick={()=> setIsMenuActive(false)} 
                                href="#" className="flex items-end justify-center text-center mx-auto px-4 pt-2 w-full text-black group-hover:text-rose-500 ease-in duration-300">
                                    <span className="block px-1 pt-1 pb-1">
                                    <BiUser className="inline-block  text-xl" />
                                        <span className="block text-xs pb-2">Users</span>
                                        <span className="block w-5 mx-auto h-1 group-hover:bg-rose-500 rounded-full"></span>
                                    </span>
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>


        </div >
    )
}

export default NavigationBar
import { useState } from 'react'
import { HiOutlinePlus, HiOutlineMinus } from 'react-icons/Hi';
import { FiDelete } from 'react-icons/Fi';

function CartDrawer() {
    const [piece, setPiece] = useState(0)
    return (
        <div>

            <div className='bg-white shadow border my-3 rounded-md  '>

                <div className='flex flex-row justify-between items-center w-full p-3 '>
                    <div>
                        <img className="w-14 h-14 rounded" src='https://images.pexels.com/photos/1639557/pexels-photo-1639557.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1' alt="Rounded avatar" />

                    </div>
                    <div className='flex flex-col'>
                        <div className=''>
                            <p className='text-lg'>Çiz Burger</p>
                        </div>
                        <div className='flex flex-row justify-between '>
                            <div className='text-rose-500'>
                                <p>X4</p>
                            </div>
                            <div>
                                <p>$7.99</p>
                            </div>
                        </div>
                    </div>
                    <div>
                        <div className='flex justify-start items-center py-5 text-xl gap-2'>
                            <button
                                type='button'
                                onClick={() => { setPiece(piece - 1) }}
                                className='flex items-center justify-center text-white bg-rose-500 rounded-full h-5 w-5'><HiOutlineMinus /></button>
                            <p className='text-sm'>{piece}</p>
                            <button
                                onClick={() => { setPiece(piece + 1) }}
                                type='button'
                                className='flex items-center justify-center text-white bg-rose-500 rounded-full h-5 w-5'><HiOutlinePlus />
                            </button>
                        </div>
                    </div>
                    <div className='flex items-center justify-center' >
                        <button className='text-xl hover:text-rose-500 '>
                            <FiDelete />
                        </button>
                    </div>
                </div>
            </div>



        </div>
    )
}

export default CartDrawer

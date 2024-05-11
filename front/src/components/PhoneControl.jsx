import { useState } from 'react'


import { PhoneInput } from 'react-international-phone';
import 'react-international-phone/style.css';
    function OTPInput() {
        const inputs = document.querySelectorAll('#otp > *[id]');
        for (let i = 0; i < inputs.length; i++) { inputs[i].addEventListener('keydown', function (event) { if (event.key === "Backspace") { inputs[i].value = ''; if (i !== 0) inputs[i - 1].focus(); } else { if (i === inputs.length - 1 && inputs[i].value !== '') { return true; } else if (event.keyCode > 47 && event.keyCode < 58) { inputs[i].value = event.key; if (i !== inputs.length - 1) inputs[i + 1].focus(); event.preventDefault(); } else if (event.keyCode > 64 && event.keyCode < 91) { inputs[i].value = String.fromCharCode(event.keyCode); if (i !== inputs.length - 1) inputs[i + 1].focus(); event.preventDefault(); } } }); }
    } OTPInput();


function PhoneControl() {
    const [showModal, setShowModal] = useState(true);
    const [value, setValue] = useState()
    const [phone, setPhone] = useState('');

    
    return (
        <div>
            <>

                <button
                    className="text-white text-xl flex justify-center items-center"
                    type="button"
                    onClick={() => setShowModal(true)}
                >
                    h
                </button>
                {showModal ? (
                    <>
                        <div
                            className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50  outline-none focus:outline-none"
                        >
                            <div className="relative w-auto my-6 mx-auto max-w-3xl">
                                {/*content*/}
                                <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
                                    {/*header*/}

                                    {/*body*/}
                                    <div className="flex justify-center">
                                        <div
                                            className="block max-w-sm rounded-lg bg-white shadow-lg dark:bg-neutral-700">

                                            <div className=" py-10 px-3">
                                                <div className="container mx-auto">
                                                    <div className="max-w-sm mx-auto md:max-w-lg">
                                                        <div className="w-full flex justify-center items-center text-center ">
                                                            <div className="bg-white h-64 py-3 rounded flex flex-col justify-center items-center">
                                                                <h1 className="text-2xl font-bold">SMS Verification</h1>
                                                                <div className="flex flex-col my-3">
                                                                    <span>Enter the OTP you received at</span>
                                                                    <span className="font-bold">+90******876</span>
                                                                </div>
                                                                <div className='flex items-center justify-center flex-col '>

                                                                    <PhoneInput
                                                                        className='my-3 '
                                                                        placeholder='Enter your Phone number'
                                                                        initialCountry="tr"
                                                                        value={phone}
                                                                        onChange={(phone) => setPhone(phone)}
                                                                    />

                                                                    <span>Enter Your Message</span>
                                                                    <div id="otp" className="flex flex-row justify-center text-center px-2 mt-3 ml-3">
                                                                        <input className="m-2 border h-10 w-10 text-center form-control rounded" type="text" id="first" maxLength="1" />
                                                                        <input className="m-2 border h-10 w-10 text-center form-control rounded" type="text" id="second" maxLength="1" />
                                                                        <input className="m-2 border h-10 w-10 text-center form-control rounded" type="text" id="third" maxLength="1" />
                                                                        <input className="m-2 border h-10 w-10 text-center form-control rounded" type="text" id="fourth" maxLength="1" />
                                                                    </div>
                                                                </div>


                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="flex items-center justify-between mt-3 p-2 border-slate-200 rounded-b">
                                                <button
                                                    className="text-rose-500  hover:bg-rose-500 hover:text-white rounded py-3 background-transparent font-bold uppercase px-6  text-sm outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                                                    type="button"
                                                    onClick={() => setShowModal(false)}
                                                >
                                                    Close
                                                </button>
                                                <button
                                                    className="bg-rose-500 text-white active:bg-rose-600  font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                                                    type="submit"
                                                    onClick={() => setShowModal(false)}
                                                >
                                                    Verify
                                                </button>
                                            </div>


                                        </div>
                                    </div>
                                    {/*footer*/}

                                </div>
                            </div>
                        </div>
                        <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
                    </>
                ) : null}
            </>
        </div>
    )
}

export default PhoneControl
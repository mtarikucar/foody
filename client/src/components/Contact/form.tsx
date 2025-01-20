import {EmptyCartImg} from '../Assets'
import { toast } from 'react-toastify';
import { useState } from 'react';

const Form = () => {
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [message, setMessage] = useState('')
    const [subject, setSubject] = useState('')

    const submitForm = (e:any) => {
        e.preventDefault()
        return toast.info(`${name} Form handling is not implemented yet`, {
            position: 'top-left',
            autoClose: 3000,
            toastId: 'form'
        })
    }
  return (
    <div className="h-full w-full flex items-center flex-col justify-center px-4 bg-primary">
        <img src={EmptyCartImg} alt="not found" className="w-[30%] h-[30%]" />
      <form action="#" className="mb-6 w-full flex itemx-center justify-center gap-y-3 flex-col">
      <div className="mb-6">
          <input
            type="text"
            className="form-control block w-full px-4 py-2  text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-rose-600 focus:outline-none"
            placeholder="Adınız"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div className="mb-6">
          <input
            type="text"
            className="form-control block w-full px-4 py-2  text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-rose-600 focus:outline-none"
            placeholder="E-posta kimliği"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="mb-6">
          <input
            type="text"
            className="form-control block w-full px-4 py-2  text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-rose-600 focus:outline-none"
            placeholder="Konu"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
          />
        </div>
        <div className="mb-6">
          <textarea
            className="form-control block w-full min-h-[25vh] px-4 py-2  text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-rose-600 focus:outline-none"
            placeholder="Mesajınız"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
        </div>
        <button
          type="submit"
          className="text-white bg-rose-600 hover:bg-rose-700 w-full focus:ring-4 focus:text-cartNumBg font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-rose-600 dark:hover:bg-rose-700 focus:outline-none dark:focus:ring-rose-800 block"
            onClick={submitForm}
        >
         Mesaj Gönder
        </button>
      </form>
      <p className="mb-2 cursor-pointer text-sm text-gray-500 dark:text-gray-400">
        <a href="mailto:bentilshadrack72@gmail.com" className="hover:underline">
          bentilshadrack72@gmail.com
        </a>
      </p>
      <p className="text-sm cursor-pointer text-gray-500 dark:text-gray-400">
        <a href="tel:+233556844331" className="hover:underline">
          +
        </a>
      </p>
    </div>
  );
};

export default Form;

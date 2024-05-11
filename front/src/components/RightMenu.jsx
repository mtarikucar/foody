import { useState } from 'react'
import { HiOutlinePlus, HiOutlineMinus } from 'react-icons/Hi';
import { FiDelete } from 'react-icons/Fi';
import CartDrawer from './CartDrawer.jsx';

function RightMenu({ isMenuActive }) {
    const [cart, setCart] = useState(false)

    const [piece, setPiece] = useState(0)

    return (
        <div>
            <div className={isMenuActive ? "rightMenu active" : 'rightMenu'}>
                <div className="debitCardContainer">
                    <div className="debitCard">

                    </div>
                </div>

                {cart ? (
                    <div className="addSomeItem">
                        <img
                            src="https://firebasestorage.googleapis.com/v0/b/food-delivery-37c59.appspot.com/o/Images%2FemptyCart.png?alt=media&token=50b733d4-cdd9-4025-bffe-8efa4066ca24"
                            alt=""
                            className="emptyCart"
                        />
                    </div>
                ) : (
                    <div className="cartCheckOutContianer">
                        <div className="cartContainer">
                            <div className="subMenuContianer">
                                <h3>Seçilen Ürünler</h3>
                            </div>

                            <div className="cartItems">
                                <CartDrawer/>

                            </div>
                        </div>
                        <div className="totalSection mt-16  ">
                            <h3>Total</h3>
                            <p>
                                <span>$ </span> 34
                            </p>
                        </div>
                        <button className="checkOut -mt-11 hover:bg-white hover:text-black">Check Out</button>
                    </div>
                )}
            </div>
        </div>
    )
}

export default RightMenu

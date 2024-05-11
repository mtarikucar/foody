import {useState} from 'react'
import Categories from '../../components/categories/index.jsx'
import Products from '../../components/products/index.jsx'
import {useSelector} from "react-redux";

function ProductsByCategory() {

    const [filter, setFilter] = useState('')
    const menuData = useSelector((state) => state.global.menuData);

    return (
        <div>
            <div className="dishContainer p-3 gap-y-2">
                <Categories setFilter={setFilter} filter={filter}/>
                <div className={"mt-4 "}>
                    <Products filter={filter} menuId={menuData?.menuId}/>
                </div>
            </div>
        </div>
    )
}

export default ProductsByCategory

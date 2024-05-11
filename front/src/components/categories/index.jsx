import Category from "./Category.jsx";
import SubCategory from "./SubCategory.jsx";
import {useSelector} from "react-redux";
import {ChevronRightRounded} from "@mui/icons-material";
import all from "/all.png"

function Index({setFilter, filter}) {
    const categoryData = useSelector((state) => state.global.categoryData);

    return (
        <div className="w-full ">
            <div className=" flex items-center w-auto overflow-x-auto overflow-y-hidden  scrollbar-hide  ">
                <div
                    onClick={() => setFilter('')}
                    className={
                        filter === '' ? "active rowMenuCard" : "rowMenuCard border border-dynamic "
                    }
                >
                    <div className="imgBox">
                        <img className="object-cover" src={all} alt=""/>
                    </div>
                    <h3 className="text-xl">All</h3>
                    <i
                        className={
                            filter === ""
                                ? "loadMenu bg-no-repeat transform rotate-90 "
                                : "loadMenu"
                        }
                    >
                        <ChevronRightRounded className="text-lg"/>
                    </i>
                </div>
                {categoryData && categoryData?.map((category) => (
                    <div key={category.categoryId}>
                        <Category
                            setFilter={setFilter}
                            filter={filter}
                            categoryId={category.categoryId}
                            image={category.image}
                            name={category.name}
                        />
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Index;

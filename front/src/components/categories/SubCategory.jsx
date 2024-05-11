import React from 'react'
import { ChevronRightRounded } from "@mui/icons-material";
function SubCategory() {
    return (
        <div className="subMenuContianer px-2 ">
            <h3>Menu Category</h3>
            <div className="viewAll">
                <p>View All</p>
                <i>
                    <ChevronRightRounded />
                </i>
            </div>
        </div>
    )
}

export default SubCategory

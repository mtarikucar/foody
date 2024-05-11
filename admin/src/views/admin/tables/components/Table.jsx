import Card from "../../../../components/card";
import {Link, NavLink} from "react-router-dom";
import {useEffect, useState} from "react";

const Table = ({name, tableId, orders}) => {

    const [status, setStatus] = useState(0);

    useEffect(() => {

        orders?.map((order) => {
            if (order.status === 1) {
                setStatus(1);
            }
        });
    }, [orders]);

    return (
        <Link to={"/admin/waiter/" + tableId}>
            <Card
                extra={`!flex-row flex-grow items-center rounded-sm hover:-translate-y-2 ease-in-out duration-300 ${status == 1 ? "bg-green-200" : "bg-yellow-300"}`}>
                <div
                    className="flex w-full justify-center items-center text-xl font-bold text-navy-700 dark:text-white min-h-[4rem] border-2 ">
                    {name}
                </div>

            </Card>
        </Link>
    );
};

export default Table;

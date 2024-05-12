import { motion } from "framer-motion";
import { MdOutlineFastfood } from "react-icons/md";
import { FoodCategory} from "../../../types";
const Button = ({
  category,
  filter,
  setFilter,
}: {
  category: FoodCategory;
  filter: string;
  setFilter: any;
}) => {
  return (
    <motion.div
        onClick={() => {
          if (filter) {
            if (filter === category.categoryId) {
              setFilter("");
            } else {
              setFilter(category.categoryId);
            }
          } else {
            setFilter(category.categoryId);
          }
        }}
      //   whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 1.1 }}
      className={`group ${
        category.categoryId === filter
          ? "hover:bg-btnOverlay bg-cartNumBg"
          : "bg-btnOverlay hover:bg-cartNumBg"
      } w-24 min-w-[6rem] h-28 cursor-pointer rounded-lg drop-shadow-xl flex flex-col gap-3 items-center justify-center duration-150 transition-all  ease-out`}
    >
      <div
        className={`w-10 h-10 rounded-full ${
          category.categoryId === filter
            ? "group-hover:bg-cartNumBg bg-btnOverlay"
            : "bg-cartNumBg group-hover:bg-btnOverlay"
        }  flex items-center justify-center`}
      >
        {/* <MdOutlineFastfood

        /> */}
        <span
          className={`${
            category.categoryId === filter
              ? "text-textColor group-hover:text-btnOverlay"
              : "group-hover:text-textColor text-btnOverlay"
          } text-lg`}
        >
          {<MdOutlineFastfood />}
        </span>
      </div>
      <p
        className={`text-base ${
          category.categoryId === filter
            ? "group-hover:text-textColor text-white"
            : "text-textColor group-hover:text-white"
        } `}
      >
        {category.name}
      </p>
    </motion.div>
  );
};

export default Button;

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
              setFilter(filter === category.categoryId ? "" : category.categoryId);
            } else {
              setFilter(category.categoryId);
            }
          }}
          whileTap={{scale: 1.1}}
          className={`group w-24 min-w-[6rem] h-28 cursor-pointer rounded-lg drop-shadow-xl flex flex-col gap-3 items-center justify-center duration-150 transition-all ease-out ${
              filter === category.categoryId
                  ? "bg-cartNumBg text-btnOverlay"  // Active state
                  : "bg-btnOverlay text-cartNumBg" // Inactive state
          }`}
      >
        <div
            className={`w-10 h-10 rounded-full flex items-center justify-center ${
                filter === category.categoryId
                    ? "bg-btnOverlay text-cartNumBg"
                    : "bg-cartNumBg text-btnOverlay"
            }`}
        >
        <span className={`text-lg ${filter === category.categoryId ? "text-cartNumBg" : "text-btnOverlay"}`}>
          <MdOutlineFastfood/>
        </span>
        </div>
        <p
            className={`text-base ${
                filter === category.categoryId ? "text-btnOverlay" : "text-cartNumBg"
            }`}
        >
          {category.name}
        </p>
      </motion.div>
  );
};

export default Button;

import { useLayoutEffect, useRef } from "react";

import { Product} from "../../../types";
import Loader from "../Loader";
import { SingleFoodItem } from "../FoodItem";
import { motion } from "framer-motion";
import NotFound from "../NotFound";
import { isAdmin } from "../../utils/functions";
import { useStateValue } from "../../context/StateProvider";
import {useInfiniteQuery} from "react-query";
import {getProducts} from "../../api/axios";
import {SingleProduct} from "../FoodItem/SingleProduct";


const Container = ({
                     scrollOffset,
                     col,
                     className,
                     filter
                   }: {
  scrollOffset: number,
  col?: boolean;
  filter: string,
  className?: string
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [{ user, menuData }] = useStateValue();

  const {
    data: products,
    fetchNextPage,
    hasNextPage,
    isLoading,
    isError,
    error
  } = useInfiniteQuery(
      ['products', filter, menuData?.menuId],
      ({ pageParam = 0 }) => getProducts(filter, menuData?.menuId, pageParam),
      {
        getNextPageParam: (lastPage) => lastPage.data.last ? undefined : lastPage.data.pageable.pageNumber + 1
      }
  );

  useLayoutEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollLeft += scrollOffset;
    }
  }, [scrollOffset]);

  useLayoutEffect(() => {
    const observer = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting) fetchNextPage();
        },
        { root: null, rootMargin: '0px', threshold: 1.0 }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, [fetchNextPage]);

  if (isLoading) return <Loader progress="Fetching Food Items..." />;
  if (isError) return <NotFound text={`Error:    || "Unknown error"}`} />;

  // Adjust the grid and overflow styles based on the `col` prop
  const gridClass = col ? "grid-cols-1" : "grid-cols-2";
  const overflowClass = col ? "overflow-x-hidden" : "overflow-x-scroll scrollbar-hidden scroll-smooth";

  return (
      <motion.div
          ref={containerRef}
          initial={{ opacity: 0, x: 200 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 200 }}
          className={`mx-auto grid ${gridClass}  gap-y-4 gap-x-4 mb-5 w-full ${className} flex-wrap min-h-[200px] gap-4 px-2 ${overflowClass}`}
      >
        {products && products.pages.map(group =>
            group.data.content.map((item:Product) => (
                <SingleProduct key={item.productId} item={item} col={col} admin={isAdmin(user)}/>
            ))
        )}
        {products && products.pages.length <= 0 && <NotFound text="No Food Items Available"/>}
      </motion.div>
  );
};

export default Container;

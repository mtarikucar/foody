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
import {SingleProduct} from "../FoodItem/singleProduct";

const Container = ({scrollOffset, col, className, filter }: {scrollOffset:number, col?: boolean; filter:string, className?:string }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [{ user ,menuData}] = useStateValue();

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
        getNextPageParam: (lastPage) => {
          if (!lastPage.data.last) {
            return lastPage.data.pageable.pageNumber + 1;
          } else {
            return undefined;
          }
        }
      }
  );

  useLayoutEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollLeft += scrollOffset;
    }
  }, [scrollOffset]);

  useLayoutEffect(() => {
    const observerCallback = (entries: IntersectionObserverEntry[]) => { // entries tipi tanımlandı
      if (entries[0].isIntersecting) {
        fetchNextPage();
      }
    };
    const options = {
      root: null,
      rootMargin: '0px',
      threshold: 1.0
    };

    const observer = new IntersectionObserver(observerCallback, options);
    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, [fetchNextPage]);

  if (isLoading) return <Loader progress={"Fetching Food Items..."} />;
  if (isError) return <NotFound text={`Error: `} />;




  return (
      <motion.div
          ref={containerRef}
          initial={{opacity: 0, x: 200}}
          animate={{opacity: 1, x: 0}}
          exit={{opacity: 0, x: 200}}
          className={`${className} w-full flex items-center ${(!products || col) && "justify-center"} min-h-[200px] gap-4 px-2 ${!col ? "overflow-x-scroll scrollbar-hidden scroll-smooth" : "overflow-x-hidden flex-wrap"}`}
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

import {useState, useEffect, useRef, useCallback} from 'react'
import React from "react";
import Product from './Product.jsx';
import {useInfiniteQuery, useQuery} from "react-query";
import {getProducts} from '../../api/axios.js';
import LandingPage from "../../pages/LandingPage.jsx";
import ErrorPage from "../../pages/ErrorPage.jsx";

function Index({filter, menuId}) {
    const {
        data: products,
        fetchNextPage,
        hasNextPage,
        isLoading,
        isError,
        error
    } = useInfiniteQuery(
        ["products", filter, menuId],
        ({pageParam = 0}) => getProducts(filter, menuId, pageParam),
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

    const observer = useRef();
    const lastProductElementRef = useRef();

    useEffect(() => {
        if (isLoading || !hasNextPage) return;

        const observerCallback = (entries) => {
            if (entries[0].isIntersecting) {
                fetchNextPage();
            }
        };

        const options = {
            root: null,
            rootMargin: '0px',
            threshold: 1.0
        };

        observer.current = new IntersectionObserver(observerCallback, options);

        if (lastProductElementRef.current) {
            observer.current.observe(lastProductElementRef.current);
        }

        return () => {
            if (observer.current) observer.current.disconnect();
        };
    }, [isLoading, hasNextPage, fetchNextPage]);

    if (isLoading) return <LandingPage/>;
    if (isError) return <ErrorPage error={error}/>;

    return (

        <div className="grid grid-cols-1 mt-2 sm:gap-4 gap-6 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 ">
            {products.pages.map((group, i) => (
                <React.Fragment key={i}>
                    {group.data.content.map((product, index) => {
                        if (group.data.content.length === index + 1) {
                            return (
                                <div ref={lastProductElementRef} key={product.productId}>
                                    <Product {...product} />
                                </div>
                            );
                        } else {
                            return <Product key={product.productId} {...product} />;
                        }
                    })}
                </React.Fragment>
            ))}
        </div>
    )
}

export default Index

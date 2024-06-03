import React, { useState, useEffect } from 'react';
import Card from '../../../../components/card';
import { useMutation, useQueryClient } from "react-query";
import AddBanner from "./AddBanner";
import { toast } from "react-toastify";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import useAxiosPrivate from '../../../../hooks/useAxiosPrivate';
import { MdOutlineDelete } from "react-icons/md";
import { useParams } from "react-router-dom";

const reorder = (list, startIndex, endIndex) => {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);
    return result;
};

function BannerController({ menu }) {
    const [isAddBannerModalOpen, setIsAddBannerModalOpen] = useState(false);
    const [banners, setBanners] = useState(menu.banners); // banner dizisini state olarak kullanın
    const queryClient = useQueryClient();
    const { id } = useParams();
    const axiosPrivate = useAxiosPrivate();

    // menu prop'u değiştiğinde banners state'ini güncelle
    useEffect(() => {
        setBanners(menu.banners);
    }, [menu]);

    const onDragEnd = (result) => {
        if (!result.destination) return;
        if (result.destination.index === result.source.index) return;
        const newBanners = reorder(
            banners,
            result.source.index,
            result.destination.index
        );
        setBanners(newBanners); // Yeniden sıralanmış diziyi state'e kaydet
        mutate(newBanners); // Sıralama değişikliğini sunucuya kaydet
    }

    const { mutate } = useMutation(data => axiosPrivate.put(`/menu/${menu.menuId}`, {
        banners: data
    }), {
        onSuccess: () => {
            queryClient.invalidateQueries(["menuData", id]);
            toast("Banner başarıyla güncellendi");
        },
        onError: () => {
            toast.error("Banner güncellenirken bir hata oldu");
        },
    });

    const handleBannerRemove = (bannerIndex) => {
        const updatedBanners = banners.filter((_, index) => index !== bannerIndex);
        setBanners(updatedBanners);
        mutate(updatedBanners);
    };

    return (
        <Card extra={"w-full h-full p-2 gap-6"}>
            <h4 className="text-xl mt-2 ml-2 font-bold text-navy-700 dark:text-white">
                Menüye banner ekle
            </h4>
            <AddBanner isOpen={isAddBannerModalOpen} onClose={() => setIsAddBannerModalOpen(!isAddBannerModalOpen)} banners={banners} />
            <DragDropContext onDragEnd={onDragEnd}>
                <Droppable droppableId="droppable-banners" direction="horizontal">
                    {(provided) => (
                        <div className={"grid grid-cols-3 gap-3 overflow-ellipsis"} // Changed to grid-cols-1
                             ref={provided.innerRef} {...provided.droppableProps}>
                            {banners?.map((banner, index) => (
                                <Draggable key={banner} draggableId={banner} index={index}>
                                    {(provided, snapshot) => (
                                        <div
                                            ref={provided.innerRef}
                                            {...provided.draggableProps}
                                            {...provided.dragHandleProps}
                                            className={`w-full ${snapshot.isDragging ? "opacity-75" : "opacity-100"}`} // Set width to full
                                            style={provided.draggableProps.style}
                                        >
                                            <div className={"relative"}>
                                                <img src={banner} alt={`Banner ${index}`}
                                                     className="w-full h-48 object-cover" />
                                                <button onClick={() => handleBannerRemove(index)}
                                                        className={"absolute w-6 h-6 text-white top-0 right-0 rounded-bl-3xl bg-red-500"}>
                                                    <MdOutlineDelete className={"ml-1 mb-0.5"} />
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </Draggable>
                            ))}
                            {provided.placeholder}
                        </div>
                    )}
                </Droppable>
            </DragDropContext>

            <button
                disabled={banners?.length === 6}
                className="flex h-12 bg-indigo-500 justify-center rounded-md items-center w-full border-2 cursor-pointer"
                onClick={() => setIsAddBannerModalOpen(!isAddBannerModalOpen)}
                aria-label="Yeni banner ekle" // Erişilebilirlik için aria-label eklenmiştir
                role="button" // Erişilebilirlik için rol belirtilmiştir
            >
                {
                    banners?.length === 6 ? (
                        <span className={"text-white"}>En fazla 6 tane Banner yükleyebilirsiniz ...</span>
                    ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5"
                             stroke="currentColor" className="w-6 h-6 text-white">
                            <path strokeLinecap="round" strokeLinejoin="round"
                                  d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m3.75 9v6m3-3H9m1.5-12H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                        </svg>
                    )
                }
            </button>
        </Card>
    );
}

export default BannerController;

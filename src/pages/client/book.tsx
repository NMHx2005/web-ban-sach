import BookDetail from "@/components/client/book/bookDetail";
import BookLoader from "@/components/client/book/modal.loader";
import CustomFooter from "@/components/layout/footer";
import { getBookById } from "@/services/api";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

interface IBookAdmin {
    _id: string;
    thumbnail: string;
    slider: string[];
    mainText: string;
    author: string;
    price: number;
    sold: number;
    quantity: number;
    category: string;
    createdAt: string;
    updatedAt: string;
};

const BookPage = () => {
    const [dataBook, setDataBook] = useState<IBookAdmin | null>(null);
    const [isLoadingBook, setIsLoadingBook] = useState<boolean>(true);
    let { id } = useParams();

    useEffect(() => {
        if (id) {
            callBookById(id);
        }
    }, [id]);

    const callBookById = async (id: any) => {
        if (id) {
            const res = await getBookById(id);
            if (res.data) {
                setDataBook(res.data);
                setIsLoadingBook(false);
            }
        }
    }

    return (
        <>
            {isLoadingBook ?
                <BookLoader />
                :


                <BookDetail
                    dataBook={dataBook}
                />
            }
            <CustomFooter />
        </>
    );
};

export default BookPage;
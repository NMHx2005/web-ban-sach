import Category from "@/components/client/home/category";
import ListBook from "@/components/client/home/listBook";
import './home.scss'
import { useEffect, useState } from "react";
import { getBookAPI, getCategoryAPI } from "@/services/api";
import CustomFooter from "@/components/layout/footer";
import { useOutletContext } from "react-router-dom";

type IBook = {
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

const HomePage = () => {
    const [dataCategory, setDataCategory] = useState<string[] | null>([]);
    const [dataBookList, setDataBookList] = useState<IBook[] | null>([]);
    const [loader, setLoader] = useState<boolean>(false);
    const [current, setCurrent] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [total, setTotal] = useState(10);
    const [searchTerm] = useOutletContext() as any;

    useEffect(() => {
        const categoryListBook = async () => {

            // Lấy ra danh sách category
            const res = await getCategoryAPI();
            if (res.data) {
                setDataCategory(res.data);
            } else {
                console.log(">>> Check list Category call");
            }
        }
        categoryListBook();
    }, [current, pageSize]);

    useEffect(() => {
        fetchBook();
    }, [current, pageSize, searchTerm]);

    const fetchBook = async (queryPlus = '') => {
        setLoader(true);
        // Lấy ra danh sách book
        let query = `current=${current}&pageSize=${pageSize}`;

        if (queryPlus !== '') {
            query = `${query}${queryPlus}`;
        }

        if (searchTerm) {
            query += `&mainText=/${searchTerm}/i`;
        }

        const listBookResponse = await getBookAPI(query);
        if (listBookResponse.data) {
            setDataBookList(listBookResponse.data.result);
            setTotal(listBookResponse.data.meta.total);
        }
        setLoader(false);
    }

    const handleTabChange = (key: string, priceChecked = false) => {
        let queryPlusHandle = '';

        if (key === '1') {
            queryPlusHandle += "&sort=-sold";
        } else if (key === '2') {
            queryPlusHandle += "&sort=-updateAt";
        } else if (key === '3') {
            queryPlusHandle += "&sort=price";
        } else if (key === '4') {
            queryPlusHandle += "&sort=-price";
        }

        if (key.length > 1 && priceChecked == false) {
            queryPlusHandle += `&category=${key}`;
        }

        if (priceChecked) {
            queryPlusHandle += `${key}`;
        }

        if (queryPlusHandle) {
            fetchBook(queryPlusHandle);
        }
    };



    return (
        <>
            <div style={{ background: '#efefef', padding: "20px 0" }}>
                <div className="homePage">
                    <div className="category__Homepage">
                        <Category
                            dataCategory={dataCategory}
                            onTabChange={handleTabChange}
                            fetchBook={fetchBook}
                        />
                    </div>
                    <div
                        className="listBook_homepage"
                        style={{
                            marginLeft: "20px",
                            padding: "16px"
                        }}
                    >
                        <div>
                            <ListBook
                                loader={loader}
                                dataCategory={dataCategory}
                                fetchBook={fetchBook}
                                dataBookList={dataBookList}
                                current={current}
                                pageSize={pageSize}
                                setCurrent={setCurrent}
                                setPageSize={setPageSize}
                                total={total}
                                onTabChange={handleTabChange}
                            />
                        </div>
                    </div>
                </div>
            </div>
            <CustomFooter />
        </>
    )
}

export default HomePage;

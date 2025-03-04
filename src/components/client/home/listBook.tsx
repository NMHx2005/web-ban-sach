import { Spin, Divider, Pagination, Rate, Tabs, Col, Drawer } from 'antd';
import type { TabsProps } from 'antd';
import './homeDetail.scss';
import './responsive.home.scss';
import { Link, useNavigate } from 'react-router-dom';
import { FilterOutlined } from '@ant-design/icons';
import { useState } from 'react';
import Category from './category';

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

interface IProps {
    dataBookList: IBook[] | null;
    loader: boolean;
    current: number;
    pageSize: number;
    setCurrent: (v: number) => void;
    setPageSize: (v: number) => void;
    total: number;
    onTabChange: (key: string) => void;
    dataCategory: string[] | null;
    fetchBook: () => void;
}


const ListBook = ({ dataCategory, fetchBook, dataBookList, loader, current, pageSize, setCurrent, setPageSize, total, onTabChange }: IProps) => {
    const navigate = useNavigate();
    const [openModalMobile, setOpenModalMobile] = useState(false);

    const onChange = (key: string) => {
        onTabChange(key);
    };

    const items: TabsProps['items'] = [
        {
            key: '1',
            label: 'Phổ Biến',
            // children: <Book />
        },
        {
            key: '2',
            label: 'Hàng Mới',
            // children: <Book />
        },
        {
            key: '3',
            label: 'Giá Thấp Đến Cao',
            // children: <Book />
        },
        {
            key: '4',
            label: 'Giá Cao Đến Thấp',
            // children: <Book />
        },
    ];

    const dataBook = dataBookList?.map((item, index) => ({
        id: item._id,
        key: index,
        thumbnail: `${import.meta.env.VITE_BACKEND_URL}/images/book/${item.thumbnail}`,
        mainText: item.mainText,
        price: item.price,
        sold: item.sold,
    }));

    const handleOnchangePage = (page: number, pageSize: number) => {
        setCurrent(page);
        setPageSize(pageSize);
    };

    const showModalMobile = () => {
        setOpenModalMobile(true);
    }

    return (
        <>
            <div>
                <div>
                    <Tabs defaultActiveKey="1" items={items} onChange={onChange} />
                </div>
                <Col sm={0} xs={24} style={{ margin: "10px 0" }}>
                    <FilterOutlined onClick={() => showModalMobile()} style={{ fontSize: '24px', cursor: "pointer" }} />
                    <Drawer width={"70%"} title="Bộ lọc tìm kiếm" onClose={() => setOpenModalMobile(false)} open={openModalMobile}>
                        <Category
                            dataCategory={dataCategory}
                            onTabChange={onTabChange}
                            fetchBook={fetchBook}
                        />
                    </Drawer>
                </Col>
                <Spin spinning={loader} size="large" >
                    <div className="BookContainer">
                        {dataBook?.map((item) => (
                            <div key={item.id} className="BookDetail" onClick={() => navigate(`/book/${item.id}`)}>
                                <div style={{ textAlign: 'center', overflow: "hidden" }}>
                                    <img
                                        width={'200px'}
                                        alt={item.mainText}
                                        src={item.thumbnail}
                                        style={{ borderRadius: '4px' }}
                                    />
                                </div>
                                <div style={{ fontSize: '14px', marginTop: '8px' }}>
                                    <Link to="#">
                                        <div className="mainTextContainer">{item.mainText}</div>
                                    </Link>
                                </div>
                                <div style={{ fontSize: '16px', marginTop: '8px' }}>
                                    {item.price.toLocaleString()} đ
                                </div>
                                <div
                                    style={{
                                        fontSize: '12px',
                                        color: '#666',
                                        marginTop: '8px',
                                        display: 'flex',
                                        alignItems: 'center',
                                    }}
                                >
                                    <div style={{ marginRight: '5px' }}>
                                        <Rate disabled defaultValue={5} />
                                    </div>
                                    <div>Đã bán {item.sold}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                    <Divider />
                    <div style={{ display: 'flex', justifyContent: 'center' }}>
                        <Pagination
                            // total: total
                            pageSize={pageSize}
                            current={current}
                            total={total}
                            onChange={(page, pageSize) => handleOnchangePage(page, pageSize)}
                            showSizeChanger={true}
                        />
                    </div>
                </Spin>
            </div>
        </>
    );
};

export default ListBook;
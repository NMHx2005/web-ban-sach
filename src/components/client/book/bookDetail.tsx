import { Row, Col, Rate, App, Breadcrumb } from 'antd';
import ImageGallery from 'react-image-gallery';
import { useEffect, useRef, useState, useMemo } from 'react';
import { MinusOutlined, PlusOutlined } from '@ant-design/icons';
import { BsCartPlus } from 'react-icons/bs';
import './book.scss';
import ModalGallery from './modal.gallery';
import { useCurrentApp } from '@/components/context/app.context';
import { Link, useNavigate } from 'react-router-dom';

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
}

interface ICarts {
    id: string;
    quantityProducts: number;
    detail: IBookAdmin;
}

interface IProps {
    dataBook: IBookAdmin | null;
}

const BookDetail = ({ dataBook }: IProps) => {
    const [images, setImages] = useState<any[]>([]);
    const [quantityProduct, setQuantityProduct] = useState(1);
    const [isOpenModalGallery, setIsOpenModalGallery] = useState(false);
    const [currentIndex, setCurrentIndex] = useState(0);
    const refGallery = useRef<ImageGallery>(null);
    const { notification, message } = App.useApp();
    const { user, setCarts } = useCurrentApp();
    const navigate = useNavigate();

    const computedImages = useMemo(() => {
        const newImages = [];
        if (dataBook?.thumbnail) {
            newImages.push({
                original: `${import.meta.env.VITE_BACKEND_URL}/images/book/${dataBook.thumbnail}`,
                thumbnail: `${import.meta.env.VITE_BACKEND_URL}/images/book/${dataBook.thumbnail}`,
                originalClass: "original-image",
                thumbnailClass: "thumbnail-image",
            });
        }
        if (dataBook?.slider) {
            dataBook.slider.forEach((item) => {
                newImages.push({
                    original: `${import.meta.env.VITE_BACKEND_URL}/images/book/${item}`,
                    thumbnail: `${import.meta.env.VITE_BACKEND_URL}/images/book/${item}`,
                    originalClass: "original-image",
                    thumbnailClass: "thumbnail-image",
                });
            });
        }
        return newImages;
    }, [dataBook]);

    useEffect(() => {
        setImages(computedImages);
    }, [computedImages]);

    const handleOnClickImage = () => {
        const index = refGallery.current?.getCurrentIndex() ?? 0;
        setIsOpenModalGallery(true);
        setCurrentIndex(index);
    };

    const handleChangeQuantity = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        if (value === "") {
            setQuantityProduct(1);
            return;
        }
        const num = parseInt(value);
        if (!isNaN(num)) {
            if (num < 1) setQuantityProduct(1);
            else if (num > (dataBook?.quantity ?? 0)) setQuantityProduct(dataBook?.quantity ?? 1);
            else setQuantityProduct(num);
        }
    };

    const minusQuantity = () => {
        if (quantityProduct > 1) {
            setQuantityProduct(quantityProduct - 1);
        } else {
            notification.warning({ message: "Số lượng sản phẩm đã đạt tối thiểu!" });
        }
    };

    const plusQuantity = () => {
        if (quantityProduct < (dataBook?.quantity ?? 0)) {
            setQuantityProduct(quantityProduct + 1);
        } else {
            notification.warning({ message: "Số lượng sản phẩm đã đạt tối đa!" });
        }
    };

    const addToCarts = (id: string, quantityProducts: number, detail: IBookAdmin, isBuyNow = false) => {
        if (!user) {
            message.error("Bạn cần đăng nhập để thực hiện tính năng này.");
            return;
        }

        if (quantityProducts > detail.quantity) {
            notification.warning({ message: "Số lượng sản phẩm vượt quá tồn kho!" });
            return;
        }

        const cartStorage = localStorage.getItem("carts");
        let carts: ICarts[] = cartStorage ? JSON.parse(cartStorage) : [];

        const existingProductIndex = carts.findIndex((item) => item.id === id);
        if (existingProductIndex !== -1) {
            const newQuantity = carts[existingProductIndex].quantityProducts + quantityProducts;
            if (newQuantity > detail.quantity) {
                notification.warning({ message: "Số lượng sản phẩm vượt quá tồn kho!" });
                return;
            }
            carts[existingProductIndex].quantityProducts = newQuantity;
        } else {
            carts.push({ id, quantityProducts, detail });
        }

        localStorage.setItem("carts", JSON.stringify(carts));
        setCarts(carts);

        if (isBuyNow) {
            navigate("/order");
        } else {
            message.success("Thêm sản phẩm vào giỏ hàng thành công.");
        }
    };

    if (!dataBook) {
        return <div>Không có dữ liệu sách</div>;
    }

    return (
        <div style={{ background: '#efefef', padding: "20px 0" }}>
            <div className='view-detail-book' style={{ maxWidth: 1440, margin: '0 auto', minHeight: "calc(100vh - 150px)" }}>
                <Breadcrumb
                    separator=">"
                    items={[
                        {
                            title: <Link to={"/"}>Trang Chủ</Link>,
                        },

                        {
                            title: 'Xem chi tiết sách',
                        },
                    ]}
                />
                <div style={{ padding: "20px", background: '#fff', borderRadius: 5 }}>
                    <Row gutter={[20, 20]}>
                        <Col md={10} sm={0} xs={0}>
                            <ImageGallery
                                ref={refGallery}
                                items={images}
                                showPlayButton={false}
                                showFullscreenButton={false}
                                renderLeftNav={() => <></>}
                                renderRightNav={() => <></>}
                                slideOnThumbnailOver={true}
                                onClick={handleOnClickImage}
                            />
                        </Col>
                        <Col md={14} sm={24}>
                            <Col md={0} sm={24} xs={24}>
                                <ImageGallery
                                    ref={refGallery}
                                    items={images}
                                    showPlayButton={false}
                                    showFullscreenButton={false}
                                    renderLeftNav={() => <></>}
                                    renderRightNav={() => <></>}
                                    showThumbnails={false}
                                />
                            </Col>
                            <Col span={24}>
                                <div className='author'>Tác giả: <a href='#'>{dataBook.author}</a></div>
                                <div className='title'>{dataBook.mainText}</div>
                                <div className='rating' style={{ display: "flex", alignItems: "center" }}>
                                    <Rate value={5} disabled />
                                    <span className='sold'><div>{dataBook.sold}</div></span>
                                </div>
                                <div className='price'>
                                    <span className='currency'>
                                        {dataBook.price ? new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(dataBook.price) : 'N/A'}
                                    </span>
                                </div>
                                <div className='delivery'>
                                    <div>
                                        <span className='left'>Vận chuyển</span>
                                        <span className='right'>Miễn phí vận chuyển</span>
                                    </div>
                                </div>
                                <div className='quantity'>
                                    <span className='left'>Số lượng</span>
                                    <span className='right'>
                                        <button onClick={minusQuantity}><MinusOutlined /></button>
                                        <input onChange={handleChangeQuantity} value={quantityProduct} min={1} max={dataBook.quantity} />
                                        <button onClick={plusQuantity}><PlusOutlined /></button>
                                    </span>
                                </div>
                                <div className='buy'>
                                    <button className='cart' onClick={() => addToCarts(dataBook._id, quantityProduct, dataBook)}>
                                        <BsCartPlus className='icon-cart' />
                                        <span>Thêm vào giỏ hàng</span>
                                    </button>
                                    <button className='now' onClick={() => addToCarts(dataBook._id, quantityProduct, dataBook, true)}>
                                        Mua ngay
                                    </button>
                                </div>
                            </Col>
                        </Col>
                    </Row>
                </div>
            </div>
            <ModalGallery
                isOpen={isOpenModalGallery}
                setIsOpen={setIsOpenModalGallery}
                currentIndex={currentIndex}
                items={images}
                title={dataBook.mainText}
            />
        </div>
    );
};

export default BookDetail;
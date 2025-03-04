import { useState, useEffect } from "react";
import { App, Button, Col, Empty, Input, InputNumber, Row } from "antd";
import { DeleteOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";
import "./order.scss"

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

interface ICarts {
    id: string;
    quantityProducts: number;
    detail: IBookAdmin;
}
interface IProps {
    setIsCurrentOrder: (value: number) => void;
}

const Order = (props: IProps) => {
    const { setIsCurrentOrder } = props;

    const [dataOrder, setDataOrder] = useState<ICarts[]>([]);

    const { message } = App.useApp();


    useEffect(() => {
        const cart = localStorage.getItem("carts");
        if (cart) {
            setDataOrder(JSON.parse(cart));
        }
    }, []);

    // Hàm xử lý thay đổi số lượng sản phẩm
    const handleQuantityChange = (value: number | null, itemId: string) => {
        if (value === null || value < 1) return; // Đảm bảo giá trị không nhỏ hơn 1

        // Cập nhật số lượng sản phẩm trong giỏ hàng
        const updatedCart = dataOrder.map((item) => {
            if (item.id === itemId) {
                return { ...item, quantityProducts: value };
            }
            return item;
        });

        // Cập nhật state và localStorage
        setDataOrder(updatedCart);
        localStorage.setItem("carts", JSON.stringify(updatedCart));
    };

    // Hàm xóa sản phẩm khỏi giỏ hàng
    const handleDelete = (itemId: string) => {
        const updatedCart = dataOrder.filter((item) => item.id !== itemId);
        setDataOrder(updatedCart);
        localStorage.setItem("carts", JSON.stringify(updatedCart));
        message.success("Xóa sản phẩm thành công");
    };

    // Tính tổng tiền của toàn bộ giỏ hàng
    const totalAmount = dataOrder.reduce((total, item) => {
        return total + item.detail.price * item.quantityProducts;
    }, 0);

    const formatCurrency = (value: number) => {
        return value.toFixed(0).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.');
    };

    return (
        <div style={{ background: '#efefef', padding: "20px 0" }}>
            <div style={{ maxWidth: 1440, margin: '0 auto', minHeight: "calc(100vh - 150px)", display: "flex", justifyContent: "center" }}>
                <Row gutter={[16, 16]} style={{ width: "100%", justifyContent: "center" }}>
                    <Col xl={18}>
                        <div>
                            {dataOrder.length > 0 ? (
                                dataOrder.map((item: ICarts) => (
                                    <div key={item.id} style={{ marginBottom: "20px", backgroundColor: "white", display: "flex", alignItems: "center", flexWrap: "wrap", justifyContent: "space-between", padding: "15px" }}>
                                        <img
                                            width={"80px"}
                                            src={`${import.meta.env.VITE_BACKEND_URL}/images/book/${item.detail.thumbnail}`}
                                            alt={item.detail.mainText}
                                            onError={(e) => {
                                                e.currentTarget.src = "https://via.placeholder.com/50"; // Fallback ảnh nếu ảnh không tải được
                                            }}
                                        />
                                        <div style={{
                                            whiteSpace: 'nowrap', // Ngăn chữ xuống dòng
                                            overflow: 'hidden', // Ẩn phần chữ vượt quá kích thước
                                            textOverflow: 'ellipsis', // Thay thế phần dư bằng dấu ...
                                            width: '300px', // Giới hạn chiều rộng tối đa
                                        }}>
                                            <Link to={`/book/${item.id}`}>
                                                {item.detail.mainText}
                                            </Link>
                                        </div>
                                        <div style={{ width: "120px" }}>{item.detail.price.toFixed(0).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.')} VNĐ</div>
                                        <InputNumber
                                            min={1}
                                            max={item.detail.quantity}
                                            value={item.quantityProducts}
                                            onChange={(value) => handleQuantityChange(value, item.id)}
                                        />
                                        <div >
                                            Tổng tiền: {formatCurrency(item.detail.price * item.quantityProducts)} VNĐ
                                        </div>
                                        <div>
                                            <DeleteOutlined

                                                onClick={() => handleDelete(item.id)}
                                                style={{ cursor: "pointer", color: "red" }}
                                            />
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <Empty
                                    description={"Không có sản phẩm trong giỏ hàng."}
                                />
                            )}
                        </div>
                    </Col>
                    <Col xl={6}>
                        <div style={{
                            backgroundColor: "white",
                            padding: "20px",
                            borderRadius: "8px",
                            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                            border: "1px solid #e0e0e0"
                        }}>
                            <h3 style={{
                                marginBottom: "32px",
                                fontSize: "18px",
                                fontWeight: "600",
                                color: "#333"
                            }}>
                                Thông tin thanh toán
                            </h3>

                            <div style={{ marginBottom: "32px" }}>
                                <strong style={{
                                    fontSize: "14px",
                                    color: "#555",
                                    marginBottom: "12px"
                                }}>
                                    Mã Giảm Giá (Nếu có):
                                </strong>
                                <Input
                                    placeholder="Nhập mã giảm giá"
                                    style={{
                                        width: "100%",
                                        borderRadius: "4px",
                                        border: "1px solid #d9d9d9",
                                        padding: "8px 12px",
                                        marginTop: "12px"
                                    }}
                                />
                            </div>

                            <div style={{
                                padding: "16px 0",
                                borderTop: "1px solid #e0e0e0",
                                borderBottom: "1px solid #e0e0e0",
                                marginBottom: "32px"
                            }}>
                                <strong style={{
                                    fontSize: "16px",
                                    color: "#333",
                                    margin: "0"
                                }}>
                                    Tổng tiền:    <strong style={{ color: "#1890ff" }}>{formatCurrency(totalAmount)} VNĐ</strong>
                                </strong>
                            </div>

                            {dataOrder.length > 0 ?
                                (
                                    <Button
                                        style={{
                                            width: "100%",
                                            backgroundColor: "#1890ff",
                                            color: "white",
                                            border: "none",
                                            borderRadius: "4px",
                                            fontSize: "16px",
                                            fontWeight: "500",
                                            cursor: "pointer",
                                            transition: "background-color 0.3s",
                                        }}
                                        className="buttonOrder"
                                        onClick={() => setIsCurrentOrder(1)}
                                    >
                                        Thanh toán
                                    </Button>
                                )
                                :
                                (
                                    <Button
                                        style={{
                                            width: "100%",
                                            backgroundColor: "red",
                                            color: "white",
                                            border: "none",
                                            borderRadius: "4px",
                                            padding: "12px",
                                            fontSize: "16px",
                                            fontWeight: "500",
                                            cursor: "pointer",
                                            transition: "background-color 0.3s",
                                        }}
                                        className="buttonOrder"
                                        onClick={() => message.warning("Vui lòng thêm sản phẩm vào giỏ hàng !!!")}
                                    >
                                        Vui lòng chọn sản phẩm
                                    </Button>
                                )
                            }
                        </div>
                    </Col>
                </Row>
            </div>
        </div>
    );
};

export default Order;
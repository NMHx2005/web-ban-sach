import { useState, useEffect } from "react";
import type { FormProps } from 'antd';
import { App, Col, Input, Row, Button, Form, Radio } from "antd";
import { DeleteOutlined, DoubleLeftOutlined } from "@ant-design/icons";
import "./order.scss"
import TextArea from "antd/es/input/TextArea";
import { getVNPayUrlAPI, orderAPI } from "@/services/api";
import { v4 as uuidv4 } from 'uuid';
import { useCurrentApp } from "@/components/context/app.context";

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

type FieldType = {
    username: string;
    phone: string;
    address: string;
    method: string;
    totalAmount: number;
};

interface IProps {
    setIsCurrentOrder: (value: number) => void;
}
const Payment = (props: IProps) => {
    const { setIsCurrentOrder } = props;
    const { setCarts } = useCurrentApp();
    const [dataOrder, setDataOrder] = useState<ICarts[]>([]);
    const [loading, setLoading] = useState<boolean>(false);

    const { message } = App.useApp();


    useEffect(() => {
        const cart = localStorage.getItem("carts");
        if (cart) {
            setDataOrder(JSON.parse(cart));
        }
    }, []);

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
        return new Intl.NumberFormat("vi-VN").format(value) + " VNĐ";
    };


    const onFinish: FormProps<FieldType>['onFinish'] = async (values) => {
        setLoading(true);
        const dataCarts = localStorage.getItem("carts");
        if (dataCarts) {
            const cartss = JSON.parse(dataCarts);
            const detaiProduct = cartss.map((item: ICarts) => ({
                bookName: item.detail.mainText,
                quantity: item.quantityProducts,
                _id: item.id
            }));

            let res = null;
            const paymentRef = uuidv4();
            if (values.method == "COD") {
                const data = {
                    name: values.username,
                    address: values.address,
                    phone: values.phone,
                    totalPrice: totalAmount,
                    type: values.method,
                    detail: detaiProduct
                };
                res = await orderAPI(data);
            } else {
                const data = {
                    name: values.username,
                    address: values.address,
                    phone: values.phone,
                    totalPrice: totalAmount,
                    type: values.method,
                    detail: detaiProduct,
                    paymentRef: paymentRef
                };

                res = await orderAPI(data);
            }
            if (res.data) {
                localStorage.removeItem("carts");
                setCarts([]);
                if (values.method == "COD") {
                    message.success("Mua hàng thành công!!!");
                    setIsCurrentOrder(2);
                } else {
                    // redirect to VNPAY
                    const r = await getVNPayUrlAPI(totalAmount, "vn", paymentRef);
                    if (r.data) {
                        window.location.href = r.data.url;
                    } else {
                        message.error("Có lỗi xảy ra !!!!");
                    }
                }
            } else {
                message.error("Không có sản phẩm nào trong giỏ hàng!!!");
            }
        } else {
            message.error("Không có sản phẩm nào trong giỏ hàng!!!");
        }
        setLoading(false);
    };

    const onFinishFailed: FormProps<FieldType>['onFinishFailed'] = (errorInfo) => {
        console.log('Failed:', errorInfo);
    };


    return (
        <div style={{ background: '#efefef', padding: "20px 0" }}>
            <div style={{ maxWidth: 1440, margin: '0 auto', minHeight: "calc(100vh - 150px)", display: "flex", justifyContent: "center" }}>
                <Row gutter={[16, 16]} style={{ width: "100%" }}>
                    <Col xl={18}>
                        <div>
                            {dataOrder.length > 0 ? (
                                dataOrder.map((item: ICarts) => (
                                    <div key={item.id} style={{ marginBottom: "20px", flexWrap: "wrap", backgroundColor: "white", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "15px" }}>
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
                                            {item.detail.mainText}
                                        </div>
                                        <div style={{ width: "120px" }}>{item.detail.price.toFixed(0).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.')} VNĐ</div>
                                        <div>Số Lượng: {item.quantityProducts}</div>
                                        <div >
                                            Tổng tiền: {formatCurrency(item.detail.price * item.quantityProducts)}
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
                                <p>Không có sản phẩm trong giỏ hàng.</p>
                            )}
                            {dataOrder.length > 0 && (
                                <div onClick={() => setIsCurrentOrder(0)} style={{ display: "flex", alignItems: "center", gap: "10px", cursor: "pointer" }}>
                                    <DoubleLeftOutlined /> Quay trở lại
                                </div>
                            )}
                        </div>
                    </Col>
                    <Col xl={6}>
                        <Form
                            name="payment-form"
                            onFinish={onFinish}
                            onFinishFailed={onFinishFailed}
                            autoComplete="off"
                            initialValues={{ method: "COD" }}
                            style={{
                                backgroundColor: "white",
                                padding: "20px",
                                borderRadius: "8px",
                                boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                                border: "1px solid #e0e0e0"
                            }}
                            layout="vertical"
                        >
                            <Form.Item<FieldType>
                                label="Hình thức thanh toán: "
                                name="method"
                                rules={[{ required: true, message: 'Vui lòng chọn phương thức thanh toán!' }]}
                            >
                                <Radio.Group
                                    options={[
                                        { value: "COD", label: 'Thanh toán khi nhận hàng' },
                                        { value: "BANK", label: 'Thanh toán bằng ví VNPAY' }
                                    ]}
                                />
                            </Form.Item>
                            <Form.Item<FieldType>
                                label="Họ tên: "
                                name="username"
                                rules={[{ required: true, message: 'Vui lòng nhập tên người nhận hàng!' }]}
                            >
                                <Input />
                            </Form.Item>

                            <Form.Item<FieldType>
                                label="Số Điện thoại"
                                name="phone"
                                rules={[{ required: true, message: 'Vui lòng nhập số điện thoại nhận hàng!' }]}
                            >
                                <Input />
                            </Form.Item>

                            <Form.Item<FieldType>
                                label="Địa chỉ nhận hàng: "
                                name="address"
                                rules={[{ required: true, message: 'Vui lòng nhập địa chỉ nhận hàng!' }]}
                            >
                                <TextArea rows={4} />
                            </Form.Item>
                            <Form.Item<FieldType>
                                name="totalAmount"
                            >
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
                                        Tổng tiền:    <strong style={{ color: "#1890ff" }}>{formatCurrency(totalAmount)}</strong>
                                    </strong>
                                </div>
                            </Form.Item>

                            <Form.Item label={null}>
                                <Button
                                    htmlType="submit"
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
                                    loading={loading}
                                >
                                    Đặt Hàng
                                </Button>
                            </Form.Item>
                        </Form>
                    </Col>
                </Row>
            </div>
        </div>
    );
}


export default Payment;
import DoneOrder from "@/components/client/order/done";
import Order from "@/components/client/order/order";
import Payment from "@/components/client/order/payment";
import CustomFooter from "@/components/layout/footer";
import { Breadcrumb, Col, Steps } from "antd";
import { useState } from "react";
import { Link } from "react-router-dom";
import "./responsive.scss"

const OrderPage = () => {
    const [isCurrentOrder, setIsCurrentOrder] = useState<number>(0);

    return (
        <>
            <div style={{ background: '#efefef', padding: "20px 0" }}>
                <div style={{ maxWidth: 1440, margin: '0 auto', minHeight: "calc(100vh - 150px)" }}>
                    <Breadcrumb
                        separator=">"
                        items={[
                            {
                                title: <Link to={"/"}>Trang Chủ</Link>,
                            },

                            {
                                title: 'Chi Tiết Giỏ Hàng',
                            },
                        ]}
                    />
                    <Col
                        className="step__order"
                        xs={{ span: 0 }}  // Ẩn trên mobile (< 576px)
                        sm={{ span: 24 }} // Hiển thị trên small (≥ 576px)
                        md={{ span: 24 }} // Hiển thị trên medium (≥ 768px)
                    >
                        <Steps
                            style={{
                                marginBottom: "20px",
                                backgroundColor: "white",
                                padding: "20px",
                                borderRadius: "4px"
                            }}
                            size="small"
                            current={isCurrentOrder}
                            items={[
                                { title: 'Đơn Hàng' },
                                { title: 'Đặt Hàng' },
                                { title: 'Thanh Toán' },
                            ]}
                        />
                    </Col>
                    {isCurrentOrder === 0 &&
                        <Order
                            setIsCurrentOrder={setIsCurrentOrder}
                        />
                    }
                    {isCurrentOrder === 1 &&
                        <Payment
                            setIsCurrentOrder={setIsCurrentOrder}
                        />
                    }
                    {isCurrentOrder === 2 &&
                        <DoneOrder
                            setIsCurrentOrder={setIsCurrentOrder}
                        />
                    }
                </div>
            </div>
            <CustomFooter />
        </>
    )
}

export default OrderPage;
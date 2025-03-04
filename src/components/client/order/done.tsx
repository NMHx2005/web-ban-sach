import { Button, Result } from "antd";
import { useNavigate } from "react-router-dom";


interface IProps {
    setIsCurrentOrder: (value: number) => void;
}

const DoneOrder = (props: IProps) => {
    const { setIsCurrentOrder } = props;
    const navigate = useNavigate();

    return (
        <>
            <Result
                status="success"
                title="Đặt Hàng Thành Công"
                subTitle="Hệ thống đã ghi nhận đơn hàng của bạn."
                extra={[
                    <Button key="console" onClick={() => navigate("/")}>
                        Trang Chủ
                    </Button>,
                    <Button
                        key="buy"
                        onClick={() => navigate("/history")}
                    >
                        Lịch Sử Mua Hàng
                    </Button>,
                ]}
            />
        </>
    )
}


export default DoneOrder;
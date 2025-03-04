import { dashBoardAPI } from '@/services/api';
import type { StatisticProps } from 'antd';
import { Col, Row, Statistic } from 'antd';
import { useEffect, useState } from 'react';
import CountUp from 'react-countup';

interface IAPI {
    countOrder: number;
    countUser: number;
    countBook: number;
}

const DashBoardPage = () => {
    const [data, setData] = useState<IAPI | null>(null);

    useEffect(() => {
        const callAPIDashboard = async () => {
            const res = await dashBoardAPI();
            if (res.data) {
                setData(res.data);
            } else {
                console.log(res.error);
            }
        }

        callAPIDashboard();
    }, []);

    const formatter: StatisticProps['formatter'] = (value) => (
        <CountUp end={value as number} separator="," />
    );

    return (
        <div>
            <Row gutter={16} style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <Col span={7} style={{ backgroundColor: "white", padding: "20px", borderRadius: "8px" }}>
                    <Statistic title="Số lượng người dùng" value={data?.countUser} formatter={formatter} />
                </Col>
                <Col span={7} style={{ backgroundColor: "white", padding: "20px", borderRadius: "8px" }}>
                    <Statistic title="Số lượng đơn hàng" value={data?.countOrder} precision={2} formatter={formatter} />
                </Col>
                <Col span={7} style={{ backgroundColor: "white", padding: "20px", borderRadius: "8px" }}>
                    <Statistic title="Số lượng Sách" value={data?.countBook} precision={2} formatter={formatter} />
                </Col>
            </Row>
        </div>
    )
}

export default DashBoardPage;

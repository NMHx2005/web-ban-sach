import React from 'react';
import { Layout, Row, Col, Typography, Divider } from 'antd';
import './footer.scss';
import { EnvironmentOutlined, PhoneOutlined, MailOutlined, TikTokOutlined, YoutubeOutlined } from '@ant-design/icons'; // Import các icon cần thiết

const { Footer } = Layout;
const { Text, Link } = Typography;

const CustomFooter = () => {
    return (
        <Footer className="custom-footer">
            <Row justify="space-around" align="top">
                {/* Phần thông tin liên hệ */}
                <Col span={6}>
                    <Text strong>Liên hệ với chúng tôi</Text>
                    <Divider className="footer-divider" />
                    <ul>
                        <li>
                            <EnvironmentOutlined /> Số 2 Ngõ 109 Bằng Liệt - Hà Nội
                        </li>
                        <li>
                            <PhoneOutlined /> +84 123 456 789
                        </li>
                        <li>
                            <MailOutlined /> 22092005nguyenhung@gmail.com
                        </li>
                    </ul>
                </Col>

                {/* Phần liên kết nhanh */}
                <Col span={6}>
                    <Text strong>Liên kết nhanh</Text>
                    <Divider className="footer-divider" />
                    <ul>
                        <li>
                            <Link href="/">Trang chủ</Link>
                        </li>
                        <li>
                            <Link href="/san-pham">Sản phẩm</Link>
                        </li>
                        <li>
                            <Link href="/gioi-thieu">Giới thiệu</Link>
                        </li>
                        <li>
                            <Link href="/lien-he">Liên hệ</Link>
                        </li>
                    </ul>
                </Col>

                {/* Phần mạng xã hội */}
                <Col span={6}>
                    <Text strong>Theo dõi chúng tôi</Text>
                    <Divider className="footer-divider" />
                    <div className="social-icons">
                        <Link href="https://facebook.com" target="_blank">
                            <YoutubeOutlined />
                        </Link>
                        <Link href="https://twitter.com" target="_blank">
                            <TikTokOutlined />
                        </Link>
                    </div>
                </Col>
            </Row>

            {/* Phần bản quyền */}
            <Row justify="center" className="copyright">
                <Text type="secondary">
                    © 2025 Bản quyền thuộc về <Link href="/">NMHx</Link>
                </Text>
            </Row>
        </Footer>
    );
};

export default CustomFooter;
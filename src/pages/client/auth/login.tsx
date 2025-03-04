import { useCurrentApp } from "@/components/context/app.context";
import { loginAPI, loginWithGoogleAPI } from "@/services/api";
import { App, Button, Divider, Form, FormProps, Input } from "antd";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./responsive.scss"
import { GooglePlusOutlined } from "@ant-design/icons";
import { useGoogleLogin } from '@react-oauth/google';
import axios from "axios";


interface IFieldType {
    username: string;
    password: string;
};

const LoginPage = () => {
    const [isFinish, setItFinish] = useState<boolean>(false);
    const { message } = App.useApp();
    const { setIsAuthenticated, setUser } = useCurrentApp();

    const navigate = useNavigate();
    const showMessage = (content: string) => {
        message.success(`${content}`);
    };


    const onFinish: FormProps<IFieldType>['onFinish'] = async (values) => {
        setItFinish(true);
        const res = await loginAPI(values.username, values.password);

        if (res.data) {
            showMessage("Đăng Nhập Thành Công");
            localStorage.setItem("access_token", res.data.access_token);
            setIsAuthenticated(true);
            setUser(res.data.user);
            navigate("/");
        } else {
            message.error("Đăng Nhập Thất Bại");
        }
        setItFinish(false);
    };

    const loginGoogle = useGoogleLogin({
        onSuccess: async tokenResponse => {
            console.log(tokenResponse)
            const { data } = await axios(
                "https://www.googleapis.com/oauth2/v3/userinfo",
                {
                    headers: {
                        Authorization: `Bearer ${tokenResponse?.access_token}`,
                    },
                }
            );
            if (data && data.email) {
                // call backend crate user
                const res = await loginWithGoogleAPI("GOOGLE", data.email);

                if (res.data) {
                    showMessage("Đăng Nhập Thành Công");
                    localStorage.setItem("access_token", res.data.access_token);
                    setIsAuthenticated(true);
                    setUser(res.data.user);
                    navigate("/");
                } else {
                    message.error("Đăng Nhập Thất Bại");
                }

            }
        }
    });

    return (
        <>
            <div className="login__container" >
                <div style={{
                    width: "100%"
                }}>
                    <h1 className="text text-large">Đăng Nhập</h1>
                    <Divider />
                    <Form
                        name="basic"
                        labelCol={{ span: 24 }}
                        wrapperCol={{ span: 24 }}
                        initialValues={{ remember: true }}
                        onFinish={onFinish}
                        autoComplete="off"

                    >
                        <Form.Item<IFieldType>
                            label="Email: "
                            name="username"
                            rules={[{ required: true, message: 'Vui lòng nhập email!' },
                            { type: "email", message: "Vui lòng nhập đúng định dạng !!" }
                            ]}
                        >
                            <Input />
                        </Form.Item>

                        <Form.Item<IFieldType>
                            label="Password: "
                            name="password"
                            rules={[{ required: true, message: 'Vui lòng nhập mật khẩu!' }]}
                        >
                            <Input.Password />
                        </Form.Item>

                        <Form.Item label={null}>
                            <Button type="primary" htmlType="submit" loading={isFinish}>
                                Đăng Nhập
                            </Button>
                        </Form.Item>
                    </Form>
                    <Divider>Or</Divider>
                    <div
                        onClick={() => loginGoogle()}
                        title='Đăng nhập với tài khoản Google'
                        style={{
                            display: "flex", alignItems: "center",
                            justifyContent: "center", gap: 10,
                            textAlign: "center", marginBottom: 25,
                            cursor: "pointer"
                        }}>
                        Đăng nhập với
                        <GooglePlusOutlined
                            style={{ fontSize: 30, color: "orange" }} />
                    </div>
                    <p className="text text-normal" style={{ textAlign: "center" }}>
                        Chưa có tài khoản:
                        <span>
                            <Link to='/register' > Đăng Ký </Link>
                        </span>
                    </p>
                </div>
            </div>
        </>
    )
}

export default LoginPage;
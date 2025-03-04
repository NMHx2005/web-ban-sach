import { registerAPI } from "@/services/api";
import { App, Button, Divider, Form, FormProps, Input } from "antd";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./responsive.scss"
interface IFieldType {
    fullName: string;
    password: string;
    email: string;
    phone: string;
};

const RegisterPage = () => {
    const [isFinish, setItFinish] = useState<boolean>(false);
    const { message } = App.useApp();

    const navigate = useNavigate();
    const showMessage = (content: string) => {
        message.success(`${content}`);
    };


    const onFinish: FormProps<IFieldType>['onFinish'] = async (values) => {
        setItFinish(true);
        const res = await registerAPI(values.fullName, values.email, values.password, values.phone);

        if (res.data) {
            showMessage("Đăng Ký Thành Công");
            navigate("/login");
        } else {
            message.error("Email đã tồn tại !!!");
        }
        setItFinish(false);
    };

    return (
        <>
            <div className="login__container">
                <div style={{
                    width: "100%"
                }}>
                    <h1 className="text text-large">Đăng Ký Tài Khoản</h1>
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
                            label="Họ và Tên: "
                            name="fullName"
                            rules={[{ required: true, message: 'Vui lòng nhập họ và tên!' }]}
                        >
                            <Input />
                        </Form.Item>

                        <Form.Item<IFieldType>
                            label="Email: "
                            name="email"
                            rules={[{ required: true, message: 'Vui lòng nhập email!' },
                            { type: "email", message: "Email không đúng định dạng!" }
                            ]}
                        >
                            <Input />
                        </Form.Item>

                        <Form.Item<IFieldType>
                            label="Password"
                            name="password"
                            rules={[{ required: true, message: 'Vui lòng nhập mật khẩu!' }]}
                        >
                            <Input.Password />
                        </Form.Item>

                        <Form.Item<IFieldType>
                            label="Số Điện Thoại: "
                            name="phone"
                            rules={[{ required: true, message: 'Vui lòng nhập số điện thoại!' }]}
                        >
                            <Input />
                        </Form.Item>

                        <Form.Item label={null}>
                            <Button type="primary" htmlType="submit" loading={isFinish}>
                                Đăng Ký
                            </Button>
                        </Form.Item>
                    </Form>
                    <Divider>Or</Divider>
                    <p className="text text-normal" style={{ textAlign: "center" }}>
                        Đã có tài khoản ?
                        <span>
                            <Link to='/login' > Đăng Nhập </Link>
                        </span>
                    </p>
                </div>
            </div>
        </>
    )
}

export default RegisterPage;
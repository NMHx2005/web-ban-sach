import { App, Button, Form, FormProps, Input, Modal, Tabs } from 'antd';
import { TabsProps } from 'antd/lib';
import { useCurrentApp } from '@/components/context/app.context';
import { updatePassWordAPI } from '@/services/api';
import UpdateInfo from './UpdateInfo';

interface IProps {
    isModalOpenUpdateUser: boolean;
    setIsModalOpenUpdateUser: (v: boolean) => void;
}

type FieldType = {
    email: string;
    oldpass: string;
    newpass: string;
};


const UpdateCurrentUser = ({ isModalOpenUpdateUser, setIsModalOpenUpdateUser }: IProps) => {
    const { user } = useCurrentApp();
    const { message } = App.useApp();

    const onFinish: FormProps<FieldType>['onFinish'] = async (values) => {
        console.log(values);
        const res = await updatePassWordAPI({
            email: user?.email,
            oldpass: values.oldpass,
            newpass: values.newpass
        });
        console.log(res);
        if (res.data) {
            message.success("Cập nhật mật khẩu thành công!!!");
        } else {
            message.error("Cập nhật mật khẩu thất bại!!!")
        }
    };

    const onFinishFailed: FormProps<FieldType>['onFinishFailed'] = (errorInfo) => {
        console.log('Failed:', errorInfo);
    };


    const onChange = (key: string) => {
        // console.log(key);
    };


    const items: TabsProps['items'] = [
        {
            key: '1',
            label: 'Cập nhật thông tin',
            children:
                <>
                    <UpdateInfo />
                </>,
        },
        {
            key: '2',
            label: 'Đổi mật khẩu',
            children:
                <>
                    <div style={{ padding: "25px" }}>
                        <Form
                            name="basic"
                            labelCol={{ span: 24 }}
                            wrapperCol={{ span: 24 }}
                            style={{ maxWidth: 600 }}
                            initialValues={{ remember: true }}
                            onFinish={onFinish}
                            onFinishFailed={onFinishFailed}
                            autoComplete="off"
                        >
                            <Form.Item<FieldType>
                                label="Email: "
                                name="email"
                            >
                                <Input placeholder={user?.email} disabled />
                            </Form.Item>


                            <Form.Item<FieldType>
                                label="Mật khẩu hiện tại:"
                                name="oldpass"
                                rules={[{ required: true, message: 'Vui lòng nhập mật khẩu cũ!' }]}
                            >
                                <Input.Password />
                            </Form.Item>

                            <Form.Item<FieldType>
                                label="Mật khẩu mới"
                                name="newpass"
                                rules={[{ required: true, message: 'Vui lòng nhập mật khẩu mới!' }]}
                            >
                                <Input.Password />
                            </Form.Item>

                            <Form.Item label={null}>
                                <Button type="primary" htmlType="submit">
                                    Xác nhận
                                </Button>
                            </Form.Item>
                        </Form>
                    </div>
                </>,
        }
    ];

    const handleCancel = () => {
        setIsModalOpenUpdateUser(false);
    };
    return (
        <>
            <Modal title="Quản lý tài khoản" open={isModalOpenUpdateUser} width={"60%"} footer={false} onCancel={handleCancel}>
                <Tabs defaultActiveKey="1" items={items} onChange={onChange} />
            </Modal>
        </>
    )
}

export default UpdateCurrentUser;
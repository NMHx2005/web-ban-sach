import { useCurrentApp } from '@/components/context/app.context';
import { UploadOutlined } from '@ant-design/icons';
import { App, Avatar, Button, Form, Input, Space, Upload, UploadFile } from 'antd';
import { FormProps } from 'antd/lib';
import { useEffect, useState } from 'react';
import { UploadRequestOption as RcCustomRequestOptions } from 'rc-upload/lib/interface';
import { callUploadBookImg, updateUserInfoAPI } from '@/services/api';
import { UploadChangeParam } from 'antd/es/upload';
type FieldType = {
    _id: string;
    email: string;
    fullName: string;
    phone: string;
};
const UpdateInfo = () => {
    const [form] = Form.useForm();
    const { user, setUser } = useCurrentApp();

    const [userAvatar, setUserAvatar] = useState(user?.avatar ?? "");
    const [isSubmit, setIsSubmit] = useState(false);
    const { message, notification } = App.useApp();

    const urlAvatar = `${import.meta.env.VITE_BACKEND_URL}/images/avatar/${userAvatar}`;

    useEffect(() => {
        if (user) {
            form.setFieldsValue({
                _id: user.id,
                email: user.email,
                phone: user.phone,
                fullName: user.fullName
            })
        }
    }, [user])
    const onFinish: FormProps<FieldType>['onFinish'] = async (values) => {
        const { fullName, phone, _id } = values;
        setIsSubmit(true);
        const res = await updateUserInfoAPI(_id, userAvatar, fullName, phone);

        if (res && res.data) {
            //update react context
            setUser({
                ...user!,
                avatar: userAvatar,
                fullName,
                phone
            })
            message.success("Cập nhật thông tin user thành công");

            //force renew token
            localStorage.removeItem('access_token');
        } else {
            notification.error({
                message: "Đã có lỗi xảy ra",
                description: res.message
            })
        }
        setIsSubmit(false);
    };

    const handleUploadFile = async (options: RcCustomRequestOptions) => {
        const { onSuccess } = options;
        const file = options.file as UploadFile;
        const res = await callUploadBookImg(file, "avatar");

        if (res && res.data) {
            const newAvatar = res.data.fileUploaded;
            setUserAvatar(newAvatar);

            if (onSuccess)
                onSuccess('ok')
        } else {
            message.error(res.message)
        }
    };


    const propsUpload = {
        maxCount: 1,
        multiple: false,
        showUploadList: false,
        customRequest: handleUploadFile,
        onChange(info: UploadChangeParam) {
            if (info.file.status !== 'uploading') {
            }
            if (info.file.status === 'done') {
                message.success(`Upload file thành công`);
            } else if (info.file.status === 'error') {
                message.error(`Upload file thất bại`);
            }
        },
    };


    return (
        <>
            <div style={{ padding: "25px", display: "flex", justifyContent: "space-between" }}>
                <div >
                    <Space style={{ width: "100%", marginBottom: "50px" }} >
                        <Avatar size={150} src={urlAvatar} />
                    </Space>
                    <Upload {...propsUpload}>
                        <Button icon={<UploadOutlined />}>
                            Cập Nhật Avatar
                        </Button>
                    </Upload>
                </div>
                <div style={{ width: "50%" }}>
                    <Form
                        onFinish={onFinish}
                        form={form}
                        name="user-info"
                        autoComplete="off"
                    >
                        <Form.Item<FieldType>
                            hidden
                            labelCol={{ span: 24 }}
                            label="_id"
                            name="_id"
                        >
                            <Input disabled hidden />
                        </Form.Item>

                        <Form.Item<FieldType>
                            labelCol={{ span: 24 }}
                            label="Email"
                            name="email"
                            rules={[{ required: true, message: 'Email không được để trống!' }]}
                        >
                            <Input disabled placeholder={user?.email} />
                        </Form.Item>
                        <Form.Item<FieldType>
                            labelCol={{ span: 24 }}
                            label="Tên hiển thị"
                            name="fullName"
                            rules={[{ required: true, message: 'Tên hiển thị không được để trống!' }]}
                        >
                            <Input />
                        </Form.Item>
                        <Form.Item<FieldType>
                            labelCol={{ span: 24 }}
                            label="Số điện thoại"
                            name="phone"
                            rules={[{ required: true, message: 'Số điện thoại không được để trống!' }]}
                        >
                            <Input />
                        </Form.Item>
                        <Button loading={isSubmit} onClick={() => form.submit()}>Cập nhật</Button>
                    </Form>
                </div>
            </div>
        </>
    )
}


export default UpdateInfo;
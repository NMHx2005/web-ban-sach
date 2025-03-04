import { createAPI } from "@/services/api";
import { App, Form, Input, Modal } from "antd";


interface IProps {
    openModalCreate: boolean;
    setOpenModalCreate: (v: boolean) => void;
    refreshTable: () => void;
}

type FieldType = {
    fullName: string;
    password: string;
    phone: string;
    email: string;
};

const CreateUser = (props: IProps) => {
    const { openModalCreate, setOpenModalCreate, refreshTable } = props;
    const [form] = Form.useForm();
    const { message } = App.useApp();
    const { notification } = App.useApp();

    const handleSubmit = async () => {
        const dataUser = form.getFieldsValue();
        console.log(dataUser.email);
        const res = await createAPI(dataUser.fullName, dataUser.email, dataUser.password, dataUser.phone);

        if (res.data) {
            message.success("Create Success");
            setOpenModalCreate(false);
            refreshTable();
            form.resetFields();
        } else {
            notification.info({
                message: 'Tạo Không thành công'
            });
        }

    }

    return (
        <>
            <Modal
                title="Create User"
                open={openModalCreate}
                onOk={handleSubmit}
                onCancel={() => setOpenModalCreate(false)}
                okText={"Create"}
            >
                <Form
                    name="Create User"
                    labelCol={{ span: 24 }}
                    form={form}
                    wrapperCol={{ span: 24 }}
                    style={{ maxWidth: 600 }}
                >
                    <Form.Item<FieldType>
                        label="FullName: "
                        name="fullName"
                        rules={[{ required: true, message: 'Vui lòng nhập tên!' }]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item<FieldType>
                        label="Email: "
                        name="email"
                        rules={[{ required: true, message: 'Vui lòng điền email!' },
                        { type: "email", message: "Vui lòng nhập email đúng định dạng!" }
                        ]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item<FieldType>
                        label="Password: "
                        name="password"
                        rules={[{ required: true, message: 'Vui lòng điền mật khẩu!' }]}
                    >
                        <Input.Password />
                    </Form.Item>

                    <Form.Item<FieldType>
                        label="Phone: "
                        name="phone"
                        rules={[{ required: true, message: 'Vui lòng nhập số điện thoại!' }]}
                    >
                        <Input />
                    </Form.Item>
                </Form>
            </Modal>
        </>
    )
}

export default CreateUser;
import { updateUser } from "@/services/api";
import { App, Input, Modal, notification } from "antd";
import { useEffect, useState } from "react";


interface IUser {
    _id: string;
    fullName: string;
    email: string;
    phone: string;
    role: string;
    avatar: string;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}
interface IProps {
    isModalOpenUpdateUser: boolean;
    setIsModalOpenUpdateUser: (v: boolean) => void;
    dataUpdate: IUser | null;
    setDataUpdate: (v: IUser | null) => void;
    refreshTable: () => void;
}

const UpdateUser = ({ refreshTable, setDataUpdate, dataUpdate, setIsModalOpenUpdateUser, isModalOpenUpdateUser }: IProps) => {

    const [id, setId] = useState<string>("");
    const [fullName, setFullName] = useState<string>("");
    const [phone, setPhone] = useState<string>("");
    const { message } = App.useApp();


    useEffect(() => {
        if (dataUpdate && dataUpdate._id) {
            setFullName(dataUpdate?.fullName);
            setPhone(dataUpdate?.phone);
            setId(dataUpdate._id);
        }
    }, [dataUpdate]);

    const handleOk = async () => {
        setIsModalOpenUpdateUser(false);
        setDataUpdate(null);

        const res = await updateUser(id, fullName, phone);

        if (res.data) {
            message.success("Cập nhật thành công");
            refreshTable();
        } else {
            notification.error({
                message: "Cập nhật không thành công"
            })
        }
    };

    const handleCancel = () => {
        setDataUpdate(null);
        setIsModalOpenUpdateUser(false);
    };

    return (
        <>
            <Modal
                title="Cập Nhật Người Dùng"
                open={isModalOpenUpdateUser}
                onOk={handleOk}
                onCancel={handleCancel}
                okText={"Cập Nhật"}
            >
                <div style={{
                    marginBottom: "15px"
                }}>
                    <label>ID: </label>
                    <Input onChange={(event) => setFullName(event.target.value)} style={{ marginTop: "5px" }} value={id} disabled />
                </div>

                <div style={{
                    marginBottom: "15px"
                }}>
                    <label>FullName: </label>
                    <Input onChange={(event) => setFullName(event.target.value)} style={{ marginTop: "5px" }} value={fullName} />
                </div>


                <div>
                    <label>Phone: </label>
                    <Input onChange={(event) => setFullName(event.target.value)} style={{ marginTop: "5px" }} value={phone} />
                </div>
            </Modal>
        </>
    );
}

export default UpdateUser;
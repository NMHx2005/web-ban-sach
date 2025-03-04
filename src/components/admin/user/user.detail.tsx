import { Avatar, Descriptions, Drawer } from "antd";
import { UserOutlined, MailOutlined, PhoneOutlined, IdcardOutlined, SettingOutlined, ScheduleOutlined, FieldTimeOutlined } from "@ant-design/icons";
import "./UserDetail.css"; // Import CSS tùy chỉnh
import dayjs from "dayjs"
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
    openModalDetail: boolean;
    setOpenModalDetail: (v: boolean) => void;
    setDataUser: (v: null) => void;
    dataUser: IUser | null;
}

const UserDetail = (props: IProps) => {
    const { dataUser, setDataUser, openModalDetail, setOpenModalDetail } = props;

    const resetAndCloseModal = () => {
        setOpenModalDetail(false);
        setDataUser(null);
    };

    const avatarURL = `${import.meta.env.VITE_BACKEND_URL}/images/avatar/${dataUser?.avatar}`;

    return (
        <>
            <Drawer
                title={<h2 className="drawer-title">Thông Tin Người Dùng</h2>}
                onClose={resetAndCloseModal}
                open={openModalDetail}
                width={"60%"}
                className="user-detail-drawer"
            >
                <Descriptions
                    title={<h3 className="descriptions-title">User Information</h3>}
                    bordered
                    column={{ xs: 1, sm: 2, lg: 2 }}
                    className="custom-descriptions"
                >
                    <Descriptions.Item label={<><IdcardOutlined /> ID</>}>
                        <span className="description-value">{dataUser?._id || "N/A"}</span>
                    </Descriptions.Item>
                    <Descriptions.Item label={<><UserOutlined /> Full Name</>}>
                        <span className="description-value">{dataUser?.fullName || "N/A"}</span>
                    </Descriptions.Item>
                    <Descriptions.Item label={<><MailOutlined /> Email</>}>
                        <span className="description-value">{dataUser?.email || "N/A"}</span>
                    </Descriptions.Item>
                    <Descriptions.Item label={<><PhoneOutlined /> Phone</>}>
                        <span className="description-value">{dataUser?.phone || "N/A"}</span>
                    </Descriptions.Item>

                    <Descriptions.Item label={<><SettingOutlined /> Role</>}>
                        <span className="description-value">{dataUser?.role || "N/A"}</span>
                    </Descriptions.Item>

                    <Descriptions.Item label={<><SettingOutlined /> Avatar</>}>
                        <Avatar src={avatarURL}></Avatar>
                    </Descriptions.Item>

                    <Descriptions.Item label={<><ScheduleOutlined /> Created At</>}>
                        <span className="description-value">{dayjs(dataUser?.createdAt).format("YYYY - MM - DD") || "N/A"}</span>
                    </Descriptions.Item>

                    <Descriptions.Item label={<><FieldTimeOutlined /> Update At</>}>
                        <span className="description-value">{dayjs(dataUser?.updatedAt).format("YYYY - MM - DD") || "N/A"}</span>
                    </Descriptions.Item>
                </Descriptions>
            </Drawer>
        </>
    );
};

export default UserDetail;

import { deleteUser, getUsersAPI } from '@/services/api';
import { DeleteOutlined, EditOutlined, ExportOutlined, ImportOutlined, PlusOutlined } from '@ant-design/icons';
import type { ActionType, ProColumns } from '@ant-design/pro-components';
import { ProTable } from '@ant-design/pro-components';
import { App, Button, Popconfirm, Upload } from 'antd';
import { useEffect, useRef, useState } from 'react';
import { dateRangeValidate } from '@/helpers/helper';
import UserDetail from './user.detail';
import CreateUser from './create.user';
import UploadUser from './upload.user';
import { CSVLink } from 'react-csv';
import UpdateUser from './update.user';
import { PopconfirmProps } from 'antd/lib';

type TSearch = {
    fullName: string;
    email: string;
    createdAt: string;
    createdAtRange: string;
}

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

const TableUser = () => {
    const [openModalDetail, setOpenModalDetail] = useState<boolean>(false);
    const [openModalCreate, setOpenModalCreate] = useState<boolean>(false);
    const [openModelImport, setOpenModalImport] = useState<boolean>(false);
    const [isModalOpenUpdateUser, setIsModalOpenUpdateUser] = useState(false);
    const [dataExport, setDataExport] = useState<IUser[] | null>(null);
    const [dataUpdate, setDataUpdate] = useState<IUser | null>(null);
    const { message } = App.useApp();

    const [dataUser, setDataUser] = useState<IUser | null>(null);
    const [meta, setMeta] = useState({
        current: 1,
        pageSize: 5,
        pages: 0,
        total: 0
    })

    const handleClick = (entity: IUserTableAdmin) => {
        setOpenModalDetail(true);
        setDataUser(entity);
    }

    const submitDelete = async (value: IUser) => {
        const res = await deleteUser(value._id);

        if (res.data) {
            message.success("Xóa Thành Công");
            refreshTable();
        } else {
            message.error("Xóa thất bại");
        }
    };

    const cancel: PopconfirmProps['onCancel'] = (e) => {
        // Điền lệnh nếu hủy xóa thì làm gì trong này
        // tôi chọn hủy xóa thì kệ nên bỏ qua
    };


    const columns: ProColumns<IUserTableAdmin>[] = [
        {
            dataIndex: 'index',
            valueType: 'indexBorder',
            width: 48,
        },
        {
            title: 'Id',
            dataIndex: '_id',
            hideInSearch: true,
            render: (dom, entity, index, action, schema) => {
                return (
                    <>
                        <a
                            href='#'
                            onClick={() => handleClick(entity)}
                        >
                            {entity._id}
                        </a>
                    </>
                )
            }
        },
        {
            title: 'Full Name',
            dataIndex: 'fullName'
        },
        {
            title: 'Email',
            dataIndex: 'email',
            copyable: true
        },
        {
            title: 'Created At',
            dataIndex: 'createdAt',
            valueType: 'date',
            sorter: true,
            hideInSearch: true
        },
        {
            title: 'Created At',
            dataIndex: 'createdAtRange',
            valueType: 'dateRange',
            hideInTable: true,
        },
        {
            title: 'Action',
            hideInSearch: true,
            render(dom, entity, index, action, schema) {
                return (
                    <>
                        <span
                            style={{
                                color: "orange",
                                cursor: "pointer",
                                marginRight: "10px"
                            }}
                            onClick={() => {
                                setDataUpdate(entity);
                                setIsModalOpenUpdateUser(true);
                            }}
                        >
                            <EditOutlined />
                        </span>
                        <Popconfirm
                            title="Delete the task"
                            description="Are you sure to delete this task?"
                            onConfirm={() => submitDelete(entity)}
                            onCancel={cancel}
                            okText="Yes"
                            cancelText="No"
                            placement='left'
                        >
                            <span
                                style={{
                                    color: "red",
                                    cursor: "pointer"
                                }}
                            >
                                <DeleteOutlined />
                            </span>
                        </Popconfirm>
                    </>
                )
            },
        },

    ];

    const actionRef = useRef<ActionType>();

    const refreshTable = () => {
        actionRef.current?.reload();
    }



    return (
        <>
            <ProTable<IUserTableAdmin, TSearch>
                columns={columns}
                actionRef={actionRef}
                cardBordered
                request={async (params, sort, filter) => {

                    // Làm phần sort của createdAt
                    let query = "";
                    if (params) {
                        query += `current=${params.current}&pageSize=${params.pageSize}`
                        if (params.email) {
                            query += `&email=/${params.email}/i`
                        }
                        if (params.fullName) {
                            query += `&fullName=/${params.fullName}/i`
                        }
                        const createDateRange = dateRangeValidate(params.createdAtRange);
                        if (createDateRange) {
                            query += `&createdAt>=${createDateRange[0]}&createdAt<=${createDateRange[1]}`
                        }
                    }
                    // Xử lý phần sort theo createdAt
                    if (sort && sort.createdAt) {
                        if (sort.createdAt === "ascend") {
                            query += `&sort=createdAt`;
                        } else {
                            query += `&sort=-createdAt`;
                        }
                    } else {
                        // Nếu không có sort.createdAt, áp dụng mặc định
                        query += `&sort=-createdAt`;
                    }


                    const res = await getUsersAPI(query);
                    if (res.data) {
                        setMeta(res.data.meta);
                        setDataExport(res.data.result);
                    }
                    return {
                        data: res.data?.result,
                        page: meta.pages,
                        "success": true,
                        total: meta.total
                    }
                }}
                rowKey="_id"
                pagination={{
                    pageSize: meta.pageSize,
                    pageSizeOptions: ['5', '10', '20', '30'],
                    current: meta.current,
                    total: meta.total,
                    showSizeChanger: true
                    // // onChange: (page) => console.log(page)

                }}
                headerTitle="Table user"
                toolBarRender={() => [
                    <Button
                        key="button"
                        icon={<ExportOutlined />}
                        type="primary"
                        onClick={() => {

                        }}
                    >
                        {dataExport && <CSVLink data={dataExport}>Export</CSVLink>}
                    </Button>,
                    <Button
                        key="button"
                        icon={<ImportOutlined />}
                        type="primary"
                        onClick={() => {
                            setOpenModalImport(true)
                        }}
                    >
                        Import
                    </Button>,
                    <Button
                        key="button"
                        icon={<PlusOutlined />}
                        onClick={() => {
                            setOpenModalCreate(true);
                        }}
                        type="primary"
                    >
                        Add new
                    </Button>
                ]}
            />
            <UserDetail
                setOpenModalDetail={setOpenModalDetail}
                openModalDetail={openModalDetail}
                dataUser={dataUser}
                setDataUser={setDataUser}
            />

            <CreateUser
                openModalCreate={openModalCreate}
                refreshTable={refreshTable}
                setOpenModalCreate={setOpenModalCreate}
            />

            <UploadUser
                refreshTable={refreshTable}
                openModelImport={openModelImport}
                setOpenModalImport={setOpenModalImport}
            />

            <UpdateUser
                isModalOpenUpdateUser={isModalOpenUpdateUser}
                setIsModalOpenUpdateUser={setIsModalOpenUpdateUser}
                dataUpdate={dataUpdate}
                setDataUpdate={setDataUpdate}
                refreshTable={refreshTable}
            />

        </>
    );
};

export default TableUser;
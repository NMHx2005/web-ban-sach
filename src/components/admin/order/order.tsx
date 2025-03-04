import { orderAdminAPI } from '@/services/api';
import type { ActionType, ProColumns } from '@ant-design/pro-components';
import { ProTable } from '@ant-design/pro-components';
import { useRef, useState } from 'react';

interface IOrder {
    _id: string;
    name: string;
    address: string;
    phone: string;
    type: string;
    paymentStatus: string;
    paymentRef: string;
    detail: IItemOrder[];
    totalPrice: number;
    createdAt: string;
    updatedAt: string;
    __v: number;
}

interface IItemOrder {
    bookName: string;
    quantity: number;
    _id: string;
}

interface ISearch {
    mainText: string;
    author: string;
}


export default () => {
    const actionRef = useRef<ActionType>();
    const [meta, setMeta] = useState({
        current: 1,
        pageSize: 5,
        pages: 0,
        total: 0
    });

    const columns: ProColumns<IOrder>[] = [
        {
            title: 'STT',
            dataIndex: 'index',
            valueType: 'indexBorder',
            width: 48,
        },
        {
            title: 'ID',
            dataIndex: '_id',
            ellipsis: true,
            hideInSearch: true,
            render(dom, entity, index, action, schema) {
                return (
                    <>
                        <a
                            href='#'
                        >
                            {entity._id}
                        </a>
                    </>
                )
            },
        },
        {
            title: 'FullName',
            dataIndex: 'name',
            ellipsis: true,
            formItemProps: {
                rules: [
                    {
                        required: true,
                        message: 'Tên khách hàng là bắt buộc',
                    },
                ],
            },
        },
        {
            title: 'Address',
            dataIndex: 'address',
            ellipsis: true,
        },
        {
            title: 'Giá Tiền',
            dataIndex: 'totalPrice',
            valueType: 'money',
            sorter: true,
            hideInSearch: true,
            render(dom, entity, index, action, schema) {
                return (
                    <>
                        {entity.totalPrice.toLocaleString('vi-VN')} VNĐ
                    </>
                )
            },
        },
        {
            title: 'Created At',
            dataIndex: 'createdAt',
            valueType: 'date',
            sorter: true,
            hideInSearch: true
        },
    ];


    return (
        <ProTable<IOrder, ISearch>
            columns={columns}
            actionRef={actionRef}
            cardBordered
            request={async (params, sort, filter) => {
                let query = "";
                if (params) {
                    query += `current=${params.current}&pageSize=${params.pageSize}`;
                    if (params.mainText) {
                        query += `&mainText=${params.mainText}`;
                    }
                    if (params.author) {
                        query += `&author=${params.author}`;
                    }
                }

                // Default sort by createdAt descending if no sort is provided
                let hasSort = false;
                if (sort) {
                    const sortFields = ['mainText', 'category', 'author', 'price', 'updateAt'];
                    sortFields.forEach(field => {
                        if (sort[field]) {
                            hasSort = true;
                            const order = sort[field] === "ascend" ? '' : '-';
                            query += `&sort=${order}${field}`;
                        }
                    });
                }
                if (!hasSort) {
                    query += "&sort=-createdAt";
                }

                try {
                    const res = await orderAdminAPI(query);
                    if (res.data) {
                        setMeta(res.data.meta);
                        return {
                            data: res.data.result,
                            success: true,
                            total: res.data.meta.total,
                            current: res.data.meta.current,
                        };
                    }
                } catch (error) {
                    console.error("Error fetching books:", error);
                }
                return {
                    data: [],
                    success: false,
                    total: 0
                };
            }}
            rowKey="_id" // Sử dụng '_id' làm khóa duy nhất
            pagination={{
                pageSize: meta.pageSize,
                current: meta.current,
                total: meta.total,
                pageSizeOptions: ['5', '10', '20', '30'],
                showSizeChanger: true,
            }}
            headerTitle="Danh sách đơn hàng"
            search={{
                labelWidth: 'auto',
            }}
        />
    );
};
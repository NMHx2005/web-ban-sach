import React, { useEffect, useState } from 'react';
import { Badge, Button, Descriptions, DescriptionsProps, Drawer, Image, Upload } from 'antd';
import dayjs from 'dayjs';
import { PlusOutlined } from '@ant-design/icons';
import type { GetProp, UploadFile, UploadProps } from 'antd';
import { v4 as uuidv4 } from 'uuid';

type IBookAdmin = {
    _id: string;
    thumbnail: string;
    slider: string[];
    mainText: string;
    author: string;
    price: number;
    sold: number;
    quantity: number;
    category: string;
    createdAt: string;
    updatedAt: string;
};

interface IListImage {
    uid: string;
    name: string;
    url: string;
}

interface IProps {
    setOpenDetailBook: (v: boolean) => void;
    openDetailBook: boolean;
    dataDetailBook: IBookAdmin | null;
    setDataDetailBook: (v: IBookAdmin | null) => void;
}

type FileType = Parameters<GetProp<UploadProps, 'beforeUpload'>>[0];

const DetailBook = ({ dataDetailBook, setDataDetailBook, openDetailBook, setOpenDetailBook }: IProps) => {
    if (!dataDetailBook) return null; // Trả về null nếu không có dữ liệu

    const [previewOpen, setPreviewOpen] = useState(false);
    const [previewImage, setPreviewImage] = useState('');
    const [fileList, setFileList] = useState<UploadFile[]>([]);

    useEffect(() => {
        const newListImage = [];

        if (dataDetailBook.thumbnail) {
            newListImage.push({
                uid: uuidv4(),
                name: dataDetailBook.thumbnail,
                url: `${import.meta.env.VITE_BACKEND_URL}/images/book/${dataDetailBook.thumbnail}`
            });
        }

        if (dataDetailBook.slider && dataDetailBook.slider.length > 0) {
            const sliderImages = dataDetailBook.slider.map((item) => ({
                uid: uuidv4(),
                name: item,
                url: `${import.meta.env.VITE_BACKEND_URL}/images/book/${item}`
            }));
            newListImage.push(...sliderImages);
        }
        setFileList(newListImage);
    }, [dataDetailBook]);


    const getBase64 = (file: FileType): Promise<string> =>
        new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result as string);
            reader.onerror = (error) => reject(error);
        });

    const items: DescriptionsProps['items'] = [
        {
            key: '1',
            label: 'ID',
            children: `${dataDetailBook._id}`,
        },
        {
            key: '2',
            label: 'Tên Sách',
            children: `${dataDetailBook.mainText}`,
        },
        {
            key: '3',
            label: 'Tác Giả',
            children: `${dataDetailBook.author}`,
        },
        {
            key: '4',
            label: 'Giá Tiền',
            children: `${dataDetailBook.price.toLocaleString("vi-VN")} VNĐ`,
        },
        {
            key: '5',
            label: "Thể Loại",
            children: <Badge status="processing" text={dataDetailBook.category} />,
            span: 2,
        },
        {
            key: '6',
            label: 'CreateAt',
            children: `${dayjs(`${dataDetailBook.createdAt}`).format('DD-MM-YYYY')}`
        },
        {
            key: '7',
            label: 'UpdateAt',
            children: `${dayjs(`${dataDetailBook.updatedAt}`).format('DD-MM-YYYY')}`
        },
    ];

    const handlePreview = async (file: UploadFile) => {
        if (!file.url && !file.preview) {
            file.preview = await getBase64(file.originFileObj as FileType);
        }

        setPreviewImage(file.url || (file.preview as string));
        setPreviewOpen(true);
    };

    const handleChange: UploadProps['onChange'] = ({ fileList: newFileList }) => setFileList(newFileList);


    return (
        <>
            <Drawer
                width={"70%"}
                title="Book Detail"
                onClose={() => {
                    setOpenDetailBook(false);
                    setDataDetailBook(null);
                }}
                open={openDetailBook}
            >
                <Descriptions title="Book Info" bordered items={items} />;
                <h3 style={{ marginBottom: "10px" }}>Images Book</h3>

                <Upload
                    action="https://660d2bd96ddfa2943b33731c.mockapi.io/api/upload"
                    listType="picture-card"
                    fileList={fileList}
                    onPreview={handlePreview}
                    onChange={handleChange}
                    showUploadList={{
                        showRemoveIcon: false
                    }}
                >
                </Upload>
                {previewImage && (
                    <Image

                        wrapperStyle={{ display: 'none' }}
                        preview={{
                            visible: previewOpen,
                            onVisibleChange: (visible) => setPreviewOpen(visible),
                            afterOpenChange: (visible) => !visible && setPreviewImage(''),
                        }}
                        src={previewImage}
                    />
                )}
            </Drawer>
        </>
    )
}

export default DetailBook;
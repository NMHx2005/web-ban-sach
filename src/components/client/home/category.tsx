import { Button, Checkbox, Divider, Form, InputNumber, Rate } from 'antd';
import type { CheckboxProps } from 'antd';
import './homeDetail.scss'
import './responsive.home.scss'
import { FilterOutlined, UndoOutlined } from '@ant-design/icons';
import { useEffect, useState } from 'react';


interface IProps {
    dataCategory: string[] | null;
    onTabChange: (key: string, v: boolean) => void;
    fetchBook: () => void;
}


const Category = (props: IProps) => {
    const [form] = Form.useForm();
    const { dataCategory, onTabChange, fetchBook } = props;
    const [categoryList, setCategoryList] = useState([]);

    useEffect(() => {
        let queryPlusHandle = "";
        categoryList.forEach(item => {
            queryPlusHandle += `${item},`;
        });
        onTabChange(queryPlusHandle, false);
    }, [categoryList]);


    const checkboxes = dataCategory?.map((item, index) => {
        return {
            key: index + 1,
            name: item,
            label: item
        };
    });

    const toggleItem = (item: string) => {
        setCategoryList((prevItems: any) => {
            const updatedItems = prevItems.includes(item)
                ? prevItems.filter((i: string) => i !== item)
                : [...prevItems, item];
            return updatedItems;
        });
    };

    const onChange: CheckboxProps['onChange'] = (e) => {
        if (e.target.id) {
            toggleItem(e.target.id);
        }
    };

    const ClearOption = () => {
        fetchBook();
        form.resetFields();
        setCategoryList([]);
    }
    const onFinish = (values: any) => {
        let valuePrice = `&price>=${values.minPrice}&price<=${values.maxPrice}`;
        let queryPlusHandle = "";
        categoryList.forEach(item => {
            queryPlusHandle += `${item},`;
        });
        valuePrice += `&category=${queryPlusHandle}`;
        onTabChange(valuePrice, true);
    };

    return (
        <>
            <div style={{
                padding: "16px"
            }}>
                <div>
                    <div className='head__category'>
                        <div>
                            <FilterOutlined style={{ color: "#61DAFB" }} /> Bộ Lọc Tìm Kiếm
                        </div>

                        <div
                            style={{ cursor: "pointer" }}
                            onClick={() => ClearOption()}
                        >
                            <UndoOutlined />
                        </div>

                    </div>
                    <Divider />
                    <div>
                        <div style={{
                            marginBottom: "20px"
                        }}>
                            Danh Mục Sản Phẩm
                        </div>
                        <Form form={form} onFinish={onFinish}>
                            {checkboxes?.map((checkbox, index) => (
                                <Form.Item
                                    key={index}
                                    name={checkbox.name}
                                    valuePropName="checked"
                                >
                                    <Checkbox
                                        onChange={onChange}
                                    >
                                        {checkbox.label}
                                    </Checkbox>
                                </Form.Item>
                            ))}
                            <Divider />
                            <div>
                                <div>Khoảng giá: </div>
                                <div
                                    style={{
                                        display: "flex",
                                        justifyContent: "space-between",
                                        marginTop: "10px",
                                        gap: "5px"
                                    }}
                                >
                                    <Form.Item name="minPrice">
                                        <InputNumber
                                            placeholder='VNĐ'
                                            formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                        />
                                    </Form.Item>
                                    -
                                    <Form.Item name="maxPrice">
                                        <InputNumber
                                            placeholder='VNĐ'
                                            formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                        />
                                    </Form.Item>
                                </div>
                            </div>
                            <Button
                                style={{ width: "100%", marginTop: "40px" }}
                                type="primary"
                                htmlType="submit"
                            >
                                Áp dụng
                            </Button>
                        </Form>
                    </div>
                </div>
                <Divider />
                <div>
                    <div style={{ marginBottom: "20px" }}>Đánh Giá: </div>
                    <Rate disabled value={5} />
                    <Rate disabled value={4} /> trở lên
                    <Rate disabled value={3} /> trở lên
                    <Rate disabled value={2} /> trở lên
                    <Rate disabled value={1} /> trở lên
                </div>
            </div>
        </>
    )
}

export default Category;
import { InboxOutlined } from "@ant-design/icons";
import { App, message, Modal, notification, Table, Upload, UploadProps } from "antd";
import Exceljs from 'exceljs';
import { Buffer } from 'buffer';
import { useState } from "react";
import { bulkCreateUserAPI } from "@/services/api";
import templateFile from "assets/template/user.xlsx?url";

interface IProps {
    openModelImport: boolean;
    setOpenModalImport: (v: boolean) => void;
    refreshTable: () => void;
}

interface IDataImport {
    fullName: string;
    email: string;
    phone: string;
}

const UploadUser = ({ refreshTable, openModelImport, setOpenModalImport }: IProps) => {

    const { Dragger } = Upload;

    const { message } = App.useApp();
    const [dataImport, setDataImport] = useState<IDataImport[]>([]);
    const [isSubmit, setIsSubmit] = useState<boolean>(false);

    const propsUpload: UploadProps = {
        name: 'file',
        multiple: false,
        maxCount: 1,
        // https://stackoverflow.com/questions/11832930/html-input-file-accept-attribute-file-type-csv
        accept: ".csv,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        // https://stackoverflow.com/questions/51514757/action-function-is-required-with-antd-upload-control-but-i-dont-need-it
        async customRequest({ file, onSuccess }) {
            setTimeout(() => {
                if (onSuccess) onSuccess("ok");
            }, 1000);
        },
        async onChange(info) {
            const { status } = info.file;
            if (status !== 'uploading') {
                // console.log(info.file, info.fileList);
            }
            if (status === 'done') {
                message.success(`${info.file.name} file uploaded successfully.`);
                if (info.fileList && info.fileList.length > 0) {
                    const file = info.fileList[0].originFileObj!;
                    //load file to buffer
                    const workbook = new Exceljs.Workbook();
                    const arrayBuffer = await file.arrayBuffer()
                    const buffer = Buffer.from(arrayBuffer);
                    await workbook.xlsx.load(buffer);
                    //convert file to json
                    let jsonData: IDataImport[] = [];
                    workbook.worksheets.forEach(function (sheet) {
                        // read first row as data keys
                        let firstRow = sheet.getRow(1);
                        if (!firstRow.cellCount) return;
                        let keys = firstRow.values as any[];
                        sheet.eachRow((row, rowNumber) => {
                            if (rowNumber == 1) return;
                            let values = row.values as any;
                            let obj: any = {};
                            for (let i = 1; i < keys.length; i++) {
                                obj[keys[i]] = values[i];
                            }
                            jsonData.push(obj);
                        })
                    });
                    jsonData = jsonData.map((item, index) => {
                        return { ...item, id: index + 1 }
                    })
                    setDataImport(jsonData)
                }
            } else if (status === 'error') {
                message.error(`${info.file.name} file upload failed.`);
            }
        },
        onDrop(e) {
            console.log('Dropped files', e.dataTransfer.files);
        },
    };

    const handleOk = async () => {
        setIsSubmit(true);
        const dataSubmit = dataImport.map(item => ({
            fullName: item.fullName,
            email: item.email,
            phone: item.phone,
            password: import.meta.env.VITE_USER_CREATE_DEFAULT_PASSWORD
        }))
        const res = await bulkCreateUserAPI(dataSubmit);
        if (res.data) {
            notification.success({
                message: "Bulk Create Users",
                description: `Success = ${res.data.countSuccess}. Error = ${res.data.countError}`
            })
        }
        setIsSubmit(false);
        setOpenModalImport(false);
        setDataImport([]);
        refreshTable();
    }



    return (
        <>
            <Modal
                okButtonProps={{
                    disabled: dataImport.length > 0 ? false : true,
                    loading: isSubmit
                }}
                title="Import Data User"
                open={openModelImport}
                onOk={handleOk}
                okText={"Import Data"}
                onCancel={() => {
                    setOpenModalImport(false);
                    setDataImport([]);
                }}
                width={"60%"}
                maskClosable={false}
                destroyOnClose={true}
            >
                <Dragger {...propsUpload}>
                    <p className="ant-upload-drag-icon">
                        <InboxOutlined />
                    </p>
                    <p className="ant-upload-text">Click or drag file to this area to upload</p>
                    <p className="ant-upload-hint">
                        Support for a single upload. Only accept .csv, .xls, .xlsx . or
                        &nbsp;
                        <a
                            onClick={e => e.stopPropagation()}
                            href={templateFile}
                            download
                        >
                            Download Sample File
                        </a>
                    </p>
                </Dragger>
                <br />
                <br />
                <p>Dữ Liệu Upload: </p>
                <Table
                    style={{ marginTop: 8 }}
                    dataSource={dataImport}
                    rowKey={"id"}
                    columns={[
                        { title: 'Tên hiển thị', dataIndex: 'fullName', key: 'fullName' },
                        { title: 'Email', dataIndex: 'email', key: 'email' },
                        { title: 'Số điện thoại', dataIndex: 'phone', key: 'phone' },
                    ]}
                />
            </Modal>
        </>
    )
}

export default UploadUser;
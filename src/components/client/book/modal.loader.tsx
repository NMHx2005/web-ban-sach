import './book.scss'
import './loader.scss'
import { Skeleton, Space } from 'antd';


const BookLoader = () => {


    return (
        <>
            <div style={{ background: '#efefef', padding: "20px 0" }}>
                <div style={{ maxWidth: 1440, margin: '0 auto', minHeight: "calc(100vh - 150px)" }}>
                    <div style={{ padding: "20px", background: '#fff', borderRadius: 5, display: "flex", flexWrap: "wrap" }}>
                        <div className='left'>
                            <div style={{ width: "100%" }}>
                                <Skeleton.Node
                                    active={true}
                                    style={{ height: 600 }}
                                    className="custom-skeleton-node"
                                />
                            </div>
                            <Space style={{ width: "100%", display: "flex", justifyContent: "center", marginTop: "10px" }}>
                                <Skeleton.Image active={true} />
                                <Skeleton.Image active={true} />
                                <Skeleton.Image active={true} />
                            </Space>
                        </div>
                        <div className='right'>
                            <Skeleton />
                            <div style={{ height: "20px" }}></div>
                            <Skeleton active />
                            <div style={{ height: "50px" }}></div>
                            <Space>
                                <Skeleton.Button active={true} style={{ width: 150 }} />
                                <Skeleton.Button active={true} />
                            </Space>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}


export default BookLoader;
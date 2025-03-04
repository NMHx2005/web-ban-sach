import { Button, Result } from "antd";
import { useCurrentApp } from "components/context/app.context";
import { Link, useLocation } from "react-router-dom";

interface IProps {
    children: React.ReactNode;
}

const ProtectedRoute = (props: IProps) => {
    const { isAuthenticated, user } = useCurrentApp();
    const location = useLocation();
    if (isAuthenticated === false) {
        return (
            <Result
                status="404"
                title="403"
                subTitle="Xin lỗi, bạn cần đăng nhập để vào trang này!!!"
                extra={<Button type="primary">
                    <Link to={"/"}>Back Home</Link>
                </Button>}
            />
        )
    }
    const isAdminRoute = location.pathname.includes("admin");

    if (isAuthenticated === true && isAdminRoute === true) {
        const role = user?.role;
        if (role === "USER") {
            return (
                <Result
                    status="403"
                    title="403"
                    subTitle="Xin lỗi, Bạn không đủ quyền hạn truy cập vào trang này!!!"
                    extra={<Button type="primary">
                        <Link to={"/"}>Back Home</Link>
                    </Button>}
                />
            )
        }
    }

    return (
        <>
            {props.children}
        </>
    )
}

export default ProtectedRoute;
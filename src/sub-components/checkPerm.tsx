import React, { useEffect, useState } from "react";
const apiUrl = import.meta.env.VITE_BACKEND_URL;
import { Navigate } from "react-router-dom";

interface CheckPermProps {
    children: React.ReactNode;
}
interface CheckPermSideProps {
    children: React.ReactNode;
}


const CheckPerm: React.FC<CheckPermProps> = ({ children }) => {
    const [loading, setLoading] = useState(true);
    const [hasPermission, setHasPermission] = useState(false);

    useEffect(() => {
        fetch(`${apiUrl}/api/user/checkPerm`, {
            method: "GET",
            credentials: "include",
        })
            .then((res) => res.json())
            .then((data) => {
                setHasPermission(data.isAuth);
                setLoading(false);
            })
            .catch(() => {
                setHasPermission(false);
                setLoading(false);
            });
    }, []);

    if (loading) {
        return;
    }

    if (!hasPermission) {
        return <Navigate to="/InsufficientPermission" replace />;
    }

    return <>{children}</>;
};



export const CheckPermSide: React.FC <CheckPermSideProps>= ({children}) => {
    const [loading, setLoading] = useState(true);
    const [hasPermission, setHasPermission] = useState(false);

    useEffect(() => {
        fetch(`${apiUrl}/api/user/checkPerm`, {
            method: "GET",
            credentials: "include",
        })
            .then((res) => res.json())
            .then((data) => {
                setHasPermission(data.isAuth);
                setLoading(false);
            })
            .catch(() => {
                setHasPermission(false);
                setLoading(false);
            });
    }, []);

    if (loading) {
        return;
    }

    if (!hasPermission) {
        return false;
    }

    return <>{children}</>;
}

export default CheckPerm;

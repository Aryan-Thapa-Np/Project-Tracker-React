import React, { useEffect, useState } from "react";
import type { User } from "../types/usersFTypes.tsx";
const apiUrl = import.meta.env.VITE_BACKEND_URL;
import { Navigate } from "react-router-dom";



interface PrivateRouteProps {
    children: React.ReactNode;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ children }) => {
    const [loading, setLoading] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {



        fetch(`${apiUrl}/api/user/auth/check`, {
            method: "GET",
            credentials: "include",
        })
            .then((res) => res.json())
            .then((data) => {
                setIsAuthenticated(data.isAuth);
               
                setUser(data.data);
                setLoading(false);
            })
            .catch(() => {
                setIsAuthenticated(false);
                setLoading(false);
            });


    }, []);

    if (loading) {
        return;
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    return (
        <>
            {React.Children.map(children, (child) => React.isValidElement<{user?:User | null}>(child) ? React.cloneElement(child, { user }) : child)}

        </>
    );
};

export default PrivateRoute;

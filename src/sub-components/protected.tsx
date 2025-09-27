import React, { useEffect, useState } from "react";
import "react-activity/dist/Sentry.css";

const apiUrl = import.meta.env.VITE_BACKEND_URL;
import { Sentry } from "react-activity";
import { Navigate } from "react-router-dom";


interface PrivateRouteProps {
    children: React.ReactElement;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ children }) => {
    const [loading, setLoading] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {



        fetch(`${apiUrl}/api/user/auth/check`, {
            method: "GET",
            credentials: "include",
        })
            .then((res) => res.json())
            .then((data) => {
                setIsAuthenticated(data.isAuth);
                setLoading(false);
            })
            .catch(() => {
                setIsAuthenticated(false);
                setLoading(false);
            });


    }, []);

    if (loading) {
        return ;
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    return children;
};

export default PrivateRoute;

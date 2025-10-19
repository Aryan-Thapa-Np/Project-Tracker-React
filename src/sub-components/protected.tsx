import React, { useEffect, useState } from "react";
import type { User } from "../types/usersFTypes.tsx";
import { Navigate, useLocation } from "react-router-dom";
import { notification } from "../context/notificationContext.tsx";
const apiUrl = import.meta.env.VITE_BACKEND_URL;

interface PrivateRouteProps {
    children: React.ReactNode;
}

const path = [
    "users",
    "logs"
];



const PrivateRoute: React.FC<PrivateRouteProps> = ({ children }) => {

    const location = useLocation();
    const [loading, setLoading] = useState(true);
    const [hasPermission, setPermission] = useState(false);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [user, setUser] = useState<User | null>(null);
    const [notificationCount, setNotificationCount] = useState<number | undefined>(0);


    useEffect(() => {
        async function checkAuth() {
            try {
                const res = await fetch(`${apiUrl}/api/user/auth/check`, {
                    method: "GET",
                    credentials: "include",
                });

                if (!res.ok) {
                    if (res.status === 500) {
                        setLoading(false);
                        return;
                    } else {
                        setIsAuthenticated(false);
                        setLoading(false);
                        return;
                    }
                }

                const data = await res.json();
                setIsAuthenticated(data.isAuth);
                setUser(data.data);
                setPermission(data.isAllowedPerm);
                setNotificationCount(data.data.notification_count);
     ;
            } catch (error) {
                setIsAuthenticated(false);
            } finally {
                setLoading(false);
            }
        }

        checkAuth();
    }, []);

    if (loading) {
        return null; // or a loader
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    if (!hasPermission) {
        const check = path.includes(location.pathname.replace("/", ""));

        if (check) {
            return <Navigate to="/InsufficientPermission" replace />;
        }
    }

    return (
        <notification.Provider value={{ user, notificationCount, setNotificationCount }}>
            {React.Children.map(children, (child) =>
                React.isValidElement<{ user?: User | null }>(child)
                    ? React.cloneElement(child, { user })
                    : child
            )}
        </notification.Provider>
    );
};

export default PrivateRoute;

import React, { useEffect, useState } from "react";
import type { User } from "../types/usersFTypes.tsx";
import { Navigate } from "react-router-dom";

const apiUrl = import.meta.env.VITE_BACKEND_URL;

interface CheckPermProps {
    children: React.ReactNode;
}

const CheckPerm: React.FC<CheckPermProps> = ({ children }) => {
    const [loading, setLoading] = useState(true);
    const [hasPermission, setPermission] = useState(false);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
        const checkAuth = async () => {
            try {
                const res = await fetch(`${apiUrl}/api/user/auth/check`, {
                    method: "GET",
                    credentials: "include",
                });

                if (!res.ok) {
                    if (res.status === 500) {
                        return <Navigate to="/InternalServerError" replace />;

                    }
                }

                const data = await res.json();

                setIsAuthenticated(data.isAuth);
                setPermission(data.isAllowedPerm);
                setUser(data.data);
            } catch (error) {
                console.error(error);
                setIsAuthenticated(false);
            } finally {
                setLoading(false);
            }
        };

        checkAuth();
    }, []);

    if (loading) return null;

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    if (!hasPermission) {
        return <Navigate to="/InsufficientPermission" replace />;
    }

    return (
        <>
            {React.Children.map(children, (child) =>
                React.isValidElement<{ user?: User | null }>(child)
                    ? React.cloneElement(child, { user })
                    : child
            )}
        </>
    );


};







interface CheckPermSideProps {
    children: React.ReactNode;
}

export const CheckPermSide: React.FC<CheckPermSideProps> = ({ children }) => {
    const [loading, setLoading] = useState(true);
    const [hasPermission, setHasPermission] = useState(false);

    useEffect(() => {
        async function checkPermission() {
            try {
                const res = await fetch(`${apiUrl}/api/user/checkPerm`, {
                    method: "GET",
                    credentials: "include",
                });

                const data = await res.json();
                setHasPermission(data.isAuth);
            } catch (error) {
                setHasPermission(false);
            } finally {
                setLoading(false);
            }
        }

        checkPermission();
    }, []);

    if (loading) {
        return null;
    }

    if (!hasPermission) {
        return null;
    }


    return <>{children}</>;
};

export default CheckPerm;

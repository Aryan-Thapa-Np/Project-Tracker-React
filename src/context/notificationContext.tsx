
import React, { createContext, useContext } from "react";
import type { User } from "../types/usersFTypes.tsx";

interface AuthContextProps {
    user: User | null;
    notificationCount: number | undefined;
    setNotificationCount: React.Dispatch<React.SetStateAction<number | undefined>>;
}

export const notification = createContext<AuthContextProps | undefined>(undefined);

export const useNotification = () => {
    const context = useContext(notification);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};
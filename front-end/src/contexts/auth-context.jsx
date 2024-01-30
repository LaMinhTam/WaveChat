import { onAuthStateChanged } from "firebase/auth";
import React from "react";
import { auth } from "../utils/firebaseConfig";

const AuthContext = React.createContext();

export function AuthProvider(props) {
    const [loading, setLoading] = React.useState(true);
    const [values, setValues] = React.useState({
        name: "",
        phone: "",
        password: "",
    });
    const [userInfo, setUserInfo] = React.useState("");
    const [confirmationResult, setConfirmationResult] = React.useState(null); // Add this line
    React.useEffect(() => {
        onAuthStateChanged(auth, (user) => {
            setUserInfo(user);
            setLoading(false);
        });
    }, []);
    const contextValues = {
        loading,
        values,
        userInfo,
        setValues,
        setUserInfo,
        confirmationResult, // Add this line
        setConfirmationResult, // And this line
    };
    return (
        <AuthContext.Provider
            value={contextValues}
            {...props}
        ></AuthContext.Provider>
    );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
    const context = React.useContext(AuthContext);
    if (typeof context === "undefined")
        throw new Error("useAuth must be used within AuthProvider");
    return context;
}

/* eslint-disable react-refresh/only-export-components */
import ReactDOM from "react-dom/client";
import "./App.scss";
import App from "./App.jsx";
import "./index.scss";
import "react-toastify/dist/ReactToastify.css";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { ToastContainer } from "react-toastify";
import store from "./store/configureStore.js";
import { AuthProvider } from "./contexts/auth-context.jsx";
import "react-phone-input-2/lib/style.css";
import { ChatProvider } from "./contexts/chat-context.jsx";
import React, { Suspense } from "react";
import { SocketProvider } from "./contexts/socket-context.jsx";
const RegisterPage = React.lazy(() => import("./pages/RegisterPage.jsx"));
const LoginPage = React.lazy(() => import("./pages/LoginPage.jsx"));
const NotFoundPage = React.lazy(() => import("./pages/NotFoundPage.jsx"));
const DashboardPage = React.lazy(() => import("./pages/DashboardPage.jsx"));
const LayoutDashboard = React.lazy(() =>
    import("./layout/LayoutDashboard.jsx")
);
const ResetPasswordPage = React.lazy(() =>
    import("./pages/ResetPasswordPage.jsx")
);
const ChangePasswordPage = React.lazy(() =>
    import("./pages/ChangePasswordPage.jsx")
);

const router = createBrowserRouter([
    {
        element: <LayoutDashboard />,
        children: [
            {
                path: "/",
                element: <DashboardPage />,
            },
        ],
    },
    { path: "/register", element: <RegisterPage /> },
    { path: "/login", element: <LoginPage /> },
    { path: "/recover", element: <ResetPasswordPage /> },
    { path: "/recover/change-password", element: <ChangePasswordPage /> },
    { path: "*", element: <NotFoundPage /> },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
    <Provider store={store}>
        <AuthProvider>
            <SocketProvider>
                <ChatProvider>
                    <Suspense
                        fallback={
                            <div className="flex items-center justify-center w-screen h-screen">
                                <div
                                    className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"
                                    role="status"
                                >
                                    <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">
                                        Loading...
                                    </span>
                                </div>
                            </div>
                        }
                    >
                        <App>
                            <RouterProvider router={router}></RouterProvider>
                        </App>
                    </Suspense>
                    <ToastContainer bodyClassName="font-primary text-sm"></ToastContainer>
                </ChatProvider>
            </SocketProvider>
        </AuthProvider>
    </Provider>
);

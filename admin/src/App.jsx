import React from "react";
import {Routes, Route, Navigate} from "react-router-dom";

import AdminLayout from "./layouts/admin";
import AuthLayout from "./layouts/auth";
import RequireAuth from "./hooks/RequireAuth";
import {ToastContainer} from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

const App = () => {
    return (<>
            <Routes>
                <Route path="auth/*" element={<AuthLayout/>}/>
                <Route element={<RequireAuth/>}>
                    <Route path="admin/*" element={<AdminLayout/>}/>
                    <Route path="/" element={<Navigate to="/admin" replace/>}/>
                </Route>
            </Routes>
            <ToastContainer/>
        </>
    );
};

export default App;

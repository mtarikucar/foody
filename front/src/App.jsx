import "./App.css";
import DefaultLayout from "./layout/default"
import {Routes, Route, Navigate, useParams} from "react-router-dom";

import Home from "./pages/Home/Home.jsx";
import React from "react";
import About from "./pages/About/About.jsx";


function App() {

    return (
        <Routes>
            <Route element={<DefaultLayout/>}>
                <Route
                    path="/:id"
                    element={<Home/>}
                />
            </Route>

            <Route element={<DefaultLayout/>}>
                <Route
                    path="/:id/about"
                    element={<About/>}
                />
            </Route>
        </Routes>);
}

export default App;

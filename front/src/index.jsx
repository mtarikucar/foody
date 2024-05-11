import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import {QueryClient, QueryClientProvider} from "react-query";
import {BrowserRouter as Router} from "react-router-dom";
import {Provider} from "react-redux";
import {PersistGate} from "redux-persist/integration/react";
import {store, persistor} from "./store/store";

import LandingPage from "./pages/LandingPage.jsx";

const root = ReactDOM.createRoot(document.getElementById("root"));

const queryClient = new QueryClient();

root.render(
    <Router>
        <Provider store={store}>
            <PersistGate loading={<LandingPage/>} persistor={persistor}>
                <QueryClientProvider client={queryClient}>
                    <App/>
                </QueryClientProvider>
            </PersistGate>
        </Provider>
    </Router>
);

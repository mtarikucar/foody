import ReactDOM from "react-dom/client";
import {BrowserRouter as Router} from "react-router-dom";
import "./index.css";
import App from "./App";
import {Provider} from "react-redux";
import {PersistGate} from "redux-persist/integration/react";
import {QueryClient, QueryClientProvider} from "react-query";
import store, {persistor} from "./store";


const root = ReactDOM.createRoot(document.getElementById("root"));

const queryClient = new QueryClient();


root.render(
    <Router>
        <Provider store={store}>
            <PersistGate loading={null} persistor={persistor}>
                <QueryClientProvider client={queryClient}>
                        <App/>
                </QueryClientProvider>
            </PersistGate>
        </Provider>
    </Router>
);


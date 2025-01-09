import React from "react";
import {Routes, Route, Navigate, useLocation} from "react-router-dom";
import Navbar from "../../components/navbar";
import Sidebar from "../../components/sidebar";
import Footer from "../../components/footer/Footer";
import routes from "../../routes.js";
import ScrollToTop from "../../hooks/ScrollToTop";


import Joyride from 'react-joyride'
import useAuth from "../../hooks/useAuth";

export default function Admin(props) {
    const {...rest} = props;
    const location = useLocation();
    const [open, setOpen] = React.useState(false);
    const [currentRoute, setCurrentRoute] = React.useState("Main Dashboard");
    const auth = useAuth()

    React.useEffect(() => {
        getActiveRoute(routes);
    }, [location.pathname]);

    const getActiveRoute = (routes) => {
        let activeRoute = "Main Dashboard";
        for (let i = 0; i < routes.length; i++) {
            if (window.location.href.indexOf(routes[i].layout + "/" + routes[i].path) !== -1) {
                setCurrentRoute(routes[i].name);
            }
        }
        return activeRoute;
    };
    const getActiveNavbar = (routes) => {
        let activeNavbar = false;
        for (let i = 0; i < routes.length; i++) {
            if (window.location.href.indexOf(routes[i].layout + routes[i].path) !== -1) {
                return routes[i].secondary;
            }
        }
        return activeNavbar;
    };

    const getRoutes = (routes) => {
        return routes.map((prop, key) => {
            if (prop.layout === "/admin" && (prop.allowedRoles.includes(auth.currentUserRole))) {
                return (<Route path={`/${prop.path}`} element={prop.component} key={key}/>);
            } else {
                return null;
            }
        });
    };

    const steps = [{
        target: '.start-joyride', content: 'hemen gezintiye baslayalim',
    }, {
        target: '.branch-joyride', content: 'yeni bir sube olustur!',
    }]


    document.documentElement.dir = "ltr";
    return (<div className="flex h-dvhw-full bg-white/10 dark:!bg-navy-900">
        <ScrollToTop/>
        <Joyride steps={steps} continuous={true}
                 locale={{back: 'Geri', close: 'Kapat', last: 'Bitir', next: 'Sonraki', open: 'Başlat', skip: 'Geç'}}/>
        <Sidebar open={open} onClose={() => setOpen(false)}/>
        {/* Navbar & Main Content */}
        <div className="h-full w-full  ">
            <main className={`mx-[12px] h-full flex-none transition-all md:pr-2 `}>
                <div className="h-full">

                    <Navbar
                        onOpenSidenav={() => setOpen(true)}
                        logoText={"PhiloFoodie"}
                        brandText={currentRoute}
                        secondary={getActiveNavbar(routes)}
                        {...rest}
                    />

                    <div className="pt-5s mx-auto mb-auto h-full min-h-screen p-2 md:pr-2">
                        <Routes>

                            {getRoutes(routes)}

                            <Route
                                path="/"
                                element={<Navigate to="/admin/profile" replace/>}
                            />
                        </Routes>
                    </div>
                </div>

            </main>
        </div>
    </div>);
}

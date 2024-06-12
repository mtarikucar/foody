import Footer from "../../components/footer/FooterAuthDefault";
import { Link, Routes, Route, Navigate } from "react-router-dom";
import routes from "../../routes.js";
import FixedPlugin from "../../components/fixedPlugin/FixedPlugin";

export default function Auth() {
  const getRoutes = (routes) => {
    return routes.map((prop, key) => {
      if (prop.layout === "/auth") {
        return (
            <Route path={`/${prop.path}`} element={prop.component} key={key} />
        );
      } else {
        return null;
      }
    });
  };

  document.documentElement.dir = "ltr";

  return (
      <div className="flex flex-col h-screen w-full !bg-white dark:!bg-navy-900">
        <FixedPlugin />
        <main className="flex-grow mx-auto flex flex-col justify-between">
          <div className="flex-grow flex flex-col justify-center items-center">
            <Routes>
              {getRoutes(routes)}
              <Route path="/" element={<Navigate to="/auth/sign-in" replace />} />
            </Routes>
          </div>
          <Footer />
        </main>
      </div>
  );
}

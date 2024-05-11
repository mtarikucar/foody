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
    <div>
      <div className="  h-full min-h-screen w-full !bg-white dark:!bg-navy-900">
        <FixedPlugin />
        <main className={`mx-auto min-h-screen`}>
          <div className=" flex min-h-screen">
            <div className="mx-auto flex  w-full flex-col justify-start pt-12 md:max-w-[75%] min-h-screen lg:max-w-[1013px] lg:px-8 lg:pt-0 xl:h-[100vh] xl:max-w-[1383px] xl:px-0 ">
              <div className="flex flex-col ">
                <Routes>
                  {getRoutes(routes)}
                  <Route
                    path="/"
                    element={<Navigate to="/auth/sign-in" replace />}
                  />
                </Routes>

              </div>
              <Footer />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

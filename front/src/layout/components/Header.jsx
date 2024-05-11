import React, {useState} from "react";
import { useSelector } from "react-redux";
import {Link, NavLink} from "react-router-dom";
import { MdContactSupport } from "react-icons/md";
function Header() {

    const branchData = useSelector((state) => state.global.branchData);
    const [showMenu, setShowMenu] = useState(false);
    const menuData = useSelector((state) => state.global.menuData);


  return (

      <div className="sticky top-0 z-30 bg-dynamic dark:bg-gray-800 sm:container shadow-md">
          <div className="mx-auto px-4 py-2">
              <div className="flex items-center justify-between">
                  <NavLink to={`${branchData?.branchId}`} className="flex items-center space-x-2">
                      {menuData?.logo && (
                          <img
                              src={menuData?.logo}
                              alt=""
                              className="h-12 w-12 "
                          />
                      )}
                      <span className="text-lg font-semibold text-white  uppercase">
              {branchData?.branchName}
            </span>
                  </NavLink>
                  <div className="flex items-center space-x-4">
                      <NavLink
                          to={`${branchData?.branchId}/about`}
                          className="p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700"
                      >
                          <MdContactSupport size={32} className="text-white"/>
                      </NavLink>
                  </div>
              </div>
          </div>
      </div>
  );
}

export default Header;

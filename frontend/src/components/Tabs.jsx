/* React imports */
import React from "react";

/* External imports */
import { Routes, Route, Link, useLocation } from "react-router-dom";

/* Local imports */
import Visualizer from "../containers/Visualizer";
import Indexer from "../containers/Indexer";


const Tabs = (props) => {
  const { pathname } = useLocation();

  const activeTabClass =
    "bg-white inline-block border-l border-t border-r rounded-t py-2 px-4 text-blue-700 font-semibold";
  const tabClass =
    "bg-white inline-block py-2 px-4 text-blue-500 hover:text-blue-800 font-semibold";

  return (
    <>
      {/* Tabs links */}
      <div className="flex flex-row mb-2 lg:mb-4 px-2 lg:pt-4 justify-start text-center border-b">
        <div className={pathname === "/indexer" ? "-mb-px mr-1" : "mr-1"}>
        <Link
            to="/indexer"
            className={pathname === "/indexer" ? activeTabClass : tabClass}
          >
            Indexer
          </Link>
          <Link
            to="/visualizer"
            className={pathname === "/visualizer" ? activeTabClass : tabClass}
          >
            Visualizer
          </Link>
        </div>
      </div>
      
      {/* Tabs contents */}
      <div className="container mx-auto">
        <Routes>
            <Route path="/indexer" element={<Indexer />} />
            <Route path="/visualizer" element={<Visualizer />} />
        </Routes>
      </div>
      
    </>
  );
};

export default Tabs;

import React from "react";
import { Outlet } from "react-router-dom";
import SearchBar from "./searchBar";
import Footer from "./Footer";
import BackToTop from "./BackToTop";

export default function Layout() {
  return (
    <>
      <SearchBar />
      <Outlet />
      <Footer />
      <BackToTop />
    </>
  );
}

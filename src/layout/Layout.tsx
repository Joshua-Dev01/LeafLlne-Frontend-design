// src/layout/Layout.tsx

import { Outlet } from "react-router-dom";
import { useLoadingStore } from "../store/loadingStore";

const Layout = ({ children }: { children: React.ReactNode }) => {
  const loading = useLoadingStore((state) => state.loading);

  return (
    <div>
      {loading && (
        <div className=" z-50" />
      )}
      {children}
      <Outlet />
    </div>
  );
};

export default Layout;

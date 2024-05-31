"use client";

import { useAuth } from "@/contexts/authContext";
import NavigationToolbar from "./toolbar";

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useAuth();

  return (
    <div>
      {isAuthenticated && (
        <>
          <NavigationToolbar>
            <main>{children}</main>
          </NavigationToolbar>
        </>
      )}
      {!isAuthenticated && <main>{children}</main>}
    </div>
  );
};

export default Layout;

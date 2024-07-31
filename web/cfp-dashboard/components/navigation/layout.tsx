"use client";

import { useAuth } from "@/contexts/authContext";
import NavigationToolbar from "./toolbar";
import { TitleProvider } from "@/contexts/titleProvider";
import { FPCONProvider } from "@/contexts/fpconProvider";
import { EventsSocketProvider } from "@/contexts/eventsSocketContext";

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useAuth();

  return (
    <div>
      {isAuthenticated && (
        <>
          <TitleProvider>
            <EventsSocketProvider>
              <FPCONProvider>
                <NavigationToolbar>
                  <main>{children}</main>
                </NavigationToolbar>
              </FPCONProvider>
            </EventsSocketProvider>
          </TitleProvider>
        </>
      )}
      {!isAuthenticated && <main>{children}</main>}
    </div>
  );
};

export default Layout;

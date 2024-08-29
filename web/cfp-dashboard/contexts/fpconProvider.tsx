import { FPCONState, fpcons } from "@/app/types/fpcon";
import { createContext, useContext, useEffect, useMemo, useState } from "react";
import io, { Socket } from "socket.io-client";

interface FPCONContextType {
  fpconState: FPCONState;
  updateFPCONState: (fpconState: FPCONState) => void;
}

export const FPCONContext = createContext<FPCONContextType | undefined>(
  undefined
);

export const FPCONProvider = ({ children }: { children: React.ReactNode }) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const baseURL = process.env.NEXT_PUBLIC_SERVER_URL;
  const namespace = "fpcon";
  const [fpconState, setFPCONState] = useState<FPCONState>({
    currentState: fpcons[0],
    lastUpdated: new Date().toISOString(),
    history: [],
  });
  const updateFPCONState = (fpconState: FPCONState) => {
    setFPCONState(fpconState);
    socket?.emit(namespace, fpconState);
  };

  useEffect(() => {
    const newSocket = io(`${baseURL}/${namespace}`, {
      autoConnect: false,
    });
    setSocket(newSocket);

    newSocket.on("connect", () => {
      console.log(`Connected to namespace ${namespace}`);
    });

    newSocket.on("connect_error", (err) => {
      console.error(err);
    });

    newSocket.on("disconnect", () => {
      console.log(`Disconnected from namespace ${namespace}`);
    });

    newSocket.on(namespace, (data: FPCONState) => {
      setFPCONState(data);
    });

    newSocket.connect();

    return () => {
      newSocket.disconnect();
      setSocket(null);
    };
  }, []);

  const value = useMemo(
    () => ({ fpconState, updateFPCONState }),
    [fpconState, updateFPCONState]
  );

  return (
    <FPCONContext.Provider value={value}>{children}</FPCONContext.Provider>
  );
};

export const useFPCON = () => {
  const context = useContext(FPCONContext);
  if (!context) {
    throw new Error("useFPCON must be used within a FPCONProvider");
  }
  return context;
};

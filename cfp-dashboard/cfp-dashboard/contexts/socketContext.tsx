import React, {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import io, { Socket } from "socket.io-client";

interface SocketContextType {
  socket: Socket | null;
  isConnected: boolean;
  error: string | null;
}

const SocketContext = createContext<SocketContextType | undefined>(undefined);

export const SocketProvider: React.FC<{
  namespace: string;
  children: ReactNode;
}> = ({ namespace, children }) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const newSocket = io(`http://localhost:3001/${namespace}`, {
      autoConnect: false,
    });
    setSocket(newSocket);

    newSocket.on("connect", () => {
      setIsConnected(true);
      setError(null);
      console.log(`Connected to namespace ${namespace}`);
    });

    newSocket.on("connect_error", (err) => {
      setError(err.message);
    });

    newSocket.on("disconnect", () => {
      setIsConnected(false);
      setError(null);
    });

    newSocket.connect();

    return () => {
      newSocket.disconnect();
      setSocket(null);
    };
  }, [namespace]);

  const value = useMemo(
    () => ({ socket, isConnected, error }),
    [socket, isConnected, error]
  );

  return (
    <SocketContext.Provider value={value}>{children}</SocketContext.Provider>
  );
};

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error("useSocket must be used within a SocketProvider");
  }
  return context;
};

import React, {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import io, { Socket } from "socket.io-client";
import { env } from 'next-runtime-env';

interface EventsSocketContextType {
  eventsSocket: Socket | null;
  isEventsSocketConnected: boolean;
  eventsSocketError: string | null;
}

const EventsSocketContext = createContext<EventsSocketContextType | undefined>(
  undefined
);

export const EventsSocketProvider: React.FC<{
  children: ReactNode;
}> = ({ children }) => {
  const [eventsSocket, setSocket] = useState<Socket | null>(null);
  const [isEventsSocketConnected, setIsConnected] = useState(false);
  const [eventsSocketError, setError] = useState<string | null>(null);
  const baseURL = env('NEXT_PUBLIC_SERVER_URL');

  useEffect(() => {
    const newSocket = io(`${baseURL}/events`, {
      autoConnect: false,
    });
    setSocket(newSocket);

    newSocket.on("connect", () => {
      setIsConnected(true);
      setError(null);
      console.log(`Connected to namespace events`);
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
  }, []);

  const value = useMemo(
    () => ({ eventsSocket, isEventsSocketConnected, eventsSocketError }),
    [eventsSocket, isEventsSocketConnected, eventsSocketError]
  );

  return (
    <EventsSocketContext.Provider value={value}>
      {children}
    </EventsSocketContext.Provider>
  );
};

export const useEventsSocket = () => {
  const context = useContext(EventsSocketContext);
  if (!context) {
    throw new Error("useSocket must be used within a SocketProvider");
  }
  return context;
};

import useAuth from "hooks/useAuth";
import React, { createContext, useContext, useEffect, useState } from "react";
import { io } from "socket.io-client";

const BASE_URL ="http://localhost:8080/api/menu/v1";
//const BASE_URL = 'https://api.philofoody.com/api/menu/v1';


const SocketContext = createContext({ socket: null });

export const useSocket = () => useContext(SocketContext);

export const SocketProvider = ({ children }) => {
  const { user } = useAuth();
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    if (user?.userName) {
      const newSocket = io(BASE_URL, { 
        query: { username: user.userName, branchId: user.branchId },
        secure: false, 
        transports: ["websocket"],
        reconnection: true,
        reconnectionDelay: 1000,
        reconnectionDelayMax: 5000,
        reconnectionAttempts: 5,
      });
  
      setSocket(newSocket);
  
      return () => {
        newSocket.disconnect();
      };
    } else {
      if (socket) {
        socket.disconnect();
      }
      setSocket(null);
    }
  }, [user]);
  

  return (
    <SocketContext.Provider value={{ socket }}>
      {children}
    </SocketContext.Provider>
  );
};

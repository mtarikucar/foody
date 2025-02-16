import React, { createContext, useContext, useState, useEffect } from 'react';
import SockJS from 'sockjs-client';
import { Stomp } from '@stomp/stompjs';

const WebSocketContext = createContext(null);

//const BASE_URL ="http://localhost:8080/api/menu/v1";
const BASE_URL = 'https://api.philofoody.com/api/menu/v1';

export const WebSocketProvider = ({ children }) => {
    const [webSocket, setWebSocket] = useState(null);

    useEffect(() => {
        const connectWebSocket = () => {
            const socket = new SockJS(BASE_URL + '/ws');
            const stompClient = Stomp.over(socket);

            const connectCallback = () => {
                console.log('Connected to WebSocket');
                setWebSocket(stompClient);


            };

            const errorCallback = (error) => {
                console.error('WebSocket connection error, retrying in 5 seconds', error);
                setTimeout(connectWebSocket, 5000);
            };

            stompClient.connect({}, connectCallback, errorCallback);
        };

        connectWebSocket();

        return () => {
            if (webSocket) {
                webSocket.disconnect(() => {
                    console.log('Disconnected from WebSocket');
                });
            }
        };
    }, []);

    return (
        <WebSocketContext.Provider value={{ webSocket }}>
            {children}
        </WebSocketContext.Provider>
    );
};

export const useWebSocket = () => {
    const context = useContext(WebSocketContext);
    if (!context) {
        throw new Error('useWebSocket must be used within a WebSocketProvider');
    }
    return context.webSocket;
};

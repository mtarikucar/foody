import { useContext } from 'react';
import { WebSocketContext } from './WebSocketContext'; // WebSocketContext'i içe aktarın

export const useWebSocket = () => {
    const socket = useContext(WebSocketContext);

    if (!socket) {
        console.error("WebSocket context is not available");
    }

    return socket;
};
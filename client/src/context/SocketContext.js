import React, { createContext, useContext, useEffect, useState } from 'react';
import socketService from '../services/socketService';
import { useStateValue } from './StateProvider';

// Create context
const SocketContext = createContext();

// Socket provider component
export const SocketProvider = ({ children }) => {
  const [{ user, branchData }] = useStateValue();
  const [isConnected, setIsConnected] = useState(false);
  const [notifications, setNotifications] = useState([]);

  // Connect to socket when user or branch changes
  useEffect(() => {
    if (user && user.uid) {
      // Store user info for reconnection purposes
      localStorage.setItem('username', user.email || user.uid);
      if (branchData && branchData.id) {
        localStorage.setItem('branchId', branchData.id);
      }

      // Connect to socket
      socketService
        .connect(user.email || user.uid, branchData?.id)
        .then(() => {
          setIsConnected(true);
          console.log('Socket connected successfully');
          
          // Subscribe to user-specific notifications
          subscribeToNotifications();
        })
        .catch(error => {
          console.error('Socket connection failed:', error);
          setIsConnected(false);
        });
    }

    // Cleanup
    return () => {
      socketService.disconnect();
      setIsConnected(false);
    };
  }, [user, branchData]);

  // Subscribe to notifications
  const subscribeToNotifications = () => {
    if (user && user.uid) {
      socketService.subscribe(
        `/topic/notification/${user.uid}`,
        (message) => {
          console.log('Received notification:', message);
          // Add notification to the state
          if (message && message.data) {
            setNotifications(prev => [message.data, ...prev]);
          }
        }
      );
    }
  };

  // Create an order via socket
  const createOrder = async (branchId, tableId, order) => {
    try {
      await socketService.send(`/app/order/${branchId}/${tableId}`, order);
      return true;
    } catch (error) {
      console.error('Error creating order:', error);
      return false;
    }
  };

  // Handle addition via socket
  const createAddition = async (branchId, tableId, addition) => {
    try {
      await socketService.send(`/app/addition/${branchId}/${tableId}`, addition);
      return true;
    } catch (error) {
      console.error('Error creating addition:', error);
      return false;
    }
  };

  // Send a notification
  const sendNotification = async (userId, notification) => {
    try {
      await socketService.send(`/app/notification/${userId}`, notification);
      return true;
    } catch (error) {
      console.error('Error sending notification:', error);
      return false;
    }
  };

  // Subscribe to order updates for a specific table
  const subscribeToOrderUpdates = (branchId, tableId, callback) => {
    return socketService.subscribe(
      `/topic/order/${branchId}/${tableId}`,
      callback
    );
  };

  // Subscribe to addition updates for a specific table
  const subscribeToAdditionUpdates = (branchId, tableId, callback) => {
    return socketService.subscribe(
      `/topic/addition/${branchId}/${tableId}`,
      callback
    );
  };

  // Unsubscribe from updates
  const unsubscribeFromTopic = (topic) => {
    socketService.unsubscribe(topic);
  };

  // Context value
  const contextValue = {
    isConnected,
    notifications,
    createOrder,
    createAddition,
    sendNotification,
    subscribeToOrderUpdates,
    subscribeToAdditionUpdates,
    unsubscribeFromTopic,
    clearNotifications: () => setNotifications([])
  };

  return (
    <SocketContext.Provider value={contextValue}>
      {children}
    </SocketContext.Provider>
  );
};

// Hook for using socket context
export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error('useSocket must be used within a SocketProvider');
  }
  return context;
};

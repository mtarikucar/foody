import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';

// Base URL for the socket connection - change to your production URL if needed
const SOCKET_URL = 'https://api.philofoody.com/ws';

class SocketService {
  constructor() {
    this.client = null;
    this.subscriptions = {};
    this.connected = false;
    this.connectionPromise = null;
    this.activeSubscriptions = {};
    this.reconnectTimeout = null;
    this.reconnectAttempts = 0;
    this.maxReconnectAttempts = 5;
    this.connectionDelay = 2000; // initial delay in ms
  }

  /**
   * Initialize and connect to the WebSocket server
   * @param {string} username - The username for the connection
   * @param {string} branchId - The branch ID for the connection
   * @returns {Promise} - Resolves when connected
   */
  connect(username, branchId) {
    if (this.connectionPromise) {
      return this.connectionPromise;
    }

    this.connectionPromise = new Promise((resolve, reject) => {
      try {
        this.client = new Client({
          webSocketFactory: () => new SockJS(SOCKET_URL),
          connectHeaders: {
            username: username || 'guest',
            branchId: branchId || 'guest'
          },
          debug: function (str) {
            console.debug('STOMP: ' + str);
          },
          reconnectDelay: 5000,
          heartbeatIncoming: 4000,
          heartbeatOutgoing: 4000,
          onConnect: () => {
            console.log('Connected to WebSocket');
            this.connected = true;
            this.reconnectAttempts = 0;
            this.connectionDelay = 2000;
            resolve();
          },
          onStompError: (frame) => {
            console.error('STOMP error', frame);
            reject(new Error('STOMP protocol error'));
          },
          onWebSocketError: (event) => {
            console.error('WebSocket error', event);
            this.handleConnectionError();
            reject(new Error('WebSocket connection error'));
          },
          onDisconnect: () => {
            console.log('Disconnected from WebSocket');
            this.connected = false;
            this.handleDisconnect();
          }
        });

        this.client.activate();
      } catch (error) {
        console.error('Error connecting to WebSocket', error);
        this.handleConnectionError();
        reject(error);
      }
    });

    return this.connectionPromise;
  }

  /**
   * Handle WebSocket connection errors and implement reconnection logic
   */
  handleConnectionError() {
    this.connected = false;
    this.connectionPromise = null;
    
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      const delay = this.connectionDelay * this.reconnectAttempts;
      
      console.log(`Attempting to reconnect in ${delay/1000} seconds (Attempt ${this.reconnectAttempts}/${this.maxReconnectAttempts})`);
      
      if (this.reconnectTimeout) {
        clearTimeout(this.reconnectTimeout);
      }
      
      this.reconnectTimeout = setTimeout(() => {
        const username = localStorage.getItem('username') || 'guest';
        const branchId = localStorage.getItem('branchId') || 'guest';
        this.connect(username, branchId);
      }, delay);
    } else {
      console.error('Maximum reconnection attempts reached.');
    }
  }

  /**
   * Handle WebSocket disconnection
   */
  handleDisconnect() {
    this.connectionPromise = null;
    // Cleanup subscriptions
    this.activeSubscriptions = {};
  }

  /**
   * Subscribe to a topic
   * @param {string} destination - The topic to subscribe to
   * @param {function} callback - The callback to execute when a message is received
   * @param {object} headers - Optional headers
   * @returns {Promise<string>} - Resolves with the subscription ID
   */
  subscribe(destination, callback, headers = {}) {
    return new Promise((resolve, reject) => {
      if (!this.connected) {
        const username = localStorage.getItem('username') || 'guest';
        const branchId = localStorage.getItem('branchId') || 'guest';
        
        this.connect(username, branchId)
          .then(() => this.subscribeToDestination(destination, callback, headers, resolve))
          .catch(reject);
      } else {
        this.subscribeToDestination(destination, callback, headers, resolve);
      }
    });
  }

  /**
   * Helper method to subscribe to a destination
   */
  subscribeToDestination(destination, callback, headers, resolve) {
    try {
      // Check if we already have this subscription
      if (this.activeSubscriptions[destination]) {
        console.log(`Already subscribed to ${destination}`);
        resolve(this.activeSubscriptions[destination]);
        return;
      }

      const subscription = this.client.subscribe(destination, message => {
        try {
          const parsedMessage = JSON.parse(message.body);
          callback(parsedMessage);
        } catch (error) {
          console.error('Error parsing message', error, message);
          callback(message);
        }
      }, headers);

      this.activeSubscriptions[destination] = subscription.id;
      resolve(subscription.id);
    } catch (error) {
      console.error('Error subscribing to destination', error);
      throw error;
    }
  }

  /**
   * Unsubscribe from a topic
   * @param {string} destination - The topic to unsubscribe from
   */
  unsubscribe(destination) {
    if (!this.connected || !this.client) {
      return;
    }

    const subscriptionId = this.activeSubscriptions[destination];
    if (subscriptionId) {
      try {
        this.client.unsubscribe(subscriptionId);
        delete this.activeSubscriptions[destination];
        console.log(`Unsubscribed from ${destination}`);
      } catch (error) {
        console.error('Error unsubscribing from destination', error);
      }
    }
  }

  /**
   * Send a message to a destination
   * @param {string} destination - The destination to send the message to
   * @param {object} body - The message body
   * @param {object} headers - Optional headers
   * @returns {Promise} - Resolves when the message is sent
   */
  send(destination, body, headers = {}) {
    return new Promise((resolve, reject) => {
      if (!this.connected) {
        const username = localStorage.getItem('username') || 'guest';
        const branchId = localStorage.getItem('branchId') || 'guest';
        
        this.connect(username, branchId)
          .then(() => this.sendMessage(destination, body, headers, resolve))
          .catch(reject);
      } else {
        this.sendMessage(destination, body, headers, resolve);
      }
    });
  }

  /**
   * Helper method to send a message
   */
  sendMessage(destination, body, headers, resolve) {
    try {
      this.client.publish({
        destination,
        body: JSON.stringify(body),
        headers
      });
      resolve();
    } catch (error) {
      console.error('Error sending message', error);
      throw error;
    }
  }

  /**
   * Disconnect from the WebSocket server
   */
  disconnect() {
    if (this.reconnectTimeout) {
      clearTimeout(this.reconnectTimeout);
      this.reconnectTimeout = null;
    }

    if (this.client && this.connected) {
      this.client.deactivate();
      this.connected = false;
      this.connectionPromise = null;
      this.activeSubscriptions = {};
      console.log('Disconnected from WebSocket');
    }
  }
}

// Create singleton instance
const socketService = new SocketService();
export default socketService;

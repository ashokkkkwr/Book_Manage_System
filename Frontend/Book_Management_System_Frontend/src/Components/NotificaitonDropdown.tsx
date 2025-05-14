import React, { useState, useEffect, useRef } from 'react';
import { Bell } from 'lucide-react';
import * as signalR from '@microsoft/signalr';
import axiosInstance from '../service/axiosInstance';

export interface ServerNotification {
  id: string;
  title: string;
  content: string;
  type: string;
  timestamp: string;
  description?: string;
}

const NotificationDropdown: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState<ServerNotification[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);

  // SignalR connection setup
  useEffect(() => {
    const connection = new signalR.HubConnectionBuilder()
      .withUrl('http://localhost:5226/Hubs/OrderHub', {
        accessTokenFactory: () => localStorage.getItem('token') || ''
      })
      .withAutomaticReconnect()
      .build();

    connection
      .start()
      .then(() => console.log('✅ Connected to SignalR hub'))
      .catch(err => console.error('❌ SignalR Connection Error:', err));

    // Listen for real-time notifications
    connection.on('ReceiveNotification', (notification: ServerNotification) => {
      console.log('🔔 Notification received:', notification);
      setNotifications(prev => [{ ...notification }, ...prev]);
    });

    return () => {
      connection.stop();
    };
  }, []);

  // Fetch historical notifications on dropdown open


  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={containerRef}>
      <button
        onClick={() => setOpen(prev => !prev)}
        className="p-2 rounded-full text-black dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
      >
        <Bell className="h-5 w-5" />
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg overflow-hidden z-50">
          <div className="px-4 py-2 font-semibold text-gray-700 dark:text-gray-200 border-b border-gray-100 dark:border-gray-700">
            Notifications
          </div>
          <ul className="max-h-64 overflow-y-auto">
            {notifications.length === 0 ? (
              <li className="px-4 py-3 text-gray-500 dark:text-gray-400">No notifications</li>
            ) : (
              notifications.map(notif => (
                <li key={notif.id} className="px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer transition">
                  <p className="font-medium text-sm text-gray-800 dark:text-gray-100">{notif.title}</p>
                  <p className="text-sm text-gray-700 dark:text-gray-200">{notif.content}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    {new Date(notif.timestamp).toLocaleString()}
                  </p>
                  {notif.description && (
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      {notif.description}
                    </p>
                  )}
                </li>
              ))
            )}
          </ul>
        </div>
      )}
    </div>
  );
};

export default NotificationDropdown;

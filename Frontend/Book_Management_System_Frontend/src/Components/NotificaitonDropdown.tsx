// import React, { useState, useEffect, useRef } from 'react';
// import { Bell } from 'lucide-react';
// import * as signalR from '@microsoft/signalr';
// import axiosInstance from '../service/axiosInstance';

// interface Notification {
//   id: string;
//   bookId: string;
//   message: string;
//   createdAt: string;
// }

// export const NotificationDropdown: React.FC = () => {
//   const [open, setOpen] = useState(false);
//   const [notifications, setNotifications] = useState<Notification[]>([]);
//   const containerRef = useRef<HTMLDivElement>(null);

//   // Fetch previous notifications
//   useEffect(() => {
//     if (!open) return;
//     axiosInstance.get<Notification[]>('/notifications')
//       .then(res => setNotifications(res.data))
//       .catch(err => console.error('Error loading notifications:', err));
//   }, [open]);

//   // Real-time SignalR connection
//   useEffect(() => {
// // NotificationDropdown.tsx
// const connection = new signalR.HubConnectionBuilder()
//   .withUrl('http://localhost:5226/Hubs/OrderHub', {
//     accessTokenFactory: () => localStorage.getItem('token') || ''
//   })
//   .withAutomaticReconnect()
//   .build();

    
//     connection.start()
//     .catch(err => console.error('SignalR Connection Error:', err));
//     console.log("🚀 ~ useEffect ~ connection:", connection)

//     connection.on('ReceiveNotification', (message: string) => {
//       console.log("🚀 ~ connection.on ~ message:", message)
//       setNotifications(prev => [{
//         id: Date.now().toString(),
//         bookId: '',
//         message,
//         createdAt: new Date().toISOString()
//       }, ...prev]);
//     });

//     return () => {
//       connection.stop();
//     };
//   }, []);

//   // Close on outside click
//   useEffect(() => {
//     const handleClickOutside = (e: MouseEvent) => {
//       if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
//         setOpen(false);
//       }
//     };
//     document.addEventListener('mousedown', handleClickOutside);
//     return () => document.removeEventListener('mousedown', handleClickOutside);
//   }, []);

//   return (
//     <div className="relative" ref={containerRef}>
//       <button
//         onClick={() => setOpen(!open)}
//         className="p-2 rounded-full text-black dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
//       >
//         <Bell className="h-5 w-5" />
//       </button>

//       {open && (
//         <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg overflow-hidden z-50">
//           <div className="px-4 py-2 font-semibold text-gray-700 dark:text-gray-200 border-b border-gray-100 dark:border-gray-700">
//             Notifications
//           </div>
//           <ul className="max-h-64 overflow-y-auto">
//             {notifications.length === 0 ? (
//               <li className="px-4 py-3 text-gray-500 dark:text-gray-400">No notifications</li>
//             ) : (
//               notifications.map((notif) => (
//                 <li key={notif.id} className="px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer transition">
//                   <p className="text-sm text-gray-800 dark:text-gray-100">{notif.message}</p>
//                   <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
//                     {new Date(notif.createdAt).toLocaleString()}
//                   </p>
//                 </li>
//               ))
//             )}
//           </ul>
//         </div>
//       )}
//     </div>
//   );
// };
// NotificationListener.jsx
// src/components/NotificationListener.tsx
import React, { useEffect } from "react";
import * as signalR from "@microsoft/signalr";
import { toast } from "react-toastify";

export interface ServerNotification {
  type: string;
  content: string;
  id: string;
  timestamp: string;
  title: string;
  description?: string;
}

const NotificationListener: React.FC = () => {
  useEffect(() => {
    const connection = new signalR.HubConnectionBuilder()
      .withUrl("http://localhost:5226/Hubs/OrderHub")
      .withAutomaticReconnect()
      .build();

    connection
      .start()
      .then(() => {
        console.log("✅ Connected to SignalR hub");
      })
      .catch((err) => {
        console.error("❌ SignalR Connection Error: ", err);
      });

    connection.on("ReceiveNotification", (notification: ServerNotification) => {
      console.log("🔔 Notification received:", notification);

      switch (notification.type.toLowerCase()) {
        case "order":
          toast.success(`🛒 Order Update: ${notification.content}`, {
            position: "top-right",
            autoClose: 5000,
          });
          break;

        default:
          toast.info(`🔔 ${notification.content}`, {
            position: "top-right",
            autoClose: 5000,
          });
          break;
      }
    });

    return () => {
      connection.stop();
    };
  }, []);

  return null;
};

export default NotificationListener;


import { useEffect, useState } from "react";
import * as signalR from "@microsoft/signalr";

export const useOrderHub = () => {
  const [connection, setConnection] = useState<signalR.HubConnection | null>(null);
  const [notification, setNotification] = useState<string | null>(null);

  useEffect(() => {
    const connect = async () => {
      const newConnection = new signalR.HubConnectionBuilder()
        .withUrl("https://your-backend-url/orderhub", {
          accessTokenFactory: () => localStorage.getItem("access_token") || "", // or use your auth flow
        })
        .withAutomaticReconnect()
        .build();

      try {
        await newConnection.start();
        console.log("Connected to SignalR OrderHub");

        newConnection.on("ReceiveNotification", (message: string) => {
          setNotification(message);
        });

        setConnection(newConnection);
      } catch (err) {
        console.error("Connection failed: ", err);
      }
    };

    connect();

    return () => {
      connection?.stop();
    };
  }, []);

  return { connection, notification };
};

"use client";

import { useEffect, useState } from "react";
import Image from "./Image";
import React from "react";
import { socket } from "@/socket";
import { useRouter } from "next/navigation";

type NotificationType = {
  id: string;
  senderUsername: string;
  type: "like" | "comment" | "rePost" | "follow";
  link: string;
};

export default function Notification() {
  const [notifications, setNotifications] = useState<NotificationType[]>([]);
  const [open, setOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const handleGetNotification = (data: NotificationType) => {
      setNotifications((prev) => {
        const isAlreadyPresent = prev.some(n => n.id === data.id);
        if (isAlreadyPresent) {
          return prev;
        }
        return [data, ...prev];
      });
    };

    socket.on("getNotification", handleGetNotification);

    return () => {
      socket.off("getNotification", handleGetNotification);
    };
  }, []);

  const reset = () => {
    setNotifications([]);
    setOpen(false);
  };

  const handleClick = (notification: NotificationType) => {
    setNotifications((prev) => prev.filter((n) => n.id !== notification.id));
    setOpen(false);
    router.push(notification.link);
  };

  return (
    <div className="relative">
      <div
        className="cursor-pointer p-2 rounded-full hover:bg-[#181818] flex items-center gap-4"
        onClick={() => setOpen((prev) => !prev)}
      >
        <div className="relative">
          <Image path="icons/notification.svg" alt="Notifications" w={24} h={24} />
          {notifications.length > 0 && (
            <div className="absolute top-0 left-4 w-2 h-2 bg-iconBlue rounded-full"></div>
          )}
        </div>
        <span className="hidden xxl:inline">Notifications</span>
      </div>
      {open && (
        <div className="absolute top-full right-0 p-4 rounded-lg bg-white text-black flex flex-col gap-4 w-max z-20 border">
          <h1 className="text-xl text-gray-500">Notifications</h1>
          {notifications.length > 0 ? (
            notifications.map((n) => (
              <div
                className="cursor-pointer"
                key={n.id}
                onClick={() => handleClick(n)}
              >
                <b>{n.senderUsername}</b>
                {n.type === "like"
                  ? " liked your post"
                  : n.type === "rePost"
                  ? " re-posted your post"
                  : n.type === "comment"
                  ? " replied to your post"
                  : " followed you"}
              </div>
            ))
          ) : (
            <span className="text-gray-500">No new notifications.</span>
          )}
          <button
            onClick={reset}
            className="bg-black text-white p-2 text-sm rounded-lg "
          >
            Mark all as read
          </button>
        </div>
      )}
    </div>
  );
}
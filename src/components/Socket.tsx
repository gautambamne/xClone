"use client";

import { useEffect, useState } from "react";
import { socket } from "../socket";
import { useUser } from "@clerk/nextjs";

export default function Socket() {
  const [isConnected, setIsConnected] = useState(false);
  const [transport, setTransport] = useState("N/A");
  const{user} = useUser()

  useEffect(() => {
    if (socket.connected) {
      onConnect();
    }

    function onConnect() {
      setIsConnected(true);
      setTransport(socket.io.engine.transport.name);

      socket.io.engine.on("upgrade", (transport) => {
        setTransport(transport.name);
      });
      if(user){
      socket.emit("newUser", user.username); // Example of emitting an event
      }
    }

    function onDisconnect() {
      setIsConnected(false);
      setTransport("N/A");
    }

    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);

    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
    };
  }, [user]);

  return (
   <span></span>
  );
}

function newUser(): { user: any; } {
    throw new Error("Function not implemented.");
}

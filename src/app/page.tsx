"use client";

import { useEffect, useState } from "react";
import { socket } from "../socket";

export default function Home() {
  const [isConnected, setIsConnected] = useState(false);
  const [transport, setTransport] = useState("N/A");
  const [message, setMessage] = useState("");
  const [emitMessage, setEmitMessage] = useState("");
  const [broadcastMessage, setBroadcastMessage] = useState("");

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
    }

    function onDisconnect() {
      setIsConnected(false);
      setTransport("N/A");
    }

    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);
    socket.on("server-messages", (value) => {
      setMessage(value);
      console.log("message from server: ", value)
    });
    // socket.on('broadcast-message', (data)=>{
    //   console.log(data);
    //   setBroadcastMessage(data)
    // })
    // socket.on('emit-message', (data)=>{
    //   console.log(data);
    //   setEmitMessage(data)
    // })
    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
    };
  }, []);

  return (
    <div>
      <p>Status: { isConnected ? "connected" : "disconnected" }</p>
      <p>Transport: { transport }</p>
     {message &&  <p>Message: { message }</p> }
     {broadcastMessage &&  <p>broadcast Message: { broadcastMessage }</p> }
     {emitMessage &&  <p>emit Message: { emitMessage }</p> }
      <button onClick={()=>{
        socket.emit("client-message", ".........")
      }}>Cliked</button>
    </div>
  );
}
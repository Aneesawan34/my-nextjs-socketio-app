"use client";

import { useEffect, useState } from "react";
import { socket as socketClient } from "../socket";

export default function Home() {
  const [socket, setSocket] = useState<any>(undefined);
  const [inbox, setInbox] = useState<any[]>([]);
  const [message, setMessage] = useState<string>("");
  const [roomName, setRoomName] = useState<string>("");

  useEffect(() => {
    setSocket(socketClient);
  }, []);

  useEffect(() => {
    if (socket) {
      socketClient.on("message", (message: string) => {
        setInbox((prev) => [...prev, message]);
      });
    }
  }, [socket]);

  const handleMessageSubmit = () => {
    socket.emit("message", { message, roomName });
  };
  const handleRoomNameSubmit = () => {
    socket.emit("joinRoom", roomName);
  };
  return (
    <div>
      <div className="flex flex-col gap-5 mx-20 px-10 lg:px-48">
        <div className="flex flex-col gap-2 border rounded-lg p-10">
          {inbox.map((message: string, index: number) => (
            <div key={index} className="border rounded px-4 py-2">
              {message}
            </div>
          ))}
        </div>

        <div className="flex gap-2 align-center justify-center">
          <input
            type="text"
            name="message"
            className="flex-1 border rounded px-2 py-1"
            onChange={(e) => setMessage(e.target.value)}
          />
          <button className="w-40" onClick={handleMessageSubmit}>
            Send message
          </button>
        </div>

        <div className="flex gap-2 align-center justify-center">
          <input
            type="text"
            name="roomName"
            className="flex-1 border rounded px-2 py-1"
            onChange={(e) => setRoomName(e.target.value)}
          />
          <button className="w-40" onClick={handleRoomNameSubmit}>
            Join room
          </button>
        </div>
      </div>
    </div>
  );
}

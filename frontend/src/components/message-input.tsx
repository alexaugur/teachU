import React, { useState, useEffect, useRef } from "react";
import io from "socket.io-client";
import { useStore } from "@/lib/store";
import { Button } from "./ui/button"; // Update with your actual UI components
import { Input } from "./ui/input"; // Update with your actual UI components
import { getAuthenticatedSchoolUserToken } from "@/lib/schoolauth";
import { getAuthenticatedTeacherUserToken } from "@/lib/teacherauth";
import { Message, SchoolProfile } from "@/lib/types";
import { sendMessageAsTeacher } from "@/lib/api";


export const MessageInput = ({
  currentChat,
}: {
  currentChat: SchoolProfile;
}) => {

  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const messageEndRef = useRef(null);
  const teacherUser = useStore((state) => state.teacherUser);


  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const token = getAuthenticatedTeacherUserToken();

  const sendMessage = () => {
    if (message.trim()) {
      const room_string =
        currentChat.school_id.toString() + "-" + teacherUser.sub;
      const newMessage = {
        content: message,
        school_id: currentChat.school_id.toString(),
        teacher_id: teacherUser.sub,
        sender_type: "teacher",
        real_message: true,
        room: room_string,
      };
      // socket.emit("store_message", newMessage);
      sendMessageAsTeacher(currentChat.school_id.toString(), message)
      setMessage("")
    }
  };

  return (
    <div className="message-popup-container">
      {/* <div>
        {messages.map((msg, index) => (
          <div key={index}>
            {msg.sender_id === schoolUser.id ? "You: " : "They: "}
            {msg.content}
          </div>
        ))}
        <div ref={messageEndRef} />
      </div> */}
      <Input
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Type a message..."
      />
      <Button onClick={sendMessage}>Send</Button>
    </div>
  );
};

import React, { useState, useEffect, useRef } from "react";
import io from "socket.io-client";
import { useStore } from "@/lib/store";
import { Button } from "./ui/button"; // Update with your actual UI components
import { Input } from "./ui/input"; // Update with your actual UI components
import { getAuthenticatedSchoolUserToken } from "@/lib/schoolauth";
import { getAuthenticatedTeacherUserToken } from "@/lib/teacherauth";
import { Message, SchoolProfile, TeacherUser } from "@/lib/types";
import { sendMessageAsSchool } from "@/lib/api";


export const MessageInputSchool = ({
  currentChat,
}: {
  currentChat: TeacherUser;
}) => {

  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const messageEndRef = useRef(null);
  const schoolUser = useStore((state) => state.schoolUser);



  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const token = getAuthenticatedTeacherUserToken();

  const sendMessage = () => {
    if (message.trim()) {
      const room_string =
        schoolUser.sub + "-" + currentChat.id.toString()
      const newMessage = {
        content: message,
        school_id: schoolUser.sub,
        teacher_id: currentChat.id.toString(),
        sender_type: "school",
        real_message: true,
        room: room_string,
      };
      sendMessageAsSchool(currentChat.id.toString(), message);
      // socket.emit("store_message", newMessage);
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

import React, { useState, useEffect, useRef } from "react";
import io, {Socket} from "socket.io-client";
import "../App.css";
import SchoolHeaderNavBar from "@/components/school/school-header-nav-bar";
import { MessageInput } from "../components/message-input";
import { IMessage, IConversation, SchoolProfile, Message } from "@/lib/types";
import { MessageCircleDashed } from "lucide-react";
import { fetchAllMessagesAsTeacher, fetchSchoolsToChatWith } from "@/lib/api";
import { useStore } from "@/lib/store";
import Pusher from "pusher-js";


export default function MessagingApp({starting_school_id}: {starting_school_id: string}) {
  const API_URL = import.meta.env.VITE_WEBSOCKET_URL;
  // const socket = io(API_URL); // Your server URL
  const socketRef= useRef<Socket | null>(); // Ref for the socket instance

  const API_KEY = import.meta.env.VITE_API_KEY;
  const API_CLUSTER = import.meta.env.VITE_API_CLUSTER;

  const pusherRef = useRef(null); // Ref for the Pusher instance
  const channelRef = useRef(null); // Ref for the Pusher channel

  const [conversations, setConversations] = useState<SchoolProfile[]>([]);
  const [currentChat, setCurrentChat] = useState<SchoolProfile | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const messageListRef = useRef(null); // Ref for the message list container

  const teacherUser = useStore((state) => state.teacherUser);

  useEffect(() => {
    pusherRef.current = new Pusher(API_KEY, {
      cluster: API_CLUSTER,
      // encrypted: true,
    });

    return () => {
      // Clean up Pusher connection when the component unmounts
      if (pusherRef.current) {
        pusherRef.current.disconnect();
      }
    };

  }, []);
  
  useEffect(() => {
    // Fetch conversations initially
    fetchConversations(); // Join the first conversation by default
  }, [teacherUser]);

  useEffect(() => {
    if (currentChat) {
      const room_string = currentChat.school_id.toString() + "-" + teacherUser.sub;
      // socketRef.current.emit("join", { room: room_string });
      channelRef.current = pusherRef.current.subscribe(room_string);
      channelRef.current.bind("receive_message", (data: Message) => {
        setMessages((prev) => [...prev, data]);
        scrollToBottom();
      });

      fetchMessages(currentChat);
      scrollToBottom();
return () => {
        // Unbind event listener and unsubscribe from the channel when component unmounts
        if (channelRef.current) {
          channelRef.current.unbind("receive_message");
          pusherRef.current.unsubscribe(room_string);
        }
      };
    }
  }, [currentChat]);



  const fetchConversations = async () => {
    const conversations = await fetchSchoolsToChatWith();
    // Simulate fetching conversations from an API
    setConversations(conversations);

    if (starting_school_id) {
      setCurrentChat(conversations.find((conversation) => conversation.school_id.toString() === starting_school_id));
    }
    // if (conversations.length > 0) {
    //   setCurrentChat(conversations[0]);
    // }
    return conversations;
  };

  const scrollToBottom = () => {
    if (messageListRef.current) {
      messageListRef.current.scrollTop = messageListRef.current.scrollHeight;
    }
  };

  const fetchMessages = async (conversation: SchoolProfile)=> {
    // Simulate fetching messages for a conversation from an API
    if(teacherUser) {
      const myMessages = await fetchAllMessagesAsTeacher(conversation.school_id, teacherUser.sub)
      setMessages(myMessages);
      scrollToBottom();
    }
  };

  const handleConversationClick = (conversation) => {
    setCurrentChat(conversation);
    // Fetch messages for the selected conversation
    fetchMessages(conversation);
  };

  const filteredConversations = conversations.filter((conversation) =>
    conversation.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="app-container">
      <div className="sidebar-container">
        <div className="conversation-header" style={{ padding: "0.75rem" }}>
          <p className="text4">Conversations</p>
        </div>
        <div className="conversation-list-container">
          <div className="conversation-list">
            {filteredConversations.map((conversation, index) => (
              <React.Fragment key={conversation.id}>
                <div
                  className="conversation-item"
                  onClick={() => handleConversationClick(conversation)}
                  aria-label={`Open conversation with ${conversation.name}`}
                >
                  {conversation.name}
                </div>
                {index < filteredConversations.length - 1 && (
                  <div className="conversation-divider"></div>
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>
      <div className="chat-area-container">
        {currentChat ? (
          <>
            <div
              className="chat-header"
              aria-label={`Chatting with ${currentChat.name}`}
            >
              {currentChat.name}
            </div>
            <div className="message-list" ref={messageListRef}>
              {messages.map((message) => (
                <>
                  <p className="text1">
                    {message.sender_type === "teacher" ? "You" : message.sender_type === "automated" ? "Automated Message" : `${currentChat.name}`}
                  </p>
                  <div
                    key={message.id}
                    className={`message-bubble ${
                      message.sender_type === "teacher" ? "sent" : message.sender_type === "automated" ? "automated" : "received"
                    }`}
                    aria-label={
                      message.sender_type === "teacher"
                        ? "Your message"
                        : "Message received"
                    }
                  >
                    <div className="message-content">{message.content}</div>
                  </div>
                </>
              ))}
            </div>
            <MessageInput currentChat={currentChat}/>
          </>
        ) : (
          <div className="no-conversation-selected">
            <div className="no-conversation-icon">
              <i className="fas fa-comments"></i>
            </div>
            <h2>Select a conversation to start chatting</h2>
          </div>
        )}
      </div>
    </div>
  );
}

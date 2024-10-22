import React, { useState, useEffect, useRef } from "react";
import io, { Socket} from "socket.io-client";
import "../App.css";
import SchoolHeaderNavBar from "@/components/school/school-header-nav-bar";
import { MessageInput } from "../components/message-input";
import { IMessage, IConversation, SchoolProfile, Message, TeacherUser } from "@/lib/types";
import { MessageCircleDashed } from "lucide-react";
import { fetchAllMessagesAsSchool, fetchAllMessagesAsTeacher, fetchSchoolsToChatWith, fetchTeachersToChatWith } from "@/lib/api";
import { useStore } from "@/lib/store";
import { MessageInputSchool } from "./messaging-input-school";
import Pusher from "pusher-js";

export default function MessagingAppSchool({starting_teacher_id}: {starting_teacher_id: string}) {
  const API_URL = import.meta.env.VITE_WEBSOCKET_URL;

  const API_KEY = import.meta.env.VITE_API_KEY;
  const API_CLUSTER = import.meta.env.VITE_API_CLUSTER;

  const socketRef= useRef<Socket | null>(); // Ref for the socket instance

  const pusherRef = useRef(null); // Ref for the Pusher instance
  const channelRef = useRef(null); // Ref for the Pusher channel

  // const socket = io(API_URL); // Your server URL
  const [conversations, setConversations] = useState<TeacherUser[]>([]);
  const [currentChat, setCurrentChat] = useState<TeacherUser | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const messageListRef = useRef(null); // Ref for the message list container

  const schoolUser = useStore((state) => state.schoolUser);

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
  }, [schoolUser]);

  useEffect(() => {
    if (currentChat) {
      const room_string = schoolUser.sub + "-" + currentChat.id
      channelRef.current = pusherRef.current.subscribe(room_string);
      channelRef.current.bind("receive_message", (data: Message) => {
        setMessages((prev) => [...prev, data]);
        scrollToBottom();
      });
      // socketRef.current.emit("join", { room: room_string });
      fetchMessages(currentChat);
      scrollToBottom();
      // return () => {
      //   socketRef.current.emit("leave", { room: room_string });
      // };
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
    const conversations = await fetchTeachersToChatWith();
    // Simulate fetching conversations from an API
    setConversations(conversations);

    if (starting_teacher_id) {
      setCurrentChat(conversations.find((conversation) => conversation.id.toString() === starting_teacher_id));
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

  const fetchMessages = async (conversation: TeacherUser)=> {
    // Simulate fetching messages for a conversation from an API
    console.log(schoolUser)
    if(schoolUser) {
      const myMessages = await fetchAllMessagesAsSchool(schoolUser.sub, conversation.id)
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
    (conversation.first_name + " " + conversation.last_name).toLowerCase().includes(searchTerm.toLowerCase())
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
                  aria-label={`Open conversation with ${conversation.first_name + " " + conversation.last_name}`}
                >
                  {conversation.first_name + " " + conversation.last_name}
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
              aria-label={`Chatting with ${currentChat.first_name + " " + currentChat.last_name}`}
            >
              {currentChat.first_name + " " + currentChat.last_name}
            </div>
            <div className="message-list" ref={messageListRef}>
              {messages.map((message) => (
                <>
                  <p className="text1">
                  {message.sender_type === "school" ? "You" : message.sender_type === "automated" ? "Automated Message" : `${currentChat.first_name + " " + currentChat.last_name}`}
                  </p>
                  <div
                    key={message.id}
                    className={`message-bubble ${
                      message.sender_type === "school" ? "sent" : message.sender_type === "automated" ? "automated" : "received"
                    }`}
                    aria-label={
                      message.sender_type === "school"
                        ? "Your message"
                        : "Message received"
                    }
                  >
                    <div className="message-content">{message.content}</div>
                  </div>
                </>
              ))}
            </div>
            <MessageInputSchool currentChat={currentChat}/>
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

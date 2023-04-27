import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import { toast } from "react-hot-toast";
import { useSelector } from "react-redux";
import { io } from "socket.io-client";
import { format } from "timeago.js";
import Conversation from "../../components/Conversation/Conversation";
import Leftsidebar from "../../components/LeftSidebar/Leftsidebar";
import Navbar from "../../components/Navbar/Navbar";
import { BASE_URL } from "../../consts";
import InputEmoji from "react-input-emoji";
import "./messenger.css";
import { Helmet } from "react-helmet";
import "../../components/MessageBox/messagebox.css";

const Messenger = () => {
  const user = useSelector((state) => state?.users?.value);
  const [allChats, setAllChats] = useState([]);
  const [currentChat, setCurrentChat] = useState(null);

  const [onlineUsers, setOnlineUsers] = useState([]);
  const [sendMessage, setSendMessage] = useState(null);
  const [arrivalMessage, setArrivalMessage] = useState(null);
  //CHAT BOX STATE 'S
  const [friendData, setFriendData] = useState([]);
  const [message, setMessage] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const socket = useRef();
  const scrollRef = useRef();

  useEffect(() => {
    socket.current = io("ws://localhost:8900");
    socket.current.on("getMessage", async (data) => {
      setArrivalMessage({
        senderId: data?.senderId,
        text: data?.text,
      });
    });

    socket.current.on("getUsers", (users) => {
      setOnlineUsers(users);
    });
  }, []);

  useEffect(() => {
    if (arrivalMessage !== null) {
      arrivalMessage &&
        currentChat?.members?.includes(arrivalMessage?.senderId) &&
        setMessage((prev) => [...prev, arrivalMessage]);
    }
  }, [arrivalMessage, currentChat]);

  useEffect(() => {
    socket.current.emit("addUser", user._id);
    socket.current.on("getUsers", (users) => {
      console.log(users);
    });
  }, [user]);

  useEffect(() => {
    const getChats = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/chat/${user._id}`);
        setAllChats(res.data);
      } catch (err) {
        console.log(err.message);
      }
    };
    getChats();
  }, [user._id]);

  //CHAT BOX FUNCTIONS
  const sendMessageFunc = async (e) => {
    e?.preventDefault();
    const messageSend = {
      senderId: user?._id,
      text: newMessage,
      chatId: currentChat?._id,
    };

    const recevierId = currentChat?.members?.find(
      (member) => member !== user?._id
    );
    if (recevierId && newMessage && newMessage) {
      socket.current?.emit("sendMessage", {
        senderId: user._id,
        recevierId: recevierId,
        text: newMessage,
      });
    }

    //SEND MESSAGE TO DB
    try {
      if (newMessage) {
        const result = await axios.post(`${BASE_URL}/message`, messageSend);
        setMessage([...message, result.data]);
        setNewMessage("");
      } else {
        toast.error("you have to write");
      }
    } catch (err) {
      console.log(err);
    }

    // SEND MESSAGE TO SOCKET SEVrver
    const receiverId = currentChat.members.find((id) => id !== user._id);
    setSendMessage({ ...message, receiverId });
  };

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [message]);

  //   GET CONTACT DATA
  useEffect(() => {
    const friendId = currentChat?.members?.find((id) => id !== user._id);
    const getFriendData = async () => {
      try {
        const res = await axios.get(
          `${BASE_URL}/users/getuser/withId/${friendId}`
        );
        setFriendData(res.data.data);
      } catch (err) {
        console.log(err.message);
      }
    };
    if (friendId !== undefined) getFriendData();
  }, [currentChat, user._id]);

  useEffect(() => {
    const getMessage = async () => {
      try {
        const result = await axios.get(
          `${BASE_URL}/message/${currentChat._id}`
        );
        setMessage(result.data);
      } catch (err) {
        console.log(err);
      }
    };
    if (currentChat !== null) getMessage();
  }, [currentChat]);

  const handleChange = (newMessage) => {
    setNewMessage(newMessage);
  };

  const checkOnlineStatus = (chat) => {
    const chatMember = chat.members.find((member) => member !== user._id);
    const online = onlineUsers.find((user) => user.userId === chatMember);
    return online ? true : false;
  };

  return (
    <>
      <Helmet>
        <meta charSet="utf-8" />
        <title>Messenger | Codemedia</title>
        <link rel="canonical" href="http://mysite.com/example" />
      </Helmet>
      <Navbar />
      <div className="contanier_messenger">
        <Leftsidebar />
        <div className="chat_right_contanier">
          <div className="Chat">
            {/* LEFT SIDE  */}
            <div className="Left-side-chat">
              <div className="Chat-container">
                <h2 className="chat_header_text">Chats</h2>
                <div className="Chat-list">
                  {allChats.length !== 0 ? (
                    allChats.map((chat) => {
                      return (
                        <div
                          key={chat._id}
                          onClick={() => setCurrentChat(chat)}>
                          <Conversation
                            key={chat._id}
                            data={chat}
                            currentUser={user._id}
                            online={checkOnlineStatus(chat)}
                          />
                        </div>
                      );
                    })
                  ) : (
                    <h5 className="noChatText"> No chat yet ! </h5>
                  )}
                </div>
              </div>
            </div>

            {/* RIGHT SIDE  */}
            <div className="Right-side-chat">
              {/* CHAT BOX  */}
              <div className="ChatBox-container">
                {currentChat ? (
                  <>
                    {/* CHAT HEADER  */}
                    <div className="chat-header">
                      <div className="follower">
                        <>
                          <div className="user_img_name">
                            <img
                              src={
                                friendData.profilePic
                                  ? friendData.profilePic
                                  : "assets/NoProfImg.webp"
                              }
                              alt=""
                              className="followerImg"
                            />
                            <div
                              className="name_messenger_mesBox"
                              style={{ fontSize: "1rem" }}>
                              <span className="messenger_friend_name">
                                {friendData.username}
                              </span>
                            </div>
                          </div>
                        </>
                      </div>
                    </div>

                    {/* CHAT BODY */}
                    <div className="chat-body">
                      {message.length !== 0 ? (
                        message.map((message) => {
                          return (
                            <div
                              key={message._id}
                              ref={scrollRef}
                              className={
                                message.senderId === user._id
                                  ? "message own"
                                  : "message"
                              }>
                              <span
                                key={message._id}
                                className="message_text_chatbox">
                                {message?.text}
                              </span>
                              <span className="message_time_chatbox">
                                {format(message.createdAt)}
                              </span>
                            </div>
                          );
                        }, [])
                      ) : (
                        <p className="noMessage_text">No message yet !</p>
                      )}
                    </div>

                    {/* SEND MESSAGE */}
                    <div className="chat-sender">
                      <InputEmoji value={newMessage} onChange={handleChange} />
                      <button onClick={sendMessageFunc} className="send-btn">
                        Send
                      </button>
                    </div>
                  </>
                ) : (
                  <span className="none_chats"> Click to start chat</span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Messenger;

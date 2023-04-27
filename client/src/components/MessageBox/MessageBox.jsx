import axios from "axios";
import React, { useRef } from "react";
import { useEffect } from "react";
import { useState } from "react";
import { format } from "timeago.js";
import { BASE_URL } from "../../consts";
import InputEmoji from "react-input-emoji";
import "./messagebox.css";
import { toast } from "react-hot-toast";

const MessageBox = ({ chat, adminUser, setSendMessage, receiveMessage }) => {
  const [friendData, setFriendData] = useState([]);
  const [message, setMessage] = useState([]);
  const [newMessage, setNewMessage] = useState("");

  const scrollRef = useRef();

  const handleChange = (newMessage) => {
    setNewMessage(newMessage);
  };

  useEffect(() => {
    if (receiveMessage !== null && receiveMessage.chatId === chat._id) {
      setMessage([...message, receiveMessage]);
    }
  }, [receiveMessage]);

  //   GET CONTACT DATA
  useEffect(() => {
    const friendId = chat?.members?.find((id) => id !== adminUser);
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
  }, [chat, adminUser]);

  //   GET MESSAGE
  useEffect(() => {
    const getMessage = async () => {
      try {
        const result = await axios.get(`${BASE_URL}/message/${chat._id}`);
        setMessage(result.data);
      } catch (err) {
        console.log(err);
      }
    };
    if (chat !== null) getMessage();
  }, [chat]);

  //SEND MESSAGE FUNC
  const sendMessage = async (e) => {
    e?.preventDefault();
    const messageSend = {
      senderId: adminUser,
      text: newMessage,
      chatId: chat._id,
    };

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

    //SEND MESSAGE TO SOCKET SEVrver
    const receiverId = chat.members.find((id) => id !== adminUser);
    setSendMessage({ ...message, receiverId });
  };

  //SCROLL USE EFFECT
  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [message]);

  return (
    <div className="ChatBox-container">
      {chat ? (
        <>
          {/* CHAT HEADER  */}
          <div className="chat-header">
            <div className="follower">
              <>
                <div className="user_img_name">
                  <img
                    src={
                      friendData
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
          <hr
            style={{
              width: "85%",
              height: "0",
              border: "0.1px solid #c7c5c5",
            }}
          />
          {/* CHAT BODY */}
          <div className="chat-body">
            {message.map((message) => {
              return (
                <div
                  key={message._id}
                  ref={scrollRef}
                  className={
                    message.senderId === adminUser ? "message own" : "message"
                  }>
                  <span>{message?.text}</span>
                  <span>{format(message.createdAt)}</span>
                </div>
              );
            }, [])}
          </div>

          {/* SEND MESSAGE */}
          <div className="chat-sender">
            <InputEmoji value={newMessage} onChange={handleChange} />
            <button onClick={sendMessage} className="send-btn">
              Send
            </button>
          </div>
        </>
      ) : (
        <span> TAP FOR START CHAT</span>
      )}
    </div>
  );
};

export default MessageBox;

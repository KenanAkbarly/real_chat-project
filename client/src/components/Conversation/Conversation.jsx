import axios from "axios";
import React, { useEffect, useState } from "react";
import { BASE_URL } from "../../consts";
import "./conversation.css";

const Conversation = ({ data, currentUser, online }) => {
  const [friendData, setFriendData] = useState([]);

  //GET FRIEND'S DATA
  useEffect(() => {
    const friendId = data.members.find((id) => id !== currentUser);
    const getFriendData = async () => {
      try {
        if (friendId !== undefined) {
          const res = await axios.get(
            `${BASE_URL}/users/getuser/withId/${friendId}`
          );
          setFriendData(res.data.data);
        }
      } catch (err) {
        console.log(err.message);
      }
    };
    getFriendData();
  }, []);

  return (
    <>
      <div className="follower conversation">
        <div className="user_img_name">
          {online && <div className="online-dot"></div>}
          <img
            src={
              friendData.profilePic
                ? friendData.profilePic
                : "/assets/NoProfImg.webp"
            }
            alt=""
            className="followerImg"
          />
          <div className="name_messenger" style={{ fontSize: "1rem" }}>
            <span className="messenger_friend_name_conver">
              {friendData.username}
            </span>
            <span className="online_text">{online ? "Online" : "Offline"}</span>
          </div>
        </div>
      </div>
      <hr style={{ width: "100%", border: "0.1px solid #c7c5c5" }} />
    </>
  );
};

export default Conversation;

import { Spin } from "antd";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { BASE_URL } from "../../consts";
import { hideLoad, showLoad } from "../../redux/slice/loadingSlice/loadSlice";
import style from "./rightSide.module.css";
import { BsChatLeftText } from "react-icons/bs";
import { toast } from "react-hot-toast";

const Rightsidebar = () => {
  const user = useSelector((state) => state.users.value);
  const loading = useSelector((state) => state.loading.value);
  const [friends, setFriends] = useState([]);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const startChat = (allId) => {
    axios
      .post(`${BASE_URL}/chat`, allId)
      .then(() => {
        toast.success("Chat created");
        navigate("/messenger");
      })
      .catch(() => {
        toast.error("Chat already exist !");
      });
  };

  const getFriends = async () => {
    dispatch(showLoad());
    try {
      if (user._id && user._id !== undefined) {
        const friendsUser = await axios.get(
          `${BASE_URL}/users/friends/${user._id}`
        );
        setFriends(friendsUser.data);
        dispatch(hideLoad());
      }
    } catch (err) {
      dispatch(hideLoad());
    }
  };
  useEffect(() => {
    getFriends();
  }, [user._id]);
  return (
    <div className={style.right_side_section}>
      <div className={style.right_side_wrapper}>
        {/* SPONSORED SECTION */}
        <div className={style.right_side_sponsored}>
          <div className={style.sponsored_section_title}>
            <h2 className={style.sponsored_section_title_h2}>Sponsored</h2>
          </div>
          <div className={style.sponsored_pics_wrapper}>
            <div className={style.sponsored_pics_card}>
              <div className={style.sponsored_pics_card_img}>
                <Link to={"https://code.edu.az/"} target={"_blank"}>
                  <img
                    className={style.sponsored_img}
                    src="data:image/png;base64,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"
                    alt=""
                  />
                </Link>
              </div>
              <div
                style={{ marginLeft: "10px" }}
                className={style.sponsored_pics_card_img}>
                <Link target={"_blank"} to={"https://www.uber.com/"}>
                  <img
                    className={style.sponsored_img}
                    src="https://seeklogo.com/images/U/uber-logo-2BB8EC4342-seeklogo.com.png"
                    alt=""
                  />
                </Link>
              </div>
            </div>
            <div className={style.sponsored_pics_card}>
              <div className={style.sponsored_pics_card_img}>
                <Link to={"https://www.tesla.com/"} target={"_blank"}>
                  <img
                    className={style.sponsored_img}
                    src="https://images.fineartamerica.com/images/artworkimages/mediumlarge/3/4-tesla-logo-davison-melissa.jpg"
                    alt=""
                  />
                </Link>
              </div>
              <div className={style.sponsored_pics_card_img}>
                <Link to={"https://www.apple.com/"} target={"_blank"}>
                  <img
                    className={style.sponsored_img}
                    src="https://s3.amazonaws.com/cdn.designcrowd.com/blog/100-Famous-Brand%20Logos-From-The-Most-Valuable-Companies-of-2020/apple-logo.png"
                    alt=""
                  />
                </Link>
              </div>
            </div>
          </div>
        </div>
        {/* FRIENDS SECTION */}
        <div className={style.right_side_friends}>
          <div className={style.right_side_friends_title}>
            <h3 className={style.right_side_friends_title_h3}>Friends</h3>
          </div>
          <div className={style.right_side_friends_wrapper}>
            {friends.length !== 0 ? (
              loading ? (
                <Spin />
              ) : (
                friends.map((friend) => {
                  return (
                    <div
                      key={friend?._id}
                      className={style.right_side_friends_prof}>
                      <Link
                        className={style.link_prof}
                        key={friend?._id}
                        to={`/profile/${friend?.username}`}>
                        <div className={style.profile_img_username_wrap}>
                          <div
                            className={style.right_side_friends_prof_pic_div}>
                            <img
                              className={style.right_side_friends_prof_img}
                              src={
                                friend?.profilePic
                                  ? friend?.profilePic
                                  : "/assets/NoProfImg.webp"
                              }
                              alt=""
                            />
                          </div>
                          <div
                            className={style.right_side_friends_username_div}>
                            <h5 className={style.right_side_friends_username}>
                              {friend?.username}
                            </h5>
                          </div>
                        </div>
                      </Link>
                      <div
                        onClick={() => {
                          startChat({
                            receiverId: friend._id,
                            senderId: user._id,
                          });
                        }}
                        className={style.right_side_profile_icon}>
                        <BsChatLeftText
                          className={style.right_side_profile_message_icon}
                        />
                      </div>
                    </div>
                  );
                })
              )
            ) : (
              <p className={style.nofriends_text}>No friends yet !</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Rightsidebar;

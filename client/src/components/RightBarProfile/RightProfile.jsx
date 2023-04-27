import React, { useEffect, useState } from "react";
import style from "./rightProfile.module.css";
import { BiEditAlt } from "react-icons/bi";
import { Modal, Select } from "antd";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { BASE_URL } from "../../consts";
import { Link } from "react-router-dom";
import { SlUserFollow } from "react-icons/sl";
import { SlUserFollowing } from "react-icons/sl";
import axiosInstance from "../../apicall";
import { toast } from "react-hot-toast";
import { MdOutlineDeleteForever } from "react-icons/md";
import { BsFillCameraFill } from "react-icons/bs";
import { useRef } from "react";

const convertBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const fileReader = new FileReader();
    fileReader.readAsDataURL(file);
    fileReader.onload = () => {
      resolve(fileReader.result);
    };
    fileReader.onerror = (err) => {
      reject(err);
    };
  });
};

const RightProfile = ({ user, submitFunc }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const showModal = () => {
    setIsModalOpen(true);
  };
  const handleOk = () => {
    setIsModalOpen(false);
  };
  const handleCancel = () => {
    setIsModalOpen(false);
  };
  const [isFollow, setIsFollow] = useState(false);
  const [follower, setFollower] = useState([]);
  const userAdmin = useSelector((state) => state.users.value);
  const [friends, setFriends] = useState([]);

  const handleFollowUnFollow = async () => {
    try {
      if (isFollow) {
        await axiosInstance
          .put(`${BASE_URL}/users/unfollow/${user._id}`)
          .then(() => {
            getFollowers();
          });
        toast.success("User is unfollowed");
        getFriends();
      } else {
        await axiosInstance
          .put(`${BASE_URL}/users/follow/${user._id}`)
          .then(() => {
            getFollowers();
          });
        toast.success("User is following");
        getFriends();
      }
    } catch (err) {
      console.log(err.message);
    }
    setIsFollow(!isFollow);
  };

  useEffect(() => {
    setIsFollow(userAdmin?.following?.includes(user._id));
  }, [userAdmin, user._id]);

  const getFollowers = async () => {
    try {
      if (user._id !== undefined) {
        const friendsUser = await axios.get(
          `${BASE_URL}/users/friends/follower/${user._id}`
        );
        setFollower(friendsUser.data);
      }
    } catch (err) {
      console.log({ message: err.message });
    }
  };

  const getFriends = async () => {
    try {
      if (user._id) {
        const friendsUser = await axios.get(
          `${BASE_URL}/users/friends/${user._id}`
        );
        setFriends(friendsUser.data);
      }
    } catch (err) {
      console.log({ message: err.message });
    }
  };

  useEffect(() => {
    getFriends();
    getFollowers();
  }, [user._id]);

  const handleFileUploadCover = async (pic) => {
    const file = pic;
    const base64 = await convertBase64(file);
    setcoverFile(base64);
  };

  const handleFileUploadProf = async (pic) => {
    const file = pic;
    const base64 = await convertBase64(file);
    setprofFile(base64);
  };

  const [profFile, setprofFile] = useState("");
  const [coverFile, setcoverFile] = useState("");
  const [relationInp, setrelationInp] = useState("");
  const [city, setCity] = useState("");
  const cityRef = useRef();
  const fromRef = useRef();
  const descRef = useRef();

  const handleChange = (value) => {
    setrelationInp(value.value);
  };

  const resetInp = () => {
    descRef.current.value = "";
    cityRef.current.value = "";
    fromRef.current.value = "";
  };

  return (
    <>
      <div className={style.profile_right_cont}>
        {user._id !== userAdmin._id &&
          (isFollow ? (
            <button
              onClick={handleFollowUnFollow}
              className={style.unFollow_btn}>
              Friends <SlUserFollowing className={style.unFollow_btn_icon} />
            </button>
          ) : (
            <button onClick={handleFollowUnFollow} className={style.follow_btn}>
              Follow <SlUserFollow className={style.follow_btn_icon} />
            </button>
          ))}
        <div className={style.profile_right_user_info}>
          <div className={style.edit_btn_div}>
            <h3 className={style.profile_right_user_info_h3}>
              User information
            </h3>
            {userAdmin._id === user._id ? (
              <button onClick={showModal} className={style.edit_btn}>
                Edit <BiEditAlt className={style.edit_icon} />
              </button>
            ) : (
              <p style={{ display: "none" }}>halo</p>
            )}
          </div>
          <Modal
            width={300}
            footer={null}
            title="Changes"
            open={isModalOpen}
            onOk={handleOk}
            onCancel={handleCancel}>
            <form
              onSubmit={async (e) => {
                await submitFunc(
                  e,
                  coverFile,
                  profFile,
                  descRef?.current?.value,
                  cityRef?.current?.value,
                  fromRef.current?.value,
                  relationInp
                );

                setcoverFile(null);
                setprofFile(null);
                resetInp();
                setrelationInp("");

                handleCancel();
              }}
              action="#">
              <div className={style.edit_cover_phot}>
                <label className={style.title_update}>For cover photo </label>
                <label htmlFor="cover" className={style.coverPhotoWrap}>
                  <div className={style.photo_icon_back}>
                    <BsFillCameraFill />
                  </div>
                  <input
                    id="cover"
                    style={{ display: "none", paddingRight: "50px" }}
                    onChange={(e) => handleFileUploadCover(e.target.files[0])}
                    type={"file"}
                  />
                  {coverFile ? (
                    <>
                      <p>File selected </p>
                      <MdOutlineDeleteForever
                        onClick={() => {
                          setcoverFile("");
                        }}
                        className={style.photoDelete}
                      />
                    </>
                  ) : (
                    ""
                  )}
                </label>
              </div>
              <div className={style.edit_cover_phot}>
                <label className={style.title_update}>For profile photo </label>
                <label htmlFor="profile" className={style.coverPhotoWrap}>
                  <div className={style.photo_icon_back}>
                    <BsFillCameraFill />
                  </div>
                  <input
                    style={{ display: "none", paddingRight: "50px" }}
                    id="profile"
                    onChange={(e) => handleFileUploadProf(e.target.files[0])}
                    type={"file"}
                  />
                  {profFile ? (
                    <>
                      <p>File selected </p>
                      <MdOutlineDeleteForever
                        onClick={() => {
                          setprofFile("");
                        }}
                        className={style.photoDelete}
                      />
                    </>
                  ) : (
                    ""
                  )}
                </label>
              </div>
              <div className={style.edit_cover_phot}>
                <label className={style.title_update}>For Desciription </label>
                <input
                  className={style.input_update}
                  ref={descRef}
                  placeholder={`${
                    user.userDesc ? user.userDesc : "No information"
                  }`}
                  type={"text"}
                />
              </div>
              <div className={style.edit_cover_phot}>
                <label className={style.title_update}>For City </label>
                <input
                  className={style.input_update}
                  placeholder={`${user.city ? user.city : "No information"}`}
                  ref={cityRef}
                  type={"text"}
                  onChange={(e) => setCity(e.target.value)}
                />
              </div>
              <div className={style.edit_cover_phot}>
                <label className={style.title_update}>For From </label>
                <input
                  className={style.input_update}
                  placeholder={`${user.from ? user.from : "No information"}`}
                  ref={fromRef}
                  type={"text"}
                />
              </div>
              <div className={style.edit_cover_phot}>
                <label className={style.title_update}>
                  Choose Relationship
                </label>
                <Select
                  labelInValue
                  defaultValue={"Choose"}
                  style={{
                    width: "100%",
                  }}
                  onChange={handleChange}
                  options={[
                    {
                      value: 1,
                      label: "Single",
                    },
                    {
                      value: 2,
                      label: "Married",
                    },
                    {
                      value: 3,
                      label: "In a relationship",
                    },
                    {
                      value: 4,
                      label: "No Information",
                    },
                  ]}
                />
              </div>
              <div className={style.button_edit_submit}>
                <button type="submit" className={style.btn_update}>
                  Submit
                </button>
              </div>
            </form>
          </Modal>
          <div className={style.info_text}>
            <p className={style.info_text_p}>
              <span className={style.info_text_title}>City: </span>
              {user?.city ? user?.city : "No Information"}
            </p>
            <p className={style.info_text_p}>
              <span className={style.info_text_title}>From: </span>
              {user?.from ? user?.from : "No Information"}
            </p>
            <p className={style.info_text_p}>
              <span className={style.info_text_title}>Relationship: </span>
              {user?.reltionship === 1
                ? "single"
                : user?.reltionship === 2
                ? "Married"
                : user?.reltionship === 3
                ? "In a relationship"
                : "No Information"}
            </p>
          </div>
        </div>

        <div className={style.profile_right_user_friends_wrapper}>
          <div className={style.following_wrap}>
            <h4 className={style.title_following}>Followings</h4>
            <div className={style.profile_right_friends}>
              {friends.length !== 0 ? (
                friends.map((friend) => {
                  return (
                    <Link key={friend._id} to={`/profile/${friend.username}`}>
                      <div
                        key={friend._id}
                        className={style.profile_right_friends_friend_card}>
                        <div
                          className={
                            style.profile_right_friends_friend_card_img
                          }>
                          <img
                            className={style.profile_right_friends_friend_pic}
                            src={
                              friend?.profilePic
                                ? friend?.profilePic
                                : "/assets/NoProfImg.webp"
                            }
                            alt=""
                          />
                        </div>
                        <p
                          className={
                            style.profile_right_friends_friend_card_username
                          }>
                          {friend?.username}
                        </p>
                      </div>
                    </Link>
                  );
                })
              ) : (
                <h5 style={{ color: "gray", fontWeight: "500" }}>
                  No following yet
                </h5>
              )}
            </div>
          </div>

          <div className={style.following_wrap}>
            <h4 className={style.title_following}>Followers</h4>
            <div className={style.profile_right_friends}>
              {follower.length === 0 ? (
                <h5 style={{ color: "gray", fontWeight: "500" }}>
                  No follower yet !
                </h5>
              ) : (
                follower.map((friend) => {
                  return (
                    friend && (
                      <Link
                        key={friend?._id}
                        to={`/profile/${friend?.username}`}>
                        <div
                          key={friend?.username}
                          className={style.profile_right_friends_friend_card}>
                          <div
                            key={friend._id}
                            className={
                              style.profile_right_friends_friend_card_img
                            }>
                            <img
                              className={style.profile_right_friends_friend_pic}
                              src={
                                friend?.profilePic
                                  ? friend?.profilePic
                                  : "/assets/NoProfImg.webp"
                              }
                              alt=""
                            />
                          </div>
                          <p
                            className={
                              style.profile_right_friends_friend_card_username
                            }>
                            {friend?.username}
                          </p>
                        </div>
                      </Link>
                    )
                  );
                })
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default RightProfile;

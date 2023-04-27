import axios from "axios";
import React, { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import axiosInstance from "../../apicall";
import Leftsidebar from "../../components/LeftSidebar/Leftsidebar";
import Mainsidebar from "../../components/MainSidebar/Mainsidebar";
import Navbar from "../../components/Navbar/Navbar";
import RightProfile from "../../components/RightBarProfile/RightProfile";
import { BASE_URL } from "../../consts";
import { hideLoad, showLoad } from "../../redux/slice/loadingSlice/loadSlice";
import style from "./profile.module.css";
import { getUserInfo } from "../../apicall/usersApi";
import { SetUser } from "../../redux/slice/userSlice/userSlice";
import { Helmet } from "react-helmet";

const Profile = () => {
  const [user, setUser] = useState([]);
  const dispatch = useDispatch();
  const params = useParams();
  const userAdmin = useSelector((state) => state.users.value);

  const fetchUser = async () => {
    dispatch(showLoad());
    const res = await axios
      .get(`http://localhost:8080/api/users/getuser/${params.username}`)
      .then((res) => setUser(res.data.data));
    dispatch(hideLoad());
  };
  useEffect(() => {
    fetchUser();
  }, [params.username]);

  const handleSubmit = async (
    e,
    coverFile,
    profFile,
    descRef,
    cityRef,
    fromRef,
    relationInp
  ) => {
    e?.preventDefault();
    const newPost = {};

    if (coverFile) {
      try {
        newPost.coverPic = coverFile;
        console.log("Succsess");
      } catch (err) {}
    }
    if (profFile) {
      try {
        newPost.profilePic = profFile;
        console.log("Succsess");
      } catch (err) {}
    }
    if (descRef) {
      try {
        newPost.userDesc = descRef;
        console.log("Succsess");
      } catch (err) {}
    }
    if (cityRef) {
      try {
        newPost.city = cityRef;
        console.log("Succsess");
        cityRef = "";
      } catch (err) {}
    }
    if (fromRef) {
      try {
        newPost.from = fromRef;
        console.log("Succsess");
      } catch (err) {}
    }
    if (relationInp) {
      try {
        newPost.reltionship = relationInp;
        console.log("Succsess");
      } catch (err) {}
    }
    try {
      if (newPost && userAdmin._id !== undefined) {
        await axiosInstance
          .put(`${BASE_URL}/users/${userAdmin._id}`, newPost)
          .then(async () => {
            profFile = "";
            toast.success("Updated");
            fetchUser();
            const response = await getUserInfo();
            if (response.success) {
              dispatch(SetUser(response.data));
            }
          });
      } else if (!newPost) {
        toast.error("No update");
      }
    } catch (err) {
      console.log({ message: err.message });
    }
  };

  return (
    <>
      <Helmet>
        <meta charSet="utf-8" />
        <title> {params.username} | Codemedia</title>
        <link rel="canonical" href="http://mysite.com/example" />
      </Helmet>
      <Navbar />
      <div className={style.profile_page_cont}>
        <Leftsidebar />
        <div className={style.profile_page_right_side}>
          <div className={style.profile_page_top_pics}>
            <div className={style.profile_page_cover_div}>
              <img
                className={style.profile_page_cover}
                src={user?.coverPic || "/assets/noCoverPic2.jpg"}
                alt=""
              />
            </div>
            <div className={style.profile_page_pics_user}>
              <img
                className={style.profile_page_pics_img}
                src={
                  user?.profilePic ? user?.profilePic : "/assets/NoProfImg.webp"
                }
                alt=""
              />
            </div>
            <div className={style.profile_page_username_desc}>
              <h3>{user?.username}</h3>
              <p className={style.prof_desc_top_side}>
                {user?.userDesc ? user?.userDesc : "Write about yourself"}
              </p>
            </div>
          </div>
          <div className={style.profile_page_right_bottom_section}>
            <Mainsidebar username={user?.username} />
            <RightProfile user={user} submitFunc={handleSubmit} />
          </div>
        </div>
      </div>
    </>
  );
};

export default Profile;

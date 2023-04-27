import { Spin } from "antd";
import React, { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import axiosInstance from "../../apicall";
import { BASE_URL } from "../../consts";
import { hideLoad, showLoad } from "../../redux/slice/loadingSlice/loadSlice";
import Post from "../Post/Post";
import Share from "../Share/Share";
import style from "./mainSide.module.css";

const Mainsidebar = ({ username }) => {
  const [posts, setPosts] = useState([]);
  const user = useSelector((state) => state.users.value);
  const loading = useSelector((state) => state.loading.value);
  const dispatch = useDispatch();
  const [isSure, setisSure] = useState(false);

  const getPost = async () => {
    dispatch(showLoad());
    username
      ? await axiosInstance
          .get(`${BASE_URL}/posts/timeline/${user?._id}`)
          .then((res) => {
            setPosts(
              res?.data
                .filter((post) => {
                  return post.userId.username === username;
                })
                .sort((d1, d2) => {
                  return new Date(d2?.createdAt) - new Date(d1?.createdAt);
                })
            );
          })
      : await axiosInstance
          .get(`${BASE_URL}/posts/timeline/${user?._id}`)
          .then((res) => {
            setPosts(
              res?.data.sort((d1, d2) => {
                return new Date(d2?.createdAt) - new Date(d1?.createdAt);
              })
            );
          });
    dispatch(hideLoad());
  };

  useEffect(() => {
    getPost();
    dispatch(hideLoad());
  }, [username, user]);

  const deletePost = async (id) => {
    if (id && id !== undefined)
      axiosInstance.delete(`${BASE_URL}/posts/${id}`).then(() => {
        getPost();
      });
  };
  useEffect(() => {
    deletePost();
  }, [isSure]);

  //POST PUSH
  const handleSubmit = async (e, userId, desc, file) => {
    e.preventDefault();
    const newPost = {
      userId: userId,
      desc: desc,
    };
    if (file) {
      newPost.img = file;
      try {
        console.log("Succsess");
      } catch (err) {}
    }
    try {
      await axiosInstance.post(`${BASE_URL}/posts`, newPost).then(() => {
        getPost();
      });
    } catch (err) {}
  };

  useEffect(() => {
    getPost();
  }, []);

  //COMMENT POST
  const postComment = async (comment, postId) => {
    const newComment = {};
    if (comment) {
      newComment.desc = comment;
      try {
        await axiosInstance
          .post(`${BASE_URL}/posts/comment/${postId}`, newComment)
          .then(() => {
            getPost();
          });
        toast.success("Comment posted");
      } catch (err) {
        console.log({ message: err.message });
      }
    } else {
      toast.error("You have to write");
    }
  };

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

  return (
    <>
      <div className={style.main_side_section}>
        <div className={style.main_side_wrapper}>
          <div className={style.post_wrapper_main}>
            {!username && <Share submitPost={handleSubmit} />}

            {posts.length !== 0 ? (
              loading ? (
                <Spin size="large" />
              ) : (
                posts.map((post) => {
                  return (
                    <Post
                      key={post?._id}
                      deleteFunc={deletePost}
                      postComment={postComment}
                      post={post}
                      showModal={showModal}
                      isSure={isSure}
                    />
                  );
                })
              )
            ) : (
              <p className={style.noPost}>No post yet !</p>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Mainsidebar;

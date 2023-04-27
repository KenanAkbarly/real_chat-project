import React, { useRef, useState } from "react";
import style from "./post.module.css";
import Button from "@mui/material/Button";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Fade from "@mui/material/Fade";
import { BsThreeDots } from "react-icons/bs";
import { RiDeleteBin5Line } from "react-icons/ri";
import { AiOutlineHeart } from "react-icons/ai";
import { FaRegCommentAlt } from "react-icons/fa";
import { AiFillHeart } from "react-icons/ai";
import { RiShareForwardLine } from "react-icons/ri";
import { BsEmojiSmile } from "react-icons/bs";
import { MdSend } from "react-icons/md";
import EmojiPicker from "emoji-picker-react";
import { format } from "timeago.js";
import { useSelector } from "react-redux";
import axiosInstance from "../../apicall";
import { BASE_URL } from "../../consts";
import { useEffect } from "react";
import { Link } from "react-router-dom";
import { confirmAlert } from "react-confirm-alert"; // Import
import "react-confirm-alert/src/react-confirm-alert.css";

const Post = ({ post, deleteFunc, postComment, showModal, isSure }) => {
  const user = useSelector((state) => state.users.value);

  const [show, setShow] = useState(false);

  const [like, setLike] = useState(false);
  const [likeCount, setLikeCount] = useState(post.likes.length);

  //POST DROP DOWN STATE
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  //DROP DOWN CLOSE
  const handleClose = () => {
    setAnchorEl(null);
  };

  //EMOJI SHOW
  const emojiShowHideFunc = () => {
    setShow(!show);
  };

  //GET EMOJI
  const handleEmojiClick = (e, emoji) => {
    let msg = comment;
    msg += e.emoji;
    setCom(msg);
  };
  //LIKE FUNC AND DISLIKE
  const likeDislike = async () => {
    setLikeCount(like ? likeCount - 1 : likeCount + 1);
    setLike(!like);
    try {
      await axiosInstance.put(`${BASE_URL}/posts/like/${post._id}`);
    } catch (err) {
      console.log(err);
    }
  };

  //LIKES RENDER
  useEffect(() => {
    setLike(post.likes.includes(user._id));
  }, [post.likes, user._id]);
  const commentRef = useRef();

  const [comment, setCom] = useState("");

  const submit = () => {
    confirmAlert({
      message: "Are you sure you want to delete ?",
      buttons: [
        {
          label: "Yes",
          onClick: () => deleteFunc(post._id),
        },
        {
          label: "No",
          onClick: () => handleClose(),
        },
      ],
    });
  };
  return (
    <>
      <div className={style.post_parent_div}>
        {/* POST TOP SECTION */}
        <div className={style.post_top}>
          <div className={style.post_top_left}>
            <Link to={`/profile/${post?.userId?.username}`}>
              <div className={style.post_top_left_img_div}>
                <img
                  className={style.post_top_left_img}
                  src={post?.userId?.profilePic || "/assets/NoProfImg.webp"}
                  alt=""
                />
              </div>
            </Link>
            <div className={style.post_left_text}>
              <h5 className={style.post_left_text_user}>
                {post?.userId?.username}
              </h5>
              <p className={style.post_left_text_date}>
                {format(post?.createdAt)}
              </p>
            </div>
          </div>
          <div className={style.post_top_right}>
            <Button
              style={{
                display: post?.userId?._id === user?._id ? "inline" : "none",
              }}
              className={style.post_btn}
              id="fade-button"
              aria-controls={open ? "fade-menu" : undefined}
              aria-haspopup="true"
              aria-expanded={open ? "true" : undefined}
              onClick={handleClick}>
              <BsThreeDots className={style.post_btn_icon} />
            </Button>
            <Menu
              id="fade-menu"
              MenuListProps={{
                "aria-labelledby": "fade-button",
              }}
              anchorEl={anchorEl}
              open={open}
              onClose={handleClose}
              TransitionComponent={Fade}>
              <MenuItem
                onClick={async () => {
                  handleClose();
                  submit();
                }}
                className={style.menu_item_post}>
                Delete <RiDeleteBin5Line className={style.post_delete_btn} />
              </MenuItem>
            </Menu>
          </div>
        </div>
        {/* POST DESC AND PICS */}
        <div className={style.post_center}>
          <div className={style.post_center_desc}>
            <p className={style.post_center_desc_text}>{post?.desc}</p>
            {/* <EmojiPicker onEmojiClick /> */}
          </div>
          <div className={style.post_center_img_div}>
            <img className={style.post_center_img} src={post?.img} alt="" />
          </div>
        </div>
        <div className={style.post_bottom_wrapper}>
          {/* LIKE AND COMMENT COUNTER */}
          <div className={style.post_bottom}>
            <div className={style.post_bottom_like}>
              <div className={style.post_img_like_div}>
                <img
                  className={style.post_img_like}
                  src="data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' viewBox='0 0 16 16'%3e%3cdefs%3e%3clinearGradient id='a' x1='50%25' x2='50%25' y1='0%25' y2='100%25'%3e%3cstop offset='0%25' stop-color='%2318AFFF'/%3e%3cstop offset='100%25' stop-color='%230062DF'/%3e%3c/linearGradient%3e%3cfilter id='c' width='118.8%25' height='118.8%25' x='-9.4%25' y='-9.4%25' filterUnits='objectBoundingBox'%3e%3cfeGaussianBlur in='SourceAlpha' result='shadowBlurInner1' stdDeviation='1'/%3e%3cfeOffset dy='-1' in='shadowBlurInner1' result='shadowOffsetInner1'/%3e%3cfeComposite in='shadowOffsetInner1' in2='SourceAlpha' k2='-1' k3='1' operator='arithmetic' result='shadowInnerInner1'/%3e%3cfeColorMatrix in='shadowInnerInner1' values='0 0 0 0 0 0 0 0 0 0.299356041 0 0 0 0 0.681187726 0 0 0 0.3495684 0'/%3e%3c/filter%3e%3cpath id='b' d='M8 0a8 8 0 00-8 8 8 8 0 1016 0 8 8 0 00-8-8z'/%3e%3c/defs%3e%3cg fill='none'%3e%3cuse fill='url(%23a)' xlink:href='%23b'/%3e%3cuse fill='black' filter='url(%23c)' xlink:href='%23b'/%3e%3cpath fill='white' d='M12.162 7.338c.176.123.338.245.338.674 0 .43-.229.604-.474.725a.73.73 0 01.089.546c-.077.344-.392.611-.672.69.121.194.159.385.015.62-.185.295-.346.407-1.058.407H7.5c-.988 0-1.5-.546-1.5-1V7.665c0-1.23 1.467-2.275 1.467-3.13L7.361 3.47c-.005-.065.008-.224.058-.27.08-.079.301-.2.635-.2.218 0 .363.041.534.123.581.277.732.978.732 1.542 0 .271-.414 1.083-.47 1.364 0 0 .867-.192 1.879-.199 1.061-.006 1.749.19 1.749.842 0 .261-.219.523-.316.666zM3.6 7h.8a.6.6 0 01.6.6v3.8a.6.6 0 01-.6.6h-.8a.6.6 0 01-.6-.6V7.6a.6.6 0 01.6-.6z'/%3e%3c/g%3e%3c/svg%3e"
                  alt=""
                />
              </div>
              <p className={style.post_like_text}>
                <span>{likeCount}</span> people liked it
              </p>
            </div>
            <div className={style.post_bottom_comment}>
              <span className={style.comment_count}>
                {post?.comments?.length}
              </span>
              <FaRegCommentAlt className={style.post_comment_icon} />
            </div>
          </div>
          {/* BUTTON FOR LIKE */}
          <div className={style.post_bottom_like_btn}>
            {/* LIKE BUTTON */}
            <div
              onClick={() => {
                likeDislike();
              }}
              className={style.post_bottom_like_btn_func}>
              <div className={style.post_bottom_like_btn_func_icons}>
                {like ? (
                  <AiFillHeart
                    className={style.like_func_icon}
                    style={{ color: "rgba(255, 0, 0, 0.8)" }}
                  />
                ) : (
                  <AiOutlineHeart
                    style={{ color: "#65676b" }}
                    className={style.like_func_icon}
                  />
                )}
              </div>
              <span className={style.like_func_text}>Like</span>
            </div>
            {/* SHARE BUTTON */}
            <div className={style.post_bottom_like_btn_func}>
              <RiShareForwardLine
                style={{ color: "#65676b" }}
                className={style.like_func_icon}
              />
              <span className={style.like_func_text}>Share</span>
            </div>
          </div>
          {/* COMMENT SECTION */}
          <div className={style.post_bottom_comment_section}>
            <div className={style.post_bottom_comments_wrapper}>
              {post?.comments.length !== 0 ? (
                post?.comments?.map((com) => (
                  <div
                    key={com?.commentId}
                    className={style.post_bottom_comment}>
                    <div className={style.user_comment}>
                      <div className={style.comment_user_name_img_div}>
                        <img
                          className={style.comment_user_prof}
                          src={
                            com.user?.profilePic
                              ? com.user?.profilePic
                              : "/assets/NoProfImg.webp"
                          }
                          alt=""
                        />
                        <span className={style.comment_username}>
                          {com?.user?.username}
                        </span>
                      </div>
                      <span className={style.comment_desc}>{com?.descCom}</span>
                    </div>
                  </div>
                ))
              ) : (
                <div className={style.no_comment_div}>
                  <p className={style.no_comment_div_p}>No comment yet !</p>
                </div>
              )}
            </div>
            <div className={style.post_bottom_comment_input}>
              <div className={style.post_bottom_comment_profPic_div}>
                <img
                  className={style.post_bottom_comment_img}
                  src={
                    user.profilePic
                      ? user?.profilePic
                      : "/assets/NoProfImg.webp"
                  }
                  alt=""
                />
              </div>
              <div className={style.post_bottom_comment_emoji}>
                <input
                  ref={commentRef}
                  className={style.comment_input}
                  type="text"
                  placeholder="Write a comment..."
                  value={comment}
                  onChange={(e) => setCom(e.target.value)}
                />
                <div className={style.emoji_btn_collec}>
                  <BsEmojiSmile
                    style={{ color: show ? "blue" : "black" }}
                    onClick={emojiShowHideFunc}
                    className={style.emoji_btn}
                  />
                  {show && (
                    <EmojiPicker
                      emojiStyle="google"
                      width={300}
                      height={260}
                      onEmojiClick={handleEmojiClick}
                      searchDisabled="true"
                    />
                  )}
                </div>
                <button
                  onClick={() => {
                    postComment(comment, post._id);
                  }}
                  className={style.send_btn_comment}>
                  <MdSend className={style.comment_send_icon} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Post;

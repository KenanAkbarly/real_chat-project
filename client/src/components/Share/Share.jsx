import React from "react";
import style from "./share.module.css";
import { FaPhotoVideo } from "react-icons/fa";
import { FaRegLaugh } from "react-icons/fa";
import { HiLocationMarker } from "react-icons/hi";
import { useSelector } from "react-redux";
import { useState } from "react";
import { useRef } from "react";
import { MdDeleteForever } from "react-icons/md";
import { toast } from "react-hot-toast";

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
const Share = ({ submitPost }) => {
  const user = useSelector((state) => state.users.value);
  const descInp = useRef();
  const [file, setFile] = useState(null);
  const [testFile, setTestfile] = useState(null);

  const handleFileUpload = async (pic) => {
    const file = pic;
    setTestfile(file);
    const base64 = await convertBase64(file);
    setFile(base64);
  };

  return (
    <div className={style.share_wrapper}>
      <div className={style.share_wrapper_top}>
        <div className={style.share_top_profile_pic_div}>
          <img
            className={style.share_top_profile_img}
            src={user?.profilePic ? user?.profilePic : "/assets/NoProfImg.webp"}
            alt=""
          />
        </div>
        <div className={style.share_top_profile_input_div}>
          <input
            ref={descInp}
            className={style.share_top_input}
            type="text"
            placeholder={`What's in your mind ${user.username} ?`}
          />
        </div>
      </div>
      {testFile && (
        <div className={style.testImgWrapper}>
          <img
            className={style.imgTest}
            src={URL.createObjectURL(testFile)}
            alt=""
          />
          <MdDeleteForever
            className={style.testImgCancel}
            onClick={() => setTestfile(null)}
          />
        </div>
      )}
      <form
        onSubmit={async (e) => {
          e?.preventDefault();
          if (descInp.current.value) {
            await submitPost(e, user._id, descInp.current.value, file);
            descInp.current.value = "";
            setFile(null);
            setTestfile(null);
          } else {
            toast.error("You must write anything");
          }
        }}>
        <div className={style.share_wrapper_icons}>
          <div className={style.icons_wrapper}>
            {/* PHOTO VIDEO */}
            <label htmlFor="file" className={style.share_icon}>
              <FaPhotoVideo style={{ color: "red" }} className={style.icon} />
              <p className={style.share_text}>Photo/video</p>
              <input
                style={{ display: "none" }}
                type="file"
                id="file"
                accept=".jpg, .jpeg, .png"
                onChange={(e) => handleFileUpload(e.target.files[0])}
              />
            </label>
            {/* LOCATION */}
            <div className={style.share_icon}>
              <HiLocationMarker
                style={{ color: "green" }}
                className={style.icon}
              />
              <p className={style.share_text}>Location</p>
            </div>
            {/* FEELINGS */}
            <div className={style.share_icon}>
              <FaRegLaugh
                className={style.icon}
                style={{ color: "goldenrod" }}
              />
              <p className={style.share_text}>Feelings</p>
            </div>
          </div>
          <div className={style.btn_div}>
            <button type="submit" className={style.share_btn}>
              Share
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default Share;

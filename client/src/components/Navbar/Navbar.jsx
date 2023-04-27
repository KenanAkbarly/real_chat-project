import React, { useEffect, useRef, useState } from "react";
import style from "./navbar.module.css";
import { BsMessenger } from "react-icons/bs";
import { MdNotificationsActive } from "react-icons/md";
import { BsChevronDown } from "react-icons/bs";
import { BsSearch } from "react-icons/bs";
import { FaRegWindowClose } from "react-icons/fa";
import { IoMdSettings } from "react-icons/io";
import { BsChevronRight } from "react-icons/bs";
import { MdOutlineHelp } from "react-icons/md";
import { BsFillMoonFill } from "react-icons/bs";
import { RiFeedbackFill } from "react-icons/ri";
import { MdLogout } from "react-icons/md";
import { BiMenuAltRight } from "react-icons/bi";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getUserInfo } from "../../apicall/usersApi";
import { toast, Toaster } from "react-hot-toast";
import { SetUser } from "../../redux/slice/userSlice/userSlice";
import axios from "axios";
import { BASE_URL } from "../../consts";

const Navbar = () => {
  const user = useSelector((state) => state.users.value);

  const [open, setOpen] = useState(false);
  const [account, setAccount] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const getUserData = async () => {
    try {
      const response = await getUserInfo();
      if (response.success) {
        dispatch(SetUser(response.data));
      } else {
        toast.error(response.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };
  const [alluser, setAlluser] = useState([]);
  useEffect(() => {
    axios.get(`${BASE_URL}/users`).then((res) => {
      setAlluser(res.data);
    });
  }, []);

  const [searchInp, setSearch] = useState("");

  useEffect(() => {
    if (localStorage.getItem("token")) {
      getUserData();
    } else {
      navigate("/login");
    }
  }, []);

  const searchRef = useRef();
  const toggle = () => {
    setAccount(!account);
  };
  const openFunc = () => {
    setOpen(true);
  };
  const closeFunc = () => {
    setOpen(false);
  };

  return (
    <>
      <Toaster position="top-right" reverseOrder={false} />
      <div
        onClick={() => {
          // closeFunc();
        }}
        className={style.navbar}>
        {/* NAVBAR LEFT */}
        <div className={style.navbar_left_part}>
          <Link to={"/"} className={style.navbar_left_h1}>
            codemedia
          </Link>
        </div>
        {/* NAVBAR MIDDLE */}
        <div className={style.navbar_middle_part}>
          <div
            onClick={() => {
              // openFunc();
            }}
            className={style.navbar_middle_search_div}>
            <div className={style.navbar_middle_search_input_div}>
              <input
                onFocus={() => {
                  openFunc();
                }}
                ref={searchRef}
                placeholder="Search for friends"
                type="text"
                className={style.navbar_middle_search_input}
                onChange={(e) => setSearch(e.target.value)}
              />
              <BsSearch className={style.search_icon} />
            </div>
            <div
              className={
                open
                  ? style.display_block
                  : style.navbar_middle_search_input_div_bottom
              }>
              <div className={style.navbar_middle_search_input_bottom_results}>
                <div
                  className={
                    style.navbar_middle_search_input_bottom_results_text
                  }>
                  <div className={style.searchInp_friends_wrapper}>
                    {searchInp ? (
                      alluser
                        .filter((user) => {
                          if (searchInp === "") {
                            return user;
                          } else if (
                            user?.username
                              .toLowerCase()
                              .includes(searchInp.toLowerCase().trim())
                          ) {
                            return user;
                          }
                        })
                        .map((user) => {
                          return (
                            <Link
                              key={user._id}
                              to={`/profile/${user.username}`}>
                              <div
                                onClick={closeFunc}
                                className={style.searchInp_friends}>
                                <div
                                  className={style.searchInp_friends_img_div}>
                                  <img
                                    className={style.searchInp_friends_img}
                                    src={
                                      user?.profilePic
                                        ? user?.profilePic
                                        : "/assets/NoProfImg.webp"
                                    }
                                    alt=""
                                  />
                                </div>
                                <p className={style.search_user_name}>
                                  {user?.username}
                                </p>
                              </div>
                            </Link>
                          );
                        })
                    ) : (
                      <p className={style.results_text}>No search yet</p>
                    )}
                  </div>
                  <FaRegWindowClose
                    onClick={() => {
                      closeFunc();
                    }}
                    className={style.close_button}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* NAVBAR RİGHT */}
        <div
          onClick={() => {
            closeFunc();
          }}
          className={style.navbar_right_part}>
          <div
            type="button"
            data-bs-toggle="offcanvas"
            data-bs-target="#offcanvasRight"
            aria-controls="offcanvasRight"
            title="modal"
            className={style.navbar_modal_icon}>
            <BiMenuAltRight />
          </div>

          <div className={style.navbar_right_part_icons}>
            <Link to={"/messenger"}>
              <div title="Messenger" className={style.navbar_message_icon}>
                <BsMessenger />
              </div>
            </Link>
            <div title="Notification" className={style.navbar_message_icon}>
              <MdNotificationsActive />
            </div>
            <div
              onClick={() => {
                toggle();
              }}
              title="Account"
              className={style.navbar_profile_photo}>
              <img
                className={style.navbar_profile_photo_img}
                src={
                  user?.profilePic ? user?.profilePic : "/assets/NoProfImg.webp"
                }
                alt=""
              />
              <div className={style.navbar_profile_photo_icon}>
                <BsChevronDown className={style.arrow} />
              </div>
              <div
                className={
                  account
                    ? style.navbar_profile_logout
                    : style.navbar_profile_logout_display_none
                }>
                <div className={style.navbar_profile_logout_options}>
                  {/* SETTINGS */}
                  <div className={style.option}>
                    <div className={style.option_left}>
                      <div className={style.option_left_icon_backg}>
                        <IoMdSettings className={style.settings_icon} />
                      </div>
                    </div>
                    <div className={style.option_right}>
                      <p className={style.option_right_text}>
                        Settings & privacy
                      </p>
                      <BsChevronRight className={style.right_arrow} />
                    </div>
                  </div>

                  {/* HELP AND SUPPORT */}
                  <div className={style.option}>
                    <div className={style.option_left}>
                      <div className={style.option_left_icon_backg}>
                        <MdOutlineHelp className={style.settings_icon} />
                      </div>
                    </div>
                    <div className={style.option_right}>
                      <p className={style.option_right_text}>Help & support</p>
                      <BsChevronRight className={style.right_arrow} />
                    </div>
                  </div>

                  {/* DISPLAY */}
                  <div className={style.option}>
                    <div className={style.option_left}>
                      <div className={style.option_left_icon_backg}>
                        <BsFillMoonFill className={style.settings_icon} />
                      </div>
                    </div>
                    <div className={style.option_right}>
                      <p className={style.option_right_text}>
                        Display & accessibility
                      </p>
                      <BsChevronRight className={style.right_arrow} />
                    </div>
                  </div>

                  {/* FEEDBACK */}
                  <div className={style.option}>
                    <div className={style.option_left}>
                      <div className={style.option_left_icon_backg}>
                        <RiFeedbackFill className={style.settings_icon} />
                      </div>
                    </div>
                    <div className={style.option_right}>
                      <p className={style.option_right_text}>Give feedback</p>
                    </div>
                  </div>

                  {/* LOGOUT */}
                  <div
                    onClick={() => {
                      localStorage.removeItem("token");
                      window.location.href = "/login";
                    }}
                    className={style.option}>
                    <div className={style.option_left}>
                      <div className={style.option_left_icon_backg}>
                        <MdLogout className={style.settings_icon} />
                      </div>
                    </div>
                    <div className={style.option_right}>
                      <p className={style.option_right_text}>Log Out</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div
        className="offcanvas offcanvas-end w-60 p-3"
        tabIndex="-1"
        id="offcanvasRight"
        aria-labelledby="offcanvasRightLabel">
        <div className="offcanvas-header">
          <h2 className={style.canvas_head}>Codemedia</h2>
          <button
            type="button"
            className="btn-close text-reset"
            data-bs-dismiss="offcanvas"
            aria-label="Close"></button>
        </div>
        <div className="offcanvas-body">
          <div className={style.offcanvas_body_content}>
            <div className={style.offcanvas_icons}>
              <Link
                to={"/messenger"}
                onClick={() => {
                  closeFunc();
                }}>
                <div className={style.offcanvas_icons_text}>
                  <div title="Messenger" className={style.navbar_message_icon}>
                    <BsMessenger />
                  </div>
                  <p className={style.canvas_text}>Messenger</p>
                </div>
              </Link>

              <div className={style.offcanvas_icons_text}>
                <div title="Notification" className={style.navbar_message_icon}>
                  <MdNotificationsActive />
                </div>
                <p className={style.canvas_text}>Notifications</p>
              </div>

              <div className={style.offcanvas_icons_text}>
                <div
                  onClick={() => {
                    toggle();
                  }}
                  title="Account"
                  className={style.navbar_profile_photo}>
                  <img
                    className={style.navbar_profile_photo_img}
                    src="https://th.bing.com/th/id/R.4b1ebbdf9a6a42f23de2678c80eb02df?rik=SEPvooeqfgw0kA&riu=http%3a%2f%2fimages.unsplash.com%2fphoto-1535713875002-d1d0cf377fde%3fcrop%3dentropy%26cs%3dtinysrgb%26fit%3dmax%26fm%3djpg%26ixid%3dMnwxMjA3fDB8MXxzZWFyY2h8NHx8bWFsZSUyMHByb2ZpbGV8fDB8fHx8MTYyNTY2NzI4OQ%26ixlib%3drb-1.2.1%26q%3d80%26w%3d1080&ehk=Gww3MHYoEwaudln4mR6ssDjrAMbAvyoXYMsyKg5p0Ac%3d&risl=&pid=ImgRaw&r=0"
                    alt=""
                  />
                  <div className={style.navbar_profile_photo_icon}>
                    <BsChevronDown className={style.arrow} />
                  </div>
                  <div
                    className={
                      account
                        ? style.navbar_profile_logout
                        : style.navbar_profile_logout_display_none
                    }>
                    <div className={style.navbar_profile_logout_options}>
                      {/* SETTINGS */}
                      <div className={style.option}>
                        <div className={style.option_left}>
                          <div className={style.option_left_icon_backg}>
                            <IoMdSettings className={style.settings_icon} />
                          </div>
                        </div>
                        <div className={style.option_right}>
                          <p className={style.option_right_text}>
                            Settings & privacy
                          </p>
                          <BsChevronRight className={style.right_arrow} />
                        </div>
                      </div>

                      {/* HELP AND SUPPORT */}
                      <div className={style.option}>
                        <div className={style.option_left}>
                          <div className={style.option_left_icon_backg}>
                            <MdOutlineHelp className={style.settings_icon} />
                          </div>
                        </div>
                        <div className={style.option_right}>
                          <p className={style.option_right_text}>
                            Help & support
                          </p>
                          <BsChevronRight className={style.right_arrow} />
                        </div>
                      </div>

                      {/* DISPLAY */}
                      <div className={style.option}>
                        <div className={style.option_left}>
                          <div className={style.option_left_icon_backg}>
                            <BsFillMoonFill className={style.settings_icon} />
                          </div>
                        </div>
                        <div className={style.option_right}>
                          <p className={style.option_right_text}>
                            Display & accessibility
                          </p>
                          <BsChevronRight className={style.right_arrow} />
                        </div>
                      </div>

                      {/* FEEDBACK */}
                      <div className={style.option}>
                        <div className={style.option_left}>
                          <div className={style.option_left_icon_backg}>
                            <RiFeedbackFill className={style.settings_icon} />
                          </div>
                        </div>
                        <div className={style.option_right}>
                          <p className={style.option_right_text}>
                            Give feedback
                          </p>
                        </div>
                      </div>

                      {/* LOGOUT */}
                      <div className={style.option}>
                        <div className={style.option_left}>
                          <div className={style.option_left_icon_backg}>
                            <MdLogout className={style.settings_icon} />
                          </div>
                        </div>
                        <div className={style.option_right}>
                          <p className={style.option_right_text}>Log Out</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <p className={style.canvas_text}>Account</p>
              </div>
            </div>

            <div className={style.navbar_profile_logout_canvas}>
              <div className={style.navbar_profile_logout_options}>
                {/* SETTINGS */}
                <div className={style.option}>
                  <div className={style.option_left}>
                    <div className={style.option_left_icon_backg}>
                      <IoMdSettings className={style.settings_icon} />
                    </div>
                  </div>
                  <div className={style.option_right}>
                    <p className={style.option_right_text}>
                      Settings & privacy
                    </p>
                    <BsChevronRight className={style.right_arrow} />
                  </div>
                </div>

                {/* HELP AND SUPPORT */}
                <div className={style.option}>
                  <div className={style.option_left}>
                    <div className={style.option_left_icon_backg}>
                      <MdOutlineHelp className={style.settings_icon} />
                    </div>
                  </div>
                  <div className={style.option_right}>
                    <p className={style.option_right_text}>Help & support</p>
                    <BsChevronRight className={style.right_arrow} />
                  </div>
                </div>

                {/* DISPLAY */}
                <div className={style.option}>
                  <div className={style.option_left}>
                    <div className={style.option_left_icon_backg}>
                      <BsFillMoonFill className={style.settings_icon} />
                    </div>
                  </div>
                  <div className={style.option_right}>
                    <p className={style.option_right_text}>
                      Display & accessibility
                    </p>
                    <BsChevronRight className={style.right_arrow} />
                  </div>
                </div>

                {/* FEEDBACK */}
                <div className={style.option}>
                  <div className={style.option_left}>
                    <div className={style.option_left_icon_backg}>
                      <RiFeedbackFill className={style.settings_icon} />
                    </div>
                  </div>
                  <div className={style.option_right}>
                    <p className={style.option_right_text}>Give feedback</p>
                  </div>
                </div>

                {/* LOGOUT */}
                <div
                  onClick={() => {
                    localStorage.removeItem("token");
                    closeFunc();
                    window.location.href = "/login";
                  }}
                  className={style.option}>
                  <div className={style.option_left}>
                    <div className={style.option_left_icon_backg}>
                      <MdLogout className={style.settings_icon} />
                    </div>
                  </div>
                  <div className={style.option_right}>
                    <p className={style.option_right_text}>Log Out</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Navbar;

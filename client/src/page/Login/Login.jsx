import React from "react";
import style from "./login.module.css";
import { useFormik } from "formik";
import * as Yup from "yup";
import { loginUser } from "../../apicall/usersApi";
import { toast, Toaster } from "react-hot-toast";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet";
import { useDispatch, useSelector } from "react-redux";
import { Spin } from "antd";
import { hideLoad, showLoad } from "../../redux/slice/loadingSlice/loadSlice";

const Login = () => {
  const loading = useSelector((state) => state.loading.value);
  const dispatch = useDispatch();
  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: Yup.object({
      password: Yup.string()
        .min(6, "Must be 8 characters or more ")
        .required("Fill Password !"),

      email: Yup.string()
        .email("Invalid email address !")
        .required("Fill Email Address !"),
    }),
    onSubmit: async (values) => {
      dispatch(showLoad(true));
      try {
        const response = await loginUser(values);
        if (response.success) {
          dispatch(hideLoad());
          localStorage.setItem("token", JSON.stringify(response.data));

          window.location.href = "/";
          formik.resetForm();
        } else {
          dispatch(hideLoad());
          toast.error(response.message);
        }
      } catch (error) {
        dispatch(hideLoad());
        toast.error(error.message);
      }
    },
  });
  return (
    <>
      <Helmet>
        <meta charSet="utf-8" />
        <title>Login in to Codemedia</title>
        <link rel="canonical" href="http://mysite.com/example" />
      </Helmet>
      <section className={style.login_page}>
        <div className={style.loginPage_contanier}>
          <div className={style.login_two_side}>
            <div className={style.login_left_side}>
              <h1 className={style.login_page_h1}>Codemedia</h1>
              <h3 className={style.login_page_h3}>
                Codemedia helps you connect and share with the people in your
                life.
              </h3>
            </div>
            <div className={style.login_right_side}>
              <div className={style.login_right_side_form_top}>
                <form onSubmit={formik.handleSubmit}>
                  <div className={style.input_valid_div}>
                    <input
                      placeholder="Email address"
                      id="email"
                      className={style.input_password}
                      name="email"
                      type="email"
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      value={formik.values.email}
                    />
                    {formik.touched.email && formik.errors.email ? (
                      <div className={style.formik_error}>
                        {formik.errors.email}
                      </div>
                    ) : null}
                  </div>

                  <div className={style.input_valid_div}>
                    <input
                      placeholder="Password"
                      className={style.input_password}
                      id="password"
                      name="password"
                      type="password"
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      value={formik.values.password}
                    />
                    {formik.touched.password && formik.errors.password ? (
                      <div className={style.formik_error}>
                        {formik.errors.password}
                      </div>
                    ) : null}
                  </div>
                  <button
                    type="submit"
                    disabled={loading}
                    className={style.button_login}>
                    {loading ? <Spin style={{ color: "white" }} /> : "Log in"}
                  </button>
                </form>

                <a href="#" className={style.forget_link}>
                  Forgotten password?
                </a>
                <hr />

                <Link to={"/register"}>
                  <button className={style.new_account_button}>
                    Create new account
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
      <Toaster position="top-center" reverseOrder={false} />
    </>
  );
};

export default Login;

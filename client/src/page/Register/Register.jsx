import React from "react";
import style from "./register.module.css";
import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { toast, Toaster } from "react-hot-toast";
import { Link, Navigate } from "react-router-dom";
import { Helmet } from "react-helmet";

const Register = () => {
  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
      username: "",
      confirmPassword: "",
    },
    validationSchema: Yup.object({
      password: Yup.string()
        .min(8, "Must be 8 characters or more !")
        .required("Fill Password !"),
      email: Yup.string()
        .email("Invalid email address !")
        .required("Fill Email Address !"),
      username: Yup.string()
        .min(6, "Username must be greater than 6 !")
        .max(50, "Username must be less than 50 !")
        .required("Fill Username !"),
      confirmPassword: Yup.string()
        .oneOf([Yup.ref("password"), null], "Passwords must be match !")
        .required("Confirm your password !"),
    }),
    onSubmit: async (values) => {
      try {
        axios
          .post("http://localhost:8080/api/auth/register", values)
          .then(() => {
            toast.success("Account created !");
          })
          .catch(() => {
            toast.error("Account already exist !");
          });
      } catch (err) {
        toast.error(err);
      }
      formik.resetForm();
    },
  });
  return (
    <>
      <Helmet>
        <meta charSet="utf-8" />
        <title>Sign up for Codemedia | Codemedia</title>
        <link rel="canonical" href="http://mysite.com/example" />
      </Helmet>
      <section className={style.login_page}>
        <div className={style.loginPage_contanier}>
          <div className={style.login_two_side}>
            <div className={style.login_left_side}>
              <h1 className={style.register_page_h1}>Codemedia</h1>
              <h3 className={style.register_page_h3}>
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
                      placeholder="Username"
                      className={style.input_password}
                      id="username"
                      name="username"
                      type="text"
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      value={formik.values.username}
                    />
                    {formik.touched.username && formik.errors.username ? (
                      <div className={style.formik_error}>
                        {formik.errors.username}
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

                  <div className={style.input_valid_div}>
                    <input
                      placeholder="Confirm password"
                      className={style.input_password}
                      id="confirmPassword"
                      name="confirmPassword"
                      type="password"
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      value={formik.values.confirmPassword}
                    />
                    {formik.touched.confirmPassword &&
                    formik.errors.confirmPassword ? (
                      <div className={style.formik_error}>
                        {formik.errors.confirmPassword}
                      </div>
                    ) : null}
                  </div>
                  <button
                    type="submit"
                    className={`${style.button_login} ${style.register_create_btn}`}>
                    Create account
                  </button>
                </form>

                <hr />
                <Link to={"/"}>
                  <button
                    className={`${style.new_account_button} ${style.register_btn_forrLog} `}>
                    Log in
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

export default Register;

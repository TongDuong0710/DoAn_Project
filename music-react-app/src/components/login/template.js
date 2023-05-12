import React, { useState } from "react";
import Tilt from "react-tilt";
import "./login.css";
import "./alert.css";
import { useForm } from "react-hook-form";
import axios from "axios";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
const Template = () => {
  const [errorFlag, setErrorFlag] = useState("hidden");
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const onSubmit = (data) => {
    const headers = {
      "Access-Control-Allow-Origin": "*",
      "content-type" : "application/json",
      "Access-Control-Allow-Headers":"*",
      'Access-Control-Allow-Credentials': 'true',
      "Access-Control-Allow-Methods": "GET,HEAD,OPTIONS,POST,PUT"
    };
    const account = data.userName;
    axios.post(
        "http://localhost:8082/login",
        JSON.stringify({
          username: data.userName,
          password: data.password,
        },{headers})
      )
      .then(function (response) {
        console.log("response: ", response);
        console.log(response.headers.authorization);
        navigate("/", { state: { username: account} });
        alert("Login successfully");
      })
      .catch(function (error) {
        console.log(error);
        setErrorFlag('visible');
      });
  
  };
  return (
    <div class="limiter">
      <div class="container-login100">
        <div class="wrap-login100">
          <Tilt className="Tilt" options={{ scale: 1.5 }}>
            <div class="login100-pic js-tilt" data-tilt>
              <img src={require("../vendor/img/zingmp3.png")} />
            </div>
          </Tilt>
          <form
            class="login100-form validate-form"
            onSubmit={handleSubmit(onSubmit)}
          >
            <span class="login100-form-title">Member Login</span>

            <div
              className={
                errors.userName?.message
                  ? "wrap-input100 validate-input alert-validate"
                  : "wrap-input100 validate-input"
              }
              data-validate={errors.userName?.message}
            >
              <input
                class="input100"
                type="text"
                name="userName"
                placeholder="UserName"
                {...register("userName", {
                  required: "User Name is required",
                })}
              />
              <span class="focus-input100"></span>
              <span class="symbol-input100">
                <i class="fa fa-envelope" aria-hidden="true"></i>
              </span>
            </div>

            <div
              className={
                errors.password?.message
                  ? "wrap-input100 validate-input alert-validate"
                  : "wrap-input100 validate-input"
              }
              data-validate={errors.password?.message}
            >
              <input
                class="input100"
                type="password"
                name="pass"
                placeholder="Password"
                {...register("password", {
                  required: "Password is required",
                  minLength: {
                    value: 6,
                    message:
                      "Password must be greater than or equal 6 characters",
                  },
                })}
              />
              <span class="focus-input100"></span>
              <span class="symbol-input100">
                <i class="fa fa-lock" aria-hidden="true"></i>
              </span>
            </div>
            <div class="text-center p-t-12" style={{visibility: errorFlag }}>
              <span class="txt2" style={{color: 'red'}}>Login Fail, Please recheck</span>
            </div>
            <div class="container-login100-form-btn">
              <button type="submit" className="login100-form-btn">
                Login
              </button>
            </div>
            <div class="text-center p-t-12">
              <span class="txt1">Forgot </span>
              <a class="txt2" href="#">
                Username / Password?
              </a>
            </div>

            <div class="text-center p-t-136">
              <Link  to={'/register'} class="txt2" >
                Create your Account
                <i class="fa fa-long-arrow-right m-l-5" aria-hidden="true"></i>
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
export default Template;

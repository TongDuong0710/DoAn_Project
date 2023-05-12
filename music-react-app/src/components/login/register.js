import React, { useState } from "react";
import Tilt from "react-tilt";
import "./login.css";
import { useForm } from "react-hook-form";
import axios from "axios";
import { Link } from "react-router-dom";
import Alert from 'react-popup-alert';

const Register = () => {
  const [alert, setAlert] = React.useState({
    type: 'error',
    text: 'This is a alert message',
    show: false
  })

  const onCloseAlert = () => {
    setAlert({
      type: '',
      text: '',
      show: false
    })
  }

  const onShowAlert = (type, message) => {
    setAlert({
      type: type,
      text: message,
      show: true
    })
  }



  const [errorFlag, setErrorFlag] = useState("hidden");
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const onSubmit = (data) => {
    let dataSent = JSON.stringify({
      "username": data.userName,
      "password": data.password,
      "name": data.name,
      "role": 'user'
    });
    let config = {
      method: 'post',
      url: 'http://localhost:8082/register',
      headers: { 
        'Content-Type': 'application/json'
      },
      data : dataSent
    };
    
    axios(config)
    .then(function (response) {
      console.log(JSON.stringify(response.data));
      onShowAlert('success', "Register Successfully !") 
    })
    .catch(function (error) {
      console.log(error);
      onShowAlert('error', "Register Fail !")
    });
  };
  return (
    <div>
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
            <span class="login100-form-title">Member Register</span>

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
            <div
              className={
                errors.name?.message
                  ? "wrap-input100 validate-input alert-validate"
                  : "wrap-input100 validate-input"
              }
              data-validate={errors.password?.message}
            >
              <input
                class="input100"
                type="text"
                name="name"
                placeholder="Name"
                {...register("name", {
                  required: "Name is required",
                })}
              />
              <span class="focus-input100"></span>
              <span class="symbol-input100">
                <i class="fa fa-lock" aria-hidden="true"></i>
              </span>
            </div>
            <div class="text-center p-t-12" style={{ visibility: errorFlag }}>
              <span class="txt2" style={{ color: "red" }}>
                Register Fail, Please recheck
              </span>
            </div>
            <div class="container-login100-form-btn">
              <button type="submit" className="login100-form-btn">
                Register
              </button>
            </div>
            <div class="text-center p-t-136">
              <Link to={"/login"} class="txt2">
                Already have an account?
                <i class="fa fa-long-arrow-right m-l-5" aria-hidden="true"></i>
              </Link>
            </div>
          </form>
        </div>
      </div>
      
    </div>
    <Alert
        header={'Header'}
        btnText={'Close'}
        text={alert.text}
        type={alert.type}
        show={alert.show}
        onClosePress={onCloseAlert}
        pressCloseOnOutsideClick={true}
        showBorderBottom={true}
        alertStyles={{}}
        headerStyles={{}}
        textStyles={{}}
        buttonStyles={{}}
      />
      </div>
  );
};
export default Register;

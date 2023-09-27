import React, { useState } from "react";
import "./login.css";
import axios from "axios";
import { Button, notification } from "antd";
import { resourceForm } from "../../../resources/resourceVN.js";
import { NavLink, useNavigate } from "react-router-dom";
import { signInWithPopup } from "firebase/auth";
import { auth, provider } from "../../../firebase/configFirebase";
import instance from "../../../api/axios";

export default function LogIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    //lấy name và value từ input
    const { value, name } = e.target;

    //khi onChange gọi đến hàm validate
    validateData(name, value);

    //kiểm tra name và gán
    if (name === "email") {
      setEmail(value);
    } else if (name === "password") {
      setPassword(value);
    } else {
      return;
    }
  };

  //hàm validate
  const validateData = (nameInput, valueInput) => {
    switch (nameInput) {
      case "email":
        if (!valueInput) {
          setEmailError(true);
        } else {
          setEmailError(false);
        }
        break;
      case "password":
        if (!valueInput) {
          setPasswordError(true);
        } else {
          setPasswordError(false);
        }
        break;
      default:
        break;
    }
  };

  //lấy giá trị từ input
  const handleSubmit = (e) => {
    e.preventDefault();
    const { value, name } = e.target;
    validateData("password", password);
    validateData("email", email);
    if (email && password) {
      const newUser = {
        email: email,
        password: password,
      };
      //gọi API đăng nhập
      axios
        .post("http://localhost:8000/login", newUser)
        .then(async (response) => {
          if (response.status === 200) {
            console.log(response.data.user.active);
            if (!response.data.user.active) {
              notification.error({
                message: "Tài Khoản Đã Bị Chặn",
              });
              return;
            }
            // lưu lên local
            localStorage.setItem(
              "userLogin",
              JSON.stringify(response.data.user)
            );

            const resCarts = await instance.get("carts");
            const carts = resCarts.data;
            const cartUserFind = carts.find(
              (cart) => cart.userId == response.data.user.id
            );
            if (cartUserFind) {
              localStorage.setItem("cartUser", JSON.stringify(cartUserFind));
            } else {
              const res = await instance.post(`carts`, {
                userId: response.data.user.id,
                cart: [],
              });
              localStorage.setItem("cartUser", JSON.stringify(res.data));
            }

            // chuyển trang
            if (response.data.user.role === 0) {
              navigate("/admin");
            } else {
              navigate("/");
            }
          }
        });
    }
  };
  //đăng nhập với google
  const signInWithGoogle = () => {
    signInWithPopup(auth, provider)
      .then((response) => {
        console.log(response);
        const useLocation = {
          email: response.user.email,
          user_name: response.user.displayName,
          image: response.user.photoURL,
          userId: response.user.uid,
        };
        //lưu thông tin lên local
        localStorage.setItem("userLogin", JSON.stringify(useLocation));
        //chuyển hướng trang home
        navigate("/");
      })
      .catch((error) => {
        console.log(error);
      });
  };
  return (
    <>
      <div className="container-login">
        <form className="form-login" onSubmit={handleSubmit}>
          <div className="d-flex justify-content-between align-items-center mb-5">
            <h2 className="text-2xl">{resourceForm.headingLogin}</h2>
            <NavLink to={"/"} className="btn btn-close">
              {" "}
            </NavLink>
          </div>
          <div className="form-group mb-3">
            <label className="form-label" htmlFor="email">
              Email
            </label>
            <input
              placeholder="Nhập Email"
              className={`form-control ${emailError && "border-danger"}`}
              id="email"
              type="text"
              value={email}
              name="email"
              onChange={handleInputChange}
              onBlur={handleInputChange}
            ></input>
            {emailError && (
              <div className="text-err mb-1 text-danger">
                Email không được để trống
              </div>
            )}
          </div>
          <div className="form-group mb-3">
            <label className="form-label" htmlFor="password">
              Password
            </label>
            <input
              placeholder="Nhập Email"
              className={`form-control ${passwordError && "border-danger"}`}
              id="password"
              type="password"
              value={password}
              name="password"
              onChange={handleInputChange}
              onBlur={handleInputChange}
            ></input>
            {passwordError && (
              <div className="text-err mb-1 text-danger">
                Password không được để trống
              </div>
            )}
          </div>

          <div>
            <button style={{ width: "100%" }} className="btn btn-primary mt-4">
              {resourceForm.headingLogin}
            </button>
          </div>
          <div className="flex text-center justify-between gap-2 pt-3">
            <NavLink to="/">{resourceForm.confirmBack}</NavLink>
            <NavLink to="/forget-password">
              {resourceForm.forgetPassword}
            </NavLink>
          </div>
          <div className="text-center my-3">
            <span>{resourceForm.or}</span>
          </div>
          <div>
            <Button
              onClick={signInWithGoogle}
              className="w-full flex items-center justify-center gap-2"
            >
              <img
                width={20}
                height={20}
                src="https://banner2.cleanpng.com/20181108/bow/kisspng-google-logo-google-search-search-engine-optimizati-5be4b4e62f2cf8.5260885315417151741932.jpg"
              />
              {resourceForm.confirmGoolge}
            </Button>
          </div>
          <div>
            <p className="pt-3 text-center">
              {resourceForm.confirmAccount}
              <NavLink
                to={"/register"}
                className="cursor-pointer text-blue-600"
              >
                {" "}
                {resourceForm.headingRegister}
              </NavLink>
            </p>
          </div>
        </form>
      </div>
    </>
  );
}

import React, { useEffect, useState, useRef } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { KeyOutlined, PoweroffOutlined, UserOutlined } from "@ant-design/icons";
import { Button, Dropdown, Image, Modal } from "antd";
import axios from "axios";
import instance from "../../../../api/axios";
import { formatMoney } from "../../../../utils/formatData";
import { animateScroll as scroll } from "react-scroll";

export default function Search({ loadCountCart }) {
  const navigate = useNavigate();
  const [cartUser, setCartUser] = useState([]);
  const userLogin = JSON.parse(localStorage.getItem("userLogin"));

  // fixed Header
  window.addEventListener("scroll", function () {
    const search = document.querySelector(".search");
    search.classList.toggle("active", window.scrollY > 100);
  });

  window.addEventListener("scroll", function () {
    const search = document.querySelector(".result-list");
    search.classList.toggle("active", window.scrollY > 100);
  });

  useEffect(() => {
    axios.get("http://localhost:8000/carts").then((response) => {
      response.data.map((cat) => {
        if (cat.userId === userLogin.id) {
          setCartUser(cat.cartDetails);
          return;
        }
      });
    });
  }, [loadCountCart]);

  const handleLogout = () => {
    localStorage.removeItem("userLogin");
    navigate("/");
  };

  const handleConfirmLogout = () => {
    Modal.confirm({
      title: "Xác nhận",
      content: "Bạn có chắc chắn muốn đăng xuất",
      onOk() {
        handleLogout();
        scrollToTop();
      },
      cancelText: "Hủy bỏ",
      okText: "Đăng xuất",
    });
  };

  const [searchText, setSearchText] = useState("");
  const [result, setResult] = useState([]);

  const loadDataSearch = async () => {
    try {
      const response = await instance.get(
        `products?product_name_like=${searchText}`
      );
      if (searchText) {
        setResult(response.data);
      } else {
        setResult([]);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleNavigate = (id) => {
    navigate(`description/${id}`);
    setResult([]);
  };

  const resultRef = useRef(null);

  const handleDocumentClick = (e) => {
    if (resultRef.current && !resultRef.current.contains(e.target)) {
      setResult([]);
    }
  };

  useEffect(() => {
    document.addEventListener("click", handleDocumentClick);
    return () => {
      document.removeEventListener("click", handleDocumentClick);
    };
  }, []);

  const handleChange = (value) => {
    setSearchText(value);
    loadDataSearch(value);
  };
  //lên đầu trang
  const scrollToTop = () => {
    scroll.scrollToTop({
      smooth: true,
    });
  };
  return (
    <>
      <div className="search ">
        <div className="container c_flex">
          <div className="logo width">
            <NavLink to="/">
              <img
              style={{marginLeft:"40px"}}
                onClick={scrollToTop}
                className="scale-150"
                src="https://firebasestorage.googleapis.com/v0/b/fir-login-with-e3ed6.appspot.com/o/logo%2FGroup%209.png?alt=media&token=b0bd3fee-63f7-49ac-8007-835ee1c9f661"
                alt=""
              />
            </NavLink>
          </div>

          <div className="search-box flex justify-between items-center px-4 ">
            <i className="fa fa-search text-xl text-gray-400"></i>
            <input
              placeholder="Nhập vào tìm kiếm"
              className="input_search"
              type="text"
              value={searchText}
              onChange={(e) => handleChange(e.target.value)}
            />
            <div className="result-list " ref={resultRef}>
              {result.map((product, index) => (
                <div
                  key={index}
                  className="a-product-search d-flex justify-start items-center gap-3 border-bottom"
                  onClick={() => handleNavigate(product.id)}
                >
                  <div onClick={() => handleNavigate(product.id)}>
                    <img
                      src={product.product_image}
                      width={100}
                      style={{ borderRadius: 20 }}
                    />
                  </div>
                  <div onClick={() => handleNavigate(product.id)}>
                    <p>{product.product_name}</p>
                    <p>{formatMoney(product.price)}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="icon f_flex width">
            {userLogin !== null ? (
              <Dropdown
                menu={{
                  items: [
                    {
                      key: "1",
                      label: (
                        <NavLink to="profile" onClick={scrollToTop}>
                          <UserOutlined className="pr-2 " />
                          Thông tin cá nhân
                        </NavLink>
                      ),
                    },
                    {
                      key: "2",
                      label: (
                        <NavLink to="my_order" onClick={scrollToTop}>
                          <KeyOutlined className="pr-2" />
                          Lịch sử mua hàng
                        </NavLink>
                      ),
                    },
                    {
                      key: "3",
                      label: (
                        <a
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={handleConfirmLogout}
                        >
                          <PoweroffOutlined className="pr-2" /> Đăng xuất
                        </a>
                      ),
                    },
                  ],
                }}
                placement="bottomRight"
                arrow
              >
                <Button className="border-none shadow-none text-white">
                  <div className="flex items-center gap-2 px-3">
                    <img
                      src={userLogin.image}
                      alt=""
                      height={27}
                      width={27}
                      className="rounded-full"
                    />
                    <span className="text-black text-xl">
                      {userLogin.user_name}
                    </span>
                  </div>
                </Button>
              </Dropdown>
            ) : (
              <div>
                <NavLink to="/login">
                  <i className="fa fa-user icon-circle"></i>
                </NavLink>
              </div>
            )}

            <div className="cart">
              <NavLink to="/cart">
                <i className="fa fa-shopping-bag icon-circle"></i>
                {/* <span>{cartUser.length}</span> */}
              </NavLink>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

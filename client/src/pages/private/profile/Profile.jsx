import React, { useEffect, useState } from "react";
import "./profile.css";
import { Input } from "antd";
import instance from "../../../api/axios";
import { formatDate } from "../../../utils/formatData";

export default function Profile() {
  const [profileUser, setProfileUser] = useState([]);

  const userLogin = JSON.parse(localStorage.getItem("userLogin"));
  
  // Gọi API lấy thông tin tất cả userLogin
  const loadDataUserLogin = async (id) => {
    const response = await instance.get(`users/${userLogin.id}`);
   
    
    // Gán giá trị dữ liệu lấy được vào state profileUser
    setProfileUser(response.data);
  };

  useEffect(() => {
    loadDataUserLogin();
  }, []);

  return (
    <>
      <div className=" mt-5 mb-5 flex  justify-center ">
        <div className="flex gap-36 items-start">
          <div className="col-md-3 border-right">
            <div className="d-flex flex-column align-items-center text-center p-3 py-5">
              <img
                width="300px"
                style={{borderRadius: "50%", margin:"20px"}}
                src={profileUser.image}
              />
              <span className="text-black-50">Tài Khoản</span>
              <span className="font-weight-bold">USER</span>
              <span> </span>
            </div>
          </div>

          <div>
            <div className="w-96 " style={{ lineHeight: "20px" }}>
              <div className="text-3xl mb-4">
                <h4 className="">Thông Tin Cá Nhân</h4>
              </div>
              <div>
                <div className="mb-3">
                  <label>Tên người dùng:</label>
                  <Input
                    type="text"
                    className="form-control border-none"
                    placeholder="enter your name"
                    value={profileUser.user_name} // Gán giá trị tương ứng
                  />
                </div>
                <div className="mb-3">
                  <label>Địa Chỉ:</label>
                  <Input
                    type="text"
                    className="form-control border-none"
                    placeholder="enter address"
                    value={profileUser.address} // Gán giá trị tương ứng
                  />
                </div>
                <div className="mb-3">
                  <label>Ngày Sinh:</label>
                  <Input
                    type="text"
                    className="form-control border-none"
                    placeholder="enter dateOfBirth"
                    value={formatDate(profileUser.dateOfBirth)} // Gán giá trị tương ứng
                  />
                </div>
                <div className="mb-3">
                  <label>Giới Tính:</label>
                  <Input
                    type="text"
                    className="form-control border-none"
                    placeholder="enter gender"
                    value={profileUser.gender==0?"Nam":profileUser.gender==1?"Nữ":"Khác"} // Gán giá trị tương ứng
                  />
                </div>
                <div className="mb-3">
                  <label>Email:</label>
                  <Input
                    type="text"
                    className="form-control border-none"
                    placeholder="enter email"
                    value={profileUser.email} // Gán giá trị tương ứng
                  />
                </div>
                <div className="mb-3">
                  <label>Phone Number:</label>
                  <Input
                    type="text"
                    className="form-control border-none"
                    placeholder="Cập nhật thêm số điện thoại"
                    value={profileUser.phoneNumber} // Gán giá trị tương ứng
                  />
                </div>
                
               
              </div>
            
              <div className="mt-5 ">
                <button className="btn btn-primary profile-button" type="button">
                  Save Profile
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
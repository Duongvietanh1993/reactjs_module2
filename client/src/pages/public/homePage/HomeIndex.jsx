import React from "react";
import Slide from "./../../../components/user/slide/Slide";
import FlashDeals from "./../../../components/user/flashDeals/FlashDeals";
import TopCategorie from "./../../../components/user/topCategories/TopCategorie";
import NewArrival from "./../../../components/user/newArrivals/NewArrival";
import Discount from "./../../../components/user/discounts/Discount";
import ShopCard from "./../../../components/user/shop/ShopCard";
import Wrapper from "./../../../components/user/wrapper/Wrapper";
import { Navigate, Outlet } from "react-router-dom";

export default function HomeIndex({ setLoadHeader }) {
  const isLogin = JSON.parse(localStorage.getItem("userLogin"));

  return (
    <>
      {isLogin || isLogin === 1 ? <Outlet /> : <Navigate to={"/login"} />}
      <Slide />
      <FlashDeals setLoadHeader={setLoadHeader} />
      <TopCategorie />
      <NewArrival />
      <Discount />
      <ShopCard />
      <Wrapper />
    </>
  );
}

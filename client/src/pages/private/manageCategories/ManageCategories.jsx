import React, { useEffect, useState } from "react";
import { Button, Modal, Space, Table, Form, Input, Image, message } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import {
  addCategory,
  deleteCategory,
  getCategory,
  updateCategory,
} from "../../../redux/categorySlice/categorySlice";
import { storage } from "../../../firebase/configFirebase";
import "./category.css";

export default function ManageCategories() {
  // Các biến state
  const [editedImage, setEditedImage] = useState("");
  const dispatch = useDispatch();
  const categories = useSelector((state) => state.category.data);
  const isLoadingChange = useSelector(
    (state) => state.category.isLoadingChange
  );
  const [isModalOpenDelete, setIsModalOpenDelete] = useState(false);
  const [idDelete, setIdDelete] = useState();
  const [formRef] = Form.useForm();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [categoryUpdate, setCatagoryUpdate] = useState({});
  const [imageUpload, setImageUpload] = useState(null);
  const [linkImage, setLinkImage] = useState("");
  const [searchText, setSearchText] = useState("");

  // Hàm xử lý hiển thị modal xác nhận xóa
  const handleShowModalDelete = (id) => {
    setIdDelete(id);
    setIsModalOpenDelete(true);
  };

  // Hàm xử lý xác nhận xóa danh mục
  const handleOkDelete = () => {
    dispatch(deleteCategory(idDelete));
    setIdDelete();
    setIsModalOpenDelete(false);
  };

  // Hàm xử lý hủy bỏ xóa danh mục
  const handleCancelDelete = () => {
    setIdDelete();
    setIsModalOpenDelete(false);
  };

  // Hàm xử lý chọn ảnh cho danh mục
  const handleChoosePhoto = (e) => {
    if (!e.target.files) {
      return;
    }

    const newImage = e.target.files[0];
    setImageUpload(newImage);
    setLinkImage(URL.createObjectURL(newImage));

    if (categoryUpdate && categoryUpdate.id && newImage) {
      setEditedImage(URL.createObjectURL(newImage));
    }
  };

  // Hàm xử lý hiển thị modal thêm/sửa danh mục
  const handleShowModal = (cate) => {
    setCatagoryUpdate(cate);
    if (cate && cate.category_image) {
      setLinkImage(cate.category_image);
      setEditedImage(cate.category_image);
    }
    formRef.setFieldsValue(cate);
    setIsModalOpen(true);
  };

  // Hàm xử lý lưu danh mục
  const handleOk = () => {
    setCatagoryUpdate();
    setIsModalOpen(false);
  };

  // Hàm xử lý hủy bỏ việc thêm/sửa danh mục
  const handleCancel = () => {
    formRef.resetFields();
    setCatagoryUpdate();
    setImageUpload();
    setLinkImage();
    setIsModalOpen(false);
  };

  // Hàm xử lý khi submit form
  const onFinish = async (values) => {
    if (linkImage === "") {
      message.info("Vui lòng chọn ảnh!");
      return;
    }

    if (categoryUpdate && categoryUpdate.id) {
      if (editedImage === categoryUpdate.category_image) {
        dispatch(
          updateCategory({
            ...values,
            category_image: categoryUpdate.category_image,
            id: categoryUpdate.id,
          })
        );
      } else {
        const imageRef = ref(storage, `categories/${imageUpload.name}`);
        await uploadBytes(imageRef, imageUpload);

        const downloadURL = await getDownloadURL(imageRef);

        dispatch(
          updateCategory({
            ...values,
            category_image: downloadURL,
            id: categoryUpdate.id,
          })
        );
      }
    } else {
      if (imageUpload) {
        const imageRef = ref(storage, `categories/${imageUpload.name}`);
        await uploadBytes(imageRef, imageUpload);

        const downloadURL = await getDownloadURL(imageRef);

        dispatch(
          addCategory({
            ...values,
            category_image: downloadURL,
          })
        );
      } else {
        dispatch(
          addCategory({
            ...values,
          })
        );
      }
    }

    formRef.resetFields();
    handleCancel();
  };
  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  useEffect(() => {
    dispatch(getCategory(searchText));
  }, [isLoadingChange]);

  useEffect(() => {
    dispatch(getCategory(searchText));
  }, [searchText]);

  const columns = [
    {
      title: "STT",
      dataIndex: "id",
      key: "id",
      sorter: (a, b) => a.id - b.id,
    },
    {
      title: "Tên Gọi Danh Mục Sản Phẩm",
      dataIndex: "category_name",
      key: "name",
    },
    {
      title: "Hình Minh Họa Danh Mục",
      dataIndex: "category_image",
      key: "image",
      render: (link) => <Image width={70} src={link} alt="image" />,
    },

    {
      title: "Thao Tác",
      key: "action",
      render: (cat) => (
        <Space size="middle" key={cat.id}>
          <Button
            style={{ background: "rgb(255, 192, 110)", color: "white" }}
            onClick={() => handleShowModal(cat)}
          >
            Edit
          </Button>
          <Button
            style={{ background: "rgb(255, 60, 60)", color: "white" }}
            onClick={() => handleShowModalDelete(cat.id)}
          >
            Delete
          </Button>
        </Space>
      ),
    },
  ];
  return (
    <>
      {/* Modal xác nhận xóa danh mục */}
      <Modal
        title="Delete Category"
        open={isModalOpenDelete}
        onOk={handleOkDelete}
        onCancel={handleCancelDelete}
        okText="Xác nhận"
        cancelText="Quay lại"
      >
        <p>Bạn muốn xóa danh mục này?</p>
      </Modal>

      {/* Modal thêm/sửa danh mục */}
      <Modal
        title={categoryUpdate ? "Cập Nhật" : "Thêm Mới"}
        maskClosable={false}
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        footer={<></>}
      >
        {/* Bảng input dữ liệu */}
        <Form
          name="basic"
          form={formRef}
          labelCol={{
            span: 8,
          }}
          wrapperCol={{
            span: 16,
          }}
          style={{
            maxWidth: 600,
          }}
          initialValues={{
            remember: true,
          }}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          autoComplete="off"
        >
          <Form.Item
            label="Tên Danh Mục"
            name="category_name"
            rules={[
              {
                required: true,
                message: "Hãy nhập tên danh mục!",
              },
            ]}
          >
            <Input placeholder="Nhập tên danh mục" />
          </Form.Item>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              margin: "10px 0 20px 0",
            }}
          >
            <div style={{ margin: "10px 0" }}>
              <label
                htmlFor="image_file"
                style={{
                  padding: "5px 10px",
                  borderRadius: 5,
                  backgroundColor: "rgb(69, 128, 255)",
                  color: "white",
                }}
              >
                Thêm Ảnh
              </label>
              <input
                id="image_file"
                style={{ display: "none" }}
                type="file"
                accept=".jpg, .jpeg, .png, .gif"
                onChange={(e) => handleChoosePhoto(e)}
              />
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                flexGrow: 1,
              }}
            >
              <Image width={200} src={linkImage} />
            </div>
          </div>

          <Form.Item
            wrapperCol={{
              offset: 8,
              span: 16,
            }}
          >
            <Button style={{ width: "100%" }} type="primary" htmlType="submit">
              Thêm Mới
            </Button>
          </Form.Item>
        </Form>
      </Modal>

      {/* Nút thêm mới */}
      <div className="flex justify-between">
        <Button
          style={{ background: "rgb(69, 128, 255)", color: "white" }}
          onClick={() => handleShowModal()}
        >
          Thêm Mới
        </Button>
        <Input
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          placeholder="Mời nhập tên tìm kiếm"
          className="w-96"
        ></Input>
      </div>

      <div className="table">
        {/* Bảng danh mục */}
        <Table
          columns={columns}
          dataSource={categories}
          pagination={{ pageSize: 6 }}
          rowKey={(record) => record.id}
        />
      </div>
    </>
  );
}

import React, { useEffect, useState } from "react";
import {
  Button,
  Modal,
  Space,
  Table,
  Form,
  Input,
  Image,
  message,
  Select,
} from "antd";
import { useDispatch, useSelector } from "react-redux";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { storage } from "../../../firebase/configFirebase";
import "./product.css";
import {
  addProduct,
  deleteProduct,
  getProduct,
  updateProduct,
} from "../../../redux/productSlice/productSlice";
import axios from "axios";
import { formatMoney } from "./../../../utils/formatData";
import TextArea from "antd/es/input/TextArea";

export default function ManagerProduct() {
  const [editedImage, setEditedImage] = useState("");
  const dispatch = useDispatch();
  const products = useSelector((state) => state.product.data);
  const isLoadingChange = useSelector((state) => state.product.isLoadingChange);
  const [isModalOpenDelete, setIsModalOpenDelete] = useState(false);
  const [idDelete, setIdDelete] = useState();
  const [category, setCategory] = useState([]);
  const { Option } = Select;
  const [searchText, setSearchText] = useState("");
  const [formRef] = Form.useForm();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [productUpdate, setProductUpdate] = useState({});
  const [imageUpload, setImageUpload] = useState(null);
  const [linkImage, setLinkImage] = useState("");

  // gọi API lấy thông tin tất cả danh mục
  const loadDataCategory = () => {
    axios
      .get("http://localhost:8000/categories")
      .then((response) => {
        setCategory(response.data);
      })
      .catch((error) => console.log(error));
  };

  useEffect(() => {
    loadDataCategory();
  }, []);

  // Hàm xử lý hiển thị modal xác nhận xóa
  const handleShowModalDelete = (id) => {
    setIdDelete(id);
    setIsModalOpenDelete(true);
  };

  // Hàm xử lý xác nhận xóa danh mục
  const handleOkDelete = () => {
    dispatch(deleteProduct(idDelete));
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

    if (productUpdate && productUpdate.id && newImage) {
      setEditedImage(URL.createObjectURL(newImage));
    }
  };

  // Hàm xử lý hiển thị modal thêm/sửa danh mục
  const handleShowModal = (product) => {
    setProductUpdate(product);
    if (product && product.product_image) {
      setLinkImage(product.product_image);
      setEditedImage(product.product_image);
    }
    formRef.setFieldsValue(product);
    setIsModalOpen(true);
  };

  // Hàm xử lý lưu danh mục
  const handleOk = () => {
    setProductUpdate();
    setIsModalOpen(false);
  };

  // Hàm xử lý hủy bỏ việc thêm/sửa danh mục
  const handleCancel = () => {
    formRef.resetFields();
    setProductUpdate();
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

    if (productUpdate && productUpdate.id) {
      if (editedImage === productUpdate.product_image) {
        dispatch(
          updateProduct({
            ...values,
            product_image: productUpdate.product_image,
            id: productUpdate.id,
          })
        );
      } else {
        const imageRef = ref(storage, `products/${imageUpload.name}`);
        await uploadBytes(imageRef, imageUpload);

        const downloadURL = await getDownloadURL(imageRef);

        dispatch(
          updateProduct({
            ...values,
            product_image: downloadURL,
            id: productUpdate.id,
          })
        );
      }
    } else {
      if (imageUpload) {
        const imageRef = ref(storage, `products/${imageUpload.name}`);
        await uploadBytes(imageRef, imageUpload);

        const downloadURL = await getDownloadURL(imageRef);

        dispatch(
          addProduct({
            ...values,
            product_image: downloadURL,
          })
        );
      } else {
        dispatch(
          addProduct({
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
    dispatch(getProduct(searchText));
  }, [isLoadingChange]);

  useEffect(() => {
    dispatch(getProduct(searchText));
  }, [searchText]);

  const columns = [
    {
      title: "STT",
      dataIndex: "id",
      key: "id",
      sorter: (a, b) => a.id - b.id,
    },
    {
      title: "Tên Sản Phẩm",
      dataIndex: "product_name",
      key: "product_name",
    },
    {
      title: "Minh Họa",
      dataIndex: "product_image",
      key: "image",
      render: (link) => <Image width={80} src={link} alt="image" />,
    },
    {
      title: "Giá Bán",
      dataIndex: "price",
      key: "price",
      render: (_, pro) => <div>{formatMoney(+pro.price)}</div>,
      sorter: (a, b) => a.price - b.price,
      sortDirections: ["descend", "ascend"],
    },
    {
      title: "Mô Tả",
      dataIndex: "description",
      key: "description",
      render: (_, des) => <span>{des.description.substring(0, 20)}... </span>,
    },
    {
      title: "Xuất Xứ",
      dataIndex: "from",
      key: "from",
    },
    {
      title: "Danh Mục",
      dataIndex: "category_id",
      key: "category_id",
      render: (_, cat) => (
        <span>
          {cat.category_id == 1
            ? "Iphone"
            : cat.category_id == 2
            ? "Ipad"
            : cat.category_id == 3
            ? "Apple Watch"
            : cat.category_id == 4
            ? "Apple Airpods"
            : cat.category_id == 5
            ? "MacBook"
            : "Khác"}
        </span>
      ),
    },
    {
      title: "Số Lượng",
      dataIndex: "quantity",
      key: "quantity",
    },
    {
      title: "Thao Tác",
      key: "action",
      render: (product) => (
        <Space size="middle" key={product.id}>
          <Button
            style={{ background: "rgb(255, 192, 110)", color: "white" }}
            onClick={() => handleShowModal(product)}
          >
            Edit
          </Button>
          <Button
            style={{ background: "rgb(255, 60, 60)", color: "white" }}
            onClick={() => handleShowModalDelete(product.id)}
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
        title="Delete Product"
        open={isModalOpenDelete}
        onOk={handleOkDelete}
        onCancel={handleCancelDelete}
        okText="Xác nhận"
        cancelText="Quay lại"
      >
        <p>Bạn muốn xóa xản phẩm này?</p>
      </Modal>

      {/* Modal thêm/sửa danh mục */}
      <Modal
        title={productUpdate ? "Cập Nhật" : "Thêm Mới"}
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
            label="Tên Sản Phẩm"
            name="product_name"
            rules={[
              {
                required: true,
                message: "Hãy nhập vào tên sản phẩm",
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Giá Bán"
            name="price"
            rules={[
              {
                required: true,
                message: "Hãy nhập vào giá bán",
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Mô Tả"
            name="description"
            rules={[
              {
                required: true,
                message: "Hãy nhập vào mô tả",
              },
            ]}
          >
            <TextArea />
          </Form.Item>
          <Form.Item
            label="Xuất Xứ"
            name="from"
            rules={[
              {
                required: true,
                message: "Hãy nhập vào xuất xứ",
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Danh mục"
            name="category_id"
            rules={[
              {
                required: true,
                message: "Hãy nhập vào xuất xứ",
              },
            ]}
          >
            <Select placeholder="Danh mục">
              {category.map((cat) => (
                <Option key={cat.id} value={cat.id}>
                  {cat.category_name}
                </Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item
            label="Giảm Giá"
            name="discount"
            rules={[
              {
                required: true,
                message: "Hãy nhập vào giá giảm",
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Số Lượng"
            name="quantity"
            rules={[
              {
                required: true,
                message: "Hãy nhập vào số lượng",
              },
            ]}
          >
            <Input />
          </Form.Item>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyItems: "center",
              margin: "10px 0 20px 0",
            }}
          >
            {/* Upload hình */}
            <div style={{ margin: "10px 0" }}>
              <label
                htmlFor="image_file"
                style={{
                  padding: "5px 10px",
                  borderRadius: 5,
                  backgroundColor: "#0d6efd",
                  color: "white",
                }}
              >
                Choose File
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
              Submit
            </Button>
          </Form.Item>
        </Form>
      </Modal>
      {/* Nút thêm mới */}
      <div className="flex justify-between">
        <Button
          style={{ background: "rgb(69, 128, 255)", color: "white",width: "10%",}}
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
          dataSource={products}
          pagination={{ pageSize: 5 }}
          rowKey={(record) => record.id}
        />
      </div>
    </>
  );
}

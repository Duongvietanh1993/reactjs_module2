/**
 * hàm format tiền tệ
 * @param {*} money chuỗi tiền cần format
 * @returns kết quả trả về
 * Author:D.Việt Anh(16/9/2023)
 */

export const formatMoney = (money) => {
  return money.toLocaleString("vi", { style: "currency", currency: "VND" });
};

/**
 * Định dạng chuỗi thời gian
 * @param {*} date chuỗi thời gian cần định dạng
 * @returns kết quả trả về
 * Author:D.Việt Anh(16/9/2023)
 */
export const formatDate = (date) => {
  //lấy ra định dạng thời gian dựa vào thời gian thưc
  const today = new Date(date);
  //lấy năm
  const year = today.getFullYear();
  //lấy ra tháng
  let month = today.getMonth() + 1;
  if (month > 0 && month < 10) {
    month = `0${month}`;
  }
  //lấy ra ngày
  let day = today.getDate();
  if (day > 0 && day < 10) {
    day = `0${day}`;
  }
  //trả ra chuỗi cần định dạng
  return `${day}-${month}-${year}`;
};

/**
 * validate email
 * @param {*} email chuỗi email cần kiểm tra
 * @returns true nếu đúng định dạng và false nếu sai
 * Author: D.Việt Anh(16/9/2023)
 */
export const ValidateEmail = (email) => {
  return String(email)
    .toLowerCase()
    .match(
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    );
};

/**
 * validate password
 * @param {*} password chuỗi password cần kiểm tra
 * @returns true nếu đúng định dạng và false nếu sai
 * Author: D.Việt Anh(16/9/2023)
 */
export const validatePassword = (password) => {
  return String(password)
    .toLowerCase()
    .match(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/);
};

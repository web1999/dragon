const errorTypes = require("../constants/error.types")
const errorHandler = (error,ctx) =>{
  let status,message;
  switch (error.message) {
    case errorTypes.NAME_OR_PASSWORD_IS_REQUIRED:
      status = 400;
      message = "用户名或者密码不能为空"
      break;
    case errorTypes.USER_ALREADY_EXISTS:
      status = 409;
      message = "用户名已存在"
      break;
    case errorTypes.USER_NOT_EXISTS:
      status = 400;
      message = "用户名不存在"
      break;
    case errorTypes.PASSWORD_ERROR:
      status = 400;
      message = "密码错误"
      break;
    case errorTypes.UNAUTHORIZED:
      status = 401;
      message = "无效的token~"
      break;
    default:
      status = 404;
      message = "发生了错误"
  }
  ctx.status = status;
  ctx.body = message
}

module.exports = errorHandler;
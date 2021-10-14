const errorType = require("../constants/error.types");
const service = require("../service/user.service");
const md5password = require("../utils/password-handle");


const verifyUser = async (ctx,next) =>{
  //获取用户传递的账号密码
  const {userName,password} = ctx.request.body;

  //判断用户名和密码不能为空‘
  if (!userName || !password || userName === "" || password === "") {
    const error = new Error(errorType.NAME_OR_PASSWORD_IS_REQUIRED);
    return ctx.app.emit("error",error,ctx)
  }
  //判断用户名是否存在
  const result = await service.getUserByName(userName);
  if (result.length ) {
    const error = new Error(errorType.USER_ALREADY_EXISTS);
    return ctx.app.emit("error",error,ctx);
  }
  await next();
}
//该中间件用户加密
const handlePassword = async (ctx,next) =>{
  const {password} = ctx.request.body;
  ctx.request.body.password = md5password(password);

  await next();
}

module.exports = {
  verifyUser,
  handlePassword
}
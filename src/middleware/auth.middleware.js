const jwt = require("jsonwebtoken");
const {PUBLIC_KEY} = require("../app/config");

const errorType = require("../constants/error.types");
const AuthService = require("../service/auth.service");
const service = require("../service/user.service");
const md5password = require("../utils/password-handle");


const verifyLogin = async (ctx,next) =>{
  //获取用户传递的账号密码
  const {userName,password} = ctx.request.body;

  //判断用户名和密码不能为空‘
  if (!userName || !password) {
    const error = new Error(errorType.NAME_OR_PASSWORD_IS_REQUIRED);
    return ctx.app.emit("error",error,ctx)
  }
  //判断用户名是否存在
  const result = await service.getUserByName(userName);
  const user = result[0];
  if (!user ) {
    const error = new Error(errorType.USER_NOT_EXISTS);
    return ctx.app.emit("error",error,ctx);
  }
  //判断密码是否正确
  if (md5password(password) !== user.password) {
    const error = new Error(errorType.PASSWORD_ERROR);
    return ctx.app.emit("error",error,ctx);
  }
  ctx.user = user;
  await next();
}

const verifyAuth = async(ctx,next) =>{
  //获取token
  const authorization = ctx.headers.authorization;
  if (!authorization) {
    const error = new Error(errorType.UNAUTHORIZED);
    return ctx.app.emit("error",error,ctx);
  }
  const token = authorization.replace("Bearer " , "");

  try {
    const result = jwt.verify(token, PUBLIC_KEY,{
      algorithms:["RS256"]
    });
    ctx.user = result;
    await next();
  } catch (err) {
    const error = new Error(errorType.UNAUTHORIZED);
    ctx.app.emit("error",error,ctx)
  }

  
};
//配置所有模块的权限验证 
const verifyJurisdiction = async(ctx,next) =>{
    //获取当前用户id以及需要操作的动态id    
    const [resourceKey] = Object.keys(ctx.params);
    const tableName = resourceKey.replace("Id","");
    const resourceId = ctx.params[resourceKey];
    const userId = ctx.user.id;
    const isPermission = await AuthService.checkResource(tableName,resourceId,userId);
    if (!isPermission) {
      const error = new Error(errorTypes.UNAUTHORIZED);
      return ctx.app.emit("error",error,ctx);
    }
    await next();
  };

// const verifyJurisdiction = (tableName) =>{
//   async(ctx,next) =>{
//     //获取当前用户id以及需要操作的动态id
//     const id = ctx.params.momentId;
//     const userId = ctx.user.id;
  
//     const isPermission = await AuthService.checkResource(tableName,id,userId);
//     if (!isPermission) {
//       const error = new Error(errorTypes.UNAUTHORIZED);
//       return ctx.app.emit("error",error,ctx);
//     }
//     await next();
//   };

module.exports = {
  verifyLogin,
  verifyAuth,
  verifyJurisdiction
}
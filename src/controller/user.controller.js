const fs = require("fs");

const service = require("../service/user.service");

const fileService = require("../service/file.service");
const {AVATAR_PATH} = require("../constants/file.path");
class UserController {
  async create(ctx,next){
    //获取用户请求传递的数据
    const user = ctx.request.body
    const result = await service.create(user);

    ctx.body = result;
  };
  async avatarInfo(ctx,next){
    const {userId} = ctx.params;
    const avatarContent = await fileService.getAvatarByUserId(userId);

    //给文件设置类型
    ctx.response.set("content-type",avatarContent.mimetype); 
    ctx.body =  fs.createReadStream(`${AVATAR_PATH}/${avatarContent.filename}`);
  }
}

module.exports = new UserController();
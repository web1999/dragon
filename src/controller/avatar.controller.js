const service = require("../service/file.service");
const userService = require("../service/user.service");
const {AVATAR_PATH} = require("../constants/file.path");
const {APP_HOST,APP_PORT} = require("../app/config")

class AvatarController {
  async saveAvatarInfo(ctx,next){
    //获取用户上传头像的信息
    const {filename,mimetype,size} = ctx.req.file;
    //获取当前用户id
    const {id} = ctx.user;
    const result = await service.createAvatar(id,filename,mimetype,size);
    //将图片地址保存在users表中
    const avatarUrl = `${APP_HOST}:${APP_PORT}/users/${id}/avatar`;
    await userService.updateAvatar(avatarUrl,id);

    ctx.body = "上传头像成功";
  };
  async savePictureInfo(ctx,next){
    //获取动态配图信息
    const files = ctx.req.files;
    const {id} = ctx.user;
    const {momentId} = ctx.query;
    console.log(files);
    //遍历获取的图片
    for (let file of files) {
      const {filename,mimetype,size} = file;
      await service.createPicture(id,momentId,filename,mimetype,size);
    }
    ctx.body = "配图上传成功"
  }
}
module.exports = new AvatarController()
const fs = require("fs");
const fileService = require("../service/file.service");
const momentService = require("../service/moment.service");
const MomentService = require("../service/moment.service");

const {PICTURE_PATH} = require("../constants/file.path");

class MomentController{
  async create(ctx,next){
    //获取当前登录的用户id、name以及用户发表的content
    const userId = ctx.user.id; //获取用户id
    const content = ctx.request.body.content;//获取用户发布的内容
    //将数据插入到数据库中
    const result = await MomentService.create(userId,content);
    ctx.body = result;
  };
  async detail(ctx,next){
    //获取id
    const momentId = ctx.params.momentId;

    const result = await MomentService.getMomentById(momentId);
    ctx.body = result;
  };
  async list(ctx,next){
    //获取offset和size
    const {offset,size} = ctx.query;
    const result = await MomentService.getMomentList(offset,size);
    ctx.body = result;
  };
  async deleteMoment(ctx,next){
    //获取id
    const momentId = ctx.params.momentId;
    const result = await momentService.deleteMoment(momentId);
    ctx.body = result;
  };
  async updateMoment(ctx,next){
    const momentId = ctx.params.momentId;
    const content = ctx.request.body.content;//获取用户更新的内容
    const result = await momentService.updateMoment(content,momentId);
    ctx.body = result
  };
  async addLabels(ctx,next){
    const {labels} = ctx;
    const {momentId} = ctx.params;
    for (const label of labels) {
      //判断动态中是否存在要进行新增的标签
      const isExists = await momentService.hasLabel(label.id,momentId);
      if (!isExists) {
        console.log("不存在");
        await momentService.addLabel(label.id,momentId);
      }
    }
    ctx.body = "动态添加了标签"
  };

  async fileInfo(ctx,next){
    let {filename} = ctx.params;
    const fileInfo = await fileService.getFileByFilename(filename);

    const {type} = ctx.query;
    const types = ["small","middle","large"];
    if (types.some(item => item === type)) {
      filename = filename + "-" + type;
    }
    
    ctx.response.set("content-type",fileInfo.mimetype);
    ctx.body = fs.createReadStream(`${PICTURE_PATH}/${filename}`)
  }

};

module.exports = new MomentController();
const Router = require("koa-router");

const labelRouter = new Router({prefix:"/label"});

const {
  create,
  list
} = require("../controller/label.controller.js");
const {
  verifyAuth
} = require("../middleware/auth.middleware");

labelRouter.post("/",verifyAuth,create);

//获取标签接口
labelRouter.get("/",list)

module.exports = labelRouter;
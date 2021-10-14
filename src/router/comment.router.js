const Router = require("koa-router");

const {verifyAuth,verifyJurisdiction} = require("../middleware/auth.middleware");
const {create,reply,update,remove,list} = require("../controller/comment.controller.js");

const commentRouter = new Router({prefix:"/comment"});
//创建评论
commentRouter.post("/",verifyAuth,create);
//回复评论
commentRouter.post("/:commentId/reply",verifyAuth,reply);
//修改评论
commentRouter.patch("/:commentId",verifyAuth,verifyJurisdiction,update);
//删除评论
commentRouter.delete("/:commentId",verifyAuth,verifyJurisdiction,remove);

//查询评论
commentRouter.get("/",list)
module.exports = commentRouter;
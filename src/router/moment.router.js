const Router = require("koa-router");

const {
  create,
  detail,
  list,
  deleteMoment,
  updateMoment,
  addLabels,
  fileInfo
} = require("../controller/moment.controller")
const {
  verifyAuth,
  verifyJurisdiction
} = require("../middleware/auth.middleware");
const {
  verifyLabelExists
} = require("../middleware/label.middleware");

const momentRouter = new Router({prefix:"/moment"});

momentRouter.post("/",verifyAuth,create);
momentRouter.get("/",list);
momentRouter.get("/:momentId",detail);
momentRouter.delete("/:momentId",verifyAuth , verifyJurisdiction,deleteMoment);
momentRouter.patch("/:momentId",verifyAuth , verifyJurisdiction,updateMoment);

//给动态添加标签
momentRouter.post("/:momentId/labels",verifyAuth,verifyJurisdiction,verifyLabelExists,addLabels);

//给动态添加配图
momentRouter.get("/images/:filename",fileInfo)

module.exports = momentRouter;


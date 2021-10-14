const Router = require("koa-router");
const {
  verifyAuth,
  verifyJurisdiction
} = require("../middleware/auth.middleware");
const {
  avatarHandler,
  pictureHandler,
  pictureResize
} = require("../middleware/file.middleware");
const {
  saveAvatarInfo,
  savePictureInfo
} = require("../controller/avatar.controller");

const fileRouter = new Router({prefix:"/upload"});

fileRouter.post("/",verifyAuth,avatarHandler,saveAvatarInfo);
fileRouter.post("/picture",verifyAuth,pictureHandler,pictureResize,savePictureInfo)

module.exports = fileRouter;

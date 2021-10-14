const service = require("../service/label.service");

const verifyLabelExists = async(ctx,next) =>{
  const {labels} = ctx.request.body;
  const newLabels = [];
  //遍历用户传来的标签数组
  for(let name of labels){
    //查找数据库中是否有该标签
    const labelResult = await service.getLabelByName(name);
    const label = {name};
    if (!labelResult) {
      //不存在进入判断，进行新增标签操作
      const result = await service.create(name);
      //给新增标签添加id属性
      label.id = result.insertId;
    }else{
      //标签存在的话给标签赋原来的id值
      label.id = labelResult.id
    };
    //将处理好的标签数据push到newLabels中
    newLabels.push(label);
  };
  ctx.labels = newLabels;
  await next();
};

module.exports = {
  verifyLabelExists
}
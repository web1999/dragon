const connection = require("../app/database");

class CommentService{
  async create(momentId,content,userId){
    const statement = `INSERT INTO comment(moment_id,content,user_id) VALUES (?,?,?);`;
    const [result] = await connection.execute(statement,[momentId,content,userId]);
    return result;
  };
  async reply(momentId,commentId,content,userId){
    const statement = `INSERT INTO comment(moment_id,comment_id,content,user_id)
                                   VALUES(?,?,?,?);`;
    const [result] = await connection.execute(statement,[momentId,commentId,content,userId]);
    return result;
  };
  async update(commentId,content){
    const statement = `UPDATE comment SET content = ? WHERE id = ?;`;
    const [result] = await connection.execute(statement,[content,commentId]);
    return result;
  };
  async remove(commentId){
    const statement =  `DELETE FROM comment WHERE id = ?`;
    const [result] = await connection.execute(statement,[commentId]);
    return result
  };
  async getCommentsByMomentId(momentId){
    const statement = `
      SELECT 
        c.id , c.content , c.comment_id commentId , c.createAt createTime,
        JSON_OBJECT('id',u.id,'name',u.name) user
      FROM comment c
      LEFT JOIN users u ON u.id = c.user_id
      WHERE moment_id = ?;`;
    const [result] = await connection.execute(statement,[momentId]);
    return result;
    
  }
}

module.exports = new CommentService();
const connection = require("../app/database");

const sqlFragment = `

`

class MomentService {
  async create(userId , content){
    const statement = `INSERT INTO moment (user_id,content) VALUES (?,?);`;
    const [result] = await connection.execute(statement,[userId,content]);
    return result;
  }
  async getMomentById(momentId){
    const statement = `
      SELECT
        m.id id , m.content content , m.createAt createTime , m.updateAt updateTime, 
        JSON_OBJECT('id',u.id,'name',u.name,'avatarUrl',u.avatar_url) user,
				IF(COUNT(l.id),JSON_ARRAYAGG(
          JSON_OBJECT('id',l.id,'name',l.name)
        ),NULL)labels,
        (SELECT JSON_ARRAYAGG(CONCAT('http://localhost:8888/moment/images/',file.filename)) FROM file WHERE m.id = file.moment_id) images
      FROM moment AS m 
      LEFT JOIN users AS u ON m.user_id = u.id
      LEFT JOIN moment_label AS ml ON ml.moment_id = m.id
      LEFT JOIN label AS l ON l.id = ml.label_id
      WHERE m.id = ?`;
    const result = await connection.execute(statement,[momentId]);
    console.log(result[0]);
    return result[0];
  }
  async getMomentList(offset,size){
    //编写sql语句
    const statement = `
      SELECT
        m.id id , m.content content , m.createAt createTime , m.updateAt updateTime, 
        JSON_OBJECT('id',u.id,'name',u.name,'avatarUrl',u.avatar_url) user,
        (SELECT COUNT(*) FROM comment c WHERE c.moment_id = m.id) commentCount,
        (SELECT COUNT(*) FROM moment_label ml WHERE ml.moment_id = m.id) labelCount,
        (SELECT JSON_ARRAYAGG(CONCAT('http://localhost:8888/moment/images/',file.filename)) FROM file WHERE m.id = file.moment_id) images
      FROM moment AS m 
      LEFT JOIN users AS u ON m.user_id = u.id
      LIMIT ? , ?;`;
    const result = await connection.execute(statement,[offset,size]);
    return result[0];
  }

  async deleteMoment(momentId){
    const statement = `
    DELETE FROM moment WHERE id = ?;
    `;
    const result = await connection.execute(statement,[momentId]);
    return result
  }
  async updateMoment(content, momentId){
    const statement = `
    UPDATE moment SET content = ? WHERE id = ?;
    `;
    const result = await connection.execute(statement,[content,momentId]);
    return result
  };
  async hasLabel(labelId,momentId){
    const statement = `SELECT * FROM moment_label WHERE label_id = ? AND moment_id = ?;`;
    const [result] = await connection.execute(statement,[labelId,momentId]);
    return result.length === 0?false : true;
  };
  async addLabel(labelId,momentId){
    const statement = `INSERT INTO moment_label(label_id,moment_id) VALUES(?,?);`;
    const [result] = await connection.execute(statement,[labelId,momentId]);
    return result;
  }
};

module.exports = new MomentService();

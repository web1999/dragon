const connection = require("../app/database");

class FileService{ 
  async createAvatar(id,filename,mimetype,size){
    const statement = `INSERT INTO avatar(user_id,filename,mimetype,size) VALUES (?,?,?,?);`;
    const [result] = await connection.execute(statement,[id,filename,mimetype,size]);
    return result;
  };
  async getAvatarByUserId(userId){
    const statement = `SELECT * FROM avatar WHERE user_id = ?;`;
    const [result] = await connection.execute(statement,[userId]);
    return result[0];
  };
  async createPicture(id,momentId,filename,mimetype,size){
    const statement = `INSERT INTO file(user_id,moment_id,filename,mimetype,size) VALUES (?,?,?,?,?);`;
    const [result] = await connection.execute(statement,[id,momentId,filename,mimetype,size]);
    return result;
  };
  async getFileByFilename(filename){
    const statement = `SELECT * FROM file WHERE filename = ?;`;
    const [result] = await connection.execute(statement,[filename]);
    return result[0];
  }
};

module.exports = new FileService();
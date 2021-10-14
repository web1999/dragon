const connection = require("../app/database")

class UserService{
  async create(user){
    const {userName,password} = user
    const statement = `INSERT INTO users (name,password) VALUES(?,?);`;
    const result = await connection.execute(statement,[userName,password])
    //将user存储到数据库中
    return result[0];
  }

  async getUserByName(name){
    const statement = `SELECT * FROM users WHERE name = ?;`;
    const result = await connection.execute(statement,[name])
    return result[0];
  }

  async updateAvatar(avatarUrl,userId){
    const statement = `UPDATE users SET avatar_url = ? WHERE id = ?;`;
    const [result] = await connection.execute(statement,[avatarUrl,userId]);
    return result;
  }
}

module.exports = new UserService();
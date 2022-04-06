const mysql = require("mysql2");
  
const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  database: "deathdb",
  password: "0000"
});
// тестирование подключения
 connection.connect(function(err){
    if (err) {
      return console.error("Ошибка: " + err.message);
    }
    else{
      console.log("Подключение к серверу MySQL успешно установлено");
    }
 });

try {

}
catch{

}
let likeLogin = ""
let likePassword = ""
connection.promise().query("SELECT * FROM users WHERE login = ? and password = ?;", ["samvel797", "0000"])
.then(result => {
  console.log(result[0][0].id);
})
.catch(err => {
  console.log(err)
})

 // закрытие подключения
 connection.end(function(err) {
  if (err) {
    return console.log("Ошибка: " + err.message);
  }
  console.log("Подключение закрыто");
});
var fs = require('fs');
var http = require('http');
const path = require('path');
const mysql = require("mysql2");
const { send } = require('process');
const { dirname } = require('path');

const PORT = process.env.PORT || 3000;

const connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    database: "deathdb",
    password: "0000"
  });

var server = http.createServer(function(req, res){
    console.log("URL страницы: " + req.url);
    if (req.method == "POST") {
        let data = '';
        req.on('data', chunk => {
          data += chunk;
        })
        req.on('end', () => {
            let body = JSON.parse(data)
            let sql = ""
            let serverResponse = {
                information: "",
                code: null, 
            }
            console.log(body)
            switch(body.reqnumber) {
                
                case 1: // Попытка входа. Определяем логин или регистрация
                
                    sql = "SELECT * FROM users WHERE login = ?"
                    connection.promise().query(sql, [body.login])
                    .then(result => {
                        if (result[0][0] != undefined) {
                            serverResponse = {information: "Пользователь уже существует", code: 0}
                            res.end(JSON.stringify(serverResponse))
                            console.log(result[0][0], "Почеши залупу")
                        }
                        else {
                            serverResponse = {information: "Зарегестрируйтесь", code: 1}
                            res.end(JSON.stringify(serverResponse))
                        } 
                    })
                    .catch(err => {
                        console.log(err)
                    })
                
                    break
                
                case 2: // Логин
                    sql = "SELECT * FROM users WHERE login = ? and password = ?"
                    connection.promise().query(sql, [body.login, body.password])
                    .then(result => {
                        if (result[0][0] != undefined) {
                            serverResponse = {information: "Вы вошли", code: 2, id: result[0][0].id}
                            res.end(JSON.stringify(serverResponse))
                        }
                        else {
                            serverResponse = {information: "Не вошли", code: 3}
                            res.end(JSON.stringify(serverResponse))
                        } 
                    })
                    .catch(err => {
                        console.log(err)
                    })

                    break
                
                case 3: // Регистрация
                    sql = "INSERT INTO users (login, password) VALUES ( ? , ?);"
                    connection.promise().query(sql, [body.login, body.password])
                    .then(result => {
                        serverResponse = {information: "Resgistration user - successfull", id: result[0].insertId}
                        res.end(JSON.stringify(serverResponse))
                        console.log(result[0].insertId, "Resgistration user - successfull")
                    })
                    .catch(err => {
                        if (err.errno == 1062) {
                            res.end(JSON.stringify("User with this login is already registered"))
                            console.log("User with this login is already registered")
                        } 
                        else {
                            res.end(JSON.stringify("Unpredictable error with DB"))
                            console.log(err)
                        } 
                                    
                        })
                    
                    break

                case 4: // Настройки
                    console.log(body.name, body.surname)
                    sql = "UPDATE users SET name = ?, surname = ?, gender = ?, born = ?, die = ?, about = ?, ready = 1 WHERE id = ?"
                    connection.promise().query(sql, [body.name, body.surname, body.gender, body.born, body.die, body.about, body.id])
                    .then(result => {
                        res.end(JSON.stringify(result[0].insertId))
                        console.log("Успех настрйки сохранены")
                    })
                    .catch(err => {
                        console.log(err)
                    })

                    break
                
                case 5: //Аккаунт
                    console.log(body.reqnumber, body.id)
                    sql = "SELECT name, surname, gender, born, die, img, about FROM users where id = ?"
                    connection.promise().query(sql, [body.id])
                    .then(result => {
                        res.end(JSON.stringify(result[0]))
                        console.log(result[0])
                    })
                    .catch(err => {
                        console.log(err)
                    })

                    break

                case 6: //Аккаунт
                    console.log(body.reqnumber, body.image)
                    sql = "SELECT name, surname, gender, born, die about FROM users where id = ?"
                    res.end(body.image)

                    break
                
                case 7: //Вывод всех готовых аккаунтов в поиске
                    console.log(body.reqnumber, body.id)
                    sql = "SELECT * FROM users WHERE ready = 1;"
                    connection.promise().query(sql, [body.id])
                    .then(result => {
                        res.end(JSON.stringify(result[0]))
                        console.log(result[0])
                    })
                    .catch(err => {
                        console.log(err)
                    })

                    break

                case 8: //Фотка
                console.log(body.reqnumber)
                    serverResponse = 'ПРивет'
                    res.end(JSON.stringify(serverResponse))
                    break

                case 9: //Фотка
                    console.log(body.reqnumber, body.sendFile);
                    /* fs.appendFile(__dirname + 'public/hui.jpg', body.sendFile,function() {
                        respond.end(); }) */
                    fs.writeFileSync
                    fs.writeFileSync(__dirname + '/hui.jpg', body.sendFile);
                    serverResponse = 'ПРивет'
                    res.end(JSON.stringify(serverResponse))
                    break    
            }
            
          
        })

    } else {
        if (req.url === '/') {
            sendRes('index.html', 'text/html', res);
        } else {
            sendRes(req.url, getContentType(req.url), res)
        }
    }

});



function sendRes(url, contentType, res) {
    let file = path.join(__dirname, url);
    fs.readFile(file, (err, content) => {
        if (err) {
            res.writeHead(404);
            res.write('file not found');
            res.end();
            //console.log('error 400', file);
        } else {
            res.writeHead(200, { 'Content-Type': contentType });
            res.write(content);
            res.end();
            //console.log('res 200', file);
        }
    })
}

function getContentType(url) {
    switch (path.extname(url)) {
        case ".html":
            return "text/html";
        case ".css":
            return "text/css";
        case ".js":
            return "text/javascript";
        case ".json":
            return "application/json";
        case ".txt":
            return "text/txt";
        case ".img":
            return "image/jpeg"
        default:
            return "application/octate-stream";
    }
}

/* server.on('request', (req, res) => {
    console.log(req.url)
    if (req.method == 'POST') {
        console.log(req.)
        res.end(JSON.stringify('asdasdasdsada'))
    }

 
  
  
    
}) */


server.listen(PORT, 'localhost');
console.log("мы отслеживаем порт 3000");

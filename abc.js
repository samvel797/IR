case 1:
                    sql = "SELECT * FROM users WHERE login = ? and password = ?;"
                    connection.promise().query(sql, [body.login, body.password])
                    .then(result => {
                        if (result[0][0] != undefined) {
                            res.end(JSON.stringify('Пользователь уже существует'))
                            console.log(result[0][0])
                        }
                        else{
                            sql = "INSERT INTO users (login, password) VALUES ( ? , ?);"
                            connection.promise().query(sql, [body.login, body.password, body.teams])
                            .then(result => {
                                res.end(JSON.stringify(result[0].insertId))
                                console.log("Resgistration user - successfull")
                            })
                            .catch(err => {
                                if (err.errno == 1062) {
                                    res.end(JSON.stringify("User with this login is already registered"))
                                    console.log("User with this login is already registered")
                                } else {
                                    res.end(JSON.stringify("Unpredictable error with DB"))
                                    console.log(err)
                                } 
                                    
                            });
                        }
                    })
                    .catch(err => {
                        console.log(err)
                    })
                    
                    /* console.log(body.login);
                    console.log(body.password); */
                    break

function registration (body, sql) {
    sql = "SELECT * FROM users WHERE login = ? and password = ?;"
    connection.promise().query(sql, [body.login, body.password])
    .then(result => {
        if (result[0][0] != undefined) {
            res.end(JSON.stringify('Пользователь уже существует'))
            console.log(result[0][0])
        }
        else{
            sql = "INSERT INTO users (login, password) VALUES ( ? , ?);"
            connection.promise().query(sql, [body.login, body.password])
            .then(result => {
                res.end(JSON.stringify(result[0].insertId))
                console.log("Resgistration user - successfull")
            })
            .catch(err => {
                if (err.errno == 1062) {
                    res.end(JSON.stringify("User with this login is already registered"))
                    console.log("User with this login is already registered")
                } else {
                    res.end(JSON.stringify("Unpredictable error with DB"))
                    console.log(err)
                } 
                    
            });
        }
    })
    .catch(err => {
        console.log(err)
    })
}

async function sendRequest (url, method, body = null) {
   
        const response = await fetch(url, {
            headers: {'Content-type': 'application/json'},
            method: method, 
            body: body
        })

        let serverResponse
        if (response.ok) {
            serverResponse = await response.json();
        }
        else {
            console.log("Ошибка HTTP: " + response.status);
        }

    return serverResponse   
}

function validLoginClient(login) { //Лишний код ?
    loginRegExp = /\W/
    return (!(loginRegExp.test(login)) && (login.length <= 10 ) && (4 <= login.length))
}


function validCheck(elem) {
    loginRegExp = /\W/
    switch (elem.className){
        case "login_input": 
            return (!(loginRegExp.test(elem.value)) && (elem.value.length <= 15 ) && (4 <= elem.value.length))
        case "password_input":
            return (!(loginRegExp.test(elem.value)) && (elem.value.length <= 15 ) && (4 <= elem.value.length))
        case "repeat_password_input":
            return (!(loginRegExp.test(elem.value)) && (elem.value.length <= 15 ) && (4 <= elem.value.length) && (elem.value == document.querySelector('.password_input').value))
    }
}

let note = document.createElement('div')
note.className = "error"

function errorInputShow(elem) {
    if (!validCheck(elem)) {
        elem.style.border = "2px solid rgb(224, 98, 98)"
        note.innerHTML = "Note: login and password fields only support Latin characters and number! fields cannot be empty and length < 3 !"
        document.querySelector('.register_button').after(note)
    }
    else {
        elem.style.border = "0px"
        note.remove()
    }
}

//////////////////////////////////////////////////////////////////////////////////////
document.querySelector('.login_input').onchange = () => {
    errorInputShow(document.querySelector('.login_input'))
}

document.querySelector('.password_input').onchange = () => {
    errorInputShow(document.querySelector('.password_input'))
}

document.querySelector('.repeat_password_input').onchange = () => {
    errorInputShow(document.querySelector('.repeat_password_input'))
}

//////////////////////////////////////////////////////////////////////////////////////


async function modeCheck() {
    if (document.querySelector('.login_or_register_label').textContent == "LOG IN") {
        console.log("мод 2")
        return 2 //Логин   
    }
    else if (document.querySelector('.login_or_register_label').textContent == "CREATE AN ACCOUNT") {
        console.log("мод 3")
        return 3 //Регистрация
    }
    else {
        console.log("мод 1")
        return 1 //Попытка входа/регистрация    
    }   
}

async function loginValid() {
    const login = document.querySelector('.login_input')
    const password = document.querySelector('.password_input')
    const repeatPassword = document.querySelector('.repeat_password_input')
    let reqnumber = await modeCheck()
    
    
    let body = {
        reqnumber: reqnumber,
        login: login.value,
        password: password.value,
        repeatPassword: repeatPassword.value,
        enterMode: ""
    }
    body = JSON.stringify(body)
    
    switch (await modeCheck()) {
        case 1: // Попытка входа. Определяем логин или регистрация
        errorInputShow(login) // Отрисовываем рамку при нажатии продолжить с пустым полем. Без этой строчки при пустом поле рамка не отрисуется

            if (validCheck(login)) {
                serverResponse = await sendRequest('http://localhost:3000/index.html', 'POST', body)
                console.log("Произошла отправка данных ответ сервера = ", serverResponse)    
                if (serverResponse.code == 0) {
                    document.querySelector('.login_or_register_label').textContent = "LOG IN"
                    document.querySelector('.login_or_register_about_label').textContent = "Welcome back. Enter your password to continue."
                    document.querySelector('.password_label').style.visibility = "visible"
                    document.querySelector('.password_input').style.visibility = "visible"
                } 
                else if (serverResponse.code == 1){
                    /* login.disabled = true */
                    document.querySelector('.login_or_register_label').textContent = "CREATE AN ACCOUNT"
                    document.querySelector('.login_or_register_about_label').textContent = "Looks like you're new here. Create a password."
                    document.querySelector('.password_input').style.visibility = "visible"
                    document.querySelector('.repeat_password_input').style.visibility = "visible"
                    document.querySelector('.password_label').style.visibility = "visible"
                    document.querySelector('.repeat_password_label').style.visibility = "visible"
                }
                }// Тут можно будет с помощью else уведомлять об ошибке  
            
            break

        case 2: // Логин
            errorInputShow(password) // Отрисовываем рамку при нажатии продолжить с пустым полем. Без этой строчки при пустом поле рамка не отрисуется
            
            if (validCheck(login) && validCheck(password)){
                serverResponse = await sendRequest('http://localhost:3000/index.html', 'POST', body)    
                console.log("Произошла отправка данных ответ сервера = ", serverResponse)
                if (serverResponse.code == 2) {
                    console.log(serverResponse.information) // Вошли
                    localStorage.setItem('id', serverResponse.id)
                    window.location.href = 'http://localhost:3000/account.html'
                }
                else if (serverResponse.code == 3) {
                    console.log(serverResponse.information) // Не вошли
                }
            }
            // Тут можно будет с помощью else уведомлять об ошибке            
            break

        case 3: // Регистрация
            errorInputShow(password)  // Отрисовываем рамку при нажатии продолжить с пустым полем. Без этой строчки при пустом поле рамка не отрисуется
            errorInputShow(repeatPassword)
            
            if (validCheck(login) && validCheck(password) && validCheck(repeatPassword)){
                serverResponse = await sendRequest('http://localhost:3000/index.html', 'POST', body)
                console.log("Произошла отправка данных ответ сервера =  ", serverResponse)
                if (serverResponse == "User with this login is already registered"){
                    note.innerHTML = "User with this login is already registered"
                    document.querySelector('.register_button').after(note)
                    /* window.location.href = 'http://localhost:3000/account.html' */
                }
                if (serverResponse.information == "Resgistration user - successfull"){
                    console.log(serverResponse.information) // Вошли
                    localStorage.setItem('id', serverResponse.id)
                    window.location.href = 'http://localhost:3000/account.html'
                }
            }// Тут можно будет с помощью else уведомлять об ошибке  
            break

        default: 
            console.log("Неправильный логин")
            break
    }


}
 
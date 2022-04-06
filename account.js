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

function logout() {
    localStorage.clear()
    window.location = 'http://localhost:3000/index.html'
}
function anotherIdClear() {
    console.log('CRABOTALO')
    localStorage.removeItem('anotherId')
}

document.body.onload = addElement;
async function addElement() {
    let currntId
    if (localStorage.getItem('id') == null) {
        window.location = 'http://localhost:3000/index.html'
    }
    else {
        if (localStorage.getItem('anotherId') != null) {
            currntId = localStorage.getItem('anotherId')
        } else {
            currntId = localStorage.getItem('id')
        }
        
        let body = {
            reqnumber: 5,
            id : currntId
        }
        body = JSON.stringify(body)
        console.log(body);
        serverResponse = await sendRequest('http://localhost:3000/index.html', 'POST', body)
        console.log("Произошла отправка данных ответ сервера = ", serverResponse)
        if (serverResponse[0].name == null) {    // Переадресация на настройки если данные не заполнены
            window.location.href = 'http://localhost:3000/settings.html'
        }
        document.querySelector('.account_picture').src =  serverResponse[0].img
        document.querySelector('.gender').innerHTML += serverResponse[0].gender
        document.querySelector('.name').innerHTML = serverResponse[0].name + " " + serverResponse[0].surname
        document.querySelector('.born').innerHTML += serverResponse[0].born
        if (serverResponse[0].die != "1000-07-07") {
            document.querySelector('.die').innerHTML = "DIE - " + serverResponse[0].die
        }
        else {
            document.querySelector('.die').innerHTML = "STILL ALIVE"
        }
        /* let age = new Date ()
        age = Math.trunc((age - bornDate) / 31559791500) */
    
        /* document.querySelector('.age').innerHTML += age */
        document.querySelector('.about').innerHTML = serverResponse[0].about
    }
    for (let i = 0; i < 4; i++) {
        document.querySelectorAll('.nav__link')[i].addEventListener("click", ()=>anotherIdClear())
    }
    
}
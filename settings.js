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

//Валидация и выделение ошибки

function validCheck(elem) {
    nameRegExp = /^[a-zA-Z]+$/
    switch (elem.className){
        case "name_input": 
            return ((nameRegExp.test(elem.value)) && (elem.value.length <= 15 ) && (1 <= elem.value.length))
        case "surname_input":
            return ((nameRegExp.test(elem.value)) && (elem.value.length <= 15 ) && (1 <= elem.value.length))
        case "gender_input": 
            return ((document.querySelectorAll('.gender_input')[0].checked) || (document.querySelectorAll('.gender_input')[1].checked))
        case "born_input":
            return((document.querySelector('.born_input').value) != 0)
        case "die_input":
            return((document.querySelectorAll('.die_input')[1].checked) || ((document.querySelectorAll('.die_input')[0].value) != 0))
        case "photo_input":
            return(document.querySelector('.photo_input').value == "")   
    }
}

let note = document.createElement('div')
note.className = "error"
note.innerHTML = "Note: name and surname fields only support Latin characters ! fields cannot be empty! Photo only 300x300 .png"

function errorInputShow(elem) {
    
     if ((elem.className == "name_input") || (elem.className == "surname_input") || (elem.className == "born_input") || (elem.className == "die_input") || (elem.className == "photo_input")) {
        if (!validCheck(elem)) {
            elem.style.border = "2px solid rgb(224, 98, 98)"
            document.querySelector('.save_button').before(note)
        }
        else {
            elem.style.border = "0px"
            note.remove()
        }
     }

     if (elem.className == "gender_input") {
        if (!validCheck(elem)) { 
            document.querySelectorAll(".gender_label")[1].textContent = "male !"
            document.querySelectorAll(".gender_label")[1].style.color = "rgb(224, 98, 98)"
            document.querySelectorAll(".gender_label")[2].textContent = "female !"
            document.querySelectorAll(".gender_label")[2].style.color = "rgb(224, 98, 98)"
        }
        else {
            document.querySelectorAll(".gender_label")[1].textContent = "male:"
            document.querySelectorAll(".gender_label")[1].style.color = "white"
            document.querySelectorAll(".gender_label")[2].textContent = "female:"
            document.querySelectorAll(".gender_label")[2].style.color = "white"
        }
     }
}

function errorGendershow(elem) {
    return ((document.querySelectorAll('.gender_input')[0].checked) && (document.querySelectorAll('.gender_input')[1].checked))    
}

document.querySelector('.name_input').onchange = () => {
    errorInputShow(document.querySelector('.name_input'))
}
document.querySelector('.surname_input').onchange = () => {
    errorInputShow(document.querySelector('.surname_input'))
}
document.querySelectorAll('.gender_input')[0].onchange = () => {
    errorInputShow(document.querySelector('.gender_input'))
}
document.querySelectorAll('.gender_input')[1].onchange = () => {
    errorInputShow(document.querySelector('.gender_input'))
}
document.querySelector('.born_input').onchange = () => {
    errorInputShow(document.querySelector('.born_input'))
}

document.querySelectorAll('.die_input')[0].onchange = () => {
    errorInputShow(document.querySelector('.die_input'))
}

document.querySelectorAll('.photo_input')[0].onchange = () => {
    errorInputShow(document.querySelector('.photo_input'))
}

document.querySelectorAll('.die_input')[1].onchange = () => {
    if (!document.querySelectorAll('.die_input')[1].checked){
        document.querySelectorAll('.die_input')[0].disabled = false
    }
    else {
        document.querySelectorAll('.die_input')[0].disabled = true
    }
}

function logout() {
    localStorage.clear()
    window.location = 'http://localhost:3000/index.html'
}

document.body.onload = loadInfo()
async function loadInfo() {
    if (localStorage.getItem('id') == null) {
        window.location = 'http://localhost:3000/index.html'
    }
    else {
        let body = {
            reqnumber: 5,
            id : localStorage.getItem('id')
        }
        body = JSON.stringify(body)
        console.log(body);
        serverResponse = await sendRequest('http://localhost:3000/index.html', 'POST', body)
        console.log("Произошла отправка данных ответ сервера = ", serverResponse)
        document.querySelector(".name_input").value = serverResponse[0].name
        document.querySelector(".surname_input").value = serverResponse[0].surname
        if (serverResponse[0].gender == "male") {
            document.querySelectorAll('.gender_input')[0].checked = "yes"
        }
        if (serverResponse[0].gender == "female") {
            document.querySelectorAll('.gender_input')[1].checked = "yes"
        }
        document.querySelector('.born_input').value = serverResponse[0].born
        if (serverResponse[0].die != "1000-07-07") {
            document.querySelectorAll('.die_input')[1].checked = false
            document.querySelector(".die_input").value = serverResponse[0].die
            document.querySelectorAll('.die_input')[0].disabled = false
        }
        document.querySelector('.about_input').value = serverResponse[0].about
    }
}


async function mySave(){
    const selectedFile = document.querySelector('.photo_input').files[0]
    const preview = document.querySelector('.image')
    let reader = new FileReader()
    reader.onload = function () {
        let img = document.createElement("img")
        img.files = selectedFile
        preview.appendChild(img);
        img.src = reader.result
    }
    reader.readAsDataURL(selectedFile)

    let body = {
        reqnumber: 9,
        sendFile: selectedFile
    } 
    body = JSON.stringify(body) 
    console.log(body);
    
    serverResponse = await sendRequest('http://localhost:3000/index.html', 'POST', body)
    console.log("Произошла отправка данных, ответ сервера = ", serverResponse)
    /* let xhr = new XMLHttpRequest();
    xhr.open('POST', '/uploads/' + selectedFile.name, true)
    xhr.onreadystatechange = function () {
        
        if (xhr.readyState === 4) { 
            if (xhr.status === 200) {
                console.log('succses')
            } else {
                console.log('error')
            }
        }
    }
    xhr.send(JSON.stringify(selectedFile));  */
    
}

async function settingSave() {
    let gender = ""
    let die = ""
    const name = document.querySelector(".name_input")
    const surname  =  document.querySelector(".surname_input")
    const genderRadio  =  document.querySelector(".gender_input")
    const born  =  document.querySelector(".born_input")
    const dieDate  =  document.querySelector(".die_input")
    const about  =  document.querySelector(".about_input")
    const photo  =  document.querySelector(".photo_input")
    errorInputShow(name)
    errorInputShow(surname)
    errorInputShow(genderRadio)
    errorInputShow(born)
    errorInputShow(dieDate)
    errorInputShow(photo)
    
    if (validCheck(name) && validCheck(surname) && validCheck (genderRadio) && validCheck(born) && validCheck(dieDate) && validCheck(photo)) {
        if (document.querySelectorAll('.gender_input')[1].checked) {
            gender = "female"
        }
        else {
            gender = "male"
        }
        if (document.querySelectorAll('.die_input')[1].checked) {
            die = "1000-07-07"
        }   
        else {
            die = document.querySelectorAll('.die_input')[0].value
        }

        let body = {
            reqnumber: 4,
            name: name.value,
            surname: surname.value,
            gender: gender,
            born: born.value,
            die: die,
            id : localStorage.getItem('id'),
            about: about.value
        } 
        body = JSON.stringify(body)
        console.log(body);
        serverResponse = await sendRequest('http://localhost:3000/index.html', 'POST', body)
        console.log("Произошла отправка данных, ответ сервера = ", serverResponse)  
    }
    else {
        console.log("ОШибка")
    }

}
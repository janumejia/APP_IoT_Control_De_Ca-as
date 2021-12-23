window.onload = function() {
    sessionStorage.setItem("logged", "")
}

const loadData = async(string) => {
    const url = `http://localhost:3000/${string}`
    const data = await requestData(url)
    console.log(data)

}
const iniciarSesion = async(correo, password) => {
    const url = `http://localhost:3000/compare/${correo}/${password}`
    const data = await requestData(url)
    console.log(data)
    if (data.status == 'OK') {
        console.log('sesion iniciada')
        sessionStorage.setItem("logged", correo)
        sessionStorage.setItem("nombre_usuario", data.username)
        if (sessionStorage.logged != "") {
            window.location.href = "./src/pages/home.html"
        }
    } else {
        console.log('revise su usuario o su contraseña')
    }

}

document.querySelector('#login-user-btn').addEventListener("click", (e) => {
    const correo = document.querySelector('#login-user-input-correo').value
    const passwd = document.querySelector('#login-user-input-password').value
    iniciarSesion(correo, passwd)
})
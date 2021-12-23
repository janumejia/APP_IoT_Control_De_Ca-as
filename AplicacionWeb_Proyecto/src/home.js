window.onload = function() {

    if (sessionStorage.logged === undefined || sessionStorage.logged === "") {
        {

            window.location.href = "../../index.html"
        }
    }
}
document.querySelector('#btn-cerrar-sesion').addEventListener("click", (e) => {
    sessionStorage.setItem("logged", "")
    window.location.href = "../../index.html"

})

const bienvenida = document.querySelector('#h1-welcome')
bienvenida.innerHTML = `Bienvenido ${sessionStorage.nombre_usuario}`
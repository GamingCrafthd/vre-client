document.getElementById("submit").addEventListener('click', () => {
    const ip = document.getElementById("ip").value || "localhost:5000"
    const user = document.getElementById("username").value || "123456"
    const password = document.getElementById("password").value || "123"

    const req = httpGet(`http://${ip}/api/user/login/${user}/${password}`)
    const sessionId = req.res
    const status = req.status

    localStorage.setItem("sessionId", sessionId)
    localStorage.setItem("username", user)
    localStorage.setItem("ipv4", ip)
    window.history.pushState('index', 'VRE Client', 'index.html')
})

function httpGet(url) {
    var xmlHttp = new XMLHttpRequest()
    xmlHttp.open("GET", url, false)
    xmlHttp.send(null)
    return { res: xmlHttp.responseText, status: xmlHttp.status }
}
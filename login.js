doc.getById("submit").addEventListener('click', () => {
    const ip = doc.getById("ip").value
    const user = doc.getById("username").value
    const password = doc.getById("password").value

    const req = httpGet(`http://${ip}/api/user/login/${user}/${password}`)
    const sessionId = req.res

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
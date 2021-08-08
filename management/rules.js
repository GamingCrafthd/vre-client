JSON.parse(httpGet(`http://${localStorage.getItem("ipv4")}/api/rules/${localStorage.getItem("sessionId")}`).res).forEach(rule => {
    var opt = document.createElement('option')
    opt.value = rule
    opt.innerHTML = rule
    document.getElementById("delete").appendChild(opt)
})

document.getElementById("confirm").addEventListener('click', () => {
    httpGet(`http://${localStorage.getItem("ipv4")}/api/rules/add/${document.getElementById("name").value}/${document.getElementById("uri").value.replace(/\//g, "%2F")}/${localStorage.getItem("sessionId")}`)
    location.reload()
})

document.getElementById("delete_confirm").addEventListener('click', () => {
    httpGet(`http://${localStorage.getItem("ipv4")}/api/rules/${document.getElementById("delete").value}/delete/${localStorage.getItem("sessionId")}`)
    location.reload()
})

function httpGet(url) {
    var xmlHttp = new XMLHttpRequest()
    xmlHttp.open("GET", url, false)
    xmlHttp.send(null)
    return { res: xmlHttp.responseText, status: xmlHttp.status }
}
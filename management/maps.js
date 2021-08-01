const select = document.getElementById("select")
const maps = JSON.parse(httpGet(`http://${localStorage.getItem("ipv4")}/api/map/maps/${localStorage.getItem("sessionId")}`).res)
const routeTemplate = '<a href="#" class="list-group-item list-group-item-action" id="%id">%display</a>'

maps.forEach(map => {
    var opt = document.createElement('option')
    opt.value = map
    opt.innerHTML = map
    select.appendChild(opt)
});

document.getElementById("edit").hidden = true

document.getElementById("bn_edit").addEventListener("click", () =>  openEdit(document.getElementById("select").options[document.getElementById("select").selectedIndex].text))
document.getElementById("bn_create").addEventListener("click", () =>  createMap(document.getElementById("name").value))
document.getElementById("bn_edit_back").addEventListener("click", () =>  returnToMainWindow())

function createMap(map) {
    httpGet(`http://${localStorage.getItem("ipv4")}/api/map/create/${map}/${localStorage.getItem("sessionId")}`)
    alert("Karte erstellt.\nÖffne das Fenster erneut, um sie zu bearbeiten!")
    window.close()
}

function openEdit(map) {
    document.getElementById("edit").hidden = false
    document.getElementById("start").hidden = true

    document.getElementById("edit_name").innerText = map
    document.getElementById("edit_list").innerHTML = ""

    var routes = JSON.parse(httpGet(`http://${localStorage.getItem("ipv4")}/api/map/${map}/routes/${localStorage.getItem("sessionId")}`).res)
    routes.forEach(res => {
        const index = routes.indexOf(res)

        const line = res.split("_")[0]
        const course = res.split("_")[1]
        const firstStop = httpGet(`http://${localStorage.getItem("ipv4")}/api/map/${map}/${index}/firstStop/${localStorage.getItem("sessionId")}`).res
        const lastStop = httpGet(`http://${localStorage.getItem("ipv4")}/api/map/${map}/${index}/lastStop/${localStorage.getItem("sessionId")}`).res
        const startTime = httpGet(`http://${localStorage.getItem("ipv4")}/api/map/${map}/${index}/startTime/${localStorage.getItem("sessionId")}`).res
        const vehicles = httpGet(`http://${localStorage.getItem("ipv4")}/api/map/${map}/${index}/vehicles/${localStorage.getItem("sessionId")}`).res

        const display = line + "/" + course + " " + firstStop + " --> " + lastStop + " (" + startTime + ") [" + vehicles + "]"

        document.getElementById("edit_list").innerHTML += routeTemplate.replace("%id", index).replace("%display", display)
    })
}

function returnToMainWindow() {
    document.getElementById("edit").hidden = true
    document.getElementById("start").hidden = false
}

function httpGet(url) {
    var xmlHttp = new XMLHttpRequest()
    xmlHttp.open("GET", url, false)
    xmlHttp.send(null)
    return { res: xmlHttp.responseText, status: xmlHttp.status }
}
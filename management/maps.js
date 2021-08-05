const select = document.getElementById("select")
const maps = JSON.parse(httpGet(`http://${localStorage.getItem("ipv4")}/api/map/maps/${localStorage.getItem("sessionId")}`).res)
const routeTemplate = '<button href="#" class="list-group-item list-group-item-action" id="%id" onclick="%onclick">%display</button>'
const newRouteTemplate = '<button type="button" class="btn btn-primary" id="bn_edit_new_route_%map" onclick="%onclick">Neue Fahrt erstellen</button>'
const saveRouteTemplate = '<button type="button" class="btn btn-primary" id="bn_edit_route_save" onclick="%onclick">Speichern</button>'
const deleteRouteTemplate = '<button type="button" class="btn btn-danger" id ="bn_edit_delete_route" onclick="%onclick">Löschen</button>'

maps.forEach(map => {
    var opt = document.createElement('option')
    opt.value = map
    opt.innerHTML = map
    select.appendChild(opt)
})

document.getElementById("edit").hidden = true
document.getElementById("edit_route").hidden = true

document.getElementById("bn_edit").addEventListener("click", () =>  openEdit(document.getElementById("select").options[document.getElementById("select").selectedIndex].text))
document.getElementById("bn_create").addEventListener("click", () =>  createMap(document.getElementById("name").value))
document.getElementById("bn_edit_route_back").addEventListener("click", () =>  returnToMainWindow())

function createMap(map) {
    if(maps.indexOf(map) > -1) {
        alert("Diese Karte existiert bereits!")
        returnToMainWindow()
        return
    }

    httpGet(`http://${localStorage.getItem("ipv4")}/api/map/create/${map}/${localStorage.getItem("sessionId")}`)
    openEdit(map)
    document.getElementById("name").value = ""
}

function openEdit(map) {
    document.getElementById("edit").hidden = false
    document.getElementById("start").hidden = true
    document.getElementById("edit_route").hidden = true

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
        const weekly = httpGet(`http://${localStorage.getItem("ipv4")}/api/map/${map}/${index}/weekly/${localStorage.getItem("sessionId")}`).res

        const display = line + "/" + course + " " + firstStop + " --> " + lastStop + " (" + startTime + ") [" + vehicles + "]" + (weekly === "true" ? " (jede Woche)" : "")

        document.getElementById("edit_list").innerHTML += routeTemplate.replace("%id", `route_${index}`).replace("%display", display).replace("%onclick", `openRouteEdit('${map}', '${res}')`)
    })

    document.getElementById('edit_bn').innerHTML = ""

    document.getElementById('edit_bn').innerHTML += newRouteTemplate.replace('%map', map).replace("%onclick", `openRouteEdit('${map}', '')`)

    document.getElementById('edit_bn').innerHTML += '<button type="button" class="btn btn-secondary" id="bn_edit_back">Zurück</button>'
    document.getElementById("bn_edit_back").addEventListener("click", () =>  returnToMainWindow())
}

function openRouteEdit(map, route) {
    document.getElementById("edit").hidden = true
    document.getElementById("start").hidden = true
    document.getElementById("edit_route").hidden = false

    document.getElementById("edit_route_name").innerText = map

    const routes = JSON.parse(httpGet(`http://${localStorage.getItem("ipv4")}/api/map/${map}/routes/${localStorage.getItem("sessionId")}`).res)
    if(route !== "") {
        const index = routes.indexOf(route)

        const line = route.split("_")[0]
        const course = route.split("_")[1]
        const firstStop = httpGet(`http://${localStorage.getItem("ipv4")}/api/map/${map}/${index}/firstStop/${localStorage.getItem("sessionId")}`).res
        const lastStop = httpGet(`http://${localStorage.getItem("ipv4")}/api/map/${map}/${index}/lastStop/${localStorage.getItem("sessionId")}`).res
        const startTime = httpGet(`http://${localStorage.getItem("ipv4")}/api/map/${map}/${index}/startTime/${localStorage.getItem("sessionId")}`).res
        const vehicles = httpGet(`http://${localStorage.getItem("ipv4")}/api/map/${map}/${index}/vehicles/${localStorage.getItem("sessionId")}`).res
        const weekly = httpGet(`http://${localStorage.getItem("ipv4")}/api/map/${map}/${index}/weekly/${localStorage.getItem("sessionId")}`).res

        document.getElementById("edit_route_line").value = line
        document.getElementById("edit_route_course").value = course
        document.getElementById("edit_route_first_stop").value = firstStop
        document.getElementById("edit_route_last_stop").value = lastStop
        document.getElementById("edit_route_start_time").value = startTime
        document.getElementById("edit_route_vehicles").value = vehicles
        document.getElementById("edit_route_weekly").checked = (weekly === "true")

        document.getElementById("edit_route_delete_bn").innerHTML = deleteRouteTemplate.replace("%onclick", `deleteRoute('${map}', ${index})`)
    } else {
        document.getElementById("edit_route_line").value = ""
        document.getElementById("edit_route_course").value = ""
        document.getElementById("edit_route_first_stop").value = ""
        document.getElementById("edit_route_last_stop").value = ""
        document.getElementById("edit_route_start_time").value = ""
        document.getElementById("edit_route_vehicles").value = ""
        document.getElementById("edit_route_weekly").checked = false

        document.getElementById("edit_route_delete_bn").innerHTML = ""
    }

    document.getElementById("edit_route_bn").innerHTML = saveRouteTemplate.replace("%onclick", `saveRoute('${map}', ${route !== '' ? routes.indexOf(route) : -1})`)
}

function saveRoute(map, index) {
    const line = document.getElementById("edit_route_line").value
    const course = document.getElementById("edit_route_course").value
    const firstStop = document.getElementById("edit_route_first_stop").value
    const lastStop = document.getElementById("edit_route_last_stop").value
    const startTime = document.getElementById("edit_route_start_time").value
    const vehicles = document.getElementById("edit_route_vehicles").value
    const weekly = document.getElementById("edit_route_weekly").checked

    httpGet(`http://${localStorage.getItem("ipv4")}/api/map/${map}/${index >= 0 ? (index + "/edit") : "create"}/${line}/${course}/${firstStop}/${lastStop}/${startTime}/${vehicles}/${weekly}/${localStorage.getItem("sessionId")}`)

    openEdit(map)
}

function deleteRoute(map, index) {
    httpGet(`http://${localStorage.getItem("ipv4")}/api/map/${map}/delete/${index}/${localStorage.getItem("sessionId")}`)

    openEdit(map)
}

function returnToMainWindow() {
    location.reload()
}

function httpGet(url) {
    var xmlHttp = new XMLHttpRequest()
    xmlHttp.open("GET", url, false)
    xmlHttp.send(null)
    return { res: xmlHttp.responseText, status: xmlHttp.status }
}
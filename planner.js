const routeTemplate = '<div class="accordion-item" id="planner_routeSelect_accordition_%route"><h2 class="accordion-header" id="headingTwo"><button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseTwo" aria-expanded="false" aria-controls="collapseTwo">%route</button></h2><div id="collapseTwo" class="accordion-collapse collapse" aria-labelledby="headingTwo" data-bs-parent="#accordionExample"><div class="accordion-body">Start: %start<br>Ziel: %destination<br>Startzeit: %starttime<br>Endzeit: %endtime<br>Fahrzeuge: %vehicles<br>Wochentage: %daysofweek<br><br><select id="planner_routeSelect_accordition_%route_user"></select><div id="planner_routeSelect_accordition_%route_misc"></div></div></div></div>'

document.getElementById("planner_mapSelect_button").addEventListener("click", () => openMap(document.getElementById("planner_mapsSelect_select").value))
document.getElementById("planner_userSelect_button").addEventListener("click", () => openUser(document.getElementById("planner_userSelect_select").value))

document.getElementById("planner_routeSelect_backButton").addEventListener("click", () => resetLeft())
document.getElementById("planner_userRoutes_backButton").addEventListener("click", () => resetRight())

function load() {
    document.getElementById("planner_userSelect").hidden = false
    document.getElementById("planner_mapSelect").hidden = false
    document.getElementById("planner_userRoutes").hidden = true
    document.getElementById("planner_routeSelect").hidden = true

    document.getElementById("planner_mapsSelect_select").options.length = 0

    const maps = JSON.parse(httpGet(`http://${localStorage.getItem("ipv4")}/api/map/maps/${localStorage.getItem("sessionId")}`).res)
    maps.forEach(map => {
        const opt = document.createElement('option');
        opt.value = map
        opt.innerHTML = map
        document.getElementById("planner_mapsSelect_select").appendChild(opt)
    })

    document.getElementById("planner_userSelect_select").options.length = 0

    const users = JSON.parse(api.get("user").res)
    users.forEach(user => {
        const opt = document.createElement('option')
        opt.value = user
        opt.innerHTML = user
        document.getElementById("planner_userSelect_select").appendChild(opt)
    })
}

function openMap(map) {
    document.getElementById("planner_mapSelect").hidden = true
    document.getElementById("planner_routeSelect").hidden = false

    document.getElementById("planner_routeSelect_accordition").innerHTML = ""
    document.getElementById("planner_routeSelect_name").innerHTML = `<h1>${map}</h1>`

    const routes = JSON.parse(httpGet(`http://${localStorage.getItem("ipv4")}/api/map/${map}/routes/${localStorage.getItem("sessionId")}`).res)
    routes.forEach(route => {
        const firstStop = httpGet(`http://${localStorage.getItem("ipv4")}/api/map/${map}/${route}/firstStop/${localStorage.getItem("sessionId")}`).res
        const lastStop = httpGet(`http://${localStorage.getItem("ipv4")}/api/map/${map}/${route}/lastStop/${localStorage.getItem("sessionId")}`).res
        const startTime = httpGet(`http://${localStorage.getItem("ipv4")}/api/map/${map}/${route}/startTime/${localStorage.getItem("sessionId")}`).res
        const endTime = httpGet(`http://${localStorage.getItem("ipv4")}/api/map/${map}/${route}/endTime/${localStorage.getItem("sessionId")}`).res
        const vehicles = httpGet(`http://${localStorage.getItem("ipv4")}/api/map/${map}/${route}/vehicles/${localStorage.getItem("sessionId")}`).res

        const daysOfWeekRaw = httpGet(`http://${localStorage.getItem("ipv4")}/api/map/${map}/${route}/daysOfWeek/${localStorage.getItem("sessionId")}`).res

        document.getElementById("planner_routeSelect_accordition").innerHTML += routeTemplate.replaceAll("%route", route).replaceAll("%start", firstStop).replaceAll("%destination", lastStop).replaceAll("%starttime", startTime).replaceAll("%endtime", endTime).replaceAll("%vehicles", vehicles).replaceAll("%daysofweek", daysOfWeekRaw)
    })
}

function openUser(user) {
    document.getElementById("planner_userSelect").hidden = true
    document.getElementById("planner_userRoutes").hidden = false

    document.getElementById("planner_userRoutes_accordition").innerHTML = ""
    document.getElementById("planner_userRoutes_name").innerHTML = `<h1>${user}</h1>`
}

function resetLeft() {
    document.getElementById("planner_mapSelect").hidden = false
    document.getElementById("planner_routeSelect").hidden = true
}

function resetRight() {
    document.getElementById("planner_userSelect").hidden = false
    document.getElementById("planner_userRoutes").hidden = true
}
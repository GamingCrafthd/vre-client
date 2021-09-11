const routeTemplate = '<div class="accordion-item" id="planner_routeSelect_accordition_%route"><h2 class="accordion-header" id="headingTwo"><button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseTwo" aria-expanded="false" aria-controls="collapseTwo">%route</button></h2><div id="collapseTwo" class="accordion-collapse collapse" aria-labelledby="headingTwo" data-bs-parent="#accordionExample"><div class="accordion-body">Start: %start<br>Ziel: %destination<br>Startzeit: %starttime<br>Endzeit: %endtime<br>Fahrzeuge: %vehicles<br>Wochentage: %daysofweek<br><br><select id="planner_routeSelect_accordition_%route_user"></select></div></div></div>'

document.getElementById("planner_mapSelect_button").addEventListener("click", () => openMap(document.getElementById("planner_mapsSelect_select").value))

function loadMaps() {
    document.getElementById("planner_mapsSelect_select").options.length = 0

    const maps = JSON.parse(httpGet(`http://${localStorage.getItem("ipv4")}/api/map/maps/${localStorage.getItem("sessionId")}`).res)
    maps.forEach(map => {
        const opt = document.createElement('option');
        opt.value = map
        opt.innerHTML = map
        document.getElementById("planner_mapsSelect_select").appendChild(opt)
    })
}

function openMap(map) {
    document.getElementById("planner_mapSelect").hidden = true
    document.getElementById("planner_routeSelect").hidden = false

    document.getElementById("planner_routeSelect_accordition").innerHTML = ""
    document.getElementById("planner_routeSelect_name").innerHTML = `<h1>${map}</h1>`
    document.getElementById("planner_routeSelect_backButton").addEventListener("click", () => reset())
}

function reset() {
    document.getElementById("planner_mapSelect").hidden = false
    document.getElementById("planner_routeSelect").hidden = true
}
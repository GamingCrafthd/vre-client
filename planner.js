document.getElementById("planner_routeSelect").hidden = true
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

    document.getElementById("planner_routeSelect_name").innerHTML = `<h1>${map}</h1>`
    document.getElementById("planner_routeSelect_backButton").addEventListener("click", () => reset())
}

function reset() {
    document.getElementById("planner_mapSelect").hidden = false
    document.getElementById("planner_routeSelect").hidden = true
}
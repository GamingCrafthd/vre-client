const routeTemplate = '<div class="accordion-item" id="planner_%section_accordition_%route"><h2 class="accordion-header" id="heading%section%index"><button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapse%section%index" aria-expanded="false" aria-controls="collapse%section%index">%route</button></h2><div id="collapse%section%index" class="accordion-collapse collapse" aria-labelledby="heading%section%index" data-bs-parent="#accordionExample"><div class="accordion-body">Start: %firststop<br>Ziel: %destination<br>Startzeit: %starttime<br>Endzeit: %endtime<br>Fahrzeuge: %vehicles<br>Wochentage: %daysofweek<br><br><button class="btn btn-primary" type="button" id="planner_%section_accordition_%route_assign">Fahrer zuweisen</button><button class="btn btn-danger" type="button" id="planner_%section_accordition_%route_remove">Zuweisung löschen</button><div id="planner_%section_accordition_%route_misc"></div></div></div></div>'

document.getElementById("planner_dayOfWeek").addEventListener("change", () => {
    if (document.getElementById("planner_mapSelect").hidden) {
        openMap(document.getElementById("planner_routeSelect_name").innerHTML.replace("<h1>", "").replace("</h1>", ""))
    }

    if (document.getElementById("planner_userSelect").hidden) {
        openUser(document.getElementById("planner_userRoutes_name").innerHTML.replace("<h1>", "").replace("</h1>", ""))
    }
})

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
        const index = routes.indexOf(route)
        const daysOfWeekRaw = httpGet(`http://${localStorage.getItem("ipv4")}/api/map/${map}/${index}/daysOfWeek/${localStorage.getItem("sessionId")}`).res

        if (daysOfWeekRaw.toString().includes(document.getElementById("planner_dayOfWeek").value)) {
            const firstStop = api.map(`${map}/${index}/firstStop`).res
            const lastStop = api.map(`${map}/${index}/lastStop`).res
            const startTime = api.map(`${map}/${index}/startTime`).res
            const endTime = api.map(`${map}/${index}/endTime`).res
            const vehicles = api.map(`${map}/${index}/vehicles`).res

            const daysOfWeek = daysOfWeekRaw.toString().replace("1", "Mo ").replace("2", "Di ").replace("3", "Mi ").replace("4", "Do ").replace("5", "Fr ").replace("6", "Sa ").replace("7", "So ")

            const assignee = api.map(`${map}/${index}/assignedUser`).res

            document.getElementById("planner_routeSelect_accordition").innerHTML += routeTemplate.replaceAll("%route", route).replaceAll("%firststop", firstStop).replaceAll("%destination", lastStop).replaceAll("%starttime", startTime).replaceAll("%endtime", endTime).replaceAll("%vehicles", vehicles).replaceAll("%daysofweek", daysOfWeek).replaceAll("%index", index).replaceAll("%section", "routeSelect")

            document.getElementById(`planner_routeSelect_accordition_${route}_remove`).hidden = true

            if (assignee !== "NONE") {
                document.getElementById(`planner_routeSelect_accordition_${route}_assign`).disabled = true
                document.getElementById(`planner_routeSelect_accordition_${route}_misc`).innerHTML = `Zugewiesen an ${assignee}`
            } else {
                document.getElementById(`planner_routeSelect_accordition_${route}_misc`).innerHTML = "frei"

                document.getElementById(`planner_routeSelect_accordition_${route}_assign`).addEventListener("click", () => {
                    addRoute(`${map}::${route}::${document.getElementById("planner_dayOfWeek").value}`, document.getElementById("planner_userRoutes_name").innerHTML.replace("<h1>", "").replace("</h1>", ""))
                    openMap(map)
                    openUser(document.getElementById("planner_userRoutes_name").innerHTML.replace("<h1>", "").replace("</h1>", ""))
                })
            }
        }
    })
}

function openUser(user) {
    document.getElementById("planner_userSelect").hidden = true
    document.getElementById("planner_userRoutes").hidden = false

    document.getElementById("planner_userRoutes_accordition").innerHTML = ""
    document.getElementById("planner_userRoutes_name").innerHTML = `<h1>${user}</h1>`

    const routes = api.user(`${user}/routes`).res.split(",")
    routes.forEach(routeRaw => {
        const dayOfWeekRaw = routeRaw.split("::")[2]

        if (dayOfWeekRaw === document.getElementById("planner_dayOfWeek").value) {
            const map = routeRaw.split("::")[0]
            const route = routeRaw.split("::")[1]

            const index = JSON.parse(api.map(`${map}/routes`).res).indexOf(route)

            const firstStop = api.map(`${map}/${index}/firstStop`).res
            const lastStop = api.map(`${map}/${index}/lastStop`).res
            const startTime = api.map(`${map}/${index}/startTime`).res
            const endTime = api.map(`${map}/${index}/endTime`).res
            const vehicles = api.map(`${map}/${index}/vehicles`).res

            const dayOfWeek = dayOfWeekRaw.toString().replace("1", "Mo ").replace("2", "Di ").replace("3", "Mi ").replace("4", "Do ").replace("5", "Fr ").replace("6", "Sa ").replace("7", "So ")

            document.getElementById("planner_userRoutes_accordition").innerHTML += routeTemplate.replaceAll("%route", route).replaceAll("%firststop", firstStop).replaceAll("%destination", lastStop).replaceAll("%starttime", startTime).replaceAll("%endtime", endTime).replaceAll("%vehicles", vehicles).replaceAll("%daysofweek", dayOfWeek).replaceAll("%index", index).replaceAll("%section", "userRoutes")

            document.getElementById(`planner_userRoutes_accordition_${route}_assign`).hidden = true
            document.getElementById(`planner_userRoutes_accordition_${route}_remove`).addEventListener("click", () => {
                deleteRoute(routeRaw, user)
                openUser(user)
                openMap(map)
            })
        }
    })
}

function deleteRoute(route, user) {
    let routes = api.user(`${user}/routes`).res
    routes = routes.replace(`${route}${routes.includes(route + ",") ? "," : ""}`, "")
    api.user(`${document.getElementById("planner_userRoutes_name").innerHTML.replace("<h1>", "").replace("</h1>", "")}/set/routes/${routes === "" ? "NONE" : routes}`)
}

function addRoute(route, user) {
    let routes = api.user(`${user}/routes`).res
    routes += `${routes === "" ? "" : ","}${route}`
    api.user(`${document.getElementById("planner_userRoutes_name").innerHTML.replace("<h1>", "").replace("</h1>", "")}/set/routes/${routes}`)
}

function resetLeft() {
    document.getElementById("planner_mapSelect").hidden = false
    document.getElementById("planner_routeSelect").hidden = true
}

function resetRight() {
    document.getElementById("planner_userSelect").hidden = false
    document.getElementById("planner_userRoutes").hidden = true
}
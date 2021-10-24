const routeTemplate1 = '<div class="accordion-item"><h2 class="accordion-header" id="heading%index"><button class="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#collapse%index" aria-expanded="true" aria-controls="collapse%index">%map: %route</button></h2><div id="collapse%index" class="accordion-collapse collapse show" aria-labelledby="heading%index" data-bs-parent="#routes_accordition"><div class="accordion-body">Start: %firststop<br>Ziel: %laststop<br>Startzeit: %starttime<br>Endzeit: %endtime<br>Fahrzeuge: %vehicles<br><br><br><button type="button" class="btn btn-success" id="routes_accordition_%index_button">Fahrt abschließen</button></div></div></div>'
document.getElementById("routes_dayOfWeek").value = new Date().getDay() === 0 ? 7 : new Date().getDay()
document.getElementById("routes_dayOfWeek").addEventListener("change", () => loadRoutes())

function loadRoutes() {
    const routes = api.user(`${localStorage.getItem("username")}/routes`).res.split(",")
    const selectedDay = document.getElementById("routes_dayOfWeek").value

    document.getElementById("routes_accordition").innerHTML = ""
    document.getElementById("routes_empty").innerHTML = ""

    routes.forEach(routeRaw => {
        const data = routeRaw.split("::")

        const map = data[0]

        if (map !== "") {
            const route = data[1]
            const dayOfWeek = parseInt(data[2])
            const mapRoutes = JSON.parse(api.map(`${map}/routes`).res)

            if (dayOfWeek == selectedDay) {
                let index = mapRoutes.indexOf(route);

                const firstStop = api.map(`${map}/${index}/firstStop`).res
                const lastStop = api.map(`${map}/${index}/lastStop`).res
                const startTime = api.map(`${map}/${index}/startTime`).res
                const endTime = api.map(`${map}/${index}/endTime`).res
                const vehicles = api.map(`${map}/${index}/vehicles`).res

                document.getElementById("routes_accordition").innerHTML += routeTemplate1.replaceAll("%index", index).replaceAll("%route", route).replaceAll("%map", map).replaceAll("%firststop", firstStop).replaceAll("%laststop", lastStop).replaceAll("%starttime", startTime).replaceAll("%endtime", endTime).replaceAll("%vehicles", vehicles)
                document.getElementById(`routes_accordition_${index}_button`).addEventListener("click", () => {
                    deleteRoute(routeRaw, localStorage.getItem("username"))
                    loadRoutes()
                })
            }
        }
    })

    if (document.getElementById("routes_accordition").innerHTML === "") {
        document.getElementById("routes_empty").innerHTML = "Keine Fahrten"
    }
}

function deleteRoute(route, user) {
    let routes = api.user(`${user}/routes`).res
    routes = routes.replace(route, "").replace(",,", ",")
    if (routes.endsWith(",")) routes = routes.slice(0, routes.length - 1)
    if (routes.startsWith(",")) routes = routes.slice(1)
    api.user(`${localStorage.getItem("username")}/set/routes/${routes === "" ? "NONE" : routes}`)
}
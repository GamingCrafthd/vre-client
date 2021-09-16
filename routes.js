function loadRoutes() {
    const routes = api.user(`${localStorage.getItem("username")}/routes`).res.split(",")
    const currentDay = new Date().getDay()

    document.getElementById("routes_dayOfWeek").value = currentDay

    routes.forEach(routeRaw => {
        const data = routeRaw.split("::")

        const map = data[0]
        const route = data[1]
        const dayOfWeek = parseInt(data[2])

        if (dayOfWeek === currentDay) {

        }
    })
}
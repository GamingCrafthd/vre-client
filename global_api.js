const doc = {
    getById: id => {
        return document.getElementById(id)
    },

    remove: id => {
        doc.getById(id).parentNode.removeChild(document.getElementById(id))
    }
}

const http = {
    get: uri => {
        console.log("Global API » Connecting to " + uri)

        const xmlHttp = new XMLHttpRequest();
        xmlHttp.open("GET", uri, false)
        xmlHttp.send(null)
        return { res: xmlHttp.responseText, status: xmlHttp.status }
    }
}

const api = {
    get: uri => {
        return http.get(`http://${localStorage.getItem("ipv4")}/api/${uri}/${localStorage.getItem("sessionId")}`)
    },

    user: uri => {
        return api.get(`user/${uri}`)
    },

    vehicles: uri => {
        return api.get(`vehicles/${uri}`)
    },

    map: uri => {
        return api.get(`map/${uri}`)
    }
}
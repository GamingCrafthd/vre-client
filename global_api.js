const doc = {
    getById: id => {
        return document.getElementById(id)
    },

    remove: id => {
        doc.getById(id).parentNode.removeChild(doc().getById(id))
    }
}

const http = {
    get: uri => {
        var xmlHttp = new XMLHttpRequest()
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
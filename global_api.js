const { app } = require("electron")

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

let log = []

const logger = {
    debug: message => {
        log.push({ type: "debug", message: message })
        return message
    },

    info: message => {
        log.push({ type: "info", message: message })
        return message
    },

    warn: message => {
        log.push({ type: "warning", message: message })
        return message
    },

    error: message => {
        log.push({ type: "error", message: message })
        return message
    },

    fatal: (message, cb) => {
        log.push({ type: "fatal", message: message })
        cb()
        return message
    }
}
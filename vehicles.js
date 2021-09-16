const { appendFile } = require("original-fs")

const specTemplate = "<p class=\"spec\">%key: %value</p>"
const vehicleTemplate = "<div id=\"%id\" class=\"vehicle\"><img src=\"vehicles/%img.png\" alt=\"\"><p class=\"type\">%id - %manufacturer %type</p>%specs</div>"

const vehicleList = JSON.parse(httpGet(`http://${localStorage.getItem("ipv4")}/api/vehicles/${localStorage.getItem("sessionId")}`).res)
const allowedVehicles = httpGet(`http://${localStorage.getItem("ipv4")}/api/user/${localStorage.getItem("username")}/types/${localStorage.getItem("sessionId")}`).res.split(",")

let firstTime = true;

const imageFiles = [{
    file: "B80D",
    types: ["B80D", "B80D-M"]
}, {
    file: "GT8SU",
    types: ["GT8SU", "GT8SU-M"]
}, {
    file: "NM68CDS",
    types: ["N6S", "N6C", "N6D", "N8S", "N8C", "N8D"]
}, {
    file: "GT8S",
    types: ["GT8S", "GT8SSP"]
}, {
    file: "GT8",
    types: ["GT8"]
}]

async function updateVehicles() {
    doc.getById("vehicles2").hidden = true
    if (firstTime) doc.getById("vehicles2").innerHTML = ""
    vehicleList.forEach(vehicleId => {
        if (firstTime) createVehicle(vehicleId)
        if (!firstTime) document.getElementById(vehicleId).hidden = false;
    })
    doc.getById("vehicles2").hidden = false
    firstTime = false;
}

async function updateVehiclesByOwnedOnly(ownedOnly) {
    doc.getById("vehicles2").hidden = true
    vehicleList.forEach(vehicleId => {
        document.getElementById(vehicleId).hidden = true
        if (ownedOnly) {
            const type = httpGet(`http://${localStorage.getItem("ipv4")}/api/vehicles/${vehicleId}/type/${localStorage.getItem("sessionId")}`).res
            allowedVehicles.forEach(vehicle => {
                if (vehicle == type) document.getElementById(vehicleId).hidden = false
            })
        } else {
            document.getElementById(vehicleId).hidden = false
        }
    })
    doc.getById("vehicles2").hidden = false
}

async function updateVehiclesWithSearch(ownedOnly, searchedVehicleId) {
    doc.getById("vehicles2").hidden = true
    if (searchedVehicleId === "LittlePixelJumper") {
        launchLittlePixelJumper()
        return
    }


    vehicleList.forEach(vehicleId => {
        document.getElementById(vehicleId).hidden = true
        if (("" + vehicleId).match(new RegExp(searchedVehicleId, 'g'))) {
            if (ownedOnly) {
                const type = httpGet(`http://${localStorage.getItem("ipv4")}/api/vehicles/${vehicleId}/type/${localStorage.getItem("sessionId")}`).res
                allowedVehicles.forEach(vehicle => {
                    if (vehicle === type) document.getElementById(vehicleId).hidden = false
                })
            } else {
                document.getElementById(vehicleId).hidden = false
            }
        }
    })
    doc.getById("vehicles2").hidden = false
}

function createVehicle(vehicleId) {
    const manufacturer = httpGet(`http://${localStorage.getItem("ipv4")}/api/vehicles/${vehicleId}/manufacturer/${localStorage.getItem("sessionId")}`).res
    const type = httpGet(`http://${localStorage.getItem("ipv4")}/api/vehicles/${vehicleId}/type/${localStorage.getItem("sessionId")}`).res
    const specs = httpGet(`http://${localStorage.getItem("ipv4")}/api/vehicles/${vehicleId}/specs/${localStorage.getItem("sessionId")}`).res

    let specsText = ""

    if (specs === "NONE") {
        specsText = ""
    } else {
        specs.split("=").forEach(spec => {
            specsText += specTemplate.replace("%key", spec.split("=")[0]).replace("%value", spec.split("=")[1]).replace("undefined", "kein(e)")
        })
    }



    let image = "default"
    imageFiles.forEach(img => {
        if (img.types.includes(type)) image = img.file
    })

    doc.getById("vehicles2").innerHTML += vehicleTemplate.replace("%manufacturer", manufacturer).replace("%type", type).replace("%id", vehicleId).replace("%id", vehicleId).replace("%specs", specsText).replace("%img", image)
}
const select = document.getElementById("select")
const vehicles = JSON.parse(httpGet(`http://${localStorage.getItem("ipv4")}/api/vehicles/${localStorage.getItem("sessionId")}`).res)
const specTemplate = '<div id="%id"><input id="key_%id"><input id="value_%id"><button class="btn btn-danger" id="bn_delete_%id">Löschen</button><br></div>'
const newSpecTemplate = '<button type="button" class="btn btn-primary" id="bn_edit_new_spec_%vehicle" onclick="addSpec()">Neue Spezifikation hinzufügen</button>'

document.remove = x => { document.getElementById(x).parentNode.removeChild(document.getElementById(x)) }

vehicles.forEach(vehicle => {
    var opt = document.createElement('option')
    opt.value = vehicle
    opt.innerHTML = vehicle
    select.appendChild(opt)
})

document.getElementById("bn_edit").addEventListener("click", () => openEdit(document.getElementById("select").options[document.getElementById("select").selectedIndex].text))
document.getElementById("bn_delete").addEventListener("click", () => deleteVehicle(document.getElementById("select").options[document.getElementById("select").selectedIndex].text))
document.getElementById("bn_create").addEventListener("click", () => createVehicle(document.getElementById("name").value))

document.getElementById("edit").hidden = true

function createVehicle(vehicle) {
    httpGet(`http://${localStorage.getItem("ipv4")}/api/vehicles/create/${vehicle}/${localStorage.getItem("sessionId")}`)
    openEdit(vehicle)
}

function deleteVehicle(vehicle) {
    httpGet(`http://${localStorage.getItem("ipv4")}/api/vehicles/delete/${vehicle}/${localStorage.getItem("sessionId")}`)
    location.reload()
}

function openEdit(vehicle) {
    updateCurrentVehicle(vehicle)

    document.getElementById("start").hidden = true
    document.getElementById("edit").hidden = false

    document.getElementById("edit_name").innerText = vehicle

    const manufacturer = httpGet(`http://${localStorage.getItem("ipv4")}/api/vehicles/${vehicle}/manufacturer/${localStorage.getItem("sessionId")}`).res
    const type = httpGet(`http://${localStorage.getItem("ipv4")}/api/vehicles/${vehicle}/type/${localStorage.getItem("sessionId")}`).res

    document.getElementById("manufacturer").value = manufacturer
    document.getElementById("type").value = type
    document.getElementById('edit_bn').innerHTML = ""
    document.getElementById('edit_bn').innerHTML += newSpecTemplate.replace('%vehicle', vehicle)
    document.getElementById('edit_bn').innerHTML += `<br><br><button type="button" class="btn btn-primary" id="bn_edit_save" onclick="saveVehicle('${vehicle}')">Speichern</button>`
    document.getElementById('edit_bn').innerHTML += '<br><button type="button" class="btn btn-secondary" id="bn_edit_back">Zurück</button>'
    document.getElementById("bn_edit_back").addEventListener("click", () => returnToMainWindow())
}

function saveVehicle(vehicle) {
    var get = `http://${localStorage.getItem("ipv4")}/api/vehicles/${vehicle}/edit/${document.getElementById("manufacturer").value}/${document.getElementById("type").value}/${getSpecsFormatted()}/${localStorage.getItem("sessionId")}`
    httpGet(get)
    returnToMainWindow()
}

function returnToMainWindow() {
    location.reload()
}

function httpGet(url) {
    var xmlHttp = new XMLHttpRequest()
    xmlHttp.open("GET", url, false)
    xmlHttp.send(null)
    return { res: xmlHttp.responseText, status: xmlHttp.status }
}
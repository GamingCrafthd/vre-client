const select = document.getElementById("select")
const vehicles = JSON.parse(httpGet(`http://${localStorage.getItem("ipv4")}/api/vehicles/${localStorage.getItem("sessionId")}`).res)
const specTemplate = '<div id="%id"><input id="key_%id"><input id="value_%id"><button class="btn btn-danger" id="bn_delete_%id">Löschen</button><br></div>'
const newSpecTemplate = '<button type="button" class="btn btn-primary" id="bn_edit_new_spec_%vehicle" onclick="%onclick">Neue Spezifikation hinzufügen</button>'

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
    document.getElementById("start").hidden = true
    document.getElementById("edit").hidden = false

    document.getElementById("edit_name").innerText = vehicle
    document.getElementById("edit_specs").innerHTML = ""

    const specs = httpGet(`http://${localStorage.getItem("ipv4")}/api/vehicles/${vehicle}/specs/${localStorage.getItem("sessionId")}`).res.split(";")
    specs.forEach(() => {
        const id = getIndex()
        document.getElementById("edit_specs").innerHTML += specTemplate.replace(/%id/g, id)
        document.getElementById(`bn_delte_${id}`).addEventListener("click", () => deleteSpec(id))
    })
    updateSpecs(vehicle)

    const manufacturer = httpGet(`http://${localStorage.getItem("ipv4")}/api/vehicles/${vehicle}/manufacturer/${localStorage.getItem("sessionId")}`).res
    const type = httpGet(`http://${localStorage.getItem("ipv4")}/api/vehicles/${vehicle}/type/${localStorage.getItem("sessionId")}`).res

    document.getElementById("manufacturer").value = manufacturer
    document.getElementById("type").value = type
    document.getElementById('edit_bn').innerHTML = ""
    document.getElementById('edit_bn').innerHTML += newSpecTemplate.replace('%vehicle', vehicle).replace("%onclick", `addSpec('${vehicle}')`)
    document.getElementById('edit_bn').innerHTML += '<br><br><button type="button" class="btn btn-primary" id="bn_edit_save">Speichern</button>'
    document.getElementById('edit_bn').innerHTML += '<br><button type="button" class="btn btn-secondary" id="bn_edit_back">Zurück</button>'
    document.getElementById("bn_edit_back").addEventListener("click", () => returnToMainWindow())
}

function updateSpecs(vehicle) {
    let index = 0
    const specs = httpGet(`http://${localStorage.getItem("ipv4")}/api/vehicles/${vehicle}/specs/${localStorage.getItem("sessionId")}`).res.split(";")
    specs.forEach(spec => {
        document.getElementById(`key_${index}`).value = spec.split("=")[0]
        document.getElementById(`value_${index}`).value = spec.split("=")[1]
        index++
    })
}

function addSpec(vehicle) {
    document.getElementById('edit_specs').innerHTML += specTemplate.replace(/%id/g, getIndex()).replace("%onclick", `deleteSpec(${getIndex()})`)
    updateSpecs(vehicle)
}

function deleteSpec(index) {
    document.remove(index)
    let i = 0
    document.getElementById("edit_specs").childNodes.forEach(node => {
        node.childNodes.forEach(childNode => {
            childNode.id = childNode.id.replace(node.id, i)
            if(childNode.onclick) {
                childNode.removeEventListener("click", () => deleteSpec(node.id))
                childNode.addEventListener("click", () => deleteSpec(i))
            }
            /*if(childNode.id == `key_${node.id}`) childNode.id = `key_${i}`
            if(childNode.id == `value_${node.id}`) childNode.id = `value_${i}`
            if(childNode.id == `bn_delete_${node.id}`) childNode.id = `bn_delete_${i}`
            if(childNode.onclick) childNode.onclick = () => deleteSpec(i)*/
        })

        node.id = i
        i++
    })
}

function getIndex() {
    return document.getElementById('edit_specs').childNodes.length
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
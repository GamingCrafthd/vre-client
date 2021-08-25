const select = doc.getById("select")
const vehicles = JSON.parse(api.get("vehicles").res)
const specTemplate = '<div id="%id"><input id="key_%id"><input id="value_%id"><button class="btn btn-danger" id="bn_delete_%id">Löschen</button><br></div>'
const newSpecTemplate = '<button type="button" class="btn btn-primary" id="bn_edit_new_spec_%vehicle" onclick="addSpec()">Neue Spezifikation hinzufügen</button>'

document.remove = x => { doc.getById(x).parentNode.removeChild(doc.getById(x)) }

vehicles.forEach(vehicle => {
    const opt = document.createElement('option');
    opt.value = vehicle
    opt.innerHTML = vehicle
    select.appendChild(opt)
})

doc.getById("bn_edit").addEventListener("click", () => openEdit(doc.getById("select").options[doc.getById("select").selectedIndex].text))
doc.getById("bn_delete").addEventListener("click", () => deleteVehicle(doc.getById("select").options[doc.getById("select").selectedIndex].text))
doc.getById("bn_create").addEventListener("click", () => createVehicle(doc.getById("name").value))

doc.getById("edit").hidden = true

function createVehicle(vehicle) {
    api.vehicles(`create/${vehicle}`)
    openEdit(vehicle)
}

function deleteVehicle(vehicle) {
    api.vehicles(`delete/${vehicle}`)
    location.reload()
}

function openEdit(vehicle) {
    updateCurrentVehicle(vehicle)

    doc.getById("start").hidden = true
    doc.getById("edit").hidden = false

    doc.getById("edit_name").innerText = vehicle

    const manufacturer = api.vehicles(`${vehicle}/manufacturer`).res
    const type = api.vehicles(`${vehicle}/type`).res

    doc.getById("manufacturer").value = manufacturer
    doc.getById("type").value = type
    doc.getById('edit_bn').innerHTML = ""
    doc.getById('edit_bn').innerHTML += newSpecTemplate.replace('%vehicle', vehicle)
    doc.getById('edit_bn').innerHTML += `<br><br><button type="button" class="btn btn-primary" id="bn_edit_save" onclick="saveVehicle('${vehicle}')">Speichern</button>`
    doc.getById('edit_bn').innerHTML += '<br><button type="button" class="btn btn-secondary" id="bn_edit_back">Zurück</button>'
    doc.getById("bn_edit_back").addEventListener("click", () => returnToMainWindow())
}

function saveVehicle(vehicle) {
    api.vehicles(`${vehicle}/edit/${doc.getById("manufacturer").value}/${doc.getById("type").value}/${getSpecsFormatted()}`)
    returnToMainWindow()
}

function returnToMainWindow() {
    location.reload()
}
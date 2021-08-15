const { clipboard } = require('electron')

const users = JSON.parse(api.get("user").res)
const roles = ["Fahrschüler", "Fahrer", "Fahrzeugbeauftragter", "Fahrlehrer", "Disponent", "Administrator", "Entwickler"]

doc.getById("edit").hidden = true

users.forEach(user => {
    var opt = document.createElement("option")
    opt.value = user
    opt.innerHTML = user
    doc.getById("select").appendChild(opt)
});

roles.forEach(role => {
    var opt = document.createElement("option")
    opt.value = role
    opt.innerHTML = role
    doc.getById("role").appendChild(opt)
})

roles.forEach(role => {
    var opt = document.createElement("option")
    opt.value = role
    opt.innerHTML = role
    doc.getById("edit_role").appendChild(opt)
})

doc.getById("bn_delete").addEventListener("click", () => {
    api.user(`${doc.getById("select").options[doc.getById("select").selectedIndex].text}/delete`)
    location.reload()
})

doc.getById("bn_create").addEventListener("click", () => {
    api.user(`register/${doc.getById("name").value}/${doc.getById("role").selectedIndex}`)
    location.reload()
})

doc.getById("bn_edit").addEventListener("click", () => openEdit(doc.getById("select").options[doc.getById("select").selectedIndex].text))

function openEdit(user) {
    doc.getById("start").hidden = true
    doc.getById("edit").hidden = false

    doc.getById("edit_name").innerHTML = user

    const display = api.user(`${user}/display`).res
    const role = api.user(`${user}/role`).res
    const types = api.user(`${user}/types`).res
    const seenRules = api.user(`${user}/seenRules`).res

    doc.getById("edit_display").value = display
    doc.getById("edit_role").selectedIndex = parseInt(role)
    doc.getById("edit_types").value = types
    doc.getById("edit_rules").innerHTML = seenRules

    doc.getById("edit_bn").innerHTML += `<button class='btn btn-primary' onclick='saveUser(${user})'>Speichern</button>`
    doc.getById("edit_bn").innerHTML += "<button class='btn btn-secondary' onclick='returnToMainWindow()'>Zurück</button>"

    doc.getById("bn_edit_resetpswd").addEventListener("click", () => {
        alert("Passwort in Zwischenablage kopiert!")
        clipboard.writeText(user + " : " + api.user(`${user}/resetpassword`).res)
    })
}

function saveUser(user) {
    api.user(`${user}/set/role/${doc.getById("edit_role").selectedIndex}`)
    api.user(`${user}/set/types/${doc.getById("edit_types").value}`)
    api.user(`${user}/set/display/${doc.getById("edit_display").value}`)
    returnToMainWindow()
}

function returnToMainWindow() {
    location.reload()
}
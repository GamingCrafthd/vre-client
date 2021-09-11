const { ipcRenderer, shell } = require('electron')

ipcRenderer.send('resize', { width: 1280, height: 720 })

console.log(
    `%cHey! Was machst du da?\nWenn du dich hier auskennst, helf' doch mit!`,
    `color: orange; font-weight: bold; font-size: 2rem;`
)

doc.getById("user-text-2").innerText = doc.getById("user-text-2").innerText.replace("%user", api.user(`${localStorage.getItem("username")}/display`).res)
const req = httpGet(`http://${localStorage.getItem("ipv4")}/api/user/${localStorage.getItem("username")}/role/${localStorage.getItem("sessionId")}`);
if (req.status !== 200) req.res = -1;

let role = "";
switch (req.res) {
    case "-1":
        role = "Interner Fehler"
        break

    case "0":
        role = "Fahrschüler"
        break

    case "1":
        role = "Fahrer"
        break

    case "2":
        role = "Fuhrparkbeauftragter"
        break

    case "3":
        role = "Fahrlehrer"
        break

    case "4":
        role = "Disponent"
        break

    case "5":
        role = "Administrator"
        break

    case "6":
        role = "Entwickler"
        break
}

doc.getById("user-text").innerText = doc.getById("user-text").innerText.replace("%role", role)

const viewports = [{
        viewport: "home",
        onopen: () => {
            const welcomes = ["Willkommen!", "Moin!", "Guten Morgen!", "Guten Tag!", "Guten Abend!", "Bonjour!", "Hi!", "Hallo!", "Servus!", "Moinsen!", "Grüzli!", "Hola!", "Grüß Gott!", "Grüße Gemüse!"];
            doc.getById("welcome").innerText = welcomes[Math.floor(Math.random() * welcomes.length)]
        }
    },
    {
        viewport: "vehicles",
        onopen: () => {
            updateVehicles()

            doc.getById("btn_confirm").addEventListener("click", () => {
                doc.getById("vehicles2").innerHTML = "";

                if (doc.getById("id_cb").checked) {
                    updateVehiclesWithSearch(doc.getById("allowed_cb").checked, doc.getById("id_input").value)
                } else {
                    updateVehiclesByOwnedOnly(doc.getById("allowed_cb").checked)
                }
            })
        }
    },
    {
        viewport: "routes",
        onopen: () => {
            console.log("kek")
        }
    },
    {
        viewport: "lsf",
        onopen: () => {
            console.log("kek")
        }
    },
    {
        viewport: "rules",
        onopen: () => {
            loadRules()
        }
    },
    {
        viewport: "planner",
        onopen: () => {
            load()
        }
    },
    {
        viewport: "manage",
        onopen: () => {
            loadButtons()
        }
    }
]

viewports[0].onopen()

Array.from(document.getElementsByClassName("navbtn")).forEach((x) => {
    x.addEventListener("click", () => {
        for (const y of document.getElementsByClassName("active")) {
            y.classList.remove("active")
            doc.getById(y.dataset.viewport).hidden = true
        }
        x.classList.add("active")
        doc.getById(x.dataset.viewport).hidden = false

        viewports.forEach(vp => {
            if (vp.viewport === x.dataset.viewport) vp.onopen()
        })
    })
});

const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
const tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
    return new bootstrap.Tooltip(tooltipTriggerEl)
});


function httpGet(url) {
    const xmlHttp = new XMLHttpRequest();
    xmlHttp.open("GET", url, false)
    xmlHttp.send(null)
    return { res: xmlHttp.responseText, status: xmlHttp.status }
}

function launchLittlePixelJumper() {
    ipcRenderer.send('fullscreen')
    ipcRenderer.send('open_file', { file: "littlepixeljumper/index.html" })
}
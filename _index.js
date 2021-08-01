const { ipcRenderer, shell } = require('electron')

ipcRenderer.send('resize', { width: 1280, height: 720 })

console.log(
    `%cHey! Was machst du da?\nWenn du dich hier auskennst, helf' doch mit!`,
    `color: orange; font-weight: bold; font-size: 2rem;`
)

document.getElementById("user-text-2").innerText = document.getElementById("user-text-2").innerText.replace("%user", localStorage.getItem("username"))
var req = httpGet(`http://${localStorage.getItem("ipv4")}/api/user/${localStorage.getItem("username")}/role/${localStorage.getItem("sessionId")}`)
if (req.status != 200) req.res = -1;

var role = ""
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

document.getElementById("user-text").innerText = document.getElementById("user-text").innerText.replace("%role", role)

const viewports = [{
        viewport: "home",
        onopen: () => {
            const welcomes = ["Willkommen!", "Moin!", "Guten Morgen!", "Guten Tag!", "Guten Abend!", "Bonjour!", "Hi!", "Hallo!", "Servus!", "Moinsen!", "Grüzli!"];
            document.getElementById("welcome").innerText = welcomes[Math.floor(Math.random() * welcomes.length)]
        }
    },
    {
        viewport: "vehicles",
        onopen: () => {
            updateVehicles()

            document.getElementById("btn_confirm").addEventListener("click", () => {
                document.getElementById("vehicles2").innerHTML = "";

                if (document.getElementById("id_cb").checked) {
                    updateVehiclesWithSearch(document.getElementById("allowed_cb").checked, document.getElementById("id_input").value)
                } else {
                    updateVehiclesByOwnedOnly(document.getElementById("allowed_cb").checked)
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
            console.log("kek")
        }
    },
    {
        viewport: "manage",
        onopen: () => {
            loadButtons()
        }
    }
]

Array.from(document.getElementsByClassName("navbtn")).forEach((x) => {
    x.addEventListener("click", () => {
        for (var y of document.getElementsByClassName("active")) {
            y.classList.remove("active")
            document.getElementById(y.dataset.viewport).hidden = true
        }
        x.classList.add("active")
        document.getElementById(x.dataset.viewport).hidden = false

        viewports.forEach(vp => {
            if (vp.viewport === x.dataset.viewport) vp.onopen()
        })
    })
});

var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'))
var tooltipList = tooltipTriggerList.map(function(tooltipTriggerEl) {
    return new bootstrap.Tooltip(tooltipTriggerEl)
})


function httpGet(url) {
    var xmlHttp = new XMLHttpRequest()
    xmlHttp.open("GET", url, false)
    xmlHttp.send(null)
    return { res: xmlHttp.responseText, status: xmlHttp.status }
}
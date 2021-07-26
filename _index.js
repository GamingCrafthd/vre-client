const { ipcRenderer } = require('electron')

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
        role = "Fahrlehrer"
        break

    case "3":
        role = "Disponent"
        break

    case "4":
        role = "Administrator"
        break

    case "5":
        role = "Entwickler"
        break
}

document.getElementById("user-text").innerText = document.getElementById("user-text").innerText.replace("%role", role)

const viewports = [{
        viewport: "home",
        onopen: () => {
            console.log("kek")
        }
    },
    {
        viewport: "vehicles",
        onopen: () => {
            update()

            document.getElementById("btn_confirm").addEventListener("click", () => {
                document.getElementById("vehicles2").innerHTML = "";

                if (document.getElementById("id_cb").checked) {
                    updateWithSearch(document.getElementById("allowed_cb").checked, document.getElementById("id_input").value)
                } else {
                    updateByOwnedOnly(document.getElementById("allowed_cb").checked)
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
            console.log("kek")
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
            console.log("kek")
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
            if (vp.viewport === x.dataset.viewport) {
                vp.onopen()
            }
        })
    })
});

function httpGet(url) {
    var xmlHttp = new XMLHttpRequest()
    xmlHttp.open("GET", url, false)
    xmlHttp.send(null)
    return { res: xmlHttp.responseText, status: xmlHttp.status }
}
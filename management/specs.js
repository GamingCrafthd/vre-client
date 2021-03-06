let specs = [];

function updateCurrentVehicle(current_vehicle) {
    specs = api.vehicles(`${current_vehicle}/specs`).res

    if (specs === "NONE") {
        specs = []
    } else {
        specs = specs.split(";")
        let index = 0
        specs.forEach(spec => {
            specs[index] = { key: spec.split("=")[0].replace(/%2F/g, "/"), value: spec.split("=")[1].replace(/%2F/g, "/") }
            index++
        })
        update()
    }


}

const specs_div = () => document.getElementById('specs')

function addSpec() {
    specs.push({ key: "", value: "" })
    update()
}

function removeSpec(index) {
    specs = specs.splice(index, 1)
    update()
}

function getSpecsFormatted() {
    const specs_formatted = [];
    if (specs.length === 0) return "NONE"
    specs.forEach(spec => specs_formatted.push(`${spec.key.replace(/\//g, "%2F")}=${spec.value.replace(/\//g, "%2F")}`))
    return specs_formatted.join(";").replace(/;=/g, "")
}

function update() {
    specs_div().innerHTML = ''

    let index = 0
    specs.forEach(spec => {

        let specDiv = document.createElement("div")
        specDiv.id = index.toString()

        let key = document.createElement("input")
        let value = document.createElement("input")

        key.id = "key_" + index
        value.id = "value_" + index

        key.addEventListener('change', () => {
            specs[parseInt(key.id.replace("key_", ""))].key = key.value
        })

        value.addEventListener('change', () => {
            specs[parseInt(value.id.replace("value_", ""))].value = value.value
        })

        specDiv.appendChild(key)
        specDiv.appendChild(value)
        specs_div().appendChild(specDiv)
        index++
    })

    index = 0
    specs.forEach(spec => {
        document.getElementById("key_" + index).value = spec.key
        document.getElementById("value_" + index).value = spec.value
        index++
    })
}
const ruleTemplate = `<a id="%w_id_a"><div id="%w_id" class="rule position-relative"><p class="rule_p"><img src="pdf.svg" alt="" class="pdf">%rule<img src="download.svg" alt="" class="download"></p>%notification</div></a>`
    // %url, %w_id, %rule, %notification

function loadRules() {
    doc.getById("_rules").innerHTML = ""

    const rules = JSON.parse(httpGet(`http://${localStorage.getItem("ipv4")}/api/rules/${localStorage.getItem("sessionId")}`).res)
    const seenRules = httpGet(`http://${localStorage.getItem("ipv4")}/api/user/${localStorage.getItem("username")}/seenrules/${localStorage.getItem("sessionId")}`).res.split(",")

    rules.forEach(rule => {
        const url = httpGet(`http://${localStorage.getItem("ipv4")}/api/rules/${rule}/${localStorage.getItem("sessionId")}`).res
        let x = "";
        isRead(rule, seenRules, found => {
            if (!found) x = `<span class="position-absolute top-0 start-100 translate-middle badge border border-light rounded-circle bg-danger p-2"><span class="visually-hidden">unread messages</span>`
        })
        doc.getById("_rules").innerHTML += ruleTemplate.replace("%w_id_a", rule.replace(" ", "_") + "_a").replace("%w_id", rule.replace(" ", "_")).replace("%rule", rule).replace("%notification", x)
        doc.getById(rule.replace(" ", "_") + "_a").addEventListener("click", () => {
            markAsRead(rule)
            shell.openExternal(url)
        })
    })
}

function markAsRead(rule) {
    httpGet(`http://${localStorage.getItem("ipv4")}/api/user/${localStorage.getItem("username")}/seenrules/${rule}/${localStorage.getItem("sessionId")}`)
}

function isRead(rule, seenRules, cb) {
    let found = false;
    seenRules.forEach(seenRule => {
        if (seenRule == rule) found = true
    })
    cb(found)
}
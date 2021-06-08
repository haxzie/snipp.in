
// R means radius
// Quantity
// params : stockContent(list)
export function setCalculatedRadius(stockFromContent) {
    // stockContent
    // has buyHistory, sellHistory, prices, dates
    const MAX_RADIUS = 20
    const MIN_RADIUS = 7
    let coefficient = 0

    const quantities = [...stockContent['buyHistory']['q'], ...stockContent['sellHistory']['q']]
    const maxQuantity = Math.max(...quantities)
    const minQuantity = Math.min(...quantities)
    if (quantities.length > 1 && maxQuantity !== minQuantity) {
        coefficient = Number.parseFloat((MAX_RADIUS - MIN_RADIUS) / (maxQuantity - minQuantity)).toFixed(1)
    }
}

export function setDetailFromContents(stock, contents) {
    const splitted = contents.split("\n")
        .map(content => {
            return content.trim()
        }).filter(content => {
            return content !== ""
        })

    let stockFromContent = {
        buyHistory: [],
        sellHistory: [],
        company: "",
    }

    const historyTypes = ["buy", "sell"]

    historyTypes.forEach(historyType => {
        const indexHistoryStart = splitted.indexOf(`//${historyType}-start`) + 1
        const indexHistoryEnd = splitted.indexOf(`//${historyType}-end`)
        if (indexHistoryStart !== -1 && indexHistoryEnd !== -1) {
            stockFromContent[`${historyType}History`] = splitted
                .slice(indexHistoryStart, indexHistoryEnd)
                .map(history => {
                    // "2020-10-10,21389,302"
                    const splitted = history.split(",")
                    return {
                        x: splitted[0], // date
                        y: splitted[1], // price
                        q: splitted[2], // quantity
                    }
                })
        }
    })
    stockFromContent['company'] = splitted[1] || ""
    Object.assign(stock, stockFromContent)
}

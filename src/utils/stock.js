
// R means radius
// Quantity
function produceRelativeRValueByQuantities(buyQuantities, sellQuantities) {
    const MAX_RADIUS = 18
    const MIN_RADIUS = 7
    const maxQuantity = Math.max(...quantities)
    const minQuantity = Math.min(...quantities)
    const coefficient = (MAX_RADIUS - MIN_RADIUS) / (maxQuantity - minQuantity)
    return quantities.map(quantity => {
        return coefficient * quantity + MIN_RADIUS
    })
}

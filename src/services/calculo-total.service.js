export function calcularTotalPedido(itens) {
    if (!itens || itens.length === 0) return 0
    
    return itens.reduce((total, item) => total + (item.quantidade * item.precoUnitario), 0)
}

export function calcularSubtotal(quantidade, precoUnitario) {
    if (!Number.isFinite(quantidade) || !Number.isFinite(precoUnitario)) {
        throw new Error('Quantidade e preço unitário devem ser números válidos')
    }
    
    if (quantidade < 0 || precoUnitario < 0) {
        throw new Error('Quantidade e preço não podem ser negativos')
    }

    return quantidade * precoUnitario
}

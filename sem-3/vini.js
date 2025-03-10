const produtos = [1, 2, 3, 4]
const precos = [10, 20, 30, 40]
const descontos = [2, 5, 10, 20]

function calcularDesconto(preco, desconto) {
    return preco - (preco * (desconto / 100));
}

let i = 0
for (let produto in produtos) {

    console.log(`🛒 Produto ${produtos[i]}`);
    console.log(`Preço Original: R$ ${precos[i]}`);
    console.log(`🚸 Desconto Aplicado: R$ ${descontos[i]}%`);
    console.log(`✅ Preço Final: R$ ${calcularDesconto(precos[i], descontos[i])}`);
    console.log("----------------------------");

    i++
}
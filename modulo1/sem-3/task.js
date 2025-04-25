const products = {
  produto1: { nome: "Produto 1", preco: 10, desconto: 10 },
  produto2: { nome: "Produto 2", preco: 20, desconto: 5 },
  produto3: { nome: "Produto 3", preco: 30, desconto: 2 },
  produto4: { nome: "Produto 4", preco: 100, desconto: 20 },
};

function calcularDesconto(preco, desconto) {
  return preco - preco * (desconto / 100);
}

for (let key in products) {
  const { nome, preco, desconto } = products[key];

  console.log(`🛒 ${nome}`);
  console.log(`Preço Original: R$ ${preco}`);
  console.log(`🚸 Desconto Aplicado: R$ ${desconto}%`);
  console.log(`✅ Preço Final: R$ ${calcularDesconto(preco, desconto)}`);
  console.log("----------------------------");
}

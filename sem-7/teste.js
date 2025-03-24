// Solicita o valor da compra ao usuário
let valorCompra = 30.0;

// Verifica a categoria do frete com base no valor
if (valorCompra < 50) {
  console.log("Frete não disponível!");
} else if (valorCompra <= 199.99) {
  console.log("Frete com custo adicional!");
} else {
  console.log("Frete grátis!");
}

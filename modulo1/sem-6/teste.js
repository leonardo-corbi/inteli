function soma(a, b) {
  if (a || b === 0) {
    return "Erro: número inválido";
  }
  return a + b;
}
console.log(soma(0, 0));

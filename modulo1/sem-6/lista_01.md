# Instruções

- Faça uma cópia deste arquivo .md para um repositório próprio
- Resolva as 8 questões objetivas assinalando a alternativa correta e **justificando sua resposta.**
- Resolva as 2 questões dissertativas escrevendo no próprio arquivo .md
- Lembre-se de utilizar as estruturas de código como `` esta aqui com `  `` ou

````javascript
//esta aqui com ```
let a = "olá";
let b = 10;
print(a);
````

- Resolva as questões com uso do Visual Studio Code ou ambiente similar.
- Teste seus códigos antes de trazer a resposta para cá.
- Cuidado com o uso de ChatGPT (e similares), pois entregar algo só para ganhar nota não fará você aprender. Não seja dependente da máquina!
- Ao final, publique seu arquivo lista_01.md com as respostas em seu repositório, e envie o link pela Adalove.

# Questões objetivas

**1) Considerando a execução do código abaixo, indique a alternativa correta e justifique sua resposta.**

```javascript
console.log(x);
var x = 5;
console.log(y);
let y = 10;
```

a) A saída será undefined seguido de erro (x)
(No javaScript quando escrevemos uma variavel com var no começo ela é levada ao topo do escopo, então ela é registrada desde o começo do código. Como resultado, ele retorna undefined porque ela existe mas ainda não foi definida por nenhum valor, diferentemente do let.)

b) A saída será 5 seguido de 10

c) A saída será undefined seguido de undefined

d) A saída será erro em ambas as linhas que utilizam console.log

**2) O seguinte código JavaScript tem um erro que impede sua execução correta. Analise e indique a opção que melhor corrige o problema. Justifique sua resposta.**

```javascript
function soma(a, b) {
  if (a || b === 0) {
    return "Erro: número inválido";
  }
  return a + b;
}
console.log(soma(2, 0));
```

a) Substituir if (a || b === 0) por if (a === 0 || b === 0)

b) Substituir if (a || b === 0) por if (a === 0 && b === 0) (x)
(Para fazer o código funcionar e retornar algo diferente de erro, precisariamos mudar a verificação para verificar se ambas variáveis são 0, se não, ele retornaria erro. A atual função apenas verifica se 'b' é igual a 0 e se 'a' existe.)

c) Substituir if (a || b === 0) por if (a && b === 0)

d) Remover completamente a verificação if (a || b === 0)

---

**3) Ao executar esse código, qual será a saída no console? Indique a alternativa correta e justifique sua resposta.**

```javascript
function calcularPreco(tipo) {
  let preco;

  switch (tipo) {
    case "eletrônico":
      preco = 1000;
    case "vestuário":
      preco = 200;
      break;
    case "alimento":
      preco = 50;
      break;
    default:
      preco = 0;
  }

  return preco;
}

console.log(calcularPreco("eletrônico"));
```

a) O código imprime 1000.

b) O código imprime 200. (x)
(O código imprime 200 porque não tem uma quebra (break) em case do número ser 1000, o que leva o código a levar para o próximo case)

c) O código imprime 50.

d) O código gera um erro.

---

**4) Ao executar esse código, qual será a saída no console? Indique a alternativa correta e justifique sua resposta.**

```javascript
let numeros = [1, 2, 3, 4, 5];

let resultado = numeros
  .map((x) => x * 2)
  .filter((x) => x > 5)
  .reduce((a, b) => a + b, 0);

console.log(resultado);
```

a) 0

b) 6

c) 18

d) 24 (x)
(Os numeros do array passam por etapas: todos eles são multiplicados por 2, depois são filtrados apenas os números maiores que 5 e então somados)

---

**5) Qual será o conteúdo do array lista após a execução do código? Indique a alternativa correta e justifique sua resposta.**

```javascript
let lista = ["banana", "maçã", "uva", "laranja"];
lista.splice(1, 2, "abacaxi", "manga");
console.log(lista);
```

a) ["banana", "maçã", "uva", "abacaxi", "manga", "laranja"]

b) ["banana", "abacaxi", "manga"]

c) ["banana", "abacaxi", "manga", "laranja"] (x)
(O método splice remove dois indices a partir do indice um e substitui eles por abacaxi e manga)

d) ["banana", "maçã", "uva", "abacaxi", "manga"]

---

**6) Abaixo há duas afirmações sobre herança em JavaScript. Indique a alternativa correta e justifique sua resposta**

I. A herança é utilizada para compartilhar métodos e propriedades entre classes em JavaScript, permitindo que uma classe herde os métodos de outra sem a necessidade de repetir código.  
II. Em JavaScript, a herança é implementada através da palavra-chave `extends`.

a) As duas afirmações são verdadeiras, e a segunda justifica a primeira.

b) As duas afirmações são verdadeiras, mas a segunda não justifica a primeira. (x)
(A primeira afirmação explica o conceito de herança, enquanto a segunda descreve a implementação técnica em JavaScript, mas não explica o motivo ou o propósito da herança)

c) A primeira afirmação é verdadeira, e a segunda é falsa.

d) A primeira afirmação é falsa, e a segunda é verdadeira.

---

**7) Dado o seguinte código. Indique a alternativa correta e justifique sua resposta.**

```javascript
class Pessoa {
  constructor(nome, idade) {
    this.nome = nome;
    this.idade = idade;
  }

  apresentar() {
    console.log(`Olá, meu nome é ${this.nome} e tenho ${this.idade} anos.`);
  }
}

class Funcionario extends Pessoa {
  constructor(nome, idade, salario) {
    super(nome, idade);
    this.salario = salario;
  }

  apresentar() {
    super.apresentar();
    console.log(`Meu salário é R$ ${this.salario}.`);
  }
}
```

I) A classe Funcionario herda de Pessoa e pode acessar os atributos nome e idade diretamente.  
II) O método `apresentar()` da classe Funcionario sobrepõe o método `apresentar()` da classe Pessoa, mas chama o método da classe pai usando `super`.  
III) O código não funciona corretamente, pois Funcionario não pode herdar de Pessoa como uma classe, já que o JavaScript não suporta herança de classes.

Quais das seguintes afirmações são verdadeiras sobre o código acima?

a) I e II são verdadeiras. (x)
(I: A classe Funcionario herda de Pessoa e pode acessar os atributos diretamente. II: O método apresentar da classe Funcionario sobrescreve o método da classe Pessoa, mas usa super para chamar o método original)

b) I, II e III são verdadeiras.

c) Apenas II é verdadeira.

d) Apenas I é verdadeira.

---

**8) Analise as afirmações a seguir. Indique a alternativa correta e justifique sua resposta.**

**Asserção:** O conceito de polimorfismo em Programação Orientada a Objetos permite que objetos de diferentes tipos respondam à mesma mensagem de maneiras diferentes.  
**Razão:** Em JavaScript, o polimorfismo pode ser implementado utilizando o método de sobrecarga de métodos em uma classe.

a) A asserção é falsa e a razão é verdadeira.

b) A asserção é verdadeira e a razão é falsa. (x)
(A asserção está correta, pois polimorfismo permite que diferentes objetos respondam de forma distinta ao mesmo método. Porém, a razão é falsa, pois JavaScript não suporta sobrecarga de métodos)

c) A asserção é verdadeira e a razão é verdadeira, mas a razão não explica a asserção.

d) A asserção é verdadeira e a razão é verdadeira, e a razão explica a asserção.

---

# Questões dissertativas

9. O seguinte código deve retornar a soma do dobro dos números de um array, mas contém erros. Identifique os problema e corrija o código para que funcione corretamente. Adicione comentários ao código explicado sua solução para cada problema.

```javascript
function somaArray(numeros) {
  let soma = 0; // Declara a variável soma e inicializa com 0 para acumular os valores
  for (let i = 0; i < numeros.length; i++) {
    // Usa let para declarar i e corrige 'size' para 'length'
    soma += 2 * numeros[i]; // Acumula o dobro de cada elemento no array
  }
  return soma; // Retorna a soma total
}
console.log(somaArray([1, 2, 3, 4])); // Saída: 20 (2 + 4 + 6 + 8)
```

---

10. Crie um exemplo prático no qual você tenha duas classes:

- Uma classe `Produto` com atributos `nome` e `preco`, e um método `calcularDesconto()` que aplica um desconto fixo de 10% no preço do produto.
- Uma classe `Livro` que herda de `Produto` e modifica o método `calcularDesconto()`, aplicando um desconto de 20% no preço dos livros.

Explique como funciona a herança nesse contexto e como você implementaria a modificação do método na classe `Livro`.

```javascript
class Produto {
  constructor(nome, preco) {
    this.nome = nome;
    this.preco = preco;
  }

  calcularDesconto() {
    return this.preco * 0.9; // Aplica desconto de 10% (90% do preço original)
  }
}

class Livro extends Produto {
  constructor(nome, preco) {
    super(nome, preco); // Chama o construtor da classe pai
  }

  calcularDesconto() {
    return this.preco * 0.8; // Sobrescreve o método para aplicar desconto de 20% (80% do preço original)
  }
}

// Testando as classes
const produto = new Produto("Celular", 1000);
console.log(`Preço do produto com desconto: R$ ${produto.calcularDesconto()}`); // Saída: 900

const livro = new Livro("JavaScript Básico", 100);
console.log(`Preço do livro com desconto: R$ ${livro.calcularDesconto()}`); // Saída: 80
```

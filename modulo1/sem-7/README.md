# Instruções

- Faça uma cópia deste arquivo .md para um repositório próprio
- Resolva as 6 questões objetivas assinalando a alternativa correta
- Resolva as 4 questões dissertativas escrevendo no próprio arquivo .md
  - lembre-se de utilizar as estruturas de código como `` esta aqui com `  `` ou

````javascript
//esta aqui com ```
let a = "olá";
let b = 10;
print(a);
````

- Resolva as questões com uso do Visual Studio Code ou ambiente similar.
- Teste seus códigos antes de trazer a resposta para cá.
- Cuidado com ChatGPT e afins: entregar algo só para ganhar nota não faz você aprender e ficar mais inteligente. Não seja dependente da máquina! (E não se envolva em plágio!)
- ao final, publique seu arquivo lista_02.md com as respostas em seu repositório, e envie o link pela Adalove.

# Questões objetivas

**1)** Considere o seguinte código JavaScript:

```javascript
//EX01
let p = 10;
let q = 3;
let r = 6;

let resultado = (p % q === 1 && r * 2 > p) || q + r < p;
console.log(resultado);

const valores = [3, 6, 9, 12, 15];
let produto = 1;

for (let j = 0; j < valores.length; j++) {
  produto *= valores[j];
}

console.log("O produto dos valores é:", produto);
```

Qual das seguintes alternativas melhor descreve o que o código faz?

**x**) O código avalia a expressão booleana, imprime `true`, calcula o produto dos números na lista e imprime o resultado no console.

B) O código avalia a expressão booleana, imprime `false`, calcula o produto dos números na lista e imprime o resultado no console.

C) O código avalia a expressão booleana, imprime `true` e, em seguida, verifica se o número 6 está na lista.

D) O código avalia a expressão booleana, imprime `false` e ordena os valores em ordem crescente.

**Justificativa: A expressão (p % q === 1 && r _ 2 > p) || q + r < p resulta em true (10 % 3 === 1 é verdadeiro e 6 _ 2 > 10 também. A segunda parte não importa devido ao ||). O loop calcula o produto de [3, 6, 9, 12, 15], que é 29160, e imprime isso.**

---

**2)** O código a seguir contém duas funções que calculam o limite de crédito de um cliente com base nos seus gastos e na renda mensal.

```javascript
// Versão 1 da função de análise de crédito
function analisarCredito1() {
  var compras = [2500, 1200, 800, 100];
  var totalCompras = compras[0];
  var limite = 5000;
  var status = "aprovado";
  var saldoDisponivel = 0;
  var i = 1;

  do {
    totalCompras += compras[i];
    i++;
  } while (limite >= totalCompras && i < compras.length);

  saldoDisponivel = limite - totalCompras;

  if (saldoDisponivel < 0) {
    status = "negado";
  }
  console.log(
    `Seu crédito foi ${status}. Saldo disponível: ${saldoDisponivel}.`
  );
}
```

```javascript
// Versão 2 da função de análise de crédito
function analisarCredito2() {
  var compras = [2500, 1200, 800, 100];
  var totalCompras = compras[0];
  var limite = 5000;
  var status = "aprovado";
  var saldoDisponivel = 0;
  var i = 1;

  while (limite >= totalCompras && i < compras.length) {
    totalCompras += compras[i];
    i++;
  }

  saldoDisponivel = limite - totalCompras;

  if (saldoDisponivel < 0) {
    status = "negado";
  }
  console.log(
    `Seu crédito foi ${status}. Saldo disponível: ${saldoDisponivel}.`
  );
}
```

Se ambas as funções forem executadas com os valores fornecidos, qual será a saída exibida no console?

**x**) Ambas as funções exibirão: 'Seu crédito foi aprovado. Saldo disponível: 400.'

B) analisarCredito1() exibirá: 'Seu crédito foi negado. Saldo disponível: -600.', enquanto analisarCredito2() exibirá: 'Seu crédito foi negado. Saldo disponível: -200.'

C) analisarCredito1() exibirá: 'Seu crédito foi negado. Saldo disponível: -200.', enquanto analisarCredito2() exibirá: 'Seu crédito foi aprovado. Saldo disponível: 100.'

D) Ambas as funções exibirão: 'Seu crédito foi aprovado Saldo disponível: 500.'

**Justificativa: Ambas as funções somam as compras [2500, 1200, 800, 100] até o limite de 5000. O total é 4600, deixando saldo de 400. Como o saldo é positivo, o status é "aprovado". A saída é idêntica para ambas: "Seu crédito foi aprovado. Saldo disponível: 400."**

---

**3)** Considere o seguinte trecho de código em JavaScript:

```javascript
//EX03
const idade = 21;

if (idade >= 18 && idade < 60) {
  console.log("Você é um adulto!");
} else if (idade < 18) {
  console.log("Você é menor de idade!");
} else {
  console.log("Você está na melhor idade!");
}
```

Qual das seguintes alternativas melhor descreve o comportamento do código?

A) O código verifica se a idade indica um adulto ou um idoso e exibe a mensagem correspondente.

**x**) O código verifica se a idade pertence à faixa adulta. Se for, exibe "Você é um adulto!". Caso contrário, verifica se é menor de idade e exibe "Você é menor de idade!". Se nenhuma das condições anteriores for verdadeira, exibe "Você está na melhor idade!".

C) O código verifica se a idade está entre 18 e 60 anos e, se for, imprime "Você é um adulto!". Se não estiver nesse intervalo, imprime "Você está na melhor idade!".

D) O código verifica se a idade é menor de 18, entre 18 e 60 ou acima de 60, imprimindo uma mensagem específica para cada caso.

**Justificativa: O código verifica se idade está entre 18 e 60 (21 está, imprime "Você é um adulto!"), depois menor que 18, e por fim o caso restante (60 ou mais). A descrição em B corresponde exatamente a essa lógica.**

---

**4)** Qual será o resultado impresso no console após a execução do seguinte código?

```javascript
//EX04
var energiaDisponivel = 1200;
var bateriaExtra = 400;
var consumoDispositivos = [300, 600, 500, 200, 400];

for (var i = 0; i < consumoDispositivos.length; i++) {
  var consumo = consumoDispositivos[i];

  if (consumo <= energiaDisponivel) {
    console.log(
      "Dispositivo " +
        (i + 1) +
        " ligado. Energia restante: " +
        (energiaDisponivel - consumo)
    );
    energiaDisponivel -= consumo;
  } else if (consumo <= energiaDisponivel + bateriaExtra) {
    console.log(
      "Dispositivo " +
        (i + 1) +
        " ligado com bateria extra. Energia restante: " +
        (energiaDisponivel + bateriaExtra - consumo)
    );
    energiaDisponivel = 0;
    bateriaExtra -= consumo - energiaDisponivel;
  } else {
    console.log(
      "Dispositivo " + (i + 1) + " não pode ser ligado. Energia insuficiente."
    );
  }
}
```

Escolha a opção que responde corretamente:

A)
Dispositivo 1 ligado. Energia restante: 900

Dispositivo 2 ligado com bateria extra. Energia restante: 700

Dispositivo 3 ligado. Energia restante: 200

Dispositivo 4 ligado com bateria extra. Energia restante: 0

Dispositivo 5 ligado. Energia restante: -200

B)
Dispositivo 1 ligado. Energia restante: 900

Dispositivo 2 ligado com bateria extra. Energia restante: 700

Dispositivo 3 ligado. Energia restante: 200

Dispositivo 4 não pode ser ligado. Energia insuficiente.

Dispositivo 5 não pode ser ligado. Energia insuficiente.

C)
Dispositivo 1 ligado. Energia restante: 900

Dispositivo 2 ligado com bateria extra. Energia restante: 700

Dispositivo 3 ligado. Energia restante: 400

Dispositivo 4 não pode ser ligado. Energia insuficiente.

**x**)
Dispositivo 1 ligado. Energia restante: 900

Dispositivo 2 ligado. Energia restante: 300

Dispositivo 3 ligado com bateria extra. Energia restante: 200

Dispositivo 4 não pode ser ligado. Energia insuficiente.

Dispositivo 5 não pode ser ligado. Energia insuficiente.

**Justificativa: Dispositivo 1 (300) usa energia (900 sobra); Dispositivo 2 (600) usa energia (300 sobra); Dispositivo 3 (500) usa bateria extra (200 sobra); Dispositivo 4 (200) e 5 (400) não ligam por energia insuficiente.**

---

**5)** Qual é a principal função do método update() em um jogo desenvolvido com Phaser.js?

Escolha a opção que melhor descreve seu propósito:

A) O método update() é responsável por carregar os assets do jogo antes da cena ser exibida.

**x**) O método update() é chamado continuamente a cada quadro (frame) do jogo, sendo usado para atualizar a lógica, movimentação e interações dos objetos na cena.

C) O método update() renderiza todos os sprites na tela e garante que a física do jogo seja processada corretamente.

D) O método update() é chamado apenas uma vez após a criação da cena, sendo utilizado para configurar variáveis iniciais do jogo.

**Justificativa: Em Phaser.js, update() é chamado a cada frame para atualizar lógica, movimentação e interações, sendo essencial ao loop principal do jogo.**

---

**6)** Qual é o principal objetivo do módulo Matter.js Physics em Phaser.js?

Escolha a opção que responde corretamente:

**x**) Simular física avançada, incluindo corpos rígidos, colisões complexas e interação entre objetos com gravidade e forças.

B) Gerenciar eventos de entrada do usuário, como cliques e toques na tela, permitindo movimentação de personagens.

C) Renderizar gráficos otimizados para jogos 2D e garantir uma taxa de quadros estável.

D) Criar animações automáticas para sprites e objetos interativos sem necessidade de programação de movimentação.

**Justificativa: Matter.js em Phaser.js simula física avançada como corpos rígidos, colisões e gravidade, ideal para jogos realistas.**

---

# Questões dissertativas

**7)** Uma loja online deseja implementar um sistema de classificação de pedidos com base no valor total da compra. O sistema deve determinar a categoria de um pedido com as seguintes regras:

```

Pedidos abaixo de R$50,00 → "Frete não disponível!"

Pedidos entre R$50,00 e R$199,99 (inclusive) → "Frete com custo adicional!"

Pedidos de R$200,00 ou mais → "Frete grátis!"
```

Implemente um pseudocódigo que receba o valor total da compra e exiba a classificação correta do frete para o cliente.

**Resposta:**

```
Função ClassificarFrete(valorCompra):
    Se valorCompra < 50 então:
        Exibir "Frete não disponível!"
    Senão se valorCompra >= 50 e valorCompra <= 199.99 então:
        Exibir "Frete com custo adicional!"
    Senão:
        Exibir "Frete grátis!"
```

---

**8)** Considere a implementação da classe base Veiculo em um sistema de modelagem de veículos. Sua tarefa é implementar, utilizando pseudocódigo, as classes derivadas Carro e Moto, que herdam da classe Veiculo, adicionando atributos específicos e métodos para calcular o consumo de combustível de um carro e de uma moto, respectivamente.

```
Classe Veiculo:
Atributos:

modelo
ano
Método Construtor(modelo, ano):

Define os valores dos atributos modelo e ano com os valores passados como parâmetro.
Método CalcularConsumo():
```

Implementação genérica para cálculo de consumo, a ser sobrescrita pelas subclasses.
Agora, implemente as classes Carro e Moto, garantindo que ambas herdem de Veiculo e possuam métodos específicos para calcular o consumo de combustível com base na quilometragem e eficiência do veículo.

**Resposta:**

```
Classe Veiculo:
    Atributos:
        modelo
        ano

    Construtor(modelo, ano):
        modelo <- modelo
        ano <- ano

    Método CalcularConsumo():
        Retornar "Método genérico, a ser sobrescrito"

Classe Carro herda Veiculo:
    Atributos:
        quilometragem
        eficienciaCombustivel  # km por litro

    Construtor(modelo, ano, quilometragem, eficienciaCombustivel):
        Chamar Construtor Veiculo(modelo, ano)
        quilometragem <- quilometragem
        eficienciaCombustivel <- eficienciaCombustivel

    Método CalcularConsumo():
        consumo <- quilometragem / eficienciaCombustivel
        Retornar consumo

Classe Moto herda Veiculo:
    Atributos:
        quilometragem
        eficienciaCombustivel  # km por litro

    Construtor(modelo, ano, quilometragem, eficienciaCombustivel):
        Chamar Construtor Veiculo(modelo, ano)
        quilometragem <- quilometragem
        eficienciaCombustivel <- eficienciaCombustivel

    Método CalcularConsumo():
        consumo <- quilometragem / eficienciaCombustivel * 1.2  # Moto consome 20% mais por fator de eficiência
        Retornar consumo
```

---

**9)** Você é um cientista da NASA e está ajudando no desenvolvimento de um sistema de pouso para sondas espaciais em Marte. Seu objetivo é calcular o tempo necessário para que a sonda reduza sua velocidade até um nível seguro para pouso, considerando uma velocidade inicial de entrada na atmosfera marciana e uma taxa de desaceleração constante causada pelo atrito atmosférico e retrofoguetes.

Entretanto, a sonda não pode ultrapassar um tempo máximo de descida para evitar desvios orbitais, nem pode desacelerar além de um limite mínimo, pois isso poderia causar instabilidade no pouso.

Implemente a lógica dessa simulação em pseudocódigo, considerando a seguinte equação para atualização da velocidade:

Considere a fórumla de atualização velocidade:

```
    velocidade = velocidadeInicial - desaceleracao * tempo
```

Seu programa deve determinar quanto tempo será necessário para que a sonda atinja uma velocidade segura de pouso, sem ultrapassar os limites estabelecidos.

**Resposta:**

```
Função SimularPouso(velocidadeInicial, desaceleracao, velocidadeSegura, tempoMaximo):
    tempo <- 0
    velocidadeAtual <- velocidadeInicial

    Enquanto velocidadeAtual > velocidadeSegura e tempo < tempoMaximo faça:
        velocidadeAtual <- velocidadeInicial - desaceleracao * tempo
        tempo <- tempo + 1

    Se velocidadeAtual <= velocidadeSegura então:
        Exibir "Pouso seguro em " + tempo + " segundos."
    Senão:
        Exibir "Tempo máximo excedido. Pouso instável."

    Retornar tempo
```

---

**10)** Em um sistema de análise financeira, as operações de investimento de uma empresa podem ser representadas por matrizes, onde cada linha representa um tipo de investimento e cada coluna representa um período de tempo.

A seguir, é fornecida a implementação da função SomarMatrizesInvestimento(matrizA, matrizB), que soma os valores de duas matrizes de investimento. Sua tarefa é implementar uma função semelhante, porém que realize a multiplicação das matrizes de investimento, determinando como os investimentos afetam os resultados ao longo do tempo.

```
Função SomarMatrizesInvestimento(matrizA, matrizB):
    # Verifica se as matrizes têm o mesmo número de linhas e colunas
    Se tamanho(matrizA) ≠ tamanho(matrizB) então:
        Retornar "As matrizes não podem ser somadas. Elas têm dimensões diferentes."
    Senão:
        linhas <- tamanho(matrizA)
        colunas <- tamanho(matrizA[0])
        matrizResultado <- novaMatriz(linhas, colunas)

        # Loop para percorrer cada elemento das matrizes e calcular a soma
        Para i de 0 até linhas-1 faça:
            Para j de 0 até colunas-1 faça:
                matrizResultado[i][j] <- matrizA[i][j] + matrizB[i][j]

        Retornar matrizResultado

# Exemplo de uso da função
investimentosAno1 <- [[1000, 2000], [1500, 2500]]
investimentosAno2 <- [[1200, 1800], [1300, 2700]]

totalInvestimentos <- SomarMatrizesInvestimento(investimentosAno1, investimentosAno2)
Escrever("Total de investimentos acumulados:")
ImprimirMatriz(totalInvestimentos)
```

Agora, implemente a função MultiplicarMatrizesInvestimento(matrizA, matrizB), que multiplica as duas matrizes, simulando o efeito de diferentes fatores de crescimento e impacto financeiro nos investimentos ao longo do tempo.

**Resposta:**

```
Função MultiplicarMatrizesInvestimento(matrizA, matrizB):
    # Verifica se colunas de A = linhas de B
    Se tamanho(matrizA[0]) ≠ tamanho(matrizB) então:
        Retornar "As matrizes não podem ser multiplicadas. Dimensões incompatíveis."
    Senão:
        linhasA <- tamanho(matrizA)
        colunasB <- tamanho(matrizB[0])
        linhasB <- tamanho(matrizB)
        matrizResultado <- novaMatriz(linhasA, colunasB)

        Para i de 0 até linhasA-1 faça:
            Para j de 0 até colunasB-1 faça:
                soma <- 0
                Para k de 0 até linhasB-1 faça:
                    soma <- soma + matrizA[i][k] * matrizB[k][j]
                matrizResultado[i][j] <- soma

        Retornar matrizResultado

# Exemplo de uso
investimentos <- [[1000, 2000], [1500, 2500]]
fatoresCrescimento <- [[1.1, 0.9], [0.8, 1.2]]
resultado <- MultiplicarMatrizesInvestimento(investimentos, fatoresCrescimento)
Escrever("Resultado dos investimentos multiplicados:")
ImprimirMatriz(resultado)
```

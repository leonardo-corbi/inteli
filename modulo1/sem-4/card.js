class Carta {
  constructor(cor, valor) {
      this.cor = cor;
      this.valor = valor;
  }

  toString() {
      return `${this.cor} ${this.valor}`;
  }
}

class Baralho {
  static CORES = ["Vermelho", "Azul", "Verde", "Amarelo"];
  static VALORES = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];

  constructor() {
      this.cartas = this.gerarBaralho();
      this.embaralhar();
  }

  gerarBaralho() {
      let cartas = [];
      Baralho.CORES.forEach(cor => {
          cartas.push(new Carta(cor, "0")); // Um zero por cor
          Baralho.VALORES.slice(1).forEach(valor => {
              cartas.push(new Carta(cor, valor));
              cartas.push(new Carta(cor, valor));
          });
      });
      return cartas;
  }

  embaralhar() {
      this.cartas.sort(() => Math.random() - 0.5);
  }

  comprarCarta() {
      return this.cartas.pop() || null;
  }
}

class Jogador {
  constructor(nome) {
      this.nome = nome;
      this.mao = [];
  }

  comprarCartas(baralho, qtd = 1) {
      for (let i = 0; i < qtd; i++) {
          let carta = baralho.comprarCarta();
          if (carta) {
              this.mao.push(carta);
          }
      }
  }

  mostrarMao() {
      return this.mao.map(carta => carta.toString()).join(" | ");
  }
}

class JogoUNO {
  constructor(nomesJogadores) {
      this.baralho = new Baralho();
      this.jogadores = nomesJogadores.map(nome => new Jogador(nome));
      this.pilhaDescarte = [];
      this.iniciarJogo();
  }

  iniciarJogo() {
      this.jogadores.forEach(jogador => jogador.comprarCartas(this.baralho, 7));
      this.pilhaDescarte.push(this.baralho.comprarCarta());
  }

  mostrarEstado() {
      console.log("================ JOGO UNO ================");
      console.log(`Carta no topo da pilha de descarte: ${this.pilhaDescarte[this.pilhaDescarte.length - 1]}`);
      console.log("------------------------------------------");
      this.jogadores.forEach(jogador => {
          console.log(`${jogador.nome} tem as cartas: ${jogador.mostrarMao()}`);
      });
      console.log("==========================================");
  }
}

// Exemplo de uso
const nomes = ["Alice", "Bob"];
const jogo = new JogoUNO(nomes);
jogo.mostrarEstado();

// Alice compra uma carta
console.log("\nAlice compra uma carta...");
jogo.jogadores[0].comprarCartas(jogo.baralho, 1);
jogo.mostrarEstado();

// Bob compra duas cartas
console.log("\nBob compra duas cartas...");
jogo.jogadores[1].comprarCartas(jogo.baralho, 2);
jogo.mostrarEstado();

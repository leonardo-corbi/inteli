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
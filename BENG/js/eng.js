 var canvas, ctx, ALTURA, LARGURA, frames = 0, maxPulos = 3, velocidade = 6,
    estadoAtual,

    estados = {
      jogar: 0,
      jogando: 1,
      perdeu: 2
    },

    chao = {
      y: 550,
      altura: 50,
      cor: "#ffdf70",

      // métodos do chão
      desenha: function() {
        ctx.fillStyle = this.cor;
        ctx.fillRect(0, this.y, LARGURA, this.altura);
      }
    },
    
    bloco = {
      x: 50,
      y: 0,
      altura: 50,
      largura: 50,
      cor: "#ff4e4e",
      gravidade: 1.5,
      velocidade: 5,
      forcaDoPulo: 20,
      qntPulos: 0,

      atualiza: function(){
        this.velocidade += this.gravidade;
        this.y += this.velocidade;

        if (this.y > chao.y - this.altura && estadoAtual != estados.perdeu){
          this.y = chao.y - this.altura;
          // quando chegar no chão, libera mais 3 pulos
          this.qntPulos = 0;
          // zerando a velocidade quando o quadrado tá no chão
          this.velocidade = 0;
        }
      },

      pula: function(){
        if (this.qntPulos < maxPulos){
          this.velocidade = -this.forcaDoPulo;
          this.qntPulos++;
        }
      },

      desenha: function(){
        ctx.fillStyle = this.cor;
        ctx.fillRect(this.x, this.y, this.largura, this.altura);
      }
    },

    obstaculos = {
      // criando vetor
      _obs: [],
      cores: ["#ffbc1c", "#ff1c1c", "#ff85e1", "#52a7ff", "#78ff5d"],
      velocidade: 3,
      tempoInsere: 0,
      
      // metodos, inserindo obstáculos com push na array obstáculos
      insere: function(){
        this._obs.push({
          x: LARGURA,
          // variação de largura e altura
          largura: 30 + Math.floor(20 * Math.random()),
          altura: 30 + Math.floor(80 * Math.random()),
          cor: this.cores[Math.floor(5 * Math.random())] // pegando cores aleatórias
        });
          //configurando os espaçamentos min 40 max 60
          this.tempoInsere = 20 + Math.floor(21 + Math.random());
      },

      atualiza: function() {
        if (this.tempoInsere == 0)
          this.insere();
        else
          this.tempoInsere--;

        for (var i = 0, tamanhoDoVetor = this._obs.length; i < tamanhoDoVetor; i++){
          var obs = this._obs[i];
          obs.x -= velocidade; // pega a velocidade da variável global
          // removendo os objetos no começo da canvas com splice
          // fazendo a condição de colisão e colocaro os estados para perdeu
          if (bloco.x < obs.x + obs.largura && bloco.x + bloco.largura >=
          obs.x && bloco.y + bloco.altura >= chao.y - obs.altura){
            estadoAtual = estados.perdeu;
          }
        
          else if(obs.x <= -obs.largura){
            this._obs.splice(i, 1);
            // removendo a posição que não existe mais
            tamanhoDoVetor--;
            i--;
          }
        }
      },
      //limpa o array
      limpa: function(){
        this._obs = [];
      },
      desenha: function(){
        for(var i = 0, tamanhoDoVetor = this._obs.length; i < tamanhoDoVetor; i++){
          // selecionando o vetor que vai desenhar e desenhando com o ctx
          var obs = this._obs[i];
          ctx.fillStyle = obs.cor;
          // pegando a altura do obstaculo e subtraindo com a altura y do chao
          ctx.fillRect(obs.x, chao.y - obs.altura, obs.largura, obs.altura);

        }
      }

    };

function clique(event) {
  if (estadoAtual == estados.jogando)
    bloco.pula();
  
  else if (estadoAtual == estados.jogar){
    estadoAtual = estados.jogando;
  }

  else if (estadoAtual == estados.perdeu && bloco.y >= 2 * ALTURA){
    estadoAtual = estados.jogar;
    bloco.velocidade = 0;
    bloco.y = 0;
  }
}

function main() {
    // pegando altura e largura da janela
    ALTURA = window.innerHeight;
    LARGURA = window.innerWidth;

    if (LARGURA >= 500){
        ALTURA = 600;
        LARGURA = 600;
    }

    //criando a canvas com html
    canvas = document.createElement("canvas");
    canvas.width = LARGURA;
    canvas.height = ALTURA;
    canvas.style.border = "1px solid #000";

    // definindo o contexto
    ctx = canvas.getContext('2d');
    // adicioonando a canvas no html
    document.body.appendChild(canvas);
    // evento de clique, execulta função clique
    document.addEventListener("mousedown", clique);
    // chamando a função roda
    estadoAtual = estados.jogar;
    roda();
}

function roda() {
    atualiza();
    desenha();
    // colocando pra fazer um loop
    // chamando a função roda
    window.requestAnimationFrame(roda);
}

function atualiza() {
    frames++;
    bloco.atualiza();

    if (estadoAtual == estados.jogando) {
      obstaculos.atualiza();
    } 

    else if (estadoAtual == estados.perdeu)
      obstaculos.limpa();
}

function desenha() {
  // desenhando o fundo do canvas azul
  ctx.fillStyle = "#50beff";
  ctx.fillRect(0, 0, LARGURA, ALTURA);

  if (estadoAtual == estados.jogar) {
    ctx.fillStyle = "green";
    ctx.fillRect(LARGURA / 2 - 50, ALTURA / 2 - 50, 100, 100 );
  }

  else if (estadoAtual == estados.perdeu){
    ctx.fillStyle = "red";
    ctx.fillRect(LARGURA / 2 - 50, ALTURA / 2 - 50, 100, 100 );
  }

  else if (estadoAtual == estados.jogando)
    obstaculos.desenha();

  // variável chao, e o metodo desenhar
  chao.desenha();
  bloco.desenha();
}

main();
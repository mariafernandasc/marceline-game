# Marceline Axe Bass

## Descrição

Jogo de plataforma 2D inspirado na personagem Marceline, da série *Hora de Aventura*. O jogador controla Marceline enquanto ela corre por três fases, enfrenta inimigos icônicos da série, desvia de obstáculos e usa sua guitarra-machado para atacar.

O jogo é desenvolvido inteiramente com **HTML, CSS e JavaScript puro**, sem uso de engines ou canvas — toda a lógica usa manipulação do DOM.

---

## Como Executar

1. Clone ou baixe o repositório
2. Abra a pasta `game/` no seu editor
3. Coloque os assets (imagens e áudios) nas pastas `assets/images/` e `assets/audio/` conforme a estrutura abaixo
4. Abra o arquivo `index.html` diretamente no navegador (recomendado: Chrome ou Firefox)

> Não é necessário servidor — o jogo roda localmente.

---

## Controles

| Tecla | Ação |
|-------|------|
| ← → | Mover |
| ↑ | Pular |
| ↓ (segurar) | Agachar (passa por baixo de obstáculos suspensos) |
| ESPAÇO | Atacar com a guitarra-machado |
| P / ESC | Pausar |
| ENTER | Confirmar / Reiniciar |

---

## Funcionalidades

- **3 fases** com cenários, músicas e inimigos diferentes
- **Sistema de vidas** (5 corações) com recuperação ao avançar de fase
- **Sistema de pontuação** com recorde salvo via `localStorage`
- **Inimigos com IA**: se movem em direção à Marceline e disparam projéteis
- **Obstáculos variados**: chão (alho, estaca) e suspensos (sol, tolo — requerem agachar)
- **Portal de fim de fase** que só abre quando todos os inimigos forem derrotados
- **Efeitos sonoros** via Web Audio API + suporte a arquivos `.mp3`
- **Música por fase** (I'm Just Your Problem / Remember You / Everything Stays)
- **Menu de configurações** para mutar música e efeitos sonoros
- **Tela de vitória final** ao completar as 3 fases

---

## Fases

| Fase | Cenário | Inimigo | Vidas | Novos obstáculos |
|------|---------|---------|-------|-----------------|
| 1 | Floresta | Ricardio | 5 | Alho, Estaca |
| 2 | Caverna | Hierofante | 7 | + Sol (suspenso) |
| 3 | Reino dos Vampiros | Imperatriz | 10 | + O Tolo (suspenso) |

---

## Estrutura de Arquivos

```
game/
├── index.html
├── css/
│   └── style.css
├── js/
│   ├── player.js       — Movimentação, animação e ações da Marceline
│   ├── controls.js     — Captura de teclado e navegação de menu
│   ├── collision.js    — Detecção de colisões e dano
│   ├── considzenyte.js — Criação de inimigos, IA e sistema de vida deles
│   ├── ui.js           — Atualização do HUD (vidas, pontos, fase)
│   ├── audio.js        — Música, efeitos sonoros e configurações de áudio
│   ├── victory.js      — Telas de vitória por fase e vitória final
│   └── game.js         — Loop principal, estados do jogo e carregamento de fases
└── assets/
    ├── images/         — Sprites e backgrounds
    └── audio/          — Trilhas sonoras (.mp3)
```

---

## Assets necessários

### Imagens (`assets/images/`)
| Arquivo | Descrição |
|---------|-----------|
| `marci-run1/2/3.png` | Frames de corrida |
| `marci-crouch1/2/3.png` | Frames de agachamento |
| `marci-attack1/2.png` | Frames de ataque com a guitarra |
| `marci-gameover.png` | Frame de game over |
| `background_fase1/2/3.png` | Cenários de cada fase |
| `garlic.png` | Obstáculo: alho |
| `stake.png` | Obstáculo: estaca |
| `sun.png` | Obstáculo suspenso: sol |
| `fool.png` | Obstáculo suspenso: O Tolo |
| `ricardio.png` | Inimigo da fase 1 |
| `hierofante.png` | Inimigo da fase 2 |
| `imperatriz.png` | Inimigo da fase 3 |

### Áudio (`assets/audio/`)
| Arquivo | Música |
|---------|--------|
| `fase1.mp3` | I'm Just Your Problem |
| `fase2.mp3` | Remember You |
| `fase3.mp3` | Everything Stays |

> Se os arquivos de áudio não existirem, o jogo continua funcionando com sons sintéticos via Web Audio API.

---

## Ferramentas e Recursos Utilizados

### Músicas
As trilhas sonoras de cada fase foram obtidas em [mp3.pm](https://mp3.pm/) e editadas (corte, volume e duração) no [Veed.io](https://veed.io/workspaces).

### Imagens
Os sprites e backgrounds foram gerados com auxílio das ferramentas de IA **Microsoft Copilot** e **ChatGPT**, e posteriormente editados e ajustados no **GIMP**.

---

## Divisão de Responsabilidades

Projeto desenvolvido individualmente.

| Membro | Responsabilidades |
|--------|------------------|
| [Maria Fernanda Sousa Cruz] | Desenvolvimento de todas as etapas do jogo, criação e edição dos assets visuais e sonoros |

---

## Requisitos Técnicos Atendidos

- HTML, CSS e JavaScript puro (sem engines ou canvas)
- Estados do jogo: menu, jogando, pausado, game over, vitória
- Interação por teclado
- Movimentação de elementos (Marceline, inimigos, projéteis)
- Detecção de colisões via `getBoundingClientRect()`
- Sistema de vidas e pontuação
- Criação e remoção dinâmica de elementos do DOM
- Aumento de dificuldade por fases
- Modularização em 8 arquivos JS

## Funcionalidades Adicionais

- Diferentes tipos de inimigos com comportamentos distintos
- Obstáculos com comportamentos distintos (chão vs suspenso)
- Efeitos sonoros e música por fase
- Menu inicial com instruções e configurações
- `localStorage` para armazenar recorde de pontuação
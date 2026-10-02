# Pata Amiga — Landing page

Página estática (HTML, CSS e JavaScript puros, sem build nem dependências), seguindo a identidade **Afeto com presença** (`Pata-Amiga-identidade-visual.md`).

## Como executar

Abra `index.html` no navegador, ou sirva a pasta localmente:

```bash
npx serve .
# ou
python3 -m http.server 8080
```

## Estrutura

```
index.html               Página completa
assets/css/styles.css    Tokens de cor/tipografia e estilos (mobile first)
assets/js/config.js      Dados de contato: WhatsApp, telefone, endereço, horários, redes
assets/js/main.js        Menu móvel, CTAs, dados de contato e trilha de pegadas
assets/img/              Imagens otimizadas (WebP + fallback JPG/PNG), favicon e imagem de compartilhamento
```


## Efeitos de pegadas

- **Margem direita (telas a partir de ~800 px):** um cão e um gato caminham pela margem conforme a rolagem; acima de ~1280 px andam lado a lado, abaixo disso em fila única compacta; ao subir, as pegadas recuam. A trilha termina em um coração ao lado do contato. Ajustes: `MIN_MARGIN`, `WIDE_MARGIN`, `REVEAL_AT` e as chamadas `walk(...)` em `main.js`.
- **"Como funciona" (todas as telas):** patinhas ligam uma etapa à outra quando a seção aparece.
- As pegadas são decorativas (`aria-hidden`) e respeitam "reduzir movimento".

## Outros efeitos

- **Hero:** textos e foto entram em sequência e a linha de vínculo se desenha até o coração. É só CSS e roda mesmo sem JS.
- **Rolagem:** seções e cards aparecem em cascata, a barra terracota no topo mostra o progresso de leitura, a foto do hero tem parallax leve e o menu destaca a seção atual.
- **Interações:** cards de serviço sobem com brilho seguindo o cursor, fotos com zoom sutil, botões com micro-movimento, FAQ abrindo deslizando e números do "Como funciona" preenchendo em sequência.
- Sem JavaScript ou com "reduzir movimento", todo o conteúdo aparece normalmente, sem animação.

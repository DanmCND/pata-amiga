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
assets/js/main.js        Menu móvel, CTAs e preenchimento dos dados de contato
assets/img/              Imagens otimizadas (WebP + fallback JPG/PNG), favicon e imagem de compartilhamento
```


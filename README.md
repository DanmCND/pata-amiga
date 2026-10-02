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

## Configurar o contato

Preencha `assets/js/config.js`. Enquanto um campo estiver vazio, a página mostra "A confirmar". Com o `whatsapp` preenchido, todos os botões "Agendar atendimento" passam a abrir o WhatsApp com uma mensagem pronta (nos cards de serviço, a mensagem já cita o serviço escolhido).

## Pendências: confirmar com a Pata Amiga

- [ ] **WhatsApp / canal de agendamento**: número real em `config.js`.
- [ ] **Endereço, link do Maps e horários**: a fachada mostra o número 328, mas sem rua nem cidade.
- [ ] **Serviços**: a página lista os 4 serviços do material da marca (consultas veterinárias, banho e tosa, hospedagem, produtos e acessórios). A fachada fala em "Orientação veterinária" e o material em "Consultas veterinárias": confirmar qual dos dois é o correto.
- [ ] **Como funciona**: as etapas Conhecer → Cuidar → Acompanhar vêm da identidade visual; validar o fluxo real.
- [ ] **FAQ**: respostas pendentes sobre horários, preços e regras da hospedagem.
- [ ] **Fotos reais**: as imagens atuais (hero e fachada) foram geradas por IA e estão marcadas como "Imagem ilustrativa". Substituir por fotos reais autorizadas.
- [ ] **Equipe**: foto real em `assets/img/equipe.jpg`, com nomes e funções. A "Imagem 4" não foi usada porque tem textos em espanhol e uma versão de logo diferente da oficial.
- [ ] **Depoimentos**: seção omitida de propósito; incluir só avaliações reais e autorizadas.
- [ ] **Provas de confiança** (tempo de atuação, formação da equipe, estrutura): há um comentário reservando o espaço na seção "Sobre".
- [ ] **Logo**: usado o arquivo original (Imagem 5), só sem as margens transparentes. Segundo a identidade, ele precisa ser vetorizado antes de produção profissional. O favicon é um recorte provisório do símbolo da logo.
- [ ] **Domínio**: quando existir, adicionar `og:url` e trocar as URLs de `og:image` por URLs absolutas.

## Notas de acessibilidade

- A terracota oficial `#C86F4A` com texto branco tem contraste de 3,6:1, abaixo do AA para textos de botão. Por isso, os botões usam `#B25D3A` (4,6:1) e os links usam `#9C4F30` (5,2:1). A terracota original fica nos detalhes decorativos.
- Da mesma forma, textos pequenos em sálvia usam `#536659` (5,3:1 sobre o creme).

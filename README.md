# HUC Studios — versão reconstruída

Esta pasta é uma reconstrução legível do `index.html` de produção enviado pelo usuário.

## O que foi preservado
- Conteúdo e estrutura visual da HUC Studios.
- Tema claro/escuro salvo no `localStorage`.
- Benefícios, portfólio e os três planos originais.
- Modal de contato.
- Envio principal para `/api/leads`.
- Fallback de notificação via FormSubmit e confirmação em `/api/leads/notification`.
- Campo honeypot `website` usado como proteção simples contra bots.

## Estrutura
- `index.html`: marcação principal da página.
- `css/styles.css`: estilos visuais extraídos e organizados a partir do build original, mais uma pequena camada para o modal sem dependências.
- `js/data.js`: planos, portfólio, benefícios e ticker.
- `js/theme.js`: modo claro/escuro.
- `js/contact.js`: modal e envio do formulário.
- `js/app.js`: montagem das partes dinâmicas.
- `index.original.minificado.html`: arquivo original, guardado apenas como referência.

## Imagens do portfólio
O arquivo enviado referencia cinco imagens externas ao HTML original. Elas não estavam disponíveis como arquivos separados no upload. Coloque os arquivos abaixo na pasta `portfolio/` para restaurar as imagens:

- `tribunal-gamer.png`
- `loading-gaming.png`
- `meme-gamer.png`
- `fnaf-fortnite.png`
- `wolverine.png`

Enquanto estiverem ausentes, o site mostra placeholders com o nome de cada projeto.

## Como testar
Por usar módulos JavaScript, prefira abrir com um servidor local, por exemplo:

```bash
python -m http.server 8000
```

Depois abra `http://localhost:8000`.

## Importante sobre o formulário
O front-end espera que exista um backend respondendo a:

- `POST /api/leads`
- `POST /api/leads/notification`

Sem esse backend, o restante do site funciona normalmente, mas o formulário não consegue registrar o lead.

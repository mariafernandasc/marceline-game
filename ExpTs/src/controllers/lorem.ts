import { type Request, type Response } from "express";
import { LoremIpsum } from "lorem-ipsum";

const loremGenerator = new LoremIpsum({
  sentencesPerParagraph: { max: 8, min: 4 },
  wordsPerSentence: { max: 16, min: 4 },
});

// GET /lorem/:n
// Retorna uma página HTML com N parágrafos de lorem ipsum
const lorem = (req: Request, res: Response) => {
  const n = parseInt(req.params.n);

  if (isNaN(n) || n <= 0) {
    res.status(400).send("<p>Informe um número inteiro positivo. Ex: /lorem/4</p>");
    return;
  }

  const paragraphs = loremGenerator.generateParagraphs(n);
  const paragraphList = paragraphs
    .split("\n")
    .filter((p) => p.trim() !== "")
    .map((p) => `<p>${p}</p>`)
    .join("\n");

  res.send(`<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <title>Lorem Ipsum</title>
  <link rel="stylesheet" href="/css/bootstrap.min.css">
  <style>
    body { padding: 2rem; font-family: sans-serif; }
    p { margin-bottom: 1rem; line-height: 1.7; }
  </style>
</head>
<body>
  ${paragraphList}
</body>
</html>`);
};

export default { lorem };

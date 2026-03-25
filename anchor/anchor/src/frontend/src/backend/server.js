const express = require('express');
const app = express();
app.use(express.json());

app.post('/api/deploy', (req, res) => {
  const { name, symbol, feeAmount } = req.body;
  console.log(`Déploiement de ${name} (${symbol}) avec frais : ${feeAmount}`);
  // Ici tu intégrerais la logique pour déployer le coin via Anchor ou Solana CLI
  res.json({ success: true, message: `Coin "${name}" déployé !` });
});

app.listen(3001, () => {
  console.log('Serveur backend lancé sur port 3001');
});

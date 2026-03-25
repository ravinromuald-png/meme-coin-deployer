const express = require('express');
const solana = require('@solana/web3.js');

const app = express();
app.use(express.json());

// Configuration de la connection à Solana
const connection = new solana.Connection(
  'https://api.devnet.solana.com',
  'confirmed'
);

// Simuler le déploiement (à remplacer par un vrai contrat Anchor)
app.post('/api/deploy', async (req, res) => {
  const { name, symbol, feeAmount } = req.body;

  try {
    // Créer une transaction pour déposer les frais
    const tx = new solana.Transaction();

    // Ajouter la création du mint (simulée)
    const account = await connection.getAccountInfo(
      'YOUR_MINT_ADDRESS'
    );

    if (!account) {
      throw new Error('Mint not found');
    }

    // Simuler le déploiement
    console.log(`Déploiement de "${name}" avec frais ${feeAmount} SOL`);

    res.json({
      success: true,
      message: `Coin "${name}" déployé avec succès !`,
      feePaid: feeAmount
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

app.listen(3001, () => {
  console.log('Server running on port 3001');
});

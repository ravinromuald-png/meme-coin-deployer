#!/bin/bash

echo "Déploiement du contrat MemeCoin..."

cd anchor && cargo build --release
anchor deploy --program-id meme_coins --cluster devnet

echo "✅ Contrat déployé avec succès !"

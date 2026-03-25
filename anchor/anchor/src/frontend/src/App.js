import React, { useState } from 'react';
import './App.css';

function App() {
  const [coinName, setCoinName] = useState('');
  const [symbol, setSymbol] = useState('');
  const [feeAmount, setFeeAmount] = useState(0);
  const [wallets, setWallets] = useState([]);
  const [isDeploying, setIsDeploying] = useState(false);

  // Fonction pour déployer le coin
  const deployMemeCoin = async () => {
    if (!coinName || !symbol) return;

    setIsDeploying(true);
    
    try {
      await fetch('/api/deploy', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: coinName,
          symbol: symbol,
          feeAmount: feeAmount
        })
      });

      alert(`Coin "${coinName}" déployé avec succès !`);

      // Afficher le lien vers Pump.fun
      const pumpfunUrl = `https://pump.fun/${coinName}`;
      window.open(pumpfunUrl, '_blank');
      
    } catch (error) {
      console.error(error);
      alert('Erreur lors du déploiement.');
    } finally {
      setIsDeploying(false);
    }
  };

  // Fonction pour créer un wallet
  const createWallet = () => {
    const newWallet = `wallet_${Date.now()}`;
    setWallets(prev => [...prev, newWallet]);
  };

  return (
    <div className="App">
      <h1>🚀 MemeCoin Deployer</h1>
      
      {/* Formulaire de déploiement */}
      <div style={{ margin: '20px' }}>
        <input
          value={coinName}
          onChange={(e) => setCoinName(e.target.value)}
          placeholder="Nom du coin"
          style={{ padding: '8px', marginRight: '10px' }}
        />
        <input
          value={symbol}
          onChange={(e) => setSymbol(e.target.value)}
          placeholder="Symbole (ex: MEME)"
          style={{ padding: '8px', marginRight: '10px' }}
        />
        <input
          type="number"
          value={feeAmount}
          onChange={(e) => setFeeAmount(Number(e.target.value))}
          placeholder="Frais en SOL"
          style={{ padding: '8px', marginRight: '10px' }}
        />
        <button onClick={deployMemeCoin} disabled={isDeploying}>
          {isDeploying ? 'Déploiement...' : 'Déployer le Coin'}
        </button>
      </div>

      {/* Création de wallets */}
      <div style={{ margin: '20px' }}>
        <h3>Créer un Wallet</h3>
        <button onClick={createWallet} style={{ padding: '10px', backgroundColor: '#4CAF50', color: 'white' }}>
          + Créer un Wallet
        </button>
      </div>

      {/* Liste des wallets */}
      <div style={{ margin: '20px' }}>
        <h3>Wallets créés</h3>
        {wallets.map((w, i) => (
          <p key={i}>{w}</p>
        ))}
      </div>

      {/* Affichage du coin déployé */}
      <div style={{ margin: '20px' }}>
        <h3>Coins Déployés</h3>
        {coinName && (
          <ul>
            <li><strong>{coinName} ({symbol})</strong> - Frais : {feeAmount} SOL</li>
            {/* Lien vers Pump.fun */}
            <li style={{ marginTop: '10px' }}>
              👉 <a href={`https://pump.fun/${coinName}`} target="_blank" rel="noreferrer">
                Voir le Coin sur Pump.fun
              </a>
            </li>
          </ul>
        )}
      </div>

      {/* Prochaines fonctionnalités à ajouter */}
      <div style={{ margin: '20px', backgroundColor: '#f0f0f0', padding: '15px', borderRadius: '8px' }}>
        <h3>🚀 Prochaines fonctionnalités à ajouter :</h3>
        <ul style={{ paddingLeft: '20px' }}>
          <li>✅ Gestion des frais en SOL via RPC Solana</li>
          <li>✅ Création d’un pool LP avec spl-token</li>
          <li>✅ Intégration de Pump.fun API (générer l’URL)</li>
          <li>✅ Déploiement multi-wallets (créer plusieurs coins en un clic)</li>
        </ul>
      </div>

      {/* Intégration Pump.fun */}
      <div style={{ margin: '20px' }}>
        <h3>✅ Coin ajouté à Pump.fun</h3>
        <p>Le coin sera automatiquement ajouté sur <a href="https://pump.fun" target="_blank" rel="noreferrer">Pump.fun</a></p>
      </div>
    </div>
  );
}

export default App;

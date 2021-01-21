import React, {useState, useEffect} from 'react';
import Computer from 'bitcoin-computer';
import './App.css';
import Card from './card';
import Artwork from './artwork';

function App () {
  const [computer, setComputer] = useState (
    new Computer ({
      seed: 'ugly desk like kite transfer crazy bid twin laugh quiz amused pill',
      chain: 'BSV',
      network: 'testnet',
    })
  );
  const [balance, setBalance] = useState (0);

  const [title, setTitle] = useState ('');
  const [description, setDescription] = useState ('');
  const [url, setUrl] = useState ('');
  const [issuer, setIssuer] = useState ('');

  const [revs, setRevs] = useState ([]);
  const [artworks, setArtworks] = useState ([]);
  const [refresh, setRefresh] = useState (0);

  useEffect (
    () => {
      const fetchRevs = async () => {
        setBalance (await computer.db.wallet.getBalance ());
        setRevs (await computer.getRevs (computer.db.wallet.getPublicKey ()));
        setTimeout (() => setRefresh (refresh + 1), 3500);
      };
      fetchRevs ();
    },
    [computer, computer.db.wallet, refresh]
  );

  useEffect (
    () => {
      const fetchArtworks = async () => {
        setArtworks (
          await Promise.all (revs.map (async rev => computer.sync (rev)))
        );
      };
      fetchArtworks ();
    },
    [revs, computer]
  );

  useEffect (() => console.log ('revs', revs), [revs]);
  useEffect (() => console.log ('artworks', artworks), [artworks]);

  const handleSubmit = async evt => {
    evt.preventDefault ();
    const artwork = await computer.new (Artwork, [
      title,
      description,
      url,
      issuer,
    ]);
    console.log ('created artwork', artwork);
  };

  return (
    <div className="App">
      <h1>DappToken.io</h1><h2>powered by BitcoinComputer</h2>
      <h2>Wallet</h2>
      <b>Address</b>&nbsp;{computer.db.wallet.getAddress ().toString ()}<br />
      <b>Public Key</b>
      &nbsp;
      {computer.db.wallet.getPublicKey ().toString ()}
      <br />
      <b>Balance</b>
      &nbsp;
      {balance / 1e8}
      {' '}
      {computer.db.wallet.restClient.chain}
      <br />
      <button type="submit" onClick={() => setComputer (new Computer ())}>
        Generate New Wallet
      </button>

      <h2>Create new NFT</h2>
      <form onSubmit={handleSubmit}>
        issuer<br />
        <input
          type="string"
          value={issuer}
          onChange={e => setIssuer (e.target.value)}
        />
        <br />
        Title<br />
        <input
          type="string"
          value={title}
          onChange={e => setTitle (e.target.value)}
        />
        <br />

        Description<br />
        <input
          type="string"
          value={description}
          onChange={e => setDescription (e.target.value)}
        />
        <br />

        Url<br />
        <input
          type="string"
          value={url}
          onChange={e => setUrl (e.target.value)}
        />
        <br />

        <button type="submit" value="Send Bitcoin">Create NFT</button>
      </form>

      <h2>Your NFT's</h2>
      <ul className="flex-container">
        {artworks.map (artwork => (
          <Card artwork={artwork} key={artwork.title + artwork.artist} />
        ))}

      </ul>
    </div>
  );
}

export default App;

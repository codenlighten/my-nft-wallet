import React, {useState, useEffect} from 'react';
import Computer from 'bitcoin-computer';
import './App.css';
import Card from './card';
import Artwork from './artwork';

function App () {
  const [computer, setComputer] = useState (
    new Computer ({
      seed: '',
      chain: 'BSV',
    })
  );
  const [balance, setBalance] = useState (0);

  const [title, setTitle] = useState ('');
  const [artist, setArtist] = useState ('');
  const [url, setUrl] = useState ('');

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
    const artwork = await computer.new (Artwork, [title, artist, url]);
    console.log ('created artwork', artwork);
  };

  return (
    <div className="App">
      <h1>Your NFT Wallet</h1>
      <h2>
        built on
        <a href="BitcoinComputer.io">BitcoinComputer</a>
      </h2>
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
        Title<br />
        <input
          type="string"
          value={title}
          onChange={e => setTitle (e.target.value)}
        />
        <br />
        Features<br />
        <input
          type="string"
          value={artist}
          onChange={e => setArtist (e.target.value)}
        />
        <br />
        Source URL<br />
        <input
          type="string"
          value={url}
          onChange={e => setUrl (e.target.value)}
        />
        <br />
        <button type="submit" value="Send Bitcoin">Create NFT</button>
      </form>

      <h2>Your NFTS</h2>
      <ul className="flex-container">
        {artworks.map (artwork => (
          <Card artwork={artwork} key={artwork.title + artwork.artist} />
        ))}
      </ul>
    </div>
  );
}

export default App;

import React, {useState, useEffect} from 'react';
import Computer from 'bitcoin-computer';
import './App.css';
import Card from './card';
import NFT from './artwork';

function App () {
  const [computer, setComputer] = useState (
    new Computer ({
      seed: 'view play hello artwork vital duck sad game gate dish talk pause',
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
  const [nfts, setNFTs] = useState ([]);
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
      const fetchNFTs = async () => {
        setNFTs (
          await Promise.all (revs.map (async rev => computer.sync (rev)))
        );
      };
      fetchNFTs ();
    },
    [revs, computer]
  );

  useEffect (() => console.log ('revs', revs), [revs]);
  useEffect (() => console.log ('nfts', nfts), [nfts]);

  const handleSubmit = async evt => {
    evt.preventDefault ();
    const nft = await computer.new (NFT, [issuer, title, description, url]);
    console.log ('created nft', nft);
  };

  return (
    <div className="App">
      <h1>DappToken</h1>
      <h4>powered by BitcoinComputer</h4>
      <h3>My Wallet</h3>
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
        {nfts.map (nft => (
          <Card nft={nft} key={nft.issuer + nft.title + nft.artist} />
        ))}

      </ul>
    </div>
  );
}

export default App;

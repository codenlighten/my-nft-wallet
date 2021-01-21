import './card.css';
import React from 'react';

export default ({nft}) => {
  const handleClick = () => {
    const publicKey = prompt ('Please enter the public key of the new owner');
    if (publicKey) nft.setOwner (publicKey);
  };

  return nft
    ? <div className="card" onClick={handleClick}>
        <img src={nft.url || nft.imageUrl} alt={nft.title} />
        <div className="container">
          <br />
          Issuer: {nft.issuer}<br />
          Title: <b>{nft.title}</b>
          <br />
          Description: {nft.description}<br />
        </div>
      </div>
    : <div />;
};

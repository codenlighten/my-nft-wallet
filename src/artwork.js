export default class NFT {
  constructor (issuer, title, description, url) {
    this.issuer = issuer;
    this.title = title;
    this.description = description;
    this.url = url;
  }

  setOwner (owner) {
    this._owners = [owner];
  }
}

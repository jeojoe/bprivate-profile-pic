import React, { Component } from 'react';
import request from 'superagent';
import config from '../config';

export default class Home extends Component {
  state = {
    file: null,
  }

  _uploadFile = (file) => {
    console.log(file);
    request
      .post(config.SERVER_URL)
      .send(file)
      .end((err, res) => console.log(res, err));
  }

  _formSubmit = (e) => {
    e.preventDefault();
    this._uploadFile(this.state.file);
  }

  render() {
    return (
      <form onSubmit={this._formSubmit}>
        <input
          type="file"
          onChange={e => this.setState({ file: e.target.files[0] })}
        />
        <button type="submit">Upload!</button>
      </form>
    );
  }
}

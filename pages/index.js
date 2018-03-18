import React, { Component } from 'react';
import { Head } from 'next/head';
import request from 'superagent';

import config from '../config';
import { Layout } from '../components';

export default class Home extends Component {
  state = {
    file: null,
    resultUrl: null,
  }

  _uploadFile = (file) => {
    console.log(file);
    request
      .post(config.SERVER_URL)
      .send(file)
      .buffer(true)
      .then((err, res) => console.log(res, err));
  }

  _formSubmit = (e) => {
    e.preventDefault();
    this._uploadFile(this.state.file);
  }

  render() {
    return (
      <Layout>
        <div className="container">
          <h1 className="header">Bitcoin Private Profile Pic Generator (Beta!)</h1>
          <p>Always be private.</p>
          <div className="row">
            <div className="col-12 col-md-6">
              <figure className="figure">
                <img
                  src="https://jeojoe.sgp1.digitaloceanspaces.com/bprivate-profile-pic/cjewhw2f100002ipz3w1kc83a"
                  className="figure-img img-fluid rounded"
                  alt="It's Elon Musk!"
                />
                <figcaption className="figure-caption text-right">
                  Guess who is in above image.
                </figcaption>
              </figure>
            </div>
            <div className="col-12 col-md-6">
              <form onSubmit={this._formSubmit}>
                <div className="form-group">
                  <label htmlFor="uploadFile">
                    Create your private profile pic
                  </label>
                  <div className="custom-file">
                    <input
                      type="file"
                      className="custom-file-input"
                      onChange={e => this.setState({ file: e.target.files[0] })}
                      id="uploadFile"
                    />
                    <label
                      className="custom-file-label"
                      htmlFor="uploadFile"
                    >
                      Choose file
                    </label>
                  </div>
                </div>

                <div className="form-group">
                  <button
                    type="submit"
                    className="btn btn-info btn-lg btn-block"
                  >
                    Be Private!
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
        <style jsx>{`
          .container {
            padding-top: 30px;
          }
          .header {
            font-family: 'Ubuntu', sans-serif;
            font-weight: bold;
            color: #272D63;
          }
        `}
        </style>
      </Layout>
    );
  }
}

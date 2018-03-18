import React, { Component } from 'react';
import { Head } from 'next/head';
import request from 'superagent';

import config from '../config';
import { Layout, Header, Showcase } from '../components';

export default class Home extends Component {
  state = {
    file: null,
    resultUrl: null,
  }

  _uploadFile = (file) => {
    request
      .post(config.SERVER_URL)
      .send(file)
      .buffer(true)
      .then((err, res) => {
        if (err) {
          console.log(err);
          console.log(res);
          this.setState({ resultUrl: null });
          return;
        }
        // Success
        console.log(res.body);
        this.setState({ resultUrl: res.body });
      });
  }

  _formSubmit = (e) => {
    e.preventDefault();
    this._uploadFile(this.state.file);
    this.setState({ file: null });
  }

  render() {
    return (
      <Layout>
        <div className="container">
          <Header />
          <div className="row">
            <div className="col-12 col-md-6"> <Showcase /> </div>
            <div className="col-12 col-md-6">
              {/* Form */}
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

              {/* Result Image */}
              {this.state.resultUrl &&
                <img
                  src={this.state.resultUrl}
                  alt="Your private profile pic."
                />
              }

            </div>
          </div>
        </div>
        <style jsx>{`
          .container {
            padding-top: 30px;
          }
        `}
        </style>
      </Layout>
    );
  }
}

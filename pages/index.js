import React, { Component } from 'react';
import request from 'superagent';

import config from '../config';
import { Layout, Header, Showcase, Cropper } from '../components';

export default class Home extends Component {
  state = {
    file: null,
    fileUrl: '',
    resultUrl: null,
    loading: false,
  }

  _onChangeFile = (e) => {
    const file = e.target.files[0];
    if (!file) {
      this.setState({ fileUrl: '', file });
      return;
    }

    const reader = new FileReader(); // eslint-disable-line
    reader.readAsDataURL(file);

    reader.onloadend = () => {
      this.setState({ fileUrl: reader.result, file });
    };
  }

  _uploadFile = (file) => {
    this.setState({ loading: true });
    request
      .post(config.SERVER_URL)
      .send(file)
      .buffer(true)
      .then((res) => {
        this.setState({ loading: false, resultUrl: res.text });
      })
      .catch((err) => {
        this.setState({ loading: false, resultUrl: null });
        alert('Something went wrong! contact jirat.onaree@gmail.com');
        console.log(err);
      });
  }

  _formSubmit = (e) => {
    e.preventDefault();
    this._uploadFile(this.state.file);
    this.setState({ file: null, fileUrl: '' });
  }

  render() {
    const isCropping = this.state.file && this.state.fileUrl;

    return (
      <Layout>
        <div className="container">
          <Header />
          <div className="row">
            <div className="col-12 col-md-6">
              <Showcase
                loading={this.state.loading}
                resultUrl={this.state.resultUrl}
              />
            </div>
            <div className="col-12 col-md-6 d-flex align-items-center">
              <div>
                {/* Cropper */}
                {isCropping &&
                  <Cropper
                    fileUrl={this.state.fileUrl}
                    file={this.state.file}
                    loading={this.state.loading}
                  />
                }

                {/* Form */}
                <form onSubmit={this._formSubmit}>
                  <div className="form-group">
                    <label htmlFor="uploadFile">
                      {isCropping ?
                        'Or' : 'Create your private profile pic here'
                      }
                    </label>
                    <div className="custom-file">
                      <input
                        type="file"
                        className="custom-file-input"
                        onChange={this._onChangeFile}
                        id="uploadFile"
                      />
                      <label
                        className="custom-file-label"
                        htmlFor="uploadFile"
                      >
                        {isCropping ? 'Choose new file..' : 'Choose file..'}
                      </label>
                    </div>
                  </div>
                </form>
              </div>
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

import React, { Component } from 'react';
import { Cropper } from 'react-image-cropper';
import request from 'superagent';

import { Loader } from '../components';
import config from '../config';

class CropperComponent extends Component {
  _upload = () => {
    this.props._setLoadingAndUrl(true, null);
    request
      .post(config.SERVER_URL)
      .send({
        base64: this.cropper.crop(),
      })
      .buffer(true)
      .then((res) => {
        this.props._setLoadingAndUrl(false, res.text);
        this.props._resetFile();
      })
      .catch((err) => {
        this.props._setLoadingAndUrl(false, null);
        this.props._resetFile();
        console.log(err);
        alert('Something went wrong! contact jirat.onaree@gmail.com');
      });
  }

  render() {
    return (
      <div className="wrapper">
        {this.props.loading &&
          <div className="loading-overlay d-flex justify-content-center align-items-center">
            <Loader />
          </div>
        }
        <div style={{ width: '100%', marginBottom: '15px' }}>
          <Cropper
            src={this.props.fileUrl}
            ref={(ref) => { this.cropper = ref; }}
            disabled={this.props.loading}
          />
        </div>
        <div className="form-group">
          <button
            type="submit"
            className="btn btn-info btn-lg btn-block"
            onClick={this._upload}
            disabled={this.props.loading}
          >
            {this.props.loading ? 'Becoming private..' : 'Be Private !'}
          </button>
        </div>
        <style jsx>{`
          .wrapper {
            width: 100%;
            margin-bottom: 30px;
          }
          .loading-overlay {
            position: absolute;
            z-index: 999;
            width: 100%;
          }
        `}
        </style>
      </div>
    );
  }
}

export default CropperComponent;

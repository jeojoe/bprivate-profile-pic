import React, { Component } from 'react';
import { Cropper } from 'react-image-cropper';
import request from 'superagent';

import config from '../config';

class CropperComponent extends Component {
  _upload = () => {
    // console.log(this.cropper.values());
    request
      .post(config.SERVER_URL)
      .send({
        base64: this.cropper.crop(),
      })
      .buffer(true)
      .then((res) => {
        this.props._setLoadingAndUrl(false, res.text);
      })
      .catch((err) => {
        this.props._setLoadingAndUrl(false, null);
        alert('Something went wrong! contact jirat.onaree@gmail.com');
        console.log(err);
      });
  }

  render() {
    return (
      <div className="wrapper">
        <div style={{ width: '100%', marginBottom: '15px' }}>
          <Cropper
            src={this.props.fileUrl}
            ref={(ref) => { this.cropper = ref; }}
          />
        </div>
        <div className="form-group">
          <button
            type="submit"
            className="btn btn-info btn-lg btn-block"
            onClick={this._upload}
          >
            {this.props.loading ? 'Generating..' : 'Be Private!'}
          </button>
        </div>
        <style jsx>{`
          .wrapper {
            width: 100%;
          }
        `}
        </style>
      </div>
    );
  }
}

export default CropperComponent;

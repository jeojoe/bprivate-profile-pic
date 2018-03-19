import React, { Component } from 'react';
import { Cropper } from 'react-image-cropper';

class CropperComponent extends Component {
  _upload = () => {
    console.log(this.cropper.crop());
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

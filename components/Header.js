import React from 'react';

import config from '../config';

export default () => (
  <div className="wrapper">
    <div className="d-flex">
      <img
        src="https://btcprivate.org/images/branding/icon.svg"
        alt="BTCP - Bitcoin Private Logo"
        className="logo"
      />
      <div>
        <h1 className="header">
          <span className="italic">
            Bitcoin <span className="light-blue">Private</span>
          </span> Profile Picture Generator
        </h1>
        <p>Always be private, even your profile pic! (Beta)</p>
      </div>
    </div>
    <style jsx>{`
      .wrapper {
        margin-bottom: 24px;
      }
      .logo {
        height: 100px;
        margin-right: 15px;
      }
      .header {
        font-family: 'Ubuntu', sans-serif;
        font-weight: bold;
        color: ${config.COLOR_PRIMARY.trim()};
      }
      .italic {
        font-style: italic;
      }
      .light-blue {
        color: ${config.COLOR_SECONDARY.trim()};
      }
      @media (max-width: 768px) {
        .logo {
          height: 55px;
          margin-right: 10px;
        }
      }
    `}
    </style>
  </div>
);

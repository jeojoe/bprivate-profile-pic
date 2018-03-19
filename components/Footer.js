import React from 'react';

export default () => (
  <div className="wrapper">
    {/* <blockquote className="blockquote mb-0">
      <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer posuere erat a ante.</p>
      <footer className="blockquote-footer">
        <small className="text-muted">
          Someone famous in <cite title="Source Title">Source Title</cite>
        </small>
      </footer>
      <small className="text-muted">
        Created by <a href="https://jeojoe.com">jeojoe</a>
      </small>
    </blockquote> */}
    <blockquote className="blockquote mb-0">
      <footer className="blockquote-footer">
        <small className="text-muted">
          Created by <a href="https://jeojoe.com">jeojoe</a>
        </small>
      </footer>
    </blockquote>
    <style jsx>{`
      .wrapper {
        padding-top: 30px;
      }
    `}
    </style>
  </div>
);

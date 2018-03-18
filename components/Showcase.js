import React from 'react';

export default ({ loading, resultUrl }) => (
  <figure className="figure">
    <img
      src={resultUrl || 'https://jeojoe.sgp1.digitaloceanspaces.com/bprivate-profile-pic/showcase'}
      className="figure-img img-fluid rounded"
      alt={resultUrl ? 'Hmmm...' : 'It\'s Elon Musk!'}
    />
    <figcaption className="figure-caption text-right">
      {resultUrl ? 'Hmmm 🤔 who\'s in this picture..' : 'Guess who is in above image.'}
    </figcaption>
  </figure>
);

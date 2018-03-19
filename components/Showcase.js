import React from 'react';

// hackerman : https://jeojoe.sgp1.digitaloceanspaces.com/bprivate-profile-pic/cjeyl9jot0000ompz7yjk1gt0.jpeg
// elon : https://jeojoe.sgp1.digitaloceanspaces.com/bprivate-profile-pic/cjeylakpu0001ompzudkn9vqm.jpeg
// satoshi : https://jeojoe.sgp1.digitaloceanspaces.com/bprivate-profile-pic/cjeylczo80000zapzzpkzu2ix.jpeg

export default ({ loading, resultUrl }) => (
  <figure className="figure">
    <img
      src={resultUrl || (Math.random() >= 0.5 ?
        'https://jeojoe.sgp1.digitaloceanspaces.com/bprivate-profile-pic/cjeyl9jot0000ompz7yjk1gt0.jpeg'
        :
        'https://jeojoe.sgp1.digitaloceanspaces.com/bprivate-profile-pic/cjeylakpu0001ompzudkn9vqm.jpeg')
      }
      className="figure-img img-fluid rounded"
      alt={resultUrl ? 'Hmmm...' : 'Haha not gonna tell you!'}
    />
    <figcaption className="figure-caption text-right">
      {resultUrl ? 'Hmmm 🤔 who\'s in this picture..' : 'Guess who is in above image.'}
    </figcaption>
  </figure>
);

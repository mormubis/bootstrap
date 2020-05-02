import React, { useEffect, useState } from 'react';
import PropTypes from '@prop-types';
import styled from '@styled-components';

async function load(file) {
  return (await import(`../../assets/images/icons/${file}.svg`)).default;
}

const Icon = ({ name, children = name, ...props }) => {
  const [SVG, setSVG] = useState(null);

  useEffect(() => {
    let current = true;

    (async () => {
      try {
        const svg = await load(name);

        if (current) {
          setSVG(() => svg);
        }
      } catch (error) {
        // eslint-disable-next-line no-console
        console.warn(`Missing icon: ${name}`);
      }
    })();

    return () => {
      current = false;
    };
  }, [name]);

  return SVG && <SVG aria-label={children} role="img" {...props} />;
};

Icon.propTypes = {
  children: PropTypes.node,
  name: PropTypes.string.isRequired,
};

export default styled(Icon)``;

import PropTypes from 'prop-types';
import { deprecate } from 'react-is-deprecated';

export default {
  ...PropTypes,
  deprecate,
  ref: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.shape({ current: PropTypes.any }),
  ]),
};

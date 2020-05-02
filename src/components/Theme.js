import React from 'react';
import { ThemeProvider } from '@styled-components';

import palette from '../theme';

const Theme = props => <ThemeProvider {...props} theme={palette} />;

export default Theme;

import styled from 'styled-components';

const theme = key => props => {
  const value = props.theme[key];

  if (!value) {
    // eslint-disable-next-line no-console
    console.warn(`[styled-components]: '${key}' doesn't exist in theme`);
  }

  return value;
};

const prop = key => props => props[key];

const withStyles = (styles, ...interpolations) => {
  return function Styles(WrappedComponent) {
    return styled(WrappedComponent)(styles, ...interpolations);
  };
};

export {
  css,
  createGlobalStyle,
  keyframes,
  ThemeProvider,
  withTheme,
} from 'styled-components';

export { prop, theme, withStyles };

export default styled;

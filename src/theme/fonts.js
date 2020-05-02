// I want to keep the order by font size instead of alphabetical
/* eslint-disable sort-keys */
import { css } from '@styled-components';

export default {
  '--font-xlarge': css`
    font-size: 2.2rem;
    line-height: 2.4rem;
  `,
  '--font-large': css`
    font-size: 1.6rem;
    line-height: 2.4rem;
  `,
  '--font-medium': css`
    font-size: 1.4rem;
    line-height: 1.6rem;
  `,
  '--font-small': css`
    font-size: 1.2rem;
    line-height: 1.6rem;
  `,

  '--font-weight-book': css`
    font-weight: 400;
  `,
  '--font-weight-medium': css`
    font-weight: 500;
  `,
  '--font-weight-demi': css`
    font-weight: 600;
  `,
};

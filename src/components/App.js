import React from 'react';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import {} from 'react-router-dom';

import Router, { Route, Switch, useLocation } from 'Components/Router';
import Theme from 'Components/Theme';

import Detail from 'Views/Detail';
import Master from 'Views/Master';

const App = () => {
  const location = useLocation();

  return (
    <TransitionGroup component={null}>
      <CSSTransition key={location.key} classNames="view" timeout={500}>
        <Switch location={location}>
          <Route component={Detail} path="/static/:path+" />
          <Route component={Master} />
        </Switch>
      </CSSTransition>
    </TransitionGroup>
  );
};

const Wrapper = () => (
  <Router>
    <Theme>
      <App />
    </Theme>
  </Router>
);

export default Wrapper;

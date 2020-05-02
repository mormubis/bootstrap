import { BrowserRouter, useLocation } from 'react-router-dom';

function useQuery() {
  return Object.fromEntries(
    new URLSearchParams(useLocation().search).entries(),
  );
}

export {
  Link,
  NavLink,
  Switch,
  Redirect,
  Route,
  useHistory,
  useParams,
} from 'react-router-dom';

export { useQuery, useLocation };

export default BrowserRouter;

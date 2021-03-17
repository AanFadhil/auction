import config from './config'
import { Switch, Route, Redirect, matchPath, useLocation } from 'react-router-dom'
import { storageGetItem } from './utilities/utilities'
import Login from './pages/Login'
import asyncComponent from './hoc/asyncComponent/asyncComponent';
import Layout from './hoc/layout';

const Settings = asyncComponent(() => {
  return import('./pages/Settings');
});
const Detail = asyncComponent(() => {
  return import('./pages/Detail');
});
const Home = asyncComponent(() => {
  return import('./pages/Home');
});

const App = props => {

  const { pathname } = useLocation()

  const currUrl = pathname
  const isLogin = matchPath(currUrl, {
    path: "/login"
  })

  const token = storageGetItem(config.AUTH_STORAGE_KEY)
  if (props.loading) {
    return (
      <div>Loading...</div>
    )
  } else if ((token && typeof (token) !== 'undefined') || isLogin) {
    return (
      <Switch>
        <Route path="/settings" exact component={Settings} />
        <Route path="/login" component={Login} />
        <Route path="/:id" exact component={Detail} />
        <Route path="/" exact component={Home} />
      </Switch>
    )
  } else {

    return (
      <Redirect to={'/login'} />
    )
  }
}

export default App

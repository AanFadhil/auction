import config from './config'
import { Switch, Route, Redirect, matchPath, useLocation } from 'react-router-dom'
import { connect } from 'react-redux'
import * as authactions from './store/actions/auth'
import { isNullOrEmpty, storageGetItem } from './utilities/utilities'

import Login from './pages/Login/Login'
import asyncComponent from './hoc/asyncComponent/asyncComponent';
import { useEffect } from 'react'

const Settings = asyncComponent(() => {
  return import('./pages/Settings/Settings');
});
const Detail = asyncComponent(() => {
  return import('./pages/Detail/Detail');
});
const Home = asyncComponent(() => {
  return import('./pages/Home/Home');
});

const App = ({ validateToken:validateTokenProps, user, loading }) => {

  const { pathname } = useLocation()
  const validateToken = validateTokenProps
  
  const token = storageGetItem(config.AUTH_STORAGE_KEY)
  useEffect(() => {
    if (isNullOrEmpty(user)) {
      validateToken()
    }
  }, [token])
  useEffect(() => {
    if (isNullOrEmpty(user)) {
      validateToken()
    }
  }, [])

  const currUrl = pathname
  const isLogin = matchPath(currUrl, {
    path: "/login"
  })

  if (loading) {
    return (
      <div>Loading...</div>
    )
  } else if ((token && typeof (token) !== 'undefined') || isLogin) {
    return (
      <Switch>
        <Route path="/settings" exact component={Settings} />
        <Route path="/login" component={Login} />
        <Route path="/item/:id" exact component={Detail} />
        <Route path="/" exact component={Home} />
      </Switch>
    )
  } else {

    return (
      <Redirect to={'/login'} />
    )
  }
}


const mapStateToProps = state => {
  return {
    user: state.auth.user,
    loading: state.auth.loading
  };
};

const mapDispatchToProps = dispatch => {
  return {
    validateToken: () => dispatch(authactions.validateToken())
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(App);

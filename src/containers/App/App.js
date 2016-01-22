import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { IndexLink } from 'react-router';
import { LinkContainer } from 'react-router-bootstrap';
import { Navbar, Nav, NavItem } from 'react-bootstrap';
import Helmet from 'react-helmet';
import { InfoBar } from 'components';
import { pushState } from 'redux-router';
import connectData from 'helpers/connectData';
import config from '../../config';
import Home from '../Home/Home';

function fetchData(getState, dispatch) {
  const promises = [];
  if (!isInfoLoaded(getState())) {
    promises.push(dispatch(loadInfo()));
  }
  if (!isAuthLoaded(getState())) {
    promises.push(dispatch(loadAuth()));
  }
  return Promise.all(promises);
}

class App extends Component {
  static propTypes = {
    ticksData: PropTypes.array.isRequired,
  };

  static contextTypes = {
    store: PropTypes.object.isRequired
  };

  render() {
    const { ticksData } = this.props;
    const styles = require('./App.scss');

    return (
      <div className={styles.app}>
        <Helmet {...config.app.head}/>
        <Home priceData={ticksData} />
      </div>
    );
  }
}


export default connect(state => ({ticksData: state.price.ticksData}))(App);

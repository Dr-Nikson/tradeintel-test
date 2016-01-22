
import React, { Component, PropTypes } from 'react';
import Helmet from 'react-helmet';
import config from '../../config';

import Home from '../Home/Home';


class App extends Component {

  static contextTypes = {
    store: PropTypes.object.isRequired
  };

  render() {
    const styles = require('./App.scss');

    return (
      <div className={styles.app}>
        <Helmet {...config.app.head}/>
        <Home />
      </div>
    );
  }
}

export default App;

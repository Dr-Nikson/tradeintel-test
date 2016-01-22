
import React, { Component, PropTypes } from 'react';
import Helmet from 'react-helmet';
import { connect } from 'react-redux';

import { PriceTickChart } from '../../components';


class Home extends Component {

  static propTypes = {
    ticksData: PropTypes.array.isRequired,
  };

  render() {
    const styles = require('./Home.scss');
    const { ticksData } = this.props;

    return (
      <div className={styles.home}>
        <Helmet title="Home"/>
        <div className={styles.masthead}>
          <div className="container">
            <h1>EURUSD Currency</h1>
          </div>
        </div>
        <div>
          { ticksData.length && <PriceTickChart data={ticksData} type="hybrid" />}
        </div>
      </div>
    );
  }
}

export default connect(state => ({ticksData: state.price.ticksData}))(Home);

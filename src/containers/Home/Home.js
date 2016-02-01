
import React, { Component, PropTypes } from 'react';
import Helmet from 'react-helmet';
import { connect } from 'react-redux';

import { PriceTickChart } from '../../components';


class Home extends Component {

  static propTypes = {
    ticksData: PropTypes.array.isRequired,
  };

  stopWS() {
    global.socket.close();
  }

  render() {
    const styles = require('./Home.scss');
    const { ticksData } = this.props;

    return (
      <div className={styles.home}>
        <Helmet title="Home"/>
        <div className={styles.masthead}>
          <div className="container">
            <h1>EURUSD Currency [{ticksData.length} points]</h1>
          </div>
          { !ticksData.length && <p>loading initial data ...</p> }
        </div>
        <div className="row text-center">
          <button className={`btn btn-danger ${styles.bufferBottom}`} type="button" onClick={this.stopWS}>Stop websocket</button>
        </div>
        <div>
          { ticksData.length && <PriceTickChart data={ticksData} type="hybrid" />}
        </div>
      </div>
    );
  }
}

export default connect(state => ({ticksData: state.price.ticksData}))(Home);


import React, { Component, PropTypes } from 'react';
import Helmet from 'react-helmet';
import MyChart from '../../components/MyChart/MyChart';


export default class Home extends Component {

  static propTypes = {
    priceData: PropTypes.array.isRequired,
  };

  render() {
    const styles = require('./Home.scss');
    const { priceData } = this.props;

    return (
      <div className={styles.home}>
        <Helmet title="Home"/>
        <div className={styles.masthead}>
          <div className="container">
            <h1>Real time price ticks</h1>
          </div>
        </div>
        <div>
          { priceData.length && <MyChart data={priceData} type="hybrid" />}
        </div>
      </div>
    );
  }
}

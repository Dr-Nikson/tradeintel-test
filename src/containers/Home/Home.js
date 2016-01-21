
import React, { Component } from 'react';
import d3 from 'd3';
import { Link } from 'react-router';
import { CounterButton, GithubButton } from 'components';
import config from '../../config';
import Helmet from 'react-helmet';
import MyChart from '../../components/MyChart/MyChart';
import { helper } from 'react-stockcharts';
const { TypeChooser } = helper;


export default class Home extends Component {

  constructor(props) {
    super(props);
    this._loaded = false;
    this._step = 0;
    this._data = [];
  }

  componentDidMount() {
    const { updateSome } = this;
    const parseDate = d3.time.format("%Y-%m-%d").parse;
    d3.tsv('//rrag.github.io/react-stockcharts/data/MSFT.tsv', (err, data) => {
      /* change MSFT.tsv to MSFT_full.tsv above to see how this works with lots of data points */
      const time = Date.now();
      data.forEach((d, i) => {
        d.date = new Date(time + i * 500);
        d.open = +d.open;
        d.high = +d.high;
        d.low = +d.low;
        d.close = +d.close;
        d.volume = +d.volume;
        // console.log(d);
      });
      this._loaded = true;
      this._step = 0;
      this._data = data;

      this.forceUpdate();
      setInterval(updateSome, 250);
    });
  }

  updateSome = () => {
    this._step++;
    this.forceUpdate();
  };

  render() {
    const styles = require('./Home.scss');
    const dataToRender = this._data.slice(0, this._step + 200);

    return (
      <div className={styles.home}>
        <Helmet title="Home"/>
        <div className={styles.masthead}>
          <div className="container">
            <h1>Real time price ticks</h1>
          </div>
        </div>
        <div>
          { this._loaded && <MyChart data={dataToRender} type="hybrid" />}
        </div>
      </div>
    );
  }
}

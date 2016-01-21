
import React, { Component, PropTypes } from 'react';

import { displayNumberFormat } from 'react-stockcharts/lib/utils/utils';
import { getChartDataForChart, getCurrentItemForChart } from 'react-stockcharts/lib/utils/ChartDataUtil';
import ToolTipText from 'react-stockcharts/lib/tooltip/ToolTipText';
import ToolTipTSpanLabel from 'react-stockcharts/lib/tooltip/ToolTipTSpanLabel';

const colors = { ask: '#FF7A00', bid: '#006EFF', last: '#FFFFFF' };

class RealtimePriceLabel extends Component {
  render() {
    const { name, value, color, fontFamily, fontSize, ...rest } = this.props;

    return (
      <g {...rest}>
        <ToolTipText x={0} y={0}
                     fontFamily={fontFamily} fontSize={fontSize}>
          <tspan fill="white">{name} price - Realtime </tspan>
          <tspan fill="white">{value}</tspan>
        </ToolTipText>

        <circle cx="5" cy="15" r="4" fill={color} />
      </g>
    );
  }
}


class RealTimeTickToolTip extends Component {
  static propTypes = {
    origin: PropTypes.array.isRequired,
    color: PropTypes.string.isRequired,
    displayName: PropTypes.string.isRequired,
    value: PropTypes.string.isRequired,
    onClick: PropTypes.func,
    fontFamily: PropTypes.string,
    fontSize: PropTypes.number,
  };

  render() {
    const { onClick, forChart, forDataSeries, options } = this.props;
    const translate = `translate(${this.props.origin[0]}, ${this.props.origin[1]})`;
    const SUKA = Object.keys(this.props.value).map((key, i) => {
      const value = this.props.value[key];
      return (
        <RealtimePriceLabel
          key={key}
          name={key}
          value={value}
          color={colors[key]}
          fontFamily={this.props.fontFamily}
          fontSize={this.props.fontSize}
          />
      );
    });

    return (
      <g transform={translate}>
        <line x1={0} y1={2} x2={0} y2={28} stroke={this.props.color} strokeWidth="4px"/>
        <rect x={0} y={0} width={55} height={30}
              onClick={onClick.bind(null, { chartId: forChart, dataSeriesId: forDataSeries, ...options})}
              fill="#000000" stroke="none" opacity={0.6}/>

        <ToolTipText x={5} y={11}
                     fontFamily={this.props.fontFamily} fontSize={this.props.fontSize}>
          <ToolTipTSpanLabel>{this.props.displayName}</ToolTipTSpanLabel>
          <tspan>sdf</tspan>
          <tspan>sdf</tspan>
        </ToolTipText>
        {SUKA}
      </g>
    );
  }
}

/*
 <g transform={`translate(${ absoluteOrigin[0] }, ${ absoluteOrigin[1] })`}
 onClick={onClick}>
 <ToolTipText x={0} y={0}
 fontFamily={fontFamily} fontSize={fontSize}>
 <ToolTipTSpanLabel key="label" x={0} dy="5">Date: </ToolTipTSpanLabel>
 <tspan key="value">{displayDate}</tspan>
 <ToolTipTSpanLabel key="label_O"> O: </ToolTipTSpanLabel><tspan key="value_O">{open}</tspan>
 <ToolTipTSpanLabel key="label_H"> H: </ToolTipTSpanLabel><tspan key="value_H">{high}</tspan>
 <ToolTipTSpanLabel key="label_L"> L: </ToolTipTSpanLabel><tspan key="value_L">{low}</tspan>
 <ToolTipTSpanLabel key="label_C"> C: </ToolTipTSpanLabel><tspan key="value_C">{close}</tspan>
 <ToolTipTSpanLabel key="label_Vol"> Vol: </ToolTipTSpanLabel><tspan key="value_Vol">{volume}</tspan>
 </ToolTipText>
 </g>
 */

class MyTooltip extends Component {

  static propTypes = {
    forChart: PropTypes.number.isRequired,
    displayFormat: PropTypes.func.isRequired,
    origin: PropTypes.array.isRequired,
    onClick: PropTypes.func,
    fontFamily: PropTypes.string,
    fontSize: PropTypes.number,
    forDataSeries: PropTypes.arrayOf(PropTypes.number),
  };

  static contextTypes = {
    chartData: PropTypes.array.isRequired,
    currentItems: PropTypes.array.isRequired,
  };

  static defaultProps = {
    namespace: "ReStock.MovingAverageTooltip",
    className: "react-stockcharts-moving-average-tooltip",
    displayFormat: displayNumberFormat,
    origin: [0, 10],
    width: 65,
  };

  render() {
    const chartData = getChartDataForChart(this.props, this.context);
    const item = getCurrentItemForChart(this.props, this.context);
    const { onClick, forChart, forDataSeries } = this.props;

    const { origin, height, width } = chartData.config;
    const relativeOrigin = typeof this.props.origin === "function"
      ? this.props.origin(this.context.width, this.context.height)
      : this.props.origin;
    const absoluteOrigin = [origin[0] + relativeOrigin[0], origin[1] + relativeOrigin[1]];
    const itemValue = {
      bid: item.open - item.open * 0.2,
      ask: item.open + item.open * 0.2,
      last: item.open,
    };

    return (
      <g transform={`translate(${ absoluteOrigin[0] }, ${ absoluteOrigin[1] })`} className={this.props.className}>
        <RealTimeTickToolTip
          key={0}
          origin={[0, 0]}
          displayName="EURUDS currency"
          value={itemValue}
          forChart={0} forDataSeries={0} onClick={onClick}
          fontFamily={this.props.fontFamily} fontSize={this.props.fontSize} />
        </g>
    );

    /*return (
      <g transform={`translate(${ absoluteOrigin[0] }, ${ absoluteOrigin[1] })`} className={this.props.className}>
        {chartData.config.overlays
          .filter(eachOverlay => eachOverlay.indicator !== undefined)
          .filter(eachOverlay => eachOverlay.indicator.isMovingAverage && eachOverlay.indicator.isMovingAverage())
          .filter(eachOverlay => forDataSeries === undefined ? true : forDataSeries.indexOf(eachOverlay.id) > -1)
          .map((eachOverlay, idx) => {
            var yValue = eachOverlay.yAccessor(item);
            var yDisplayValue = yValue ? this.props.displayFormat(yValue) : "n/a";
            return <SingleMAToolTip
              key={idx}
              origin={[this.props.width * idx, 0]}
              color={eachOverlay.stroke}
              displayName={eachOverlay.indicator.tooltipLabel()}
              value={yDisplayValue}
              options={eachOverlay.indicator.options()}
              forChart={forChart} forDataSeries={eachOverlay.id} onClick={onClick}
              fontFamily={this.props.fontFamily} fontSize={this.props.fontSize} />;
          })}
      </g>
    );*/
  }
}


export default MyTooltip;

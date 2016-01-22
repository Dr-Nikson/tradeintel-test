
import d3 from 'd3';

function secondsTimeScale(drawableData, indexAccessor, backingLinearScale, dateAccessor = d => d.date) {
  function formater(d) {
    return d3.time.format('%H:%M:%S')(dateAccessor(d));
  }

  function scale(x) {
    return backingLinearScale(x);
  }

  scale.isPolyLinear = function() {
    return true;
  };
  scale.invert = function(x) {
    return backingLinearScale.invert(x);
  };
  scale.data = function(x) {
    if (!arguments.length) {
      return drawableData;
    } else {
      drawableData = x;
      // this.domain([drawableData.first().index, drawableData.last().index]);
      this.domain([indexAccessor(drawableData[0]), indexAccessor(drawableData[drawableData.length - 1])]);
      return scale;
    }
  };
  scale.domain = function(x) {
    if (!arguments.length) return backingLinearScale.domain();
    // console.log("before = %s, after = %s", JSON.stringify(backingLinearScale.domain()), JSON.stringify(x))

    let d = [x[0], x[1]];
    // console.log(d);
    backingLinearScale.domain(d);
    return scale;
  };
  scale.range = function(x) {
    if (!arguments.length) return backingLinearScale.range();
    backingLinearScale.range(x);
    return scale;
  };
  scale.rangeRound = function(x) {
    return backingLinearScale.range(x);
  };
  scale.clamp = function(x) {
    if (!arguments.length) return backingLinearScale.clamp();
    backingLinearScale.clamp(x);
    return scale;
  };
  scale.interpolate = function(x) {
    if (!arguments.length) return backingLinearScale.interpolate();
    backingLinearScale.interpolate(x);
    return scale;
  };
  scale.ticks = function(m) {
    const ticks = drawableData
        .filter(d => dateAccessor(d).getSeconds() % 10 === 0)
        .reduce((res, d) => {
          if (!res.length) {
            return [ d ];
          }
          /*
             We should filter data with same seconds
             [ 11:30:20.123, 11:30:20.423 ] -> [ 11:30:18.123 ]
           */
          return Math.abs(dateAccessor(res[res.length - 1]).getTime() - dateAccessor(d).getTime()) > 1000 ?
            [ ...res, d ] :
            res
          ;
        }, [])
        .map(indexAccessor)
      ;
    // return the index of all the ticks to be displayed,
    return ticks;
  };
  scale.tickFormat = function(/* ticks */) {
    return function(index) {
      // for each index received from ticks() function derive the formatted output
      const tick = drawableData.find(item => indexAccessor(item) === index);
      return formater(tick);
    };
  };
  scale.nice = function(m) {
    backingLinearScale.nice(m);
    return scale;
  };
  scale.copy = function() {
    return secondsTimeScale(drawableData, indexAccessor, backingLinearScale.copy());
  };
  return scale;
}

const defaultFinanceDateTimeScale = function(indexAccessor) {
  return secondsTimeScale([0, 1], indexAccessor, d3.scale.linear());
};

export default defaultFinanceDateTimeScale;

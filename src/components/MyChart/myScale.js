
import d3 from 'd3';

function financeTimeScale(drawableData, indexAccessor, backingLinearScale, dateAccessor = d => d.date) {

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
    var start, end, count = 0;
    drawableData.forEach(function(d) {
      if (dateAccessor(d) !== undefined) {
        if (start === undefined) start = d;
        end = d;
        count++;
      }
    });
    m = (count / drawableData.length) * m;
    var span = (dateAccessor(end).getTime() - dateAccessor(start).getTime());
    var target = span / m;
    /*
     console.log(dateAccessor(drawableData[drawableData.length - 1])
     , drawableData[0]
     , span
     , m
     , target
     , timeScaleStepsBisector(d3_time_scaleSteps, target)
     );
     */
    /*dsads*/
    const ticks = drawableData
        .filter(d => dateAccessor(d).getSeconds() % 5 === 0)
        .reduce((res, d) => {
          if (!res.length) {
            return [ d ];
          }
          return Math.abs(dateAccessor(res[res.length - 1]).getTime() - dateAccessor(d).getTime()) > 4000 ?
            [ ...res, d ] :
            res
          ;
        }, [])
        .map(d => indexAccessor(d))
      ;
    // return the index of all the ticks to be displayed,
    // console.log(target, span, m, ticks);
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
    return financeTimeScale(drawableData, indexAccessor, backingLinearScale.copy());
  };
  return scale;
}

const defaultFinanceDateTimeScale = function(indexAccessor) {
  return financeTimeScale([0, 1], indexAccessor, d3.scale.linear());
};

export default defaultFinanceDateTimeScale;
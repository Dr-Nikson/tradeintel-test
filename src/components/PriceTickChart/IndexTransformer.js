
import stockScale from './secondsTimeScale';

const defaultOptions = {
  dateAccessor: (d) => d.date,
  indexAccessor: (d) => d.idx,
  dateMutator: (d, date) => { d.date = date; },
  indexMutator: (d, i) => ({ ...d, idx: i })
};

function IndexTransformer() {
  let newOptions;

  function transform(data, interval) {
    const { indexMutator } = newOptions;
    const responseData = {};
    const dd = data[interval];

    responseData.D = dd.map(indexMutator);
    return responseData;
  }

  transform.options = (opt) => {
    newOptions = { ...defaultOptions, ...opt };
    newOptions.xAccessor = newOptions.indexAccessor;
    newOptions.xScale = stockScale(newOptions.xAccessor);
    return newOptions;
  };

  return transform;
}

export default IndexTransformer;

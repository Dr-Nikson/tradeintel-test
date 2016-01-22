
const ADD_TICK = 'trade-intel-test/price/add_tick';
const HYDRATE = 'trade-intel-test/price/hydrate';

const initialState = {
  ticksData: []
};

export default function reducer(state = initialState, action = {}) {
  switch (action.type) {
    case ADD_TICK:
      return { ticksData: [ ...state.ticksData, action.tick ] };
    case HYDRATE:
      return { ticksData: [ ...state.ticksData, ...action.ticks ] };
    default:
      return state;
  }
}

export function addTick(tick) {
  return {
    type: ADD_TICK,
    tick,
  };
}

export function hydrate(ticks) {
  return {
    type: HYDRATE,
    ticks,
  };
}

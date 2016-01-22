/**
 * THIS IS THE ENTRY POINT FOR THE CLIENT, JUST LIKE server.js IS THE ENTRY POINT FOR THE SERVER.
 */
import 'babel/polyfill';
import React from 'react';
import ReactDOM from 'react-dom';
import {Provider} from 'react-redux';

import createStore from './redux/create';
import { ticksHandler } from './helpers/priceData/priceDataClientSocket';
import { App } from './containers';


// Three different types of scroll behavior available.
// Documented here: https://github.com/rackt/scroll-behavior
// const scrollableHistory = useScroll(createHistory);

const dest = document.getElementById('content');
const store = createStore(window.__data);

global.socket = ticksHandler(store.dispatch);

const component = (
    <App />
);

ReactDOM.render(
  <Provider store={store} key="provider">
    {component}
  </Provider>,
  dest
);

if (process.env.NODE_ENV !== 'production') {
  window.React = React; // enable debugger
}

if (__DEVTOOLS__ && !window.devToolsExtension) {
  const DevTools = require('./containers/DevTools/DevTools');
  ReactDOM.render(
    <Provider store={store} key="provider">
      <div>
        {component}
        <DevTools />
      </div>
    </Provider>,
    dest
  );
}

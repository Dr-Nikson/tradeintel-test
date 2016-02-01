
import { Server } from 'ws';
import priceData from './priceData';
import { INITIAL_DATA, NEW_TICK } from './MessageTypes';


const finalPriceData = [ ...priceData, ...[...priceData].reverse(), ...priceData ];

function createMessage(type, body) {
  return JSON.stringify({ type, body });
}

function getInitialData(data, size) {
  return data
    .slice(0, size)
    .map((el, i) => ({ ...el, date: new Date(Date.now() - 500 * (size - i)) }))
  ;
}

function fillDate(el) {
  return { ...el, date: new Date() };
}

export function ticksSource() {
  const wss = new Server({ port: 3008 });

  wss.on('connection', function connection(ws) {
    let counter = 0;
    const interval = setInterval(() => {
      if (counter + 3000 >= finalPriceData.length) {
        ws.close();
      }
      ws.send(createMessage(NEW_TICK, fillDate(finalPriceData[3000 + counter])));
      counter++;
    }, 350);

    // console.log('finalPriceData.length = ', finalPriceData.length);

    ws.on('message', function incoming(message) {
      console.log('received: %s', message);
    });

    ws.send(createMessage(INITIAL_DATA, getInitialData(finalPriceData, 3000)));
    ws.on('close', () => clearInterval(interval));
    ws.on('error', () => clearInterval(interval));
  });
}

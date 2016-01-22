
import { Server } from 'ws';
import priceData from './priceData';
import { INITIAL_DATA, NEW_TICK } from './MessageTypes';


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

  console.log('priceData', priceData.length);
  wss.on('connection', function connection(ws) {
    let counter = 0;
    const interval = setInterval(() => {
      ws.send(createMessage(NEW_TICK, fillDate(priceData[200 + counter])));
      counter++;
    }, 350);

    ws.on('message', function incoming(message) {
      console.log('received: %s', message);
    });

    ws.send(createMessage(INITIAL_DATA, getInitialData(priceData, 200)));
    ws.on('close', () => clearInterval(interval));
    ws.on('error', () => clearInterval(interval));
  });
}

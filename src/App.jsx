import styles from './App.module.css';
import { createEffect, createSignal, onMount } from 'solid-js';

import { Chart, registerables } from 'chart.js';
Chart.register(...registerables);
import protobuf from 'protobufjs';
import { Buffer } from 'buffer/';

import Grafico from './Grafico';

function App() {
  const [selectedValue, setSelectedValue] = createSignal('ETH-USD');

  let valores = [];
  let labels = [];
  const monedas = [
    { nombre: 'GameStop Corp', valor: 'GME' },
    { nombre: 'AMC Entertainment Holdings, Inc.', valor: 'AMC' },
    { nombre: 'BlackBerry Limited', valor: 'BB' },
    { nombre: 'Palantir Technologies Inc', valor: 'PLTR' },
    { nombre: 'NIO Inc', valor: 'NIO' },
    { nombre: 'Sundial Growers Inc', valor: 'SNDL' },
    { nombre: 'SOL-USD', valor: 'SOL-USD' },
    { nombre: 'ETH-USD', valor: 'ETH-USD' },
  ];

  const datasets = {
    data: [],
    fill: false,
    borderColor: 'rgb(75, 192, 192)',
    tension: 0.1,
  };

  const [data, setData] = createSignal({
    labels: [],
    datasets: [datasets],
  });

  const loadData = valorMoneda => {
    const ws = new WebSocket('wss://streamer.finance.yahoo.com');
    protobuf.load('./YPricingData.proto', (err, root) => {
      if (err) console.log(err);

      const Yaticker = root.lookupType('yaticker');

      ws.onopen = function open() {
        ws.send(
          JSON.stringify({
            subscribe: [valorMoneda],
          })
        );
      };

      ws.onclose = function close() {
        // console.log('disconnected');
      };

      ws.onmessage = function incoming(datares) {
        const response = Yaticker.decode(new Buffer(datares.data, 'base64'));
        valores.push(response['price']);
        labels.push(new Date().toLocaleTimeString());
        if (valores.length > 50) {
          valores.shift();
          labels.shift();
        }
        setData({
          ...data(),
          labels,
          datasets: [
            {
              ...datasets,
              data: [...valores],
            },
          ],
        });
      };
    });
  };

  onMount(() => {
    loadData(selectedValue());
  });

  createEffect(() => {
    loadData(selectedValue());
  });

  return (
    <div class={styles.App}>
      <div className="select">
        <label htmlFor="mValue">Valor</label>
        <select
          value={selectedValue}
          name="mValue"
          id="mValue"
          onChange={e => {
            valores = [];
            labels = [];
            setData({
              ...data(),
              labels,
              datasets: [
                {
                  ...datasets,
                  data: [...valores],
                },
              ],
            });
            setSelectedValue(e.target.value);
          }}
        >
          <For each={monedas}>
            {m => <option value={m.valor}>{m.nombre}</option>}
          </For>
        </select>
      </div>
      <Grafico data={data}></Grafico>
    </div>
  );
}

export default App;

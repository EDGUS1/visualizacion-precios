import { Chart, registerables } from 'chart.js';
Chart.register(...registerables);
import { createEffect, onMount } from 'solid-js';

function Grafico(props) {
  let canvas;
  let ctx;
  let myChart;

  onMount(() => {
    ctx = canvas.getContext('2d');
  });

  createEffect(() => {
    if (myChart) {
      myChart.destroy();
    }
    myChart = new Chart(ctx, {
      type: 'line',
      data: props.data(),

      options: {
        layout: {
            padding: 20
        },
        animation: {
          duration: 0,
        },
        plugins: {
          legend: {
            display: false,
          },
          title: {
            display: false,
          },
        },
      },
    });
  });

  return <canvas ref={canvas} id="myChart" width="1000" height="500"></canvas>;
}

export default Grafico;

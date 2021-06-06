<template>
  <div class="stock-wrapper">
    <canvas height="80" width="350" id="stockChart"></canvas>
  </div>
</template>

<script>
import { Chart, registerables,  } from 'chart.js';

Chart.register(...registerables);

export default {
  name: "StockChart",
  data() {
    return {
      companyName: null,
      xAxisLabels: [],
      prices: [],
      buyHistory: [],
      sellHistory: [],
      stockChart: null,
    }
  },
  mounted() {
    this.stockChart = new Chart(document.getElementById("stockChart"), {
          data: {
            labels: this.xAxisLabels,
            datasets: [
              {
                type: 'line',
                label: this.companyName,
                data: this.prices,
                pointRadius: 1,
                pointHitRadius: 25,
                pointHoverRadius: 6,
                pointBackgroundColor: 'rgb(100,241,241)',
                borderColor: 'rgb(100,241,241)',
                borderWidth: 0.75,
                tension: 0.5,
                fill: true,
              },
              {
                type: 'bubble',
                label: 'Buy(Date, Price, Quantity)',
                data: this.buyHistory,
                pointRadius: 5,
                pointHitRadius: 20,
                pointHoverRadius: 6,
                pointBackgroundColor: 'rgb(186,56,56)',
                borderColor: 'rgb(158,25,25)',
                borderWidth: 1,
              },
              {
                type: 'bubble',
                label: 'Sell(Date, Price, Quantity)',
                data: this.sellHistory,
                pointRadius: 5,
                pointHitRadius: 20,
                pointHoverRadius: 6,
                pointBackgroundColor: 'rgb(63,112,199)',
                borderColor: 'rgb(17,89,227)',
                borderWidth: 1,
              },
            ]
          }
        }
    )
  },
}
</script>

<style scoped>
.stock-wrapper {
  padding-bottom: 15px;
}
</style>

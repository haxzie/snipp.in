<template>
  <div class="stock-wrapper">
    <div class="stock-summary">
      Earning : {{earning}}won
    </div>
    <canvas height="80" width="350" id="stockChart"></canvas>
  </div>
</template>

<script>
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

export default {
  name: "StockChart",
  props: {
    activeFile: Object
  },
  data() {
    return {
      chart: undefined
    }
  },
  computed: {
    earning() {
      const buys = this.activeFile.stock.buyHistory.map(order => {
        return Number.parseInt(order.y) * Number.parseInt(order.q)
      })
      const sells = this.activeFile.stock.sellHistory.map(order => {
        return Number.parseInt(order.y) * Number.parseInt(order.q)
      })
      let buyingSum = 0;
      let sellingSum = 0;
      if(buys.length > 0) {
        buyingSum = buys.reduce((accumulate, currentValue) => {return accumulate + currentValue})
      }
      if(sells.length > 0) {
        sellingSum = sells.reduce((accumulate, currentValue) => {return accumulate + currentValue})
      }
      return sellingSum - buyingSum
    }
  },
  watch: {
    activeFile: function (val) {
      this.chart.data.datasets[0].data = val.stock.prices
      this.chart.data.datasets[1].data = val.stock.buyHistory
      this.chart.data.datasets[2].data = val.stock.sellHistory
      this.chart.update()
    }
  },
  mounted() {
    this.chart = new Chart(document.getElementById("stockChart"), {
          data: {
            labels: this.activeFile.stock.dates,
            datasets: [
              {
                type: 'line',
                label: this.activeFile.stock.company,
                data: this.activeFile.stock.prices,
                pointRadius: 1,
                pointHitRadius: 5,
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
                data: this.activeFile.stock.buyHistory,
                pointRadius: 10,
                pointHitRadius: 30,
                pointHoverRadius: 6,
                pointBackgroundColor: 'rgb(186,56,56)',
                borderColor: 'rgb(158,25,25)',
                borderWidth: 1,
              },
              {
                type: 'bubble',
                label: 'Sell(Date, Price, Quantity)',
                data: this.activeFile.stock.sellHistory,
                pointRadius: 10,
                pointHitRadius: 30,
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
.stock-summary {
  top: 70px;
  left: 385px;
  width: 200px;
  height: 100px;
  position: fixed;
  background-color: #0c0c0c;
  border: 1px solid #64F1F1FF;
  padding: 3px 7px;
}
</style>

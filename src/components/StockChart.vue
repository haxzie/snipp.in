<template>
  <div class="stock-wrapper">
    <div class="stock-chart">
      <canvas height="80" width="350" id="stockChart"></canvas>
    </div>
    <div v-if="havingPosition" class="stock-summary">
      현재가 : {{earning[0]}} |
      평가금액 : {{earning[1]}} |
      보유수량 : {{earning[2]}}주 |
      평가손익 : 2,225,684 |
      매수금액 : {{earning[4]}} |
      수익률 : 14.66% |
      매입단가 : 28,834 |
    </div>
    <div v-else class="stock-summary">
      실현손익 : {{Number(earning[3]).toLocaleString()}} |
      수익률 : {{earning[5]}}% |
      현재가 : {{Number(earning[0]).toLocaleString()}} |
    </div>
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
    havingPosition() {
      let buys = 0
      let sells = 0
      if (this.activeFile.stock.buyHistory.length > 0) {
        buys = this.activeFile.stock.buyHistory.map(order => {
          return [Number.parseInt(order.q)]
        }).reduce((accumulate, currentValue) => {
          return Number.parseInt(accumulate) + Number.parseInt(currentValue)
        })
      }
      if (this.activeFile.stock.sellHistory.length > 0) {
        sells = this.activeFile.stock.sellHistory.map(order => {
          return [Number.parseInt(order.q)]
        }).reduce((accumulate, currentValue) => {
          return Number.parseInt(accumulate) + Number.parseInt(currentValue)
        })
      }
      return (buys - sells) > 0;
    },
    earning() {
      const buys = this.activeFile.stock.buyHistory.map(order => {
        return [Number.parseInt(order.y), Number.parseInt(order.q)]
      })
      const sells = this.activeFile.stock.sellHistory.map(order => {
        return [Number.parseInt(order.y), Number.parseInt(order.q)]
      })
      let buyingSum = 0;
      let sellingSum = 0;
      let buyingQuantity = 0;
      let sellingQuantity = 0;
      buys.forEach(history => {
        buyingSum += history[0] * history[1]
        buyingQuantity += history[1]
      })
      sells.forEach(history => {
        sellingSum += history[0] * history[1]
        sellingQuantity += history[1]
      })

      // 평가손익 (평가금액 - 매수금액)
      // 수익률
      // 현재가
      // 평가금액 (매수량 합 * 현재가)
      // 보유수량 (매수량 합 - 매도량 합)
      // 매수금액 (매수 * 양 + 매수 * 양 + ...)
      // 매입단가 (
      const currentQuantity = buyingQuantity - sellingQuantity
      const currentPrice = this.activeFile.stock.prices[this.activeFile.stock.prices.length - 1]
      const earning = sellingSum - buyingSum
      const currentValue = currentPrice * currentQuantity
      const earningRate = ((buyingSum + earning) / buyingSum * 100 - 100).toFixed(2)
      return [currentPrice, currentValue, currentQuantity, earning, buyingSum, earningRate]
    }
  },
  watch: {
    activeFile: function (val) {
      this.chart.data.labels = val.stock.dates
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
  padding-bottom: 10px;
}
.stock-summary {
  background-color: #0c0c0c;
  border: 1px solid #64F1F1FF;
  padding: 3px 7px;
}
</style>

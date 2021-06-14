<template>
  <div class="stock-wrapper">
    <div class="stock-chart">
      <canvas height="360" id="stockChart"></canvas>
    </div>
    <div v-if="havingPosition" class="stock-summary">
      평가손익 : {{Number(earning[0]).toLocaleString()}} |
      수익률 : {{Number(earning[1]).toLocaleString()}}% |
      평가금액 : {{Number(earning[2]).toLocaleString()}} |
      보유수량 : {{Number(earning[3]).toLocaleString()}}주 |
      매수금액 : {{Number(earning[4]).toLocaleString()}} |
      매입단가 : {{Number(earning[5]).toLocaleString()}} |
      현재가 : {{Number(earning[6]).toLocaleString()}} |
    </div>
    <div v-else class="stock-summary">
      평가손익 : {{Number(earning[0]).toLocaleString()}} |
      수익률 : {{Number(earning[1]).toLocaleString()}}% |
      현재가 : {{Number(earning[6]).toLocaleString()}} |
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

      // 보유수량
      const currentQuantity = buyingQuantity - sellingQuantity
      // 현재가
      const currentPrice = this.activeFile.stock.prices[this.activeFile.stock.prices.length - 1]
      // 매수금액
      const purchaseAmount = buyingSum - sellingSum
      // 평가금액
      const estimatedValue = currentPrice * currentQuantity;
      // 평가손익 = 평가금액 - 매수금액
      const estimatedEarning = estimatedValue - purchaseAmount
      // 수익률 = 평가손익 / 매수금액 * 100
      const earningRate = (estimatedEarning / buyingSum * 100).toFixed(2)
      // 매입단가 = 매수금액 / 보유수
      const averagePurchasePrice = Number.parseInt(purchaseAmount / currentQuantity)

      // 평가손익, 수익률, 평가금액, 보유수량, 매수금액, 매입단가, 현재가
      return [estimatedEarning, earningRate, estimatedValue, currentQuantity, purchaseAmount, averagePurchasePrice, currentPrice]
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
          options: {
            maintainAspectRatio: false
          },
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
            ],
          },
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

<template>
  <!-- 收费凭证打印界面 -->
  <div class="app-container">

    <!-- 测试打印功能 -->
    <div>
      <el-button :loading="downloadLoading" style="margin:0 0 20px 20px;" type="primary" icon="el-icon-document" @click="handelPrint">
        打印
      </el-button>
    </div>

    <!-- 表格 -->
    <el-card style="margin-top: 20px; height: 50px;width:300px; text-align:center; vertical-align:middle">
      可打印的收费项目清单
    </el-card>
    <br>
    <div class="printTable">
      <el-table :data="tableData" highlight-current-row border fit max-height="900px" @selection-change="handleSelectionChange">
        <el-table-column type="selection" />
        <el-table-column label="收费项目id" prop="voucherId" align="center" />
        <el-table-column label="房号" prop="houseId" align="center" />
        <el-table-column label="业主姓名" prop="houseName" align="center" />
        <el-table-column label="收费项目" prop="item" align="center" />
        <el-table-column label="费用周期" prop="dateRange" align="center" />
        <el-table-column label="实收金额" prop="moneyGet" align="center" />
        <el-table-column label="付款方式及金额1" prop="payTypeNum1" align="center" />
        <el-table-column label="付款方式及金额2" prop="payTypeNum2" align="center" />
        <el-table-column label="付款方式及金额3" prop="payTypeNum3" align="center" />
        <el-table-column label="收费日期" prop="payDate" align="center" />
        <el-table-column label="备注" prop="remark" align="center" />
        <el-table-column label="操作人" prop="operatorName" align="center" />
        <el-table-column label="打印" align="center" width="80" class-name="small-padding fixed-width" fixed="right">
          <template slot-scope="{row}">
            <el-button type="primary" size="mini" @click="handlePrintPV(row.voucherId)">
              打印
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <button v-print="printObj">Print local range</button>

    <div id="printMe" style="background:red;">
      <p>葫芦娃，葫芦娃</p>
      <p>一根藤上七朵花 </p>
      <p>小小树藤是我家 啦啦啦啦 </p>
      <p> 叮当当咚咚当当 是我家</p>
      <p> 啦啦啦啦</p>
      <p>...</p>
    </div>

    <!-- 分页功能实现标签 -->
    <pagination v-show="total>0" :total="total" :page.sync="listQuery_all.page" @pagination="getList" />

  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { fetchAllCharging } from '@/api/chargingVoucher'
import waves from '@/directive/waves' // waves directive
import { parseTime } from '@/utils'
import Pagination from '@/components/Pagination'

export default {
  name: 'ExportChargingVoucher',
  components: { Pagination },
  directives: { waves },
  data() {
    return {
      downloadLoading: false,
      listLoading: true,
      total: 0,
      listQuery_all: {
        page: 1,
        adminId: this.$store.getters.adminId
      },
      testPrint: 0,
      tableData: [],
      printObj: {
        id: 'printMe',
        popTitle: 'Test Printing',
        extraHead: '<meta http-equiv="Content-Language"content="zh-cn"/>',
        endCallback: this.printDown()
      }
    }
  },
  computed: {
    ...mapGetters([
      'adminName',
      'adminId',
      'roles'
    ])
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      fetchAllCharging(this.listQuery_all).then(response => {
        this.tableData = response.data.items
        this.total = response.total
      })
    },
    // 多选框全选
    handleSelectionChange(val) {
      this.multipleSelection = val
      // 先把所需要的费用类型数组置空
      this.finalSelection = []
      // 获取当前选择的对象
      this.moneyTypes = this.$refs.multipleSelection.selection
      // 将当前选择的对象中的费用类型提取到数组中
      for (var i = 0; i < this.multipleSelection.length; i++) {
        this.finalSelection[i] = (this.moneyTypes[i].moneyType)
      }
      console.log(this.finalSelection)
    },
    formatJson(filterVal, jsonData) {
      return jsonData.map(v => filterVal.map(j => {
        if (j === 'timestamp') {
          return parseTime(v[j])
        } else {
          return v[j]
        }
      }))
    },
    printDown() {
      console.log('123123123123123')
    },
    // 打印按钮绑定事件
    handlePrintPV(voucherId) {
      console.log('test')
    },
    // 测试打印功能
    handelPrint() {
      var newStr = document.getElementsByClassName('printTable')[0].innerHTML
      document.body.innerHTML = newStr
      // 调用打印功能
      window.print()
      // 点击取消后刷新页面
      window.location.reload()
    }
  }
}
</script>

<style lang="scss" scoped>
$bg:#2d3a4b;
$dark_gray:#889aa4;
$light_gray:#eee;

.show-sms {
    position: absolute;
    right: 10px;
    top: 82px;
    font-size: 15px;
    color: $light_gray;
    cursor: pointer;
    user-select: none;
  }

body .el-table th.gutter {
  display: table-cell !important;
}
.el-table {
  th.gutter,
  colgroup.gutter {
    display: block !important;
    width: 6px !important
  }
}

</style>

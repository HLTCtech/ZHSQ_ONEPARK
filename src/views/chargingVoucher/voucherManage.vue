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
    <div id="printMe" class="printTable">
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

    <el-button @click="printDialog()">Print local range</el-button>

    <!-- 收据打印样式定义 -->
    <el-dialog :visible.sync="dialogPrint" title="收据打印">
      <div id="printVoucher">
        <div class="invoicMain">
          <div class="invoiceHeader">
            <ul class="headerLeft">
              <li>
                <label>收费日期：</label><span>2020-05-03 10:00:00</span>
              </li>
            </ul>
            <div class="headerMiddle">
              <h1>河南院子物业服务有限公司收据</h1>
              <div class="line" />
            </div>
            <ul class="headerRight">
              <li>
                <label style="margin-right: 50px"> 收据号： </label><span>0566655</span>
              </li>
            </ul>
          </div>
          <div class="invoiceBody">
            <div class="userInfo" style="height:60px">
              <ul>
                <li>
                  <label>项目名称：</label><span>华龙壹号院</span>
                </li>
              </ul>
              <div class="password"><label>缴费单位：</label></div><span>二期21号楼2单元28层2806</span>
            </div>
            <div class="userInfo" style="height:60px">
              <ul>
                <li>
                  <label>业主名称：</label><span>张翔</span>
                </li>
              </ul>
              <div class="password"><label>缴费人</label></div><span>张翔</span>
            </div>
            <div>
              <table class="GoodsTable" style="height: 50px" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="width: 30%">收费项目</td>
                  <td style="width: 35%">费用周期</td>
                  <td style="width: 25%">实收金额</td>
                  <td style="width: 10%">付款方式</td>
                </tr>
              </table>
              <div class="line" />
              <table class="GoodsTable" style="height: 50px" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="width: 30%;color: black;">电费</td>
                  <td style="width: 35%;color: black;">2020-02-01至2020-02-29</td>
                  <td style="width: 25%;color: black;">500.0</td>
                  <td style="width: 10%;color: black;">支付宝</td>
                </tr>
              </table>
              <div class="line" />
              <table class="GoodsTable" style="height: 50px" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="width: 30%;color: black;">水费</td>
                  <td style="width: 35%;color: black;">2020-02-01至2020-02-29</td>
                  <td style="width: 25%;color: black;">500.0</td>
                  <td style="width: 10%;color: black;">微信</td>
                </tr>
              </table>
              <div class="line" />
              <table class="GoodsTable" style="height: 50px" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="width: 30%;color: black;">物业费</td>
                  <td style="width: 35%;color: black;">2020-02-01至2020-02-29</td>
                  <td style="width: 25%;color: black;">500.0</td>
                  <td style="width: 10%;color: black;">现金</td>
                </tr>
              </table>
              <div class="line" />
              <table class="GoodsTable" style="height: 50px" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="width: 30%;color: black;">停车管理费</td>
                  <td style="width: 35%;color: black;">2020-02-01至2020-02-29</td>
                  <td style="width: 25%;color: black;">500.0</td>
                  <td style="width: 10%;color: black;">现金</td>
                </tr>
              </table>
              <table class="GoodsTable" style="height: 50px" cellpadding="0" cellspacing="0">
                <tr class="GoodsTotal">
                  <td style="width: 598px"><label>合计人民币(大写)：</label></td>
                  <td colspan="2">
                    <div style="width: 100%;display:flex">
                      <div type="text" style="margin-left: 40%;color: black;">伍佰元整</div>
                    </div>
                  </td>
                </tr>
              </table>
              <table class="GoodsTable" style="height: 50px" cellpadding="0" cellspacing="0">
                <!-- <tr class="GoodsTotal">
              <td><label style="margin-right: 90%">备注：</label>
                <span style="color:black; ">500度</span>
              </td>
            </tr> -->
                <ul style="margin-top:20px">
                  <li>
                    <label>备注:</label>&nbsp;&nbsp;&nbsp;&nbsp;<span>800度</span>
                  </li>
                </ul>
              </table>

            </div>
          </div>
          <ul class="invoicetFooter">
            <li>
              <label>单位盖章：</label>
            </li>
            <li>
              <label>收款人：</label>
            </li>
          </ul>
        </div>
      </div>
      <el-button v-print="printObj">打印</el-button>
    </el-dialog>

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
      dialogPrint: false,
      printObj: {
        id: 'printVoucher',
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
    printDialog() {
      this.dialogPrint = true
    },
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

ul,
    ul li {
        list-style: none;
        margin: 0;
        padding: 0;
    }

    label {
        color: #9c5223;
    }

    .invoicMain {
        width: 920px;
        margin: 0 auto;
        font-size: 14px;
        color: #000;
    }

    .invoiceHeader {
        height: 126px;
        display: flex;
        justify-content: space-between;
        align-items: center;
    }

    .headerLeft li:nth-child(1) {
        text-indent: 1em;
    }

    .headerLeft li {
        margin-top: 100px;
    }

    .headerMiddle h1 {
        font-size: 32px;
        color: #9c5223;
        font-family: 'kaiti';
        margin: 5px 12px;
    }

    .line {
        height: 2px;
        // border-top: #9c5223 1px solid;
        border-bottom: #9c5223 1px solid;
    }

    .headerRight li {
        line-height: 24px;
        margin-top: 100px;
    }

    .invoiceBody {
        border: 1px solid #9c5223;
    }

    .userInfo {
        width: 100%;
        display: flex;
        align-items: center;
        height: 96px;
        border-bottom: 1px solid #9c5223;
    }

    .userInfo ul {
        width: 50%;
        margin: 0 5px;
        padding: 0;

    }

    .userInfo ul li {
        line-height: 24px;
    }

    .buy {
        width: 20px;
        border-right: 1px solid #9c5223;
        padding: 0 10px;
        text-align: center;
        height: 100%;
        display: flex;
        align-items: center;
        color: #9c5223;
    }

    .password {
        padding: 0 10px;
        border-left: 1px solid #9c5223;
        text-align: center;
        height: 100%;
        display: flex;
        align-items: center;
        color: #9c5223;
    }

    .pwdInfo {
        flex: 1;
        padding-left: 5px;
    }

    .goodsInfo {
        height: 210px;
        margin: 0;
        padding: 0;

    }

    .goodsInfo li {
        display: flex;
        color: #9c5223;
        text-align: center;
    }

    .name {
        width: 260px;
        border-right: 1px solid #9c5223;
    }

    .spec {
        width: 140px;
        border-right: 1px solid #9c5223;
    }

    .qty {
        width: 108px;
        border-right: 1px solid #9c5223;
    }

    .unit,
    .taxRate {
        width: 65px;
        border-right: 1px solid #9c5223;
    }

    .qty,
    .price {
        width: 160px;
        border-right: 1px solid #9c5223;
    }

    .money {
        flex: 1;
        border-right: 1px solid #9c5223;
    }

    .taxAmount {
        flex: 1;
    }

    .GoodsTable {
        height: 210px;
        width: 100%;
        border-collapse: collapse;
    }

    .GoodsTable td {
        border-right: 1px solid #9c5223;
        color: #9c5223;
    }

    .GoodsTable tr:nth-child(1),
    .GoodsTable tr:nth-last-child(2) {
        height: 24px;
    }

    .GoodsTable tr:nth-last-child(1) {
        height: 34px;
    }

    .GoodsTable tr:nth-child(1) td {
        text-align: center;
    }

    .GoodsTotal {
        border-top: 1px solid #9c5223;
        border-bottom: 1px solid #9c5223;
    }

    .total td:nth-child(1) {
        text-align: center;
    }

    .invoicetFooter {
        margin: 0;
        padding: 0;
        display: flex;
        justify-content: space-between;
    }

    .invoicetFooter li {
        width: 25%;
    }

</style>

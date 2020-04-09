<template>
  <!-- 收费凭证打印界面 -->
  <div class="app-container">

    <!-- 顶部搜索框 -->
    <div class="filter-container">
      <el-input v-model="listQuery_all.houseId" type="text" placeholder="输入房号" style="width: 200px" class="filter-item" clearable />
      <el-input v-model="listQuery_all.houseName" type="text" placeholder="输入业主姓名" style="width: 200px" class="filter-item" clearable />
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="getList(listQuery_all.page=1)">
        搜索
      </el-button>
    </div>

    <!-- 表格 -->
    <el-card style="margin-top: 20px; height: 50px;width:300px; text-align:center; vertical-align:middle">
      可打印的收费项目清单
    </el-card>
    <br>

    <div id="printMe" class="printTable">
      <el-table ref="multipleSelection" :data="tableData" highlight-current-row border fit max-height="900px">
        <el-table-column label="收费项目id" prop="voucherId" width="50px" align="center" />
        <el-table-column label="房号" prop="houseId" align="center">
          <template slot-scope="scope">
            <el-tag @click="getHouseLog(scope.row.houseId)">{{ scope.row.houseId }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="业主姓名" prop="houseName" align="center" />
        <el-table-column label="收费项目" prop="item" align="center" />
        <el-table-column label="费用周期" prop="dateRange" width="220px" align="center" />
        <el-table-column label="实收总金额" prop="moneyGet" align="center" />
        <el-table-column label="付款方式1" prop="payType1" align="center" />
        <el-table-column label="付款金额1" prop="payNum1" align="center" />
        <el-table-column label="付款方式2" prop="payType2" align="center" />
        <el-table-column label="付款金额2" prop="payNum1" align="center" />
        <el-table-column label="付款方式3" prop="payType3" align="center" />
        <el-table-column label="付款金额3" prop="payNum3" align="center" />
        <el-table-column label="收费日期" prop="payDate" align="center" />
        <el-table-column label="备注" prop="remark" align="center" />
        <!-- <el-table-column prop="payNumAllChinese" align="center" /> -->
        <el-table-column label="操作人" prop="operatorName" align="center" />
        <el-table-column label="打印" align="center" width="80" class-name="small-padding fixed-width" fixed="right">
          <template slot-scope="{row}">
            <el-button type="primary" size="mini" @click="printDialog(row)">
              打印
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <!-- 指定行的收费模态框 -->
    <el-dialog :visible.sync="dialogPrint" title="收据打印">
      <div id="printVoucher">
        <div class="invoicMain">
          <div class="invoiceHeader">
            <ul class="headerLeft">
              <li>
                <label>收费日期：</label><span>{{ printDate }}</span>
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
              <ul style="width:46%">
                <li>
                  <label>项目名称：</label><span>{{ printPanNum }}</span>
                </li>
              </ul>
              <div class="houseId"><label>缴费房号：</label><span style="color:black">{{ printHouseId }}</span></div>
              <div class="password" style="border-right: 0px solid #9c5223"><label>业主姓名：</label><span style="color:black">{{ printHouseName }}</span></div>
            </div>
            <div class="userInfo" style="height:60px">
              <ul style="width: 14%">
                <li>
                  <label style="margin:auto auto">收费项目</label>
                </li>
              </ul>
              <div class="houseId" style="width:32%"><label style="margin:auto auto">费用周期</label></div>
              <div class="password" style="width:15%"><label style="margin:auto auto">实收金额</label></div>
              <div style="width: 100%;flex-flow: column;height: 60px">
                <div class="payTypes" style="width:100%;height: 30px">
                  <label style="margin:auto auto">缴费方式</label>
                </div>
                <table class="payItems" style="width:100%;height: 30px">
                  <tr>
                    <td style="width:30px;">支付宝</td>
                    <td style="width:30px;">微信</td>
                    <td style="width:30px;">现金</td>
                    <td style="width:30px;border-right: 0px solid #9c5223">代金券</td>
                  </tr>
                </table>
              </div>
            </div>

            <div>
              <table class="GoodsTable" style="height: 50px" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="width: 9.6%;color: black;">{{ printItem }}</td>
                  <td style="width: 20.2%;color: black;">{{ printDateRange }}</td>
                  <td style="width: 10%;color: black;">{{ printPayNum1 }}</td>
                  <td style="width: 30px;color: black;">{{ printPayNum1 }}</td>
                  <td style="width: 30px;color: black;">{{ printPayNum1 }}</td>
                  <td style="width: 30px;color: black;">{{ printPayNum1 }}</td>
                  <td style="width: 30px;color: black;border-right: 0px solid #9c5223">{{ printPayNum1 }}</td>
                </tr>
              </table>
              <div class="line" />
              <table class="GoodsTable" style="height: 50px" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="width: 9.6%;color: black;">{{ printItem }}</td>
                  <td style="width: 20.2%;color: black;">{{ printDateRange }}</td>
                  <td style="width: 10%;color: black;">{{ printPayNum1 }}</td>
                  <td style="width: 30px;color: black;">{{ printPayNum1 }}</td>
                  <td style="width: 30px;color: black;">{{ printPayNum1 }}</td>
                  <td style="width: 30px;color: black;">{{ printPayNum1 }}</td>
                  <td style="width: 30px;color: black;border-right: 0px solid #9c5223">{{ printPayNum1 }}</td>
                </tr>
              </table>
              <div class="line" />
              <table class="GoodsTable" style="height: 50px" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="width: 9.6%;color: black;">{{ printItem }}</td>
                  <td style="width: 20.2%;color: black;">{{ printDateRange }}</td>
                  <td style="width: 10%;color: black;">{{ printPayNum1 }}</td>
                  <td style="width: 30px;color: black;">{{ printPayNum1 }}</td>
                  <td style="width: 30px;color: black;">{{ printPayNum1 }}</td>
                  <td style="width: 30px;color: black;">{{ printPayNum1 }}</td>
                  <td style="width: 30px;color: black;border-right: 0px solid #9c5223">{{ printPayNum1 }}</td>
                </tr>
              </table>
              <div class="line" />
              <table class="GoodsTable" style="height: 50px" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="width: 9.6%;color: black;">{{ printItem }}</td>
                  <td style="width: 20.2%;color: black;">{{ printDateRange }}</td>
                  <td style="width: 10%;color: black;">{{ printPayNum1 }}</td>
                  <td style="width: 30px;color: black;">{{ printPayNum1 }}</td>
                  <td style="width: 30px;color: black;">{{ printPayNum1 }}</td>
                  <td style="width: 30px;color: black;">{{ printPayNum1 }}</td>
                  <td style="width: 30px;color: black;border-right: 0px solid #9c5223">{{ printPayNum1 }}</td>
                </tr>
              </table>
              <div class="line" />
              <table class="GoodsTable" style="height: 50px" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="width: 9.6%;color: black;">{{ printItem }}</td>
                  <td style="width: 20.2%;color: black;">{{ printDateRange }}</td>
                  <td style="width: 10%;color: black;">{{ printPayNum1 }}</td>
                  <td style="width: 30px;color: black;">{{ printPayNum1 }}</td>
                  <td style="width: 30px;color: black;">{{ printPayNum1 }}</td>
                  <td style="width: 30px;color: black;">{{ printPayNum1 }}</td>
                  <td style="width: 30px;color: black;border-right: 0px solid #9c5223">{{ printPayNum1 }}</td>
                </tr>
              </table>
              <table class="GoodsTable" style="height: 50px" cellpadding="0" cellspacing="0">
                <tr class="GoodsTotal">
                  <td style="width: 598px"><label>合计人民币(大写)：</label></td>
                  <td colspan="2" style="border-right: 0px solid #9c5223">
                    <div style="width: 100%;display:flex">
                      <div type="text" style="margin-left: 40%;color: black">{{ payNumAllChinese }}</div>
                    </div>
                  </td>
                </tr>
              </table>
              <table class="GoodsTable" style="height: 30px" cellpadding="0" cellspacing="0">
                <ul style="margin-top:10px">
                  <li>
                    <label>备注:</label>&nbsp;&nbsp;&nbsp;&nbsp;<span>{{ printRemark }}</span>
                  </li>
                </ul>
              </table>
            </div>
          </div>
          <ul class="invoicetFooter" style="margin-top:20px">
            <li>
              <label>单位盖章：</label>
            </li>
            <li>
              <label>收款人：</label><span>{{ adminName }}</span>
            </li>
          </ul>
        </div>
      </div>
      <!-- 打印按钮 -->
      <el-button v-print="printObj" style="margin-top:50px" type="success" @click="handlePrintPost(voucherId)">打印</el-button>
      <el-button @click="cancelPrint()">取消</el-button>
    </el-dialog>

    <!-- 分页功能实现标签 -->
    <pagination v-show="total>0" :total="total" :page.sync="listQuery_all.page" @pagination="getList" />

  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { fetchAllCharging, getMoneyDetailsByHouseId, complexVoucherIdPost, singleVoucherIdPost } from '@/api/chargingVoucher'
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
        houseId: null,
        houseName: null,
        adminId: this.$store.getters.adminId
      },
      tableData: [],
      dialogPrint: false,
      dialogAllPrint: false,
      printObj: {
        id: 'printVoucher',
        popTitle: 'Test Printing',
        extraHead: '<meta http-equiv="Content-Language"content="zh-cn"/>',
        endCallback() {
          console.log('23423423423423434')
        }
      },
      rowSelected: [],
      payNumAllChinese: null,
      // 定义打印模态框变量
      printHouseId: null,
      printPanNum: null,
      printDate: null,
      printHouseName: null,
      printPaidName: null,
      printRemark: null,
      printItem: '',
      printDateRange: '',
      printPayNum1: '',
      printPayType1: '',
      printPayNum2: '',
      printPayType2: '',
      printPayNum3: '',
      printPayType3: '',
      // 从store中取出adminId/adminName
      // adminId: this.$store.getters.adminId,
      // adminName: this.$store.getters.adminName
      housePaidQuery: {
        houseId: null,
        adminId: this.$store.getters.adminId
      },
      // 多项打印字段定义
      dataComplex: {
        panNum: null,
        houseId: null,
        payDate: null,
        houseName: null,
        remark: null,
        voucherId1: null,
        item1: null,
        dateRange1: null,
        payType1: null,
        payNum1: null,
        voucherId2: null,
        item2: null,
        dateRange2: null,
        payType2: null,
        payNum2: null,
        voucherId3: null,
        item3: null,
        dateRange3: null,
        payType3: null,
        payNum3: null,
        voucherId4: null,
        item4: null,
        dateRange4: null,
        payType4: null,
        payNum4: null,
        payNumAllChinese: null
      },
      // 多项目打印后向后台post项目id，字段定义
      voucherIds: {
        voucherId1: null,
        voucherId2: null,
        voucherId3: null,
        voucherId4: null
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
    // 单一项目打印
    handlePrintPost(voucherId) {
      singleVoucherIdPost(this.voucherId).then(response => {
        if (response.codeStatus === 200) {
          this.$notify({
            title: '注意！',
            message: '还有5s该条数据就无法打印',
            type: 'error',
            duration: 5000
          })

          var that = this
          setTimeout(function() {
            that.dialogPrint = false
            fetchAllCharging(this.listQuery_all).then(response => {
              this.tableData = response.data.items
              this.total = response.total
            })
          }, 5000)
          // this.dialogAllPrint = false
        } else {
          this.$notify({
            title: 'Failure',
            message: '提交失败，请联系系统管理员',
            type: 'error',
            duration: 3000
          })
        }
      })
    },
    // 多项目打印后把打印项目post到后台
    handleComplexPrintPost(dataComplex) {
      this.voucherIds.voucherId1 = this.dataComplex.voucherId1
      this.voucherIds.voucherId2 = this.dataComplex.voucherId2
      this.voucherIds.voucherId3 = this.dataComplex.voucherId3
      this.voucherIds.voucherId4 = this.dataComplex.voucherId4
      console.log(this.voucherIds)
      complexVoucherIdPost(this.voucherIds).then(response => {
        if (response.codeStatus === 200) {
          this.$notify({
            title: '注意！',
            message: '还有5s该条数据就无法打印',
            type: 'error',
            duration: 5000
          })

          var that = this
          setTimeout(function() {
            that.dialogAllPrint = false
            fetchAllCharging(this.listQuery_all).then(response => {
              this.tableData = response.data.items
              this.total = response.total
            })
          }, 5000)
          // this.dialogAllPrint = false
        } else {
          this.$notify({
            title: 'Failure',
            message: '提交失败，请联系系统管理员',
            type: 'error',
            duration: 3000
          })
        }
      })
    },
    // 点击houseId获取房间所有缴费记录
    getHouseLog(houseId) {
      this.housePaidQuery.houseId = houseId
      getMoneyDetailsByHouseId(this.housePaidQuery).then(response => {
        this.dataComplex = response.data.items
        console.log(this.dataComplex)
        this.dialogAllPrint = true
      })
    },
    cancelPrint() {
      this.dialogPrint = false
      this.dialogAllPrint = false
    },
    // 每行末尾针对单一项目的收费模态框
    printDialog(row) {
      this.dialogPrint = true
      this.voucherId = row.voucherId
      this.printPanNum = row.panNum
      this.printHouseId = row.houseId
      this.printDate = row.payDate
      this.printHouseName = row.houseName
      this.printPaidName = row.houseName
      this.printRemark = row.remark
      this.printItem = row.item
      this.printDateRange = row.dateRange
      this.printPayType1 = row.payType1
      this.printPayNum1 = row.payNum1
      this.printPayType2 = row.payType2
      this.printPayNum2 = row.payNum2
      this.printPayType3 = row.payType3
      this.printPayNum3 = row.payNum3
      this.payNumAllChinese = row.payNumAllChinese
    },
    getList() {
      fetchAllCharging(this.listQuery_all).then(response => {
        this.tableData = response.data.items
        this.total = response.total
      })
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
      this.$notify({
        title: 'Success',
        message: '打印成功',
        type: 'success',
        duration: 2000
      })
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

    .houseId {
        padding: 0 10px;
        width: 60%;
        border-left: 1px solid #9c5223;
        text-align: left;
        height: 100%;
        display: flex;
        align-items: center;
        color: #9c5223;
    }

    .password {
        padding: 0 10px;
        width: 50%;
        border-left: 1px solid #9c5223;
        border-right: 1px solid #9c5223;
        text-align: center;
        height: 100%;
        display: flex;
        align-items: center;
        color: #9c5223;
    }

    .payTypes {
        padding: 0 10px;
        height: 100%;
        text-align: center;
        border-bottom: 1px solid #9c5223;
        text-align: center;
        vertical-align: top;
        display: flex;
        color: #9c5223;
    }

    .payItems {
        height: 100%;
        width: 100%;
        border-collapse: collapse;
    }

    .payItems td {
        border-right: 1px solid #9c5223;
        color: #9c5223;
        width: 30px;
        text-align: center;
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

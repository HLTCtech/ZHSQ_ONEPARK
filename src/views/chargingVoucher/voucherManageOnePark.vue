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
        <el-table-column label="房号" prop="houseId" align="center" />
        <el-table-column label="业主姓名" prop="houseName" align="center" />
        <el-table-column label="收费项目" prop="item" align="center" />
        <el-table-column label="费用周期" prop="dateRange" width="220px" align="center" />
        <el-table-column label="实收总金额" prop="moneyGet" align="center" />
        <el-table-column label="支付宝" prop="alipayNum" align="center" />
        <el-table-column label="微信" prop="wechatNum" align="center" />
        <el-table-column label="现金" prop="cashNum" align="center" />
        <el-table-column label="代金券" prop="chargingVoucherNum" align="center" />
        <el-table-column label="收费日期" prop="payDate" align="center" />
        <el-table-column label="备注" prop="remark" align="center" />
        <!-- <el-table-column prop="payNumAllChinese" align="center" /> -->
        <el-table-column label="操作人" prop="operatorName" align="center" />
        <el-table-column label="打印" align="center" width="80" class-name="small-padding fixed-width" fixed="right">
          <template slot-scope="{row}">
            <el-button type="primary" size="mini" @click="printDialog(row.houseId)">
              打印
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <!-- 指定行的收费模态框 -->
    <el-dialog :visible.sync="dialogPrint" title="收据打印">
      <div id="printVoucher">
        <div class="fontbox">
          <div class="invoicMain">
            <div class="invoiceHeader">
              <ul class="headerLeft">
                <li>
                  <label>收费日期：</label><span>{{ payDate }}</span>
                </li>
              </ul>
              <div class="headerMiddle" style="margin-left:100px">
                <h1>院子物业服务有限公司收据</h1>
                <div class="line" />
              </div>
              <ul class="headerRight">
                <li>
                  <label style="margin-right: 150px"> 收据号： </label>
                </li>
              </ul>
            </div>
            <div class="invoiceBody">
              <div class="userInfo" style="height:60px">
                <ul style="width:46%">
                  <li>
                    <label>项目名称：</label><span>{{ panNum }}</span>
                  </li>
                </ul>
                <div class="houseId"><label>缴费房号：</label><span style="color:black">{{ houseId }}</span></div>
                <div class="password" style="margin-left:58px;border-right: 0px solid #9c5223"><label>业主姓名：</label><span style="color:black">{{ houseName }}</span></div>
              </div>
              <div class="userInfo" style="height:60px">
                <div class="moneyType" style="width: 15%">
                  <label style="margin:auto auto">收费项目</label>
                </div>
                <div class="houseId" style="width:35%"><label style="margin:auto auto">费用周期</label></div>
                <div class="password" style="width:20%"><label style="margin:auto auto">实收金额</label></div>
                <div class="mixpayType" style="width:25%"><label style="margin:auto auto">缴费方式</label></div>
              <!-- <div style="width: 100%;flex-flow: column;height: 60px">
                <div class="payTypes" style="width:100%;height: 30px">
                  <label style="margin:auto auto">缴费方式</label>
                </div>
              </div> -->
              </div>
              <div>
                <table class="GoodsTable" style="height: 50px" cellpadding="0" cellspacing="0">
                  <tr>
                    <td style="width: 15%;color: black;">{{ item1 }}</td>
                    <td style="width: 35%;color: black;">{{ dateRange1 }}</td>
                    <td style="width: 20%;color: black;">{{ moneyGet1 }}</td>
                    <td style="width: 30%;color: black;border-right: 0px solid #9c5223">{{ payTypesItem1 }}</td>
                  </tr>
                </table>
                <div class="line" />
                <table class="GoodsTable" style="height: 50px" cellpadding="0" cellspacing="0">
                  <tr>
                    <td style="width: 15%;color: black;">{{ item2 }}</td>
                    <td style="width: 35%;color: black;">{{ dateRange2 }}</td>
                    <td style="width: 20%;color: black;">{{ moneyGet2 }}</td>
                    <td style="width: 30%;color: black;border-right: 0px solid #9c5223">{{ payTypesItem2 }}</td>
                  </tr>
                </table>
                <div class="line" />
                <table class="GoodsTable" style="height: 50px" cellpadding="0" cellspacing="0">
                  <tr>
                    <td style="width: 15%;color: black;">{{ item3 }}</td>
                    <td style="width: 35%;color: black;">{{ dateRange3 }}</td>
                    <td style="width: 20%;color: black;">{{ moneyGet3 }}</td>
                    <td style="width: 30%;color: black;border-right: 0px solid #9c5223">{{ payTypesItem3 }}</td>
                  </tr>
                </table>
                <div class="line" />
                <table class="GoodsTable" style="height: 50px" cellpadding="0" cellspacing="0">
                  <tr>
                    <td style="width: 15%;color: black;">{{ item4 }}</td>
                    <td style="width: 35%;color: black;">{{ dateRange4 }}</td>
                    <td style="width: 20%;color: black;">{{ moneyGet4 }}</td>
                    <td style="width: 30%;color: black;border-right: 0px solid #9c5223">{{ payTypesItem4 }}</td>
                  </tr>
                </table>
                <div class="line" />
                <table class="GoodsTable" style="height: 50px" cellpadding="0" cellspacing="0">
                  <tr>
                    <td style="width: 15%;color: black;">{{ item5 }}</td>
                    <td style="width: 35%;color: black;">{{ dateRange5 }}</td>
                    <td style="width: 20%;color: black;">{{ moneyGet5 }}</td>
                    <td style="width: 30%;color: black;border-right: 0px solid #9c5223">{{ payTypesItem5 }}</td>
                  </tr>
                </table>
                <table class="GoodsTable" style="height: 50px" cellpadding="0" cellspacing="0">
                  <tr class="GoodsTotal">
                    <td style="width: 273px"><label>合计人民币(大写)：</label></td>
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
                      <label>备注:</label>&nbsp;&nbsp;&nbsp;&nbsp;<span>{{ electricNumsRemark }}</span>
                    </li>
                  </ul>
                </table>
              </div>
            </div>
            <ul class="invoicetFooter" style="margin-top:20px">
              <li>
                <label style="margin-left: 20px">单位盖章：</label>
              </li>
              <li>
                <label>收款人：</label><span>{{ operatorName }}</span>
              </li>
            </ul>
          </div>

          <div class="rightText" style="padding-left: 0">
            <span>
              <br><br><br><br><br>第一联存根 <br><br>第二联客户联 <br><br>第三联记账联<br><br> 第四联客服
            </span>
          </div>
        </div>

      </div>
      <!-- 打印按钮 -->
      <el-button v-print="printObj" style="margin-top:50px" type="success" @click="handlePrintPost(houseId)">打印</el-button>
      <el-button @click="cancelPrint()">取消</el-button>
    </el-dialog>

    <!-- 分页功能实现标签 -->
    <pagination v-show="total>0" :total="total" :page.sync="listQuery_all.page" @pagination="getList" />

  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { fetchAllCharging, getVoucherByHouseId, singleVoucherIdPost } from '@/api/chargingVoucher'
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
        id: 'printVoucher'
      },
      rowSelected: [],
      // 从store中取出adminId/adminName
      // adminId: this.$store.getters.adminId,
      // adminName: this.$store.getters.adminName
      housePaidQuery: {
        houseId: null,
        adminId: this.$store.getters.adminId
      },
      // 点击打印按钮时的请求参数
      getHouseIdPrintQuery: {
        houseId: null,
        adminId: this.$store.getters.adminId
      },
      // 打印完成之后把打印的项目参数
      printedHouIds: {
        voucherId1: null,
        voucherId2: null,
        voucherId3: null,
        voucherId4: null,
        voucherId5: null,
        houseId: null,
        adminId: this.$store.getters.adminId
      },
      // 打印字段定义
      panNum: null,
      houseId: null,
      houseName: null,
      operatorName: null,
      payNumAllChinese: null,
      payDate: null,
      electricNumsRemark: null,
      item1: null,
      dateRange1: null,
      moneyGet1: null,
      payTypesItem1: null,
      item2: null,
      dateRange2: null,
      moneyGet2: null,
      payTypesItem2: null,
      item3: null,
      dateRange3: null,
      moneyGet3: null,
      payTypesItem3: null,
      item4: null,
      dateRange4: null,
      moneyGet4: null,
      payTypesItem4: null,
      item5: null,
      dateRange5: null,
      moneyGet5: null,
      payTypesItem5: null
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
    handlePrintPost(houseId) {
      this.printedHouIds.houseId = houseId
      singleVoucherIdPost(this.printedHouIds).then(response => {
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
            fetchAllCharging(that.listQuery_all).then(response => {
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
    cancelPrint() {
      this.dialogPrint = false
      this.dialogAllPrint = false
    },
    // 每行末尾针对单一项目的收费模态框
    printDialog(houseId) {
      this.getHouseIdPrintQuery.houseId = houseId
      getVoucherByHouseId(this.getHouseIdPrintQuery).then(response => {
        this.panNum = response.data.panNum
        this.houseId = response.data.houseId
        this.houseName = response.data.houseName
        this.operatorName = response.data.operatorName
        this.payNumAllChinese = response.data.payNumAllChinese
        this.payDate = response.data.payDate
        this.electricNumsRemark = response.data.electricNumsRemark
        this.item1 = response.data.items.item1
        this.dateRange1 = response.data.items.dateRange1
        this.moneyGet1 = response.data.items.moneyGet1
        this.payTypesItem1 = response.data.items.payTypesItem1
        this.item2 = response.data.items.item2
        this.dateRange2 = response.data.items.dateRange2
        this.moneyGet2 = response.data.items.moneyGet2
        this.payTypesItem2 = response.data.items.payTypesItem2
        this.item3 = response.data.items.item3
        this.dateRange3 = response.data.items.dateRange3
        this.moneyGet3 = response.data.items.moneyGet3
        this.payTypesItem3 = response.data.items.payTypesItem3
        this.item4 = response.data.items.item4
        this.dateRange4 = response.data.items.dateRange4
        this.moneyGet4 = response.data.items.moneyGet4
        this.payTypesItem4 = response.data.items.payTypesItem4
        this.item5 = response.data.items.item5
        this.dateRange5 = response.data.items.dateRange5
        this.moneyGet5 = response.data.items.moneyGet5
        this.payTypesItem5 = response.data.items.payTypesItem5
        this.printedHouIds.voucherId1 = response.data.items.voucherId1
        this.printedHouIds.voucherId2 = response.data.items.voucherId2
        this.printedHouIds.voucherId3 = response.data.items.voucherId3
        this.printedHouIds.voucherId4 = response.data.items.voucherId4
        this.printedHouIds.voucherId5 = response.data.items.voucherId5
      })

      this.dialogPrint = true
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
        font-weight: 100;
        font-size: 20px;
        color: #9c5223;
    }

    .invoicMain {
        width: 920px;
        padding: 0 auto;
        font-size: 14px;
        color: #000;
    }

    .fontbox {
        width: 100%;
        margin: 0 auto;
        display: flex;
        align-items: center;
    }

    .fontbox .rightText {
        font-weight: 100;
        width: 1px;
        height: 100%;
        margin-left: 10px;
        flex-flow: column;
        align-items: center;
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

    .moneyType {
        padding: 0 10px;
        width: 60%;
        text-align: left;
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

    .mixpayType {
        padding: 0 10px;
        width: 50%;
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

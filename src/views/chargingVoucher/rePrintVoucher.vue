<template>
  <!-- 收费凭证打印界面 -->
  <div class="app-container">

    <!-- 顶部搜索框 -->
    <div class="filter-container">
      <el-input v-model="listQuery_all.houseId" type="text" placeholder="输入房号" style="width: 200px" class="filter-item" clearable />
      <el-input v-model="listQuery_all.houseName" type="text" placeholder="输入业主姓名" style="width: 200px" class="filter-item" clearable />
      <el-input v-model="listQuery_all.receiptNumber" type="text" placeholder="输入收据号" style="width: 200px" class="filter-item" clearable />
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="getList(listQuery_all.page=1)">
        搜索
      </el-button>
    </div>

    <!-- 已打印项目表格 -->
    <el-card style="margin-top: 20px; height: 50px;width:300px; text-align:center; vertical-align:middle">
      已经打印收费项目清单
    </el-card>
    <br>

    <div id="printMe" class="printTable">
      <el-table ref="multipleSelection" :data="tableData" highlight-current-row border fit max-height="900px">
        <el-table-column label="收费项目id" prop="voucherId" width="50px" align="center" />
        <el-table-column label="收据号" prop="receiptNumber" align="center" />
        <el-table-column label="房号" prop="houseId" align="center" />
        <el-table-column label="业主姓名" prop="houseName" align="center" />
        <el-table-column label="收费项目" prop="item" align="center" />
        <el-table-column label="费用周期" prop="dateRange" width="220px" align="center" />
        <el-table-column label="实收总金额" prop="moneyGet" align="center" />
        <el-table-column label="支付宝" prop="alipayNum" align="center" />
        <el-table-column label="微信" prop="wechatNum" align="center" />
        <el-table-column label="现金" prop="cashNum" align="center" />
        <el-table-column label="特批" prop="specialNum" align="center" />
        <el-table-column label="代金券" prop="chargingVoucherNum" align="center" />
        <el-table-column label="收费日期" prop="payDate" align="center" />
        <el-table-column label="备注" prop="remark" align="center" />
        <!-- <el-table-column prop="payNumAllChinese" align="center" /> -->
        <el-table-column label="操作人" prop="operatorName" align="center" />
        <el-table-column label="重新打印" align="center" width="100" class-name="small-padding fixed-width" fixed="right">
          <template slot-scope="{row}">
            <el-button type="primary" size="medium" @click="printDialog(row)">
              重新打印
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <!-- 收费类型为特批时验证码模态框处理 -->
    <el-dialog width="40%" title="领导审批" style="top: 20%" :visible.sync="dialogSMSVisible" append-to-body>
      <el-input
        ref="smsCode"
        v-model="reprintForm.smsCode"
        placeholder="请输入短信验证码"
        name="smsCode"
        type="number"
        tabindex="1"
        autocomplete="on"
      />
      <el-button class="show-sms" type="primary" :disabled="disabled=!show" style="width:175px;" @click="getSmsCode(reprintForm)">
        <span v-show="show">获取验证码</span>
        <span v-show="!show" class="count"> {{ count }} s</span>
      </el-button>
      <br>
      <br>
      <el-button type="success" @click="handleSMSPost(reprintForm)">确定提交</el-button>
      <el-button @click="handleCleanSMS()">取消</el-button>
    </el-dialog>

    <!-- 分页功能实现标签 -->
    <pagination v-show="total>0" :total="total" :page.sync="listQuery_all.page" @pagination="getList" />

  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { fetchAllPrinted, getReprintSMS, receiptReprintPost } from '@/api/chargingVoucher'
import waves from '@/directive/waves' // waves directive
import Pagination from '@/components/Pagination'

export default {
  name: 'ExportChargingVoucher',
  components: { Pagination },
  directives: { waves },
  data() {
    return {
      show: true,
      count: '',
      downloadLoading: false,
      listLoading: true,
      total: 0,
      listQuery_all: {
        page: 1,
        houseId: null,
        houseName: null,
        receiptNumber: null,
        adminId: this.$store.getters.adminId
      },
      printedTableData: null,
      tableData: null,
      dialogPrint: false,
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
      receiptNumber: null,
      dialogSMSVisible: null,
      // 申请重新打印表单
      reprintForm: {
        houseId: null,
        receiptNumber: null,
        adminId: this.$store.getters.adminId,
        smsCode: null
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
      fetchAllPrinted(this.listQuery_all).then(response => {
        this.tableData = response.data.items
        this.total = response.total
      })
    },
    // 领导审批按钮
    printDialog(row) {
      this.reprintForm.houseId = row.houseId
      this.reprintForm.receiptNumber = row.receiptNumber
      this.dialogSMSVisible = true
    },
    // 获取验证码页面取消按钮
    handleCleanSMS() {
      this.reprintForm.smsCode = ''
      this.dialogSMSVisible = false
    },
    // 获取验证码按钮
    getSmsCode(reprintForm) {
      getReprintSMS(reprintForm).then(response => {
        if (response.codeStatus === 200) {
          this.$message({ message: '验证码会发送到您的手机上，请注意查收', type: 'success' })
        } else {
          this.$message({ message: '提交失败，请联系系统管理员', type: 'error' })
        }
      })
      // 更改获取验证码按钮倒计时
      const TIME_COUNT = 30 // 更改倒计时时间
      if (!this.timer) {
        this.count = TIME_COUNT
        this.show = false
        this.timer = setInterval(() => {
          if (this.count > 0 && this.count <= TIME_COUNT) {
            this.count--
          } else {
            this.show = true
            clearInterval(this.timer) // 清除定时器
            this.timer = null
          }
        }, 1000)
      }
    },
    // 验证码确定提交表单
    handleSMSPost(reprintForm) {
      if (reprintForm.smsCode === null || reprintForm.smsCode.length < 6) {
        this.$message({ message: '请输入正确的验证码', type: 'error' })
      } else {
        receiptReprintPost(reprintForm).then(response => {
          if (response.codeStatus === 200) {
            this.$notify({
              title: 'Success',
              message: '提交成功',
              type: 'success',
              duration: 2000
            })
            this.dialogSMSVisible = false
            this.reprintForm.smsCode = ''
            fetchAllPrinted(this.listQuery_all).then(response => {
              this.tableData = response.data.items
              this.total = response.total
            })
          } else {
            this.$notify({
              title: 'Failure',
              message: '提交失败，请联系系统管理员',
              type: 'error',
              duration: 3000
            })
          }
        })
      }
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

  </style>

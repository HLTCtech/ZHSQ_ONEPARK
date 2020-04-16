<template>
  <!-- 收费总览 -->
  <div class="app-container">

    <!-- 顶部搜索框 -->
    <div class="filter-container">
      <el-input v-model="listQuery.houseId" type="text" placeholder="输入房号" style="width: 200px" class="filter-item" clearable />
      <el-input v-model="listQuery.houseName" type="text" placeholder="输入业主姓名" style="width: 200px" class="filter-item" clearable />
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleSearch()">
        搜索
      </el-button>
    </div>

    <!-- 房间信息 -->
    <el-card class="box-card">
      <el-table :data="tableDataHouseInfo" border fit highlight-current-row style="width: 100%" align="center">
        <el-table-column prop="houseId" label="房间号" align="center">
          <template slot-scope="scope">
            <el-tag @click="getHouseLog(scope.row.houseId)">{{ scope.row.houseId }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="houseName" label="业主姓名" align="center" />
        <el-table-column prop="housePhone" label="业主手机号" align="center" />
        <el-table-column label="住宅面积" prop="houseArea" align="center" />
        <el-table-column label="地下室面积" prop="basementArea" align="center" />
        <el-table-column prop="carNum" label="车牌号" align="center" />
        <el-table-column prop="carLoc" label="停车场位置" align="center" />
      </el-table>
    </el-card>
    <br>

    <!-- 房间费用具体信息 -->
    <el-card class="box-card">
      <el-tag :type="billStatus == '无欠费' ? 'success' : 'danger'" size="medium"> {{ billStatus }}</el-tag>
      <el-table ref="multipleSelection" :data="tableDataShallPayAll" highlight-current-row tooltip-effect="dark" style="width: 100%" @selection-change="handleSelectionChange">
        <el-table-column type="selection" />
        <el-table-column label="费用类型">
          <template slot-scope="scope">{{ scope.row.moneyType }}</template>
        </el-table-column>
        <el-table-column prop="chargingStandard" label="费率" />
        <el-table-column prop="rangeStart" label="周期开始" />
        <el-table-column prop="rangeEnd" label="周期结束" />
        <el-table-column prop="moneyShallPay" label="待缴金额" show-overflow-tooltip />
      </el-table>
      <el-card style="margin-top: 20px; width:200px; height: 50px; text-align:center; vertical-align:middle">
        <!-- 选定笔数：{{ this.$refs.multipleSelection.selection }} -->
        总金额：{{ selectItemNum }}
      </el-card>
      <div style="margin-top: 20px">
        <el-button type="success" @click="handleMoneyPost()">清缴</el-button>
        <el-button @click="toggleSelection()">取消</el-button>
      </div>
    </el-card>

    <!-- 一键收费（未欠费） -->
    <el-card class="box-card">
      <div class="payType-container">
        <el-tag type="info" size="large" style="width: 200px;text-align:center" class="payType-item" disabled>费用类型</el-tag>
        <el-tag type="info" size="large" style="width: 350px;text-align:center" class="payType-item" disabled>缴费周期</el-tag>
        <el-tag type="info" size="large" style="width: 200px;text-align:center" class="payType-item" disabled>缴费金额</el-tag>
        <el-tag type="info" size="large" style="width: 200px;text-align:center" class="payType-item" disabled>代金券金额</el-tag>
        <el-tag type="info" size="large" style="width: 200px;text-align:center" class="payType-item" disabled>应缴金额</el-tag>
      </div>
      <!-- 物业费缴纳 -->
      <div class="payType-container" style="padding:0 0 0 0">
        <el-tag size="large" style="width: 200px;text-align:center" class="payType-item" disabled>物业费</el-tag>
        <el-date-picker
          v-model="ItemsPay.propertyDateRange"
          class="filter-item"
          type="daterange"
          align="left"
          unlink-panels
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          value-format="yyyy-MM-dd"
          validate-event
          :picker-options="pickerOptions"
          required
        />
        <el-input v-model="ItemsPay.propertyMoneyNum" type="number" style="width: 200px" class="filter-item" clearable />
        <el-input v-model="ItemsPay.propertyVoucherNum" type="number" style="width: 200px" class="filter-item" clearable />
        <el-tag size="large" type="warning" style="width: 200px;text-align:center" class="payType-item" disabled>{{ propertyShallPay }}</el-tag>
      </div>
      <!-- 停车管理费缴纳 -->
      <div class="payType-container" style="padding:0 0 0 0">
        <el-tag size="large" style="width: 200px;text-align:center" class="payType-item" disabled>停车管理费</el-tag>
        <el-date-picker
          v-model="ItemsPay.parkingDateRange"
          class="filter-item"
          type="daterange"
          align="left"
          unlink-panels
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          value-format="yyyy-MM-dd"
          validate-event
          :picker-options="pickerOptions"
          required
        />
        <el-input v-model="ItemsPay.parkingMoneyNum" type="number" style="width: 200px" class="filter-item" clearable />
        <el-input v-model="ItemsPay.parkingVoucherNum" type="number" style="width: 200px" class="filter-item" clearable />
        <el-tag size="large" type="warning" style="width: 200px;text-align:center" class="payType-item" disabled>{{ parkingShallPay }}</el-tag>
      </div>
      <!-- 电费缴纳 -->
      <div class="payType-container" style="padding:0 0 0 0">
        <el-tag size="large" style="width: 200px;text-align:center" class="payType-item" disabled>电费</el-tag>
        <el-date-picker
          v-model="ItemsPay.electricDateRange"
          class="filter-item"
          type="daterange"
          align="left"
          unlink-panels
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          value-format="yyyy-MM-dd"
          validate-event
          :picker-options="pickerOptions"
          required
        />
        <el-input v-model="ItemsPay.electricMoneyNum" type="number" style="width: 200px" class="filter-item" clearable />
        <el-input type="text" style="width: 200px" class="filter-item" clearable disabled />
        <el-tag size="large" type="warning" style="width: 200px;text-align:center" class="payType-item" disabled>{{ electricShallPay }}</el-tag>
      </div>
      <!-- 水费缴纳 -->
      <div class="payType-container" style="padding:0 0 0 0">
        <el-tag size="large" style="width: 200px;text-align:center" class="payType-item" disabled>水费</el-tag>
        <el-input placeholder="" type="text" style="width: 350px" class="filter-item" disabled clearable />
        <el-input v-model="ItemsPay.waterMoneyNum" type="number" style="width: 200px" class="filter-item" clearable />
      </div>
      <!-- 暖气费缴纳 -->
      <div class="payType-container" style="padding:0 0 0 0">
        <el-tag size="large" style="width: 200px;text-align:center" class="payType-item" disabled>暖气费</el-tag>
        <el-input placeholder="11月15号至3月15号" type="text" style="width: 350px;" class="filter-item" disabled clearable />
        <el-input v-model="ItemsPay.heatMoneyNum" type="number" style="width: 200px" class="filter-item" clearable />
      </div>
      <!-- 装修保证金缴纳 -->
      <div class="payType-container" style="padding:0 0 0 0">
        <el-tag size="large" style="width: 200px;text-align:center" class="payType-item" disabled>装修保证金</el-tag>
        <el-input placeholder="" type="text" style="width: 350px" class="filter-item" disabled clearable />
        <el-input v-model="ItemsPay.decorationMoneyNum" type="number" style="width: 200px" class="filter-item" clearable />
      </div>
      <!-- 垃圾清运费缴纳 -->
      <div class="payType-container" style="padding:0 0 0 0">
        <el-tag size="large" style="width: 200px;text-align:center" class="payType-item" disabled>垃圾清运费</el-tag>
        <el-input placeholder="" type="text" style="width: 350px" class="filter-item" disabled clearable />
        <el-input v-model="ItemsPay.trashMoneyNum" type="number" style="width: 200px" class="filter-item" clearable />
      </div>
      <!-- 杂项费用缴纳 -->
      <div class="payType-container" style="padding:0 0 0 0">
        <el-tag size="large" style="width: 200px;text-align:center" class="payType-item" disabled>杂项费用</el-tag>
        <el-select v-model="ItemsPay.sundriesType" placeholder="选择缴费项目" clearable style="width: 350px" class="filter-item">
          <el-option v-for="item in sundriesOptions" :key="item" :label="item" :value="item" />
        </el-select>
        <el-input v-model="ItemsPay.sundriesMoneyNum" type="number" style="width: 200px" class="filter-item" clearable />
      </div>
      <div style="margin-top: 20px">
        <el-button type="success" @click="handleMoneyPostAll()">费用收缴</el-button>
        <el-button @click="toggleSelection()">取消</el-button>
      </div>
    </el-card>

    <!-- 清缴模态框 -->
    <el-dialog :visible.sync="dialogMoneyPost" title="欠费清缴">
      <el-card class="box-card">
        <!-- 复合缴费 -->
        <div label="复合缴费" label-width="100px">
          <el-form ref="mixDataForm" :rules="mixformRules" :model="mixFormPost" label-width="80px">
            <el-form-item label="房间号" label-width="100px" prop="houseId">
              <el-input v-model="mixFormPost.houseId" disabled />
            </el-form-item>
            <el-form-item label="应收总金额" label-width="100px">
              <el-input v-model.number="mixFormPost.shallPay" width="100px" disabled />
            </el-form-item>
            <el-form-item label="支付宝" label-width="100px">
              <el-input v-model.number="mixFormPost.mixPayType[0].value" type="number" style="width: 200px" placeholder="请输入金额" /><br>
            </el-form-item>
            <el-form-item label="微信" label-width="100px">
              <el-input v-model.number="mixFormPost.mixPayType[1].value" type="number" style="width: 200px" placeholder="请输入金额" /><br>
            </el-form-item>
            <el-form-item label="现金" label-width="100px">
              <el-input v-model.number="mixFormPost.mixPayType[2].value" type="number" style="width: 200px" placeholder="请输入金额" /><br>
            </el-form-item>
            <el-form-item label="其他" label-width="100px">
              <el-input v-model.number="mixFormPost.mixPayType[3].value" type="number" style="width: 200px" placeholder="请输入金额" />
            </el-form-item>
            <el-form-item label="实收总金额" label-width="100px">
              <el-input v-model.number="mixPayTotal" width="100px" disabled />
            </el-form-item>
            <el-form-item label="备注" label-width="100px" prop="remark">
              <el-input v-model="mixFormPost.remark" type="textarea" placeholder="如有需要请输入不多于30字的备注" />
            </el-form-item>
            <el-form-item>
              <el-button type="success" @click="mixSubmitFormPost(mixFormPost)">提交</el-button>
              <el-button @click="CleanDataForm()">取消</el-button>
            </el-form-item>
          </el-form>
        </div>
      </el-card>
    </el-dialog>

    <!-- 收缴模态框 -->
    <el-dialog :visible.sync="dialogMoneyPostAllItems" title="费用收缴">
      <el-card class="box-card">
        <!-- 复合缴费 -->
        <div label="复合缴费" label-width="100px">
          <el-form ref="ItemsPayForm" :rules="ItemsPayRules" :model="ItemsPay" label-width="80px">
            <el-form-item label="房间号" label-width="100px" prop="houseId">
              <el-input v-model="ItemsPay.houseId" disabled />
            </el-form-item>
            <el-form-item label="应收总金额" label-width="100px">
              <el-input v-model.number="ItemsPay.shallPay" width="100px" disabled />
            </el-form-item>
            <el-form-item label="支付宝" label-width="100px">
              <el-input v-model.number="ItemsPay.mixPayType[0].value" type="number" style="width: 200px" placeholder="请输入金额" /><br>
            </el-form-item>
            <el-form-item label="微信" label-width="100px">
              <el-input v-model.number="ItemsPay.mixPayType[1].value" type="number" style="width: 200px" placeholder="请输入金额" /><br>
            </el-form-item>
            <el-form-item label="现金" label-width="100px">
              <el-input v-model.number="ItemsPay.mixPayType[2].value" type="number" style="width: 200px" placeholder="请输入金额" /><br>
            </el-form-item>
            <el-form-item label="其他" label-width="100px">
              <el-input v-model.number="ItemsPay.mixPayType[3].value" type="number" style="width: 200px" placeholder="请输入金额" />
            </el-form-item>
            <el-form-item label="实收总金额" label-width="100px">
              <el-input v-model.number="payAllItemsMixPayTotal" width="100px" disabled />
            </el-form-item>
            <el-form-item label="备注" label-width="100px" prop="remark">
              <el-input v-model="ItemsPay.remark" type="textarea" placeholder="如有需要请输入不多于30字的备注" />
            </el-form-item>
            <el-form-item>
              <el-button type="success" @click="allItemsFormPost(ItemsPay)">提交</el-button>
              <el-button @click="CleanDataForm()">取消</el-button>
            </el-form-item>
          </el-form>
        </div>
      </el-card>
    </el-dialog>

    <!-- 点击houseId弹出信息变更历史模态框 -->
    <el-dialog :visible.sync="dialogHouseLog" title="房屋信息变更历史">
      <el-table :data="pvData_all" fit highlight-current-row style="width: 100%">
        <el-table-column prop="houseId" label="房间号" />
        <el-table-column prop="houseName" label="业主姓名" />
        <el-table-column prop="housePhone" label="业主手机号" />
        <el-table-column prop="houseArea" label="住宅面积" />
        <el-table-column prop="basementArea" label="地下室面积" />
        <el-table-column prop="changeTime" label="变更时间" />
      </el-table>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogHouseLog = false">确定</el-button>
      </span>
    </el-dialog>

  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { fetchBillInfoSearch, fetchBillAllList, moneyCleanPostAll, moneyPayPostAll, getRealtimeProperty, getRealtimeParking, getRealtimeElectric } from '@/api/payAll'
import waves from '@/directive/waves' // waves directive
import { getLogByHouseId } from '@/api/operationLog'
// import { parseTime } from '@/utils'
// import Pagination from '@/components/Pagination' // secondary package based on el-pagination

export default {
  name: 'BillPayAll',
  directives: { waves },
  // components: { Pagination },
  data() {
    return {
      show: true,
      count: '',
      payPattern: true,
      props: { multiple: true },
      dialogApproveSmsVisible: false,
      dialogMoneyOwing: false,
      dialogMoneyPostAllItems: false,
      billStatus: null,
      // 声明表格数据源
      tableDataHouseInfo: [],
      pvData_all: [],
      tableDataShallPayAll: [],
      multipleSelection: [],
      finalSelection: [],
      moneyTypes: [],
      dialogMoneyPost: false,
      // 根据用户输入请求参数
      listQuery: {
        houseId: null,
        houseName: null
      },
      dialogHouseLog: false,
      // 单一缴费时的选项
      singlePayOptions: [{ value: '支付宝', label: '支付宝' }, { value: '微信', label: '微信' }, { value: '现金', label: '现金' }, { value: '其他', label: '其他' }, { value: '特批', label: '特批' }],
      listLoading: true,
      // 复合缴费表单提交项目
      mixFormPost: {
        houseId: null,
        shallPay: null,
        multipleSelection: null,
        mixPayType: [{
          name: 'mixPayAlipay', value: null
        },
        { name: 'mixPayWechat', value: null
        },
        { name: 'mixPayCash', value: null
        },
        { name: 'mixPayOther', value: null
        }],
        mixPayTotalNum: null,
        remark: null,
        adminId: this.$store.getters.adminId,
        finalSelection: null
      },
      // 费用清缴复合收缴表单提交项目规则
      mixformRules: {
        houseId: [{ required: true, message: '请输入单一的完整房间号', trigger: 'change' }]
        // singlePayType: [{ required: true, message: '请选择收费类型', trigger: 'change' }],
        // singlePayMoney: [{ required: true, message: '请输入收缴金额（纯数字）', type: 'number', trigger: 'blur' }]
      },
      // 费用收缴规则
      ItemsPayRules: {
        houseId: [{ required: true, message: '请输入单一的完整房间号', trigger: 'change' }]
      },
      // 多项目缴费的参数定义
      ItemsPay: {
        houseId: null,
        mixPayType: [{
          name: 'mixPayAlipay', value: null
        },
        { name: 'mixPayWechat', value: null
        },
        { name: 'mixPayCash', value: null
        },
        { name: 'mixPayOther', value: null
        }],
        shallPay: null,
        payAllItemsMixPayTotal: null,
        remark: null,
        adminId: this.$store.getters.adminId,
        propertyDateRange: [],
        propertyMoneyNum: '',
        propertyVoucherNum: '',
        parkingDateRange: null,
        parkingMoneyNum: '',
        parkingVoucherNum: '',
        electricDateRange: null,
        electricMoneyNum: '',
        waterMoneyNum: '',
        heatMoneyNum: '',
        decorationMoneyNum: '',
        trashMoneyNum: '',
        sundriesType: null,
        sundriesMoneyNum: ''
      },
      // 往后推算的时间选择器
      pickerOptions: {
        shortcuts: [{
          text: '一个月',
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            end.setTime(start.getTime() + 3600 * 1000 * 24 * 30)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '三个月',
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            end.setTime(start.getTime() + 3600 * 1000 * 24 * 90)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '半年',
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            end.setTime(start.getTime() + 3600 * 1000 * 24 * 180)
            picker.$emit('pick', [start, end])
          }
        }]
      },
      // 定义杂项费用类型
      sundriesOptions: ['出入证工本费', '出入证押金', '有限电视', '智能卡工本费', '蓝牙卡工本费', '对外保洁', '电动车充电', '温泉水卡补卡', '车位锁工本费', '室内开荒'],
      // 根据前端选择的时间周期显示应缴金额
      propertyShallPay: null,
      parkingShallPay: null,
      electricShallPay: null
    }
  },
  computed: {
    ...mapGetters([
      'adminName',
      'adminId',
      'roles'
    ]),
    // 计算总费用
    selectItemNum: function() {
      var sum = 0
      var i = this.multipleSelection.length
      for (var num = 0; num < i; num++) {
        var all = this.multipleSelection[num]
        for (var key in all) {
          if (key === 'moneyShallPay') {
            // Number(all[key])
            // console.log(all[key])
            sum += all[key]
          }
        }
      }
      return sum
    },
    mixPayTotal: function() {
      var sum = 0
      this.mixFormPost.mixPayType.forEach((v, i) => {
        if (v.value === '') {
          v.value = 0
        }
        parseInt(v.value)
        sum += v.value
      })
      parseInt(sum)
      return sum
    },
    payAllItemsMixPayTotal: function() {
      var sum = 0
      this.ItemsPay.mixPayType.forEach((v, i) => {
        if (v.value === '') {
          v.value = 0
        }
        parseInt(v.value)
        sum += v.value
      })
      parseInt(sum)
      return sum
    }
  },
  watch: {
    // 监听前端周期变化
    'ItemsPay.propertyDateRange': function() {
      this.getRealtimeProperty()
    },
    'ItemsPay.parkingDateRange': function() {
      this.getRealtimeParking()
    },
    'ItemsPay.electricDateRange': function() {
      this.getRealtimeElectric()
    }
  },
  // created() {
  //   this.getList()
  // },
  methods: {
    // 根据前端周期监听返回相应的金额
    getRealtimeProperty() {
      getRealtimeProperty(this.ItemsPay.propertyDateRange).then(response => {
        this.propertyShallPay = response.propertyShallPay
      })
    },
    getRealtimeParking() {
      getRealtimeParking(this.ItemsPay.parkingDateRange).then(response => {
        this.parkingShallPay = response.parkingShallPay
      })
    },
    getRealtimeElectric() {
      getRealtimeElectric(this.ItemsPay.electricDateRange).then(response => {
        this.electricShallPay = response.electricShallPay
      })
    },
    // 搜索费用信息
    handleSearch() {
      fetchBillInfoSearch(this.listQuery).then(response => {
        this.tableDataHouseInfo = response.data.items
      })
      fetchBillAllList(this.listQuery).then(response => {
        this.tableDataShallPayAll = response.data.items
        this.billStatus = response.billStatus
      })
    },
    // 点击houseId获取房间变更历史
    getHouseLog(houseId) {
      getLogByHouseId(houseId).then(response => {
        this.pvData_all = response.data.pvData
        this.dialogHouseLog = true
      })
    },
    // 清缴按钮
    handleMoneyPost() {
      if (this.houseId === undefined) {
        this.$message({
          message: '请先输入房号',
          type: 'warning'
        })
      }
      this.mixFormPost.houseId = this.tableDataHouseInfo[0].houseId
      this.mixFormPost.shallPay = this.selectItemNum
      this.dialogMoneyPost = true
    },
    // 清缴费用复合收费提交收费表单
    mixSubmitFormPost(mixFormPost) {
      // 表单项规则验证
      this.$refs['mixDataForm'].validate((valid) => {
        // 操作确认框
        this.$confirm('确定提交么？', '费用收缴', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'info'
        }).then(() => {
          this.mixFormPost.mixPayTotalNum = this.mixPayTotal
          this.mixFormPost.finalSelection = this.finalSelection
          moneyCleanPostAll(mixFormPost).then(response => {
            if (response.codeStatus === 200) {
              this.$notify({
                title: 'Success',
                message: '提交成功',
                type: 'success',
                duration: 2000
              })
              // 同时清空单一缴费表单
              if (this.$refs['singleDataForm'] !== undefined) {
                this.$nextTick(() => {
                  this.$refs['singleDataForm'].resetFields()
                })
              }
              this.mixFormPost.mixPayTotalNum = 0
              this.mixFormPost.mixPayType[0].value = ''
              this.mixFormPost.mixPayType[1].value = ''
              this.mixFormPost.mixPayType[2].value = ''
              this.mixFormPost.mixPayType[3].value = ''
              this.mixFormPost.remark = ''
              this.dialogMoneyPost = false
              fetchBillAllList(this.listQuery).then(response => {
                this.tableDataShallPayAll = response.data.items
                this.billStatus = response.billStatus
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
        })
      })
    },
    // 费用收缴按钮
    handleMoneyPostAll() {
      if (this.houseId === undefined) {
        this.$message({
          message: '请先输入房号',
          type: 'warning'
        })
      }
      this.ItemsPay.houseId = this.tableDataHouseInfo[0].houseId
      this.ItemsPay.shallPay = Number(this.ItemsPay.propertyMoneyNum) + Number(this.ItemsPay.parkingMoneyNum) + Number(this.ItemsPay.electricMoneyNum) +
        Number(this.ItemsPay.waterMoneyNum) + Number(this.ItemsPay.heatMoneyNum) + Number(this.ItemsPay.decorationMoneyNum) + Number(this.ItemsPay.trashMoneyNum) + Number(this.ItemsPay.sundriesMoneyNum)
      this.dialogMoneyPostAllItems = true
    },
    // 收缴费用表单
    allItemsFormPost(ItemsPay) {
      // 表单项规则验证
      this.$refs['ItemsPayForm'].validate((valid) => {
        if ((this.payAllItemsMixPayTotal !== this.ItemsPay.shallPay) === true) {
          this.$alert('应收实收金额不一致', '注意', {
            confirmButtonText: '确定',
            callback: action => {
              this.$message({
                type: 'info',
                message: `请核对金额`
              })
            }
          })
        } else {
          // 操作确认框
          this.$confirm('确定提交么？', '费用收缴', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'info'
          }).then(() => {
            this.ItemsPay.payAllItemsMixPayTotal = this.payAllItemsMixPayTotal
            moneyPayPostAll(ItemsPay).then(response => {
              if (response.codeStatus === 200) {
                this.$notify({
                  title: 'Success',
                  message: '提交成功',
                  type: 'success',
                  duration: 2000
                })
                // 同时清空单一缴费表单
                if (this.$refs['singleDataForm'] !== undefined) {
                  this.$nextTick(() => {
                    this.$refs['singleDataForm'].resetFields()
                  })
                }
                this.ItemsPay.payAllItemsMixPayTotal = 0
                this.ItemsPay.mixPayType[0].value = ''
                this.ItemsPay.mixPayType[1].value = ''
                this.ItemsPay.mixPayType[2].value = ''
                this.ItemsPay.mixPayType[3].value = ''
                this.ItemsPay.remark = ''
                this.ItemsPay.propertyDateRange = ''
                this.ItemsPay.propertyMoneyNum = ''
                this.ItemsPay.propertyVoucherNum = ''
                this.ItemsPay.parkingDateRange = ''
                this.ItemsPay.parkingMoneyNum = ''
                this.ItemsPay.parkingVoucherNum = ''
                this.ItemsPay.electricDateRange = ''
                this.ItemsPay.electricMoneyNum = ''
                this.ItemsPay.waterMoneyNum = ''
                this.ItemsPay.heatMoneyNum = ''
                this.ItemsPay.decorationMoneyNum = ''
                this.ItemsPay.trashMoneyNum = ''
                this.ItemsPay.sundriesType = ''
                this.ItemsPay.sundriesMoneyNum = ''
                this.dialogMoneyPostAllItems = false
                fetchBillAllList(this.listQuery).then(response => {
                  this.tableDataShallPayAll = response.data.items
                  this.billStatus = response.billStatus
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
          })
        }
      })
    },
    // 多选框取消选择
    toggleSelection(rows) {
      if (rows) {
        rows.forEach(row => {
          this.$refs.multipleSelection.toggleRowSelection(row)
        })
      } else {
        this.$refs.multipleSelection.clearSelection()
      }
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
    // 收费页面取消按钮
    CleanDataForm() {
      if (this.$refs['singleDataForm'] !== undefined) {
        this.$nextTick(() => {
          this.$refs['singleDataForm'].resetFields()
        })
      }
      this.mixFormPost.mixPayTotalNum = 0
      this.mixFormPost.mixPayType[0].value = null
      this.mixFormPost.mixPayType[1].value = null
      this.mixFormPost.mixPayType[2].value = null
      this.mixFormPost.mixPayType[3].value = null
      this.mixFormPost.remark = ''
      if (this.$refs['ItemsPayForm'] !== undefined) {
        this.$nextTick(() => {
          this.$refs['ItemsPayForm'].resetFields()
        })
      }
      this.ItemsPay.mixPayTotalNum = 0
      this.ItemsPay.mixPayType[0].value = null
      this.ItemsPay.mixPayType[1].value = null
      this.ItemsPay.mixPayType[2].value = null
      this.ItemsPay.mixPayType[3].value = null
      this.ItemsPay.remark = ''
      this.dialogMoneyPost = false
      this.dialogMoneyPostAllItems = false
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

.payType-container {

  .payType-item {
    display: inline-block;
    vertical-align: middle;
  }
}
  </style>

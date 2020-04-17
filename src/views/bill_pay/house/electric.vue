<template>
  <!-- 住宅电费收费界面 -->
  <div class="app-container">
    <div class="filter-container">
      <!-- <el-input v-model="listQuery.lou_num" placeholder="楼号" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" /> -->
      <el-select v-model="listQuery_search.buildingNum" placeholder="选择楼号" clearable style="width: 120px" class="filter-item">
        <el-option v-for="item in lou_numOptions" :key="item" :label="item" :value="item" />
      </el-select>
      <el-select v-model="listQuery_search.unitNum" placeholder="选择单元号" clearable style="width: 120px" class="filter-item">
        <el-option v-for="item in danyuan_numOptions" :key="item" :label="item" :value="item" />
      </el-select>
      <el-input v-model="listQuery_search.houseNum" type="text" placeholder="输入房间号" style="width: 130px" class="filter-item" clearable />
      <el-input v-model="listQuery_search.houseName" type="text" placeholder="输入业主姓名" style="width: 130px" class="filter-item" clearable />

      <!-- 时间选择器 -->
      <el-date-picker
        v-model="listQuery_search.datePicker"
        class="filter-item"
        type="daterange"
        align="right"
        unlink-panels
        range-separator="至"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
        :picker-options="pickerOptions"
        value-format="yyyy-MM-dd"
      />
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter()">
        搜索
      </el-button>
    </div>

    <!-- 动态加载表头以及内容 -->
    <el-table v-loading="listLoading" highlight-current-row stripe border fit :data="tableColumns" style="width: 100%" align="center" height="800">
      <el-table-column v-for="(item,key) in titleData" :key="key" :prop="item.value" :label="item.name" align="center">
        <template slot-scope="scope">
          <el-tag v-if="scope.column.property=='houseId'" align="center" @click="getHouseLog(scope.row.houseId)">{{ scope.row[scope.column.property] }}</el-tag>
          <span v-else-if="scope.column.property=='id'">{{ scope.row[scope.column.property] }}</span>
          <span v-else-if="scope.column.property=='houseName'">{{ scope.row[scope.column.property] }}</span>
          <el-tag v-else-if="scope.column.property=='payStatus'" :type="scope.row[scope.column.property] > 0 ? 'success' : 'danger'" @click="handleFetchPv_all(scope.row.houseId)">
            <!-- <el-tag :type="scope.column.status === 'yes' ? 'success' : 'danger'" disable-transitions> -->
            {{ scope.row[scope.column.property] }}
            <!-- </el-tag> -->
          </el-tag>
          <span v-else class="link-type" @click="handleFetchPv_single(scope.column.property, scope.row.houseId)">{{ scope.row[scope.column.property] }}</span>
        </template>
      </el-table-column>

      <!-- 费用详情按钮 -->
      <el-table-column label="月度费用详情" align="center" width="230" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" @click="handleFetchAllDetailByMonth(scope.row.houseId)">
            详情
          </el-button>
        </template>
      </el-table-column>

      <!-- 费用收缴按钮 -->
      <el-table-column label="费用收缴" align="center" width="230" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button type="success" size="mini" @click="handleMoneyGet(scope.row.houseId)">
            收缴
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 费用收缴模态框 -->
    <el-dialog :visible.sync="dialogMoneyGetFormVisible" title="费用收缴">
      <!-- 展示当前房间的费用状态统计 -->
      <el-table :data="pvData_all" border fit highlight-current-row style="width: 100%" align="center">
        <el-table-column prop="houseId" label="房间号" align="center" />
        <el-table-column prop="prestore" label="预存余额" align="center" />
        <el-table-column prop="shallPayAll" label="应收金额总计" align="center" />
        <el-table-column prop="receivedPayAll" label="实收金额总计" align="center" />
        <el-table-column prop="notPayAll" label="未缴金额总计" align="center" />
      </el-table>
      <br>
      <!-- 具体月度读数等信息的弹出框 -->
      <el-popover placement="right" width="400" trigger="click">
        <el-table :data="pvData_details">
          <el-table-column label="日期" prop="date" align="center">
            <template slot-scope="{row}">
              <span>{{ row.date }}</span>
            </template>
          </el-table-column>
          <el-table-column label="读数" prop="meterReading" align="center">
            <template slot-scope="{row}">
              <span>{{ row.meterReading }}</span>
            </template>
          </el-table-column>
          <el-table-column label="应收" prop="shallPay" align="center">
            <template slot-scope="{row}">
              <span>{{ row.shallPay }}</span>
            </template>
          </el-table-column>
          <el-table-column label="未收" prop="notPay" align="center">
            <template slot-scope="{row}">
              <span>{{ row.notPay }}</span>
            </template>
          </el-table-column>
        </el-table>
        <el-button slot="reference" type="primary">查看月度费用详情</el-button>
      </el-popover>

      <!-- 定义表单提交项 -->
      <el-card class="box-card">

        <el-switch v-model="payPattern" label="" label-width="100px" active-text="复合缴费" inactive-text="单一缴费" active-value="0" inactive-value="1" />
        <br>
        <br>

        <!-- 选择单一缴费时的提交表单 -->
        <div v-if="payPattern==1" label="单一缴费" label-width="100px">
          <el-form ref="singleDataForm" :rules="singleformRules" :model="singleFormPost" label-width="80px">
            <el-form-item label="房间号" label-width="100px" prop="houseId">
              <el-input v-model="singleFormPost.houseId" placeholder="请输入单一完整房号（不要输入多个房号）" />
            </el-form-item>
            <el-form-item label="缴费周期" label-width="100px" prop="singlePayDateRange">
              <el-date-picker
                v-model="singleFormPost.singlePayDateRange"
                class="filter-item"
                type="daterange"
                align="right"
                unlink-panels
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                value-format="yyyy-MM-dd"
              />
            </el-form-item>
            <el-form-item label="缴费方式" label-width="100px" prop="singlePayType">
              <el-select v-model="singleFormPost.singlePayType" placeholder="请选择">
                <el-option v-for="item in singlePayOptions" :key="item.value" :label="item.label" :value="item.value" />
              </el-select>
            </el-form-item>
            <el-form-item label="缴费金额" label-width="100px" prop="singlePayMoney">
              <el-input v-model.number="singleFormPost.singlePayMoney" type="number" style="width: 200px" placeholder="请输入金额" />
            </el-form-item>
            <el-form-item label="备注" label-width="100px" prop="remark">
              <el-input v-model="singleFormPost.remark" type="textarea" placeholder="如有需要请输入不多于30字的备注" />
            </el-form-item>
            <el-form-item>
              <el-button type="success" @click="singleSubmitFormPost(singleFormPost)">提交</el-button>
              <el-button @click="CleanDataForm()">取消</el-button>
            </el-form-item>
          </el-form>
        </div>

        <!-- 选择复合缴费时的提交表单 -->
        <div v-if="payPattern==0" label="复合缴费" label-width="100px">
          <el-form ref="mixDataForm" :rules="mixformRules" :model="mixFormPost" label-width="80px">
            <el-form-item label="房间号" label-width="100px" prop="houseId">
              <el-input v-model="mixFormPost.houseId" placeholder="请输入单一完整房号（不要输入多个房号）" />
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
            <el-form-item label="缴费周期" label-width="100px" prop="mixPayDateRange">
              <el-date-picker
                v-model="mixFormPost.mixPayDateRange"
                class="filter-item"
                type="daterange"
                align="right"
                unlink-panels
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                value-format="yyyy-MM-dd"
              />
            </el-form-item>
            <el-form-item label="总金额" label-width="100px">
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

        <!-- 收费类型为特批时验证码模态框处理 -->
        <el-dialog width="40%" title="领导审批" style="top: 20%" :visible.sync="dialogSMSVisible" append-to-body>
          <el-input
            ref="smsCode"
            v-model="singleFormPost.smsCode"
            placeholder="请输入短信验证码"
            name="smsCode"
            type="number"
            tabindex="1"
            autocomplete="on"
          />
          <el-button class="show-sms" type="primary" :disabled="disabled=!show" style="width:175px;" @click="getSmsCode(singleSMSPost)">
            <span v-show="show">获取验证码</span>
            <span v-show="!show" class="count"> {{ count }} s</span>
          </el-button>
          <br>
          <br>
          <el-button type="success" @click="handleSMSPost(singleFormPost)">确定提交</el-button>
          <el-button @click="handleCleanSMS()">取消</el-button>
        </el-dialog>

      </el-card>

    </el-dialog>

    <!-- 月度费用状态详情模态框 -->
    <el-dialog :visible.sync="dialogPvVisibleDetailByMonth" title="所有的费用详情">
      <el-table :data="pvData_details" tooltip-effect="dark" style="width: 100%">
        <el-table-column label="年/月" prop="date" align="center">
          <template slot-scope="{row}">
            <span>{{ row.date }}</span>
          </template>
        </el-table-column>
        <el-table-column label="读数" prop="meterReading" align="center">
          <template slot-scope="{row}">
            <span>{{ row.meterReading }}</span>
          </template>
        </el-table-column>
        <el-table-column label="应收" prop="shallPay" align="center">
          <template slot-scope="{row}">
            <span>{{ row.shallPay }}</span>
          </template>
        </el-table-column>
        <el-table-column label="未收" prop="notPay" align="center">
          <template slot-scope="{row}">
            <span>{{ row.notPay }}</span>
          </template>
        </el-table-column>
      </el-table>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogPvVisibleDetailByMonth = false">确定</el-button>
      </span>
    </el-dialog>

    <!-- 点击houseId弹出信息变更历史模态框 -->
    <el-dialog :visible.sync="dialogHouseLog" title="房屋信息变更历史">
      <el-table :data="pvData_HouseLog" fit highlight-current-row style="width: 100%">
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

    <!-- 所有费用状态的弹出模态框 -->
    <el-dialog :visible.sync="dialogPvVisible_all" title="所有的费用详情">
      <el-table :data="pvData_all" fit highlight-current-row style="width: 100%">
        <el-table-column prop="houseId" label="房间号" />
        <el-table-column prop="prestore" label="预存余额" />
        <el-table-column prop="shallPayAll" label="应收总计金额" />
        <el-table-column prop="receivedPayAll" label="实收总计金额" />
        <el-table-column prop="notPayAll" label="未缴总计金额" />
      </el-table>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogPvVisible_all = false">确定</el-button>
      </span>
    </el-dialog>

    <!-- 单一月份具体费用信息的弹出模态框 -->
    <el-dialog :visible.sync="dialogPvVisible_single" title="费用详情">
      <el-table :data="pvData_single" fit highlight-current-row style="width: 100%">
        <el-table-column prop="houseId" label="房间号" />
        <el-table-column prop="month" label="月份" />
        <el-table-column prop="shallPay" label="应收金额" />
        <el-table-column prop="receivedPay" label="实收金额" />
        <el-table-column prop="notPay" label="未缴金额" />
      </el-table>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogPvVisible_single = false">确定</el-button>
      </span>
    </el-dialog>

    <!-- 分页功能实现标签 -->
    <pagination v-show="total>0" :total="total" :page.sync="listQuery_search.page" @pagination="fetchListSearch" />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { fetchHouseSearch, fetchPreViewSingle, fetchPreViewAll, fetchAllDetailByMonth, singleMoneyPost, mixMoneyPost, fetchSearchByHouseId, getElectricSMS } from '@/api/payElectric'
import { getLogByHouseId } from '@/api/operationLog'
import waves from '@/directive/waves' // waves directive
// import { parseTime } from '@/utils'
import Pagination from '@/components/Pagination' // secondary package based on el-pagination

export default {
  name: 'ElectricHousePay',
  components: { Pagination },
  directives: { waves },
  data() {
    return {
      show: true,
      count: '',
      payPattern: true,
      props: { multiple: true },
      listLoading: true,
      total: 0,
      // 定义搜索按钮的query字段
      listQuery_search: {
        page: 1,
        buildingNum: null,
        unitNum: null,
        houseNum: null,
        datePicker: null,
        houseName: null
      },
      // 单一缴费时的选项
      singlePayOptions: [{ value: '支付宝', label: '支付宝' }, { value: '微信', label: '微信' }, { value: '现金', label: '现金' }, { value: '其他', label: '其他' }, { value: '特批', label: '特批' }],
      // 调取短信验证码提交项目
      singleSMSPost: {
        houseId: null,
        adminId: this.$store.getters.adminId,
        payItem: '住宅电费'
      },
      // 单一缴费表单提交项目
      singleFormPost: {
        houseId: null,
        singlePayType: null,
        singlePayMoney: null,
        remark: null,
        payItem: '住宅电费',
        adminId: this.$store.getters.adminId,
        smsCode: null,
        singlePayDateRange: null
      },
      // 复合缴费表单提交项目
      mixFormPost: {
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
        mixPayTotalNum: null,
        remark: null,
        payItem: '住宅电费',
        mixPayDateRange: null,
        adminId: this.$store.getters.adminId
      },
      // 单一收缴表单提交项目规则
      singleformRules: {
        houseId: [{ required: true, message: '请输入单一的完整房间号', trigger: 'blur' }],
        singlePayType: [{ required: true, message: '请选择缴费方式', trigger: 'blur' }],
        singlePayMoney: [{ required: true, message: '请输入收缴金额（纯数字）', type: 'number', trigger: 'blur' }],
        singlePayDateRange: [{ required: true, message: '请选择缴费周期', trigger: 'blur' }]
      },
      // 复合收缴表单提交项目规则
      mixformRules: {
        houseId: [{ required: true, message: '请输入单一的完整房间号', trigger: 'blur' }],
        mixPayDateRange: [{ required: true, message: '请选择缴费周期', trigger: 'blur' }]
        // singlePayType: [{ required: true, message: '请选择收费类型', trigger: 'change' }],
        // singlePayMoney: [{ required: true, message: '请输入收缴金额（纯数字）', type: 'number', trigger: 'blur' }]
      },
      // 短信验证码模态框
      dialogSMSVisible: false,
      // 收费页面模态框
      dialogMoneyPost: false,
      // 定义顶部搜索框的选择字段
      lou_numOptions: ['1号楼', '2号楼', '3号楼', '4号楼', '5号楼', '6号楼', '7号楼', '8号楼', '9号楼', '10号楼', '11号楼', '12号楼', '13号楼', '14号楼', '15号楼', '16号楼', '17号楼', '18号楼', '19号楼', '20号楼', '21号楼', '22号楼', '23号楼', '24号楼', '25号楼', '26号楼', '27号楼', '28号楼', '29号楼', '30号楼', '31号楼'],
      danyuan_numOptions: ['1单元', '2单元', '3单元'],
      floor_numOptions: ['1楼', '2楼', '3楼', '4楼', '5楼', '6楼', '7楼', '8楼', '9楼', '10楼', '11楼', '12楼', '13楼', '14楼', '15楼', '16楼', '17楼', '18楼'],
      fangjian_numOptions: ['01', '02', '03', '04', '05', '06'],
      // 声明下api变量
      titleData: [],
      tableColumns: [],
      pvData_HouseLog: [],
      // 定义模态框显示与否
      dialogMoneyGetFormVisible: false,
      dialogFormVisible: false,
      dialogPvVisibleDetailByMonth: false,
      dialogStatus: '',
      pvData_all: [],
      pvData_single: [],
      pvData_details: [],
      dialogPvVisible_all: false,
      dialogPvVisible_single: false,
      dialogApproveSmsVisible: false,
      dialogHouseLog: false,
      checkBoxData: [],
      // 时间选择器返回数据
      pickerOptions: {
        shortcuts: [{
          text: '最近一周',
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '最近一个月',
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '最近三个月',
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
            picker.$emit('pick', [start, end])
          }
        }]
      }
    //   date_picker: ''
    }
  },
  computed: {
    ...mapGetters([
      'adminName',
      'adminId',
      'roles'
    ]),
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
    payPatternChange() {
      return this.payPattern
    }
  },
  watch: {
    payPatternChange(val) {
      if (this.$refs['singleDataForm'] !== undefined) {
        this.$refs['singleDataForm'].clearValidate()
      }
      if (this.$refs['mixDataForm'] !== undefined) {
        this.$refs['mixDataForm'].clearValidate()
      }
    }
  },
  created() {
    this.handleFilter()
  },
  methods: {
    // 根据选定信息搜索
    fetchListSearch() {
      this.listLoading = true
      fetchHouseSearch(this.listQuery_search).then(response => {
        this.titleData = response.data.titles
        this.tableColumns = response.data.items
        this.total = response.total
        this.listLoading = false
      })
    },
    handleFilter() {
      this.listLoading = true
      this.listQuery_search.page = 1
      fetchHouseSearch(this.listQuery_search).then(response => {
        this.titleData = response.data.titles
        this.tableColumns = response.data.items
        this.total = response.total
        this.listLoading = false
      })
    },
    // 收费按钮绑定的处理事件
    handleMoneyGet(houseId) {
      console.log(houseId)
      this.singleFormPost.houseId = houseId
      this.mixFormPost.houseId = houseId
      fetchPreViewAll(houseId).then(response => {
        this.pvData_all = response.data.pvData
      })
      // 访问获取具体每月的电表读数等费用信息
      fetchAllDetailByMonth(houseId).then(response => {
        this.pvData_details = response.data.items
      })
      this.dialogMoneyGetFormVisible = true
    },
    // 获取月度费用详情
    handleFetchAllDetailByMonth(houseId) {
      fetchAllDetailByMonth(houseId).then(response => {
        this.pvData_details = response.data.items
        this.dialogPvVisibleDetailByMonth = true
      })
    },
    // 获取费用状态统计
    handleFetchPv_all(houseId) {
      // 定义具体费用字段的弹出模态框
      fetchPreViewAll(houseId).then(response => {
        this.pvData_all = response.data.pvData
        this.dialogPvVisible_all = true
      })
    },
    // 获取单月费用状态
    handleFetchPv_single(pv, houseId) {
      // 定义具体费用字段的弹出模态框
      console.log(pv, houseId)
      //   console.log('currentTarget-----' + pv.currentTarget)
      fetchPreViewSingle(pv, houseId).then(response => {
        this.pvData_single = response.data.pvData
        this.dialogPvVisible_single = true
      })
    },
    // 获取验证码按钮
    getSmsCode(singleSMSPost) {
      singleSMSPost.houseId = this.singleFormPost.houseId
      getElectricSMS(singleSMSPost).then(response => {
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
    // 缴款类型是特批时，验证码点击提交的收费表单
    handleSMSPost(singleFormPost) {
      if (singleFormPost.smsCode === null || singleFormPost.smsCode.length < 6) {
        this.$message({ message: '请输入正确的验证码', type: 'error' })
      } else {
        singleMoneyPost(singleFormPost).then(response => {
          if (response.codeStatus === 200) {
            this.$notify({
              title: 'Success',
              message: '提交成功',
              type: 'success',
              duration: 2000
            })

            this.dialogSMSVisible = false
            this.dialogMoneyGetFormVisible = false
            this.$nextTick(() => {
              this.$refs['singleDataForm'].resetFields()
              this.singleFormPost.smsCode = ''
            })
            // 同时清空复合缴费表单
            this.mixFormPost.mixPayTotalNum = 0
            this.mixFormPost.mixPayType[0].value = ''
            this.mixFormPost.mixPayType[1].value = ''
            this.mixFormPost.mixPayType[2].value = ''
            this.mixFormPost.mixPayType[3].value = ''
            this.mixFormPost.remark = ''
            fetchSearchByHouseId(singleFormPost.houseId).then(response => {
              this.titleData = response.data.titles
              this.tableColumns = response.data.items
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
    },
    // 单一收费提交收费表单
    singleSubmitFormPost(singleFormPost) {
      // 表单项规则验证
      this.$refs['singleDataForm'].validate((valid) => {
        if (valid) {
          // 收费类型为特批时验证码模态框处理
          if (this.singleFormPost.singlePayType === '特批') {
            this.dialogSMSVisible = true
          } else {
            // 操作确认框
            this.$confirm('确定提交么？', '费用收缴', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'info'
            }).then(() => {
              singleMoneyPost(singleFormPost).then(response => {
                if (response.codeStatus === 200) {
                  this.$notify({
                    title: 'Success',
                    message: '提交成功',
                    type: 'success',
                    duration: 2000
                  })
                  this.$nextTick(() => {
                    this.$refs['singleDataForm'].resetFields()
                    this.singleFormPost.smsCode = ''
                  })
                  // 同时清空复合缴费表单
                  this.mixFormPost.mixPayTotalNum = 0
                  this.mixFormPost.mixPayType[0].value = ''
                  this.mixFormPost.mixPayType[1].value = ''
                  this.mixFormPost.mixPayType[2].value = ''
                  this.mixFormPost.mixPayType[3].value = ''
                  this.mixFormPost.remark = ''
                  this.dialogMoneyGetFormVisible = false
                  fetchSearchByHouseId(singleFormPost.houseId).then(response => {
                    this.titleData = response.data.titles
                    this.tableColumns = response.data.items
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
        }
      })
    },
    // 复合收费提交收费表单
    mixSubmitFormPost(mixFormPost) {
      // 表单项规则验证
      this.$refs['mixDataForm'].validate((valid) => {
        console.log(this.mixPayTotal)
        if (this.mixPayTotal === 0) {
          // this.$message.error('总金额为0！')
          this.$confirm('总金额为0', '费用收缴', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'info'
          }).then(() => {
            if (valid) {
              // 操作确认框
              this.$confirm('确定提交么？', '费用收缴', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'info'
              }).then(() => {
                this.mixFormPost.mixPayTotalNum = this.mixPayTotal
                mixMoneyPost(mixFormPost).then(response => {
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
                    this.dialogMoneyGetFormVisible = false
                    fetchSearchByHouseId(mixFormPost.houseId).then(response => {
                      this.titleData = response.data.titles
                      this.tableColumns = response.data.items
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
        } else if (valid) {
          // 操作确认框
          this.$confirm('确定提交么？', '费用收缴', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'info'
          }).then(() => {
            this.mixFormPost.mixPayTotalNum = this.mixPayTotal
            mixMoneyPost(mixFormPost).then(response => {
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
                this.dialogMoneyGetFormVisible = false
                fetchSearchByHouseId(mixFormPost.houseId).then(response => {
                  this.titleData = response.data.titles
                  this.tableColumns = response.data.items
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
    // 获取验证码页面取消按钮
    handleCleanSMS() {
      this.singleFormPost.smsCode = ''
      this.dialogSMSVisible = false
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
      this.dialogMoneyGetFormVisible = false
    },
    // 点击houseId获取房间变更历史
    getHouseLog(houseId) {
      // 定义具体费用字段的弹出模态框
      getLogByHouseId(houseId).then(response => {
        this.pvData_HouseLog = response.data.pvData
        this.dialogHouseLog = true
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

  </style>

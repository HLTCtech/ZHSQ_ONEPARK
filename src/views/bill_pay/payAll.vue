<template>
  <!-- 收费总览 -->
  <div class="app-container">

    <!-- 顶部搜索框 -->
    <div class="filter-container">
      <el-select v-model="listQuery_search.panNum" placeholder="选择楼盘" clearable style="width: 120px" class="filter-item">
        <el-option v-for="item in panNumOptions" :key="item" :label="item" :value="item" />
      </el-select>
      <el-input v-model="listQuery_search.houseId" type="text" placeholder="输入房号" style="width: 200px" class="filter-item" clearable />
      <el-input v-model="listQuery_search.houseName" type="text" placeholder="输入业主姓名" style="width: 200px" class="filter-item" clearable />
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleSearch()">
        搜索
      </el-button>
    </div>

    <!-- 房间信息 -->
    <el-card class="box-card">
      <el-table :data="pvData_all" border fit highlight-current-row style="width: 100%" align="center">
        <el-table-column prop="houseId" label="房间号" align="center" />
        <el-table-column prop="prestore" label="业主姓名" align="center" />
        <el-table-column prop="shallPayAll" label="业主手机号" align="center" />
        <el-table-column label="面积" align="center">
          <el-table-column label="住宅面积" prop="houseArea" align="center" />
          <el-table-column label="地下室面积" prop="basementArea" align="center" />
        </el-table-column>
        <el-table-column prop="notPayAll" label="车牌号" align="center" />
        <el-table-column prop="receivedPayAll" label="停车场位置" align="center" />
      </el-table>
    </el-card>
    <br>

    <!-- 房间费用具体信息 -->
    <el-card class="box-card">
      <div class="filter-container">
        <el-select v-model="listQuery_search.panNum" placeholder="选择楼盘" clearable style="width: 120px" class="filter-item">
          <el-option v-for="item in panNumOptions" :key="item" :label="item" :value="item" />
        </el-select>
        <el-input v-model="listQuery_search.houseId" type="text" placeholder="输入房号" style="width: 200px" class="filter-item" clearable />
        <el-input v-model="listQuery_search.houseName" type="text" placeholder="输入业主姓名" style="width: 200px" class="filter-item" clearable />
        <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleSearch()">
          搜索
        </el-button>
      </div>
    </el-card>

    <!-- 分页功能实现标签 -->
    <pagination v-show="total>0" :total="total" :page.sync="listQuery_all.page" @pagination="getList" />

  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { fetchWaterLogList, fetchWaterLogSearch } from '@/api/payWater'
import waves from '@/directive/waves' // waves directive
import { getLogByHouseId } from '@/api/operationLog'
// import { parseTime } from '@/utils'
import Pagination from '@/components/Pagination' // secondary package based on el-pagination

export default {
  name: 'WaterPay',
  directives: { waves },
  components: { Pagination },
  data() {
    return {
      show: true,
      count: '',
      payPattern: true,
      props: { multiple: true },
      dialogApproveSmsVisible: false,
      // 声明表格数据源
      tableData: [],
      pvData_all: [],
      // 声明分页变量
      total: 0,
      // search()查询请求变量
      listQuery_search: {
        houseId: null,
        houseName: null,
        dateRange: null
      },
      // list()查询请求变量
      listQuery_all: {
        page: 1
      },
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
      },
      panNumOptions: ['尚郡', '壹号院'],
      // 单一缴费时的选项
      singlePayOptions: [{ value: '支付宝', label: '支付宝' }, { value: '微信', label: '微信' }, { value: '现金', label: '现金' }, { value: '其他', label: '其他' }, { value: '特批', label: '特批' }],
      listLoading: true,
      // 调取短信验证码提交项目
      singleSMSPost: {
        houseId: null,
        adminId: this.$store.getters.adminId,
        payItem: '住宅水费'
      },
      // 单一缴费表单提交项目
      singleFormPost: {
        houseId: null,
        singlePayType: null,
        singlePayMoney: null,
        remark: null,
        payItem: '住宅水费',
        adminId: this.$store.getters.adminId,
        smsCode: null
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
        payItem: '住宅水费',
        adminId: this.$store.getters.adminId
      },
      // 单一收缴表单提交项目规则
      singleformRules: {
        houseId: [{ required: true, message: '请输入单一的完整房间号', trigger: 'change' }],
        singlePayType: [{ required: true, message: '请选择缴费方式', trigger: 'change' }],
        singlePayMoney: [{ required: true, message: '请输入收缴金额（纯数字）', type: 'number', trigger: 'blur' }]
      },
      // 复合收缴表单提交项目规则
      mixformRules: {
        houseId: [{ required: true, message: '请输入单一的完整房间号', trigger: 'change' }]
        // singlePayType: [{ required: true, message: '请选择收费类型', trigger: 'change' }],
        // singlePayMoney: [{ required: true, message: '请输入收缴金额（纯数字）', type: 'number', trigger: 'blur' }]
      },
      // 短信验证码模态框
      dialogSMSVisible: false,
      // 收费页面模态框
      dialogMoneyPost: false,
      dialogHouseLog: false
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
    }
  },
  created() {
    this.getList()
  },
  methods: {
    // 获取表格数据
    getList() {
      fetchWaterLogList(this.listQuery_all).then(response => {
        this.tableData = response.data.items
        this.total = response.total
      })
    },
    // 搜索记录
    handleSearch() {
      fetchWaterLogSearch(this.listQuery_search).then(response => {
        this.tableData = response.data.items
        this.total = response.total
      })
    },
    // 点击houseId获取房间变更历史
    getHouseLog(houseId) {
      getLogByHouseId(houseId).then(response => {
        this.pvData_all = response.data.pvData
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

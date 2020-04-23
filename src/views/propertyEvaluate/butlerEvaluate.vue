<template>
  <!-- 服务评价 -->
  <div class="app-container">

    <!-- 顶部搜索框 -->
    <div class="filter-container">
      <el-input v-model="listQuery_search.bulterName" type="text" placeholder="输入姓名" style="width: 130px" class="filter-item" clearable />
      <el-cascader v-model="listQuery_search.bulterDetails" class="filter-item" :options="bulterOptions" :props="{ checkStrictly: true }" clearable />
      <el-select v-model="listQuery_search.overallRate" placeholder="选择总体评分分数" clearable style="width: 250px" class="filter-item">
        <el-option v-for="item in overallRateOptions" :key="item" :label="item" :value="item" />
      </el-select>
      <el-date-picker
        v-model="listQuery_search.dateRange"
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
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleSearch(listQuery_search.page = 1)">
        搜索
      </el-button>
    </div>

    <!-- 缴款记录表格 -->
    <el-table v-loading="listLoading" highlight-current-row stripe border fit :data="tableData" style="width: 100%" height="800">
      <el-table-column label="ID" prop="id" align="center" width="50" fixed />
      <el-table-column label="管家姓名" prop="bulterName" align="center" fixed />
      <el-table-column label="管家部门" prop="bulterDepartment" align="center" fixed />
      <el-table-column label="管家职位" prop="bulterPosition" align="center" fixed />
      <el-table-column label="管家服务态度" prop="attitudeRate" align="center" fixed />
      <el-table-column label="管家服务质量" prop="qualityRate" align="center" fixed />
      <el-table-column label="管家响应速度" prop="responseRate" align="center" fixed />
      <el-table-column label="总体评分" prop="overallRate" align="center" fixed />
      <el-table-column label="意见建议" prop="suggest" align="center" width="200px" fixed>
        <template slot-scope="scope">
          <el-tag @click="getSuggestAll(scope.row.houseId, scope.row.suggestTime)">{{ scope.row.suggest }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="业主房号" prop="houseId" align="center" fixed>
        <template slot-scope="scope">
          <el-tag @click="getHouseLog(scope.row.houseId)">{{ scope.row.houseId }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="业主姓名" prop="houseName" align="center" fixed />
      <el-table-column label="业主电话" prop="housePhone" align="center" fixed />
      <el-table-column label="评价时间" prop="suggestTime" align="center" />
      <!-- <el-table-column label="距到期天数" prop="shallPayDateLeft" align="center">
        <template slot-scope="scope">
          <el-tag :type="scope.row.shallPayDateLeft <= 0 ? 'danger' : 'success'" disable-transitions>{{ scope.row.shallPayDateLeft }}</el-tag>
        </template>
      </el-table-column> -->
      <!-- <el-table-column label="收费" align="center" width="80" class-name="small-padding fixed-width" fixed="right">
        <template slot-scope="{row}">
          <el-button type="primary" size="mini" @click="handleMoneyGet(row.houseId)">
            收费
          </el-button>
        </template>
      </el-table-column> -->
    </el-table>

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

    <!-- 点击意见建议获取详情模态框 -->
    <el-dialog :visible.sync="dialogSuggestDetail" title="意见详情">
      <span>{{ suggestDetail }}</span>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogSuggestDetail = false">确定</el-button>
      </span>
    </el-dialog>

    <!-- 分页功能实现标签 -->
    <pagination v-show="total>0" :total="total" :page.sync="listQuery_search.page" @pagination="handleSearch" />

  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { bulterRateList, bulterRateSearch, getBulterSuggestDetail } from '@/api/propertyEvaluate'
import waves from '@/directive/waves' // waves directive
import { getLogByHouseId } from '@/api/operationLog'
// import { parseTime } from '@/utils'
import Pagination from '@/components/Pagination' // secondary package based on el-pagination

export default {
  name: 'ServiceEvaluate',
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
        overallRate: null,
        dateRange: null,
        page: null,
        bulterName: null,
        bulterDetails: null
      },
      // list()查询请求变量
      listQuery_all: {
        page: 1
      },
      bulterOptions: [{ value: '客服部', label: '客服部', children: [{ value: '客服主管', label: '客服主管' }, { value: '客服', label: '客服' }, { value: '内勤', label: '内勤' }] },
        { value: '维修部', label: '维修部', children: [{ value: '维修班长', label: '维修班长' }, { value: '维修工', label: '维修工' }] },
        { value: '电梯部', label: '电梯部', children: [{ value: '电梯维保', label: '电梯维保' }] },
        { value: '绿化部', label: '绿化部', children: [{ value: '绿化工', label: '绿化工' }] },
        { value: '保洁部', label: '保洁部', children: [{ value: '保洁员', label: '保洁员' }] },
        { value: '秩序部', label: '秩序部', children: [{ value: '秩序主管', label: '秩序主管' }, { value: '秩序班长', label: '秩序班长' }, { value: '秩序员', label: '秩序员' }] }],
      overallRateOptions: ['5分', '4分', '3分', '2分', '1分'],
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
      listLoading: true,
      // 短信验证码模态框
      dialogSMSVisible: false,
      // 收费页面模态框
      dialogMoneyPost: false,
      dialogHouseLog: false,
      dialogSuggestDetail: false,
      suggestDetail: ''
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
    this.getList()
  },
  methods: {
    // 获取表格数据
    getList() {
      this.listLoading = true
      bulterRateList(this.listQuery_all).then(response => {
        this.tableData = response.data.items
        this.total = response.total
        this.listLoading = false
      })
    },
    // 搜索记录
    handleSearch() {
      this.listLoading = true
      bulterRateSearch(this.listQuery_search).then(response => {
        this.tableData = response.data.items
        this.total = response.total
        this.listLoading = false
      })
    },
    // 点击houseId获取房间变更历史
    getHouseLog(houseId) {
      getLogByHouseId(houseId).then(response => {
        this.pvData_all = response.data.pvData
        this.dialogHouseLog = true
      })
    },
    // 点击意见建议获取详情
    getSuggestAll(houseId, suggestTime) {
      getBulterSuggestDetail(houseId, suggestTime).then(response => {
        this.suggestDetail = response.data.suggestDetail
        this.dialogSuggestDetail = true
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

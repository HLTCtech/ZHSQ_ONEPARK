<template>
  <!-- 住宅物业费收费界面 -->
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="listQuery_search.houseId" type="text" placeholder="输入房间号" style="width: 130px" class="filter-item" clearable />
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
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
        搜索
      </el-button>
    </div>

    <!-- 表格 -->
    <el-table :data="tableData" style="width: 100%">
      <el-table-column label="ID" prop="id" align="center" fixed />
      <el-table-column label="房号" prop="houseId" align="center" fixed/>
      <el-table-column label="业主姓名" prop="houseName" align="center" fixed/>
      <el-table-column label="房屋状况" prop="houseStatus" align="center" />
      <el-table-column label="交款日期" prop="paidDate" align="center" />
      <el-table-column label="面积" align="center">
        <el-table-column label="住宅面积" prop="houseArea" align="center" />
        <el-table-column label="地下室面积" prop="basementArea" align="center" />
      </el-table-column>
      <el-table-column label="收费标准(元/㎡)" prop="chargingStandard" align="center" />
      <el-table-column label="物业费" align="center">
        <el-table-column label="住宅" align="center">
          <el-table-column label="应缴费日期" prop="houseShallPayDate" align="center" />
          <el-table-column label="截止日期" prop="houseDeadline" align="center" />
          <el-table-column label="到期验证" prop="houseClosingVerify" align="center" />
          <el-table-column label="逾期天数" prop="houseOverdueDays" align="center">
            <template slot-scope="scope">
              <el-tag :type="scope.row.houseOverdueDays >= 0 ? 'success' : 'danger'" disable-transitions>{{ scope.row.houseOverdueDays }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column label="月数" prop="houseMonths" align="center" />
          <el-table-column label="应交物业费1" prop="houseShallPayProperty1" align="center" />
          <el-table-column label="实收现金" prop="houseCashGet" align="center" />
          <el-table-column label="物业费代金券" prop="houseVoucherProperty" align="center" />
        </el-table-column>
        <el-table-column label="地下室" align="center">
          <el-table-column label="交费日期" prop="basementShallPayDate" align="center" />
          <el-table-column label="截止日期" prop="basementDeadline" align="center" />
          <el-table-column label="逾期天数" prop="basementOverdueDays" align="center">
            <template slot-scope="scope">
              <el-tag :type="scope.row.basementOverdueDays >= 0 ? 'success' : 'danger'" disable-transitions>{{ scope.row.basementOverdueDays }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column label="应交物业费2" prop="basementShallPayProperty2" align="center" />
          <el-table-column label="实收现金" prop="basementCashGet" align="center" />
          <el-table-column label="代金券" prop="basementVoucherProperty" align="center" />
        </el-table-column>
        <el-table-column label="差额" prop="gap" align="center" />
      </el-table-column>
      <el-table-column label="备注" prop="remark" align="center" />
    </el-table>

    <!-- 分页功能实现标签 -->
    <pagination v-show="total>0" :total="total" :page.sync="listQuery_all.page" @pagination="getList" />
  </div>
</template>

<script>
import { fetchHouseListAll, fetchHouseSearch } from '@/api/payProperty'
import waves from '@/directive/waves' // waves directive
// import { parseTime } from '@/utils'
import Pagination from '@/components/Pagination' // secondary package based on el-pagination

export default {
  name: 'ElectricNotification',
  components: { Pagination },
  directives: { waves },
  data() {
    return {
      listLoading: true,
      total: 0,
      // 定义搜索按钮的query字段
      listQuery_search: {
        page: 1,
        houseId: undefined,
        houseName: undefined,
        datePicker: undefined
      },
      titles: [{ 'ID': 'id' }, { '房号': 'houseId' }, { '业主姓名': 'houseName' }],
      // 年份选择
      yearOptions: ['2020', '2019', '2018', '2017', '2016', '2015'],
      // list接口请求参数
      listQuery_all: {
        page: 1
      },
      // 声明下api变量
      tableData: [],
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
  created() {
    this.getList()
  },
  methods: {
    getList() {
      fetchHouseListAll(this.listQuery_all).then(response => {
        this.tableData = response.data.items
        this.total = response.total
      })
    },
    // 根据选定信息搜索
    fetchListSearch() {
      fetchHouseSearch(this.listQuery_search).then(response => {
        this.tableData = response.data.items
      })
    },
    handleFilter() {
      // 搜索功能调用
      this.fetchListSearch()
    }
  }
}
</script>

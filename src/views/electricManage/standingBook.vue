<template>
  <!-- 电费台账界面 -->
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="listQuery_search.houseId" type="text" placeholder="输入房间号" style="width: 130px" class="filter-item" clearable />
      <el-input v-model="listQuery_search.houseName" type="text" placeholder="输入业主姓名" style="width: 130px" class="filter-item" clearable />
      <el-select v-model="listQuery_search.year" placeholder="选择年份" clearable style="width: 120px" class="filter-item">
        <el-option v-for="item in yearOptions" :key="item" :label="item" :value="item" />
      </el-select>
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
    <el-table highlight-current-row stripe border fit :data="tableColumns" style="width: 100%" align="center" height="800">
      <!-- 左侧固定列 -->
      <el-table-column fixed prop="id" label="ID" width="80" align="center" style="background-color: green" />
      <el-table-column fixed prop="houseId" label="房号" width="80" align="center" />
      <el-table-column fixed prop="houseName" label="业主姓名" width="80" align="center" />
      <!-- 右侧固定列 -->
      <el-table-column fixed="right" prop="shallPayAll" label="应交合计" width="80" align="center" />
      <el-table-column fixed="right" prop="moneyPaidAll" label="已交合计" width="80" align="center" />
      <el-table-column fixed="right" prop="notPayAll" label="未交合计" width="80" align="center" />
      <el-table-column fixed="right" prop="prestore" label="预存电费" width="80" align="center" />
      <!-- 表头及表格内数据 -->
      <el-table-column v-for="(item,key) in titleDataFiltered" :key="key" :prop="item.value" :label="item.name" align="center" height="250px">
        <template slot-scope="scope">
          <span>{{ scope.row[scope.column.property] }}</span>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页功能实现标签 -->
    <pagination v-show="total>0" :total="total" :page.sync="listQuery_all.page" @pagination="getList" />
  </div>
</template>

<script>
import { fetchStandingBookListAll, fetchElectricStandingBookSearch } from '@/api/payElectric'
import waves from '@/directive/waves' // waves directive
// import { parseTime } from '@/utils'
import Pagination from '@/components/Pagination' // secondary package based on el-pagination

export default {
  name: 'ElectricStandingBook',
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
        year: undefined,
        datePicker: undefined
      },
      titles: [{ 'ID': 'id' }, { '房号': 'houseId' }, { '业主姓名': 'houseName' }],
      // 年份选择
      yearOptions: ['2020', '2019', '2018', '2017', '2016', '2015'],
      // list接口请求参数
      listQuery_all: {
        page: 1,
        year: 2020
      },
      // 声明下api变量
      titleData: [],
      tableColumns: [],
      titleDataFiltered: [],
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
      fetchStandingBookListAll(this.listQuery_all).then(response => {
        this.titleData = response.data.titles
        this.tableColumns = response.data.items
        this.total = response.total
        // 获取表头字段数组长度
        var titleLength = this.titleData.length
        // 删除前三个字段
        this.$delete(this.titleData, 0)
        this.$delete(this.titleData, 0)
        this.$delete(this.titleData, 0)
        // 删除最后四个字段
        var titleLengthLast1 = titleLength - 4
        var titleLengthLast2 = titleLength - 5
        var titleLengthLast3 = titleLength - 6
        var titleLengthLast4 = titleLength - 7
        this.$delete(this.titleData, titleLengthLast1)
        this.$delete(this.titleData, titleLengthLast2)
        this.$delete(this.titleData, titleLengthLast3)
        this.$delete(this.titleData, titleLengthLast4)
        // 将处理过的表头数组返回
        this.titleDataFiltered = this.titleData
      })
    },
    // 根据选定信息搜索
    fetchListSearch() {
      fetchElectricStandingBookSearch(this.listQuery_search).then(response => {
        // 将api返回值传递到前端变量
        console.log('listQuery----' + this.listQuery)
        this.titleData = response.data.titles
        this.tableColumns = response.data.items
      })
    },
    handleFilter() {
      // 搜索功能调用
      this.fetchListSearch()
    },
    filterTitleDate(titleData) {
      this.titleDataFiltered = titleData
      console.log('titleData')
      console.log(this.titleDataFiltered)
    }
  }
}
</script>

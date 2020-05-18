<template>
  <!-- 电费通知单界面 -->
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
    <el-table v-loading="listLoading" highlight-current-row stripe border fit :data="tableColumns" style="width: 100%" align="center" height="800">
      <!-- 左侧固定列 -->
      <el-table-column fixed prop="id" label="ID" width="80" align="center" style="background-color: green" />
      <el-table-column label="房号" prop="houseId" align="center" fixed>
        <template slot-scope="scope">
          <el-tag @click="getHouseLog(scope.row.houseId)">{{ scope.row.houseId }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column fixed prop="houseName" label="业主姓名" width="80" align="center" />
      <!-- 表头及表格内数据 -->
      <el-table-column v-for="(item,key) in titleDataFiltered" :key="key" :prop="item.value" :label="item.name" align="center" height="250px">
        <template slot-scope="scope">
          <span>{{ scope.row[scope.column.property] }}</span>
        </template>
      </el-table-column>
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

    <!-- 分页功能实现标签 -->
    <!-- <pagination v-show="total>0" :total="total" :page.sync="listQuery_all.page" @pagination="getList" /> -->
  </div>
</template>

<script>
import { fetchNotificationListAll, fetchElectricNotificationSearch } from '@/api/payElectric'
import waves from '@/directive/waves' // waves directive
import { getLogByHouseId } from '@/api/operationLog'
// import { parseTime } from '@/utils'
// import Pagination from '@/components/Pagination' // secondary package based on el-pagination

export default {
  name: 'ElectricNotification',
  // components: { Pagination },
  directives: { waves },
  data() {
    return {
      listLoading: true,
      total: 0,
      pvData_all: [],
      dialogHouseLog: false,
      // 定义搜索按钮的query字段
      listQuery_search: {
        houseId: null,
        houseName: null,
        datePicker: null
      },
      titles: [{ 'ID': 'id' }, { '房号': 'houseId' }, { '业主姓名': 'houseName' }],
      // 年份选择
      yearOptions: ['2020', '2019', '2018', '2017', '2016', '2015'],
      // list接口请求参数
      listQuery_all: {
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
      this.listLoading = true
      fetchNotificationListAll(this.listQuery_all).then(response => {
        console.log('list-----')
        this.titleData = response.data.titles
        this.tableColumns = response.data.items
        this.total = response.total
        console.log(this.titleData)
        // 删除前三个字段
        this.$delete(this.titleData, 0)
        this.$delete(this.titleData, 0)
        this.$delete(this.titleData, 0)
        // 将处理过的表头数组返回
        this.titleDataFiltered = this.titleData
        this.listLoading = false
      })
    },
    // 根据选定信息搜索
    fetchListSearch() {
      this.listLoading = true
      fetchElectricNotificationSearch(this.listQuery_search).then(response => {
        this.titleData = response.data.titles
        this.tableColumns = response.data.items
        this.total = response.total
        console.log(this.titleData)
        // 删除前三个字段
        this.$delete(this.titleData, 0)
        this.$delete(this.titleData, 0)
        this.$delete(this.titleData, 0)
        // 将处理过的表头数组返回
        this.titleDataFiltered = this.titleData
        this.listLoading = false
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

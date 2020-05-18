<template>
  <!-- 电费台账界面 -->
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

    <!-- excel导出功能 -->
    <div>
      <FilenameOption v-model="filename" />
      <el-button :loading="downloadLoading" style="margin:0 0 20px 20px;" type="primary" icon="el-icon-document" @click="handleDownload">
        导出Excel
      </el-button>
    </div>

    <!-- 测试打印功能 -->
    <!-- <div>
      <el-button :loading="downloadLoading" style="margin:0 0 20px 20px;" type="primary" icon="el-icon-document" @click="handelPrint">
        打印
      </el-button>
    </div> -->

    <!-- 表格 -->
    <div class="printTable">
      <el-table
        v-loading="listLoading"
        highlight-current-row
        stripe
        border
        fit
        :data="tableColumns"
        style="width: 100%"
        align="center"
        height="800"
        :summary-method="getSummaries"
        show-summary
      >
        <!-- 左侧固定列 -->
        <el-table-column fixed prop="id" label="ID" width="80" align="center" style="background-color: green" />
        <el-table-column label="房号" prop="houseId" align="center" fixed>
          <template slot-scope="scope">
            <el-tag @click="getHouseLog(scope.row.houseId)">{{ scope.row.houseId }}</el-tag>
          </template>
        </el-table-column>
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
    </div>

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

    <!-- 表格底部显示各项合计 -->
    <!-- <el-table highlight-current-row stripe border fit :data="tableColumns" style="width: 100%" align="center" height="800">
      <el-table-column fixed label="合计" width="240" align="center" style="background-color: green" />
      <el-table-column v-for="(item,key) in titleDataFiltered" :key="key" :prop="item.value" :label="item.name" align="center" height="250px">
        <template slot-scope="scope">
          <span>{{ scope.row[scope.column.property] }}</span>
        </template>
      </el-table-column>
    </el-table> -->

    <!-- 分页功能实现标签 -->
    <!-- <pagination v-show="total>0" :total="total" :page.sync="listQuery_all.page" @pagination="getList" /> -->
  </div>
</template>

<script>
import { fetchStandingBookListAll, fetchElectricStandingBookSearch } from '@/api/payElectric'
import waves from '@/directive/waves' // waves directive
import { parseTime } from '@/utils'
import { getLogByHouseId } from '@/api/operationLog'
import FilenameOption from '@/views/excel/components/FilenameOption'
// import Pagination from '@/components/Pagination' // secondary package based on el-pagination

export default {
  name: 'ElectricStandingBook',
  components: { FilenameOption },
  directives: { waves },
  data() {
    return {
      downloadLoading: false,
      listLoading: true,
      total: 0,
      // 定义导出excel默认选项
      filename: '',
      autoWidth: true,
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
      // 声明表底合计行的变量
      sumAll: [],
      titleData: [],
      dialogHouseLog: false,
      // 声明下api变量
      pvData_all: [],
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
        this.listLoading = false
      })
    },
    // 根据选定信息搜索
    fetchListSearch() {
      this.listLoading = true
      fetchElectricStandingBookSearch(this.listQuery_search).then(response => {
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
        this.listLoading = false
      })
    },
    handleFilter() {
      // 搜索功能调用
      this.fetchListSearch()
    },
    // excel导出
    handleDownload() {
      this.downloadLoading = true
      import('@/vendor/Export2Excel').then(excel => {
        const headerChinese = []
        const headerVar = []
        for (let i = 0; i < this.titleDataFiltered.length; i++) {
          headerChinese[i] = this.titleDataFiltered[i].name
        }
        for (let i = 0; i < this.titleDataFiltered.length; i++) {
          headerVar[i] = this.titleDataFiltered[i].value
        }
        headerChinese.unshift('序号', '房号', '业主姓名')
        headerChinese.push('应交合计', '已交合计', '未交合计', '预存电费')
        headerVar.unshift('id', 'houseId', 'houseName')
        headerVar.push('shallPayAll', 'moneyPaidAll', 'notPayAll', 'prestore')
        const data = this.formatJson(headerVar, this.tableColumns)
        console.log('123123123')
        console.log(this.sumAll)
        console.log(data.push(this.sumAll))
        excel.export_json_to_excel({
          header: headerChinese,
          data,
          filename: this.filename,
          autoWidth: true,
          bookType: 'xlsx'
        })
        this.downloadLoading = false
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
    // 在表格底部的合计行
    getSummaries(param) {
      const { columns, data } = param
      const sums = []
      columns.forEach((column, index) => {
        if (index === 0 || index === 1 || index === 2) {
          sums[index] = '总价'
          return
        }
        const values = data.map(item => Number(item[column.property]))
        if (!values.every(value => isNaN(value))) {
          sums[index] = values.reduce((prev, curr) => {
            const value = Number(curr)
            if (!isNaN(value)) {
              return prev + curr
            } else {
              return prev
            }
          }, 0)
        } else {
          sums[index] = '暂无数据'
        }
      })
      // console.log(sums)
      this.sumAll = sums
      return sums
    },
    // 测试打印功能
    // handelPrint() {
    //   var newStr = document.getElementsByClassName('printTable')[0].innerHTML
    //   document.body.innerHTML = newStr
    //   // 调用打印功能
    //   window.print()
    //   // 点击取消后刷新页面
    //   window.location.reload()
    // },
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

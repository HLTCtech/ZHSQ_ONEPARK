<template>
  <!-- 住宅收费界面 -->
  <div class="app-container">
    <div class="filter-container">
      <!-- <el-input v-model="listQuery.lou_num" placeholder="楼号" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" /> -->
      <el-select v-model="listQuery_search.lou_num" placeholder="楼号" clearable style="width: 90px" class="filter-item">
        <el-option v-for="item in lou_numOptions" :key="item" :label="item" :value="item" />
      </el-select>
      <el-select v-model="listQuery_search.danyuan_num" placeholder="单元号" clearable style="width: 90px" class="filter-item">
        <el-option v-for="item in danyuan_numOptions" :key="item" :label="item" :value="item" />
      </el-select>
      <el-select v-model="listQuery_search.floor_num" placeholder="楼层号" clearable style="width: 90px" class="filter-item">
        <el-option v-for="item in floor_numOptions" :key="item" :label="item" :value="item" />
      </el-select>
      <el-select v-model="listQuery_search.fangjian_num" placeholder="房间号" clearable style="width: 90px" class="filter-item">
        <el-option v-for="item in fangjian_numOptions" :key="item" :label="item" :value="item" />
      </el-select>
      <!-- 时间选择器 -->
      <el-date-picker
        v-model="listQuery_search.date_picker"
        class="filter-item"
        type="daterange"
        align="right"
        unlink-panels
        range-separator="至"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
        :picker-options="pickerOptions"
      />
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
        搜索
      </el-button>
    </div>

    <!-- 动态加载表头以及内容 -->
    <el-table highlight-current-row stripe border fit :data="tableColumns" style="width: 100%">
      <el-table-column v-for="(item,key) in titleData" :key="key" :prop="item.value" :label="item.name">
        <template slot-scope="scope">
          <!-- <el-tag @click="handleFetchPv($event)">
            {{ scope.row[scope.column.property] }}
          </el-tag> -->
          <!-- <span v-if="scope.row.houseId" class="link-type" @click="handleFetchPv(scope.row.id)">{{ scope.row[scope.column.property] }}</span> -->
          <span v-if="scope.column.property=='houseId'">{{ scope.row[scope.column.property] }}</span>
          <span v-else-if="scope.column.property=='id'">{{ scope.row[scope.column.property] }}</span>
          <span v-else-if="scope.column.property=='houseName'">{{ scope.row[scope.column.property] }}</span>
          <span v-else-if="scope.column.property=='pay_status'" class="link-type" @click="handleFetchPv_all(scope.row.houseId)">{{ scope.row[scope.column.property] }}</span>
          <span v-else class="link-type" @click="handleFetchPv_single(scope.column.property, scope.row.houseId)">{{ scope.row[scope.column.property] }}</span>
        </template>
      </el-table-column>

      <!-- 费用收缴按钮 -->
      <!-- <el-table-column label="费用收缴" align="center" width="230" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" @click="handleMoneyGet(scope.row.houseId)">
            收缴{{ scope.row.id }}
          </el-button>
        </template>
      </el-table-column> -->
    </el-table>

    <!-- 费用收缴按钮的模态框 -->
    <!-- <el-dialog :title="费用收缴" :visible.sync="dialogFormVisible"> -->
      <!-- 先展示当前房间的费用状态统计 -->
      <!-- <el-table :data="pvData_all" border fit highlight-current-row style="width: 100%">
        <el-table-column prop="houseId" label="房间号" />
        <el-table-column prop="shallPay_all" label="应收总计金额" />
        <el-table-column prop="receivePay_all" label="实收总计金额" />
        <el-table-column prop="notPay_all" label="未缴总计金额" />
      </el-table>
      <el-form ref="dataForm" :rules="rules" :model="temp" label-position="left" label-width="70px" style="width: 400px; margin-left:50px;">
        <el-form-item label="Type" prop="type">
          <el-select v-model="temp.type" class="filter-item" placeholder="Please select">
            <el-option v-for="item in calendarTypeOptions" :key="item.key" :label="item.display_name" :value="item.key" />
          </el-select>
        </el-form-item>
        <el-form-item label="Date" prop="timestamp">
          <el-date-picker v-model="temp.timestamp" type="datetime" placeholder="Please pick a date" />
        </el-form-item>
        <el-form-item label="Title" prop="title">
          <el-input v-model="temp.title" />
        </el-form-item>
        <el-form-item label="Status">
          <el-select v-model="temp.status" class="filter-item" placeholder="Please select">
            <el-option v-for="item in statusOptions" :key="item" :label="item" :value="item" />
          </el-select>
        </el-form-item>
        <el-form-item label="Imp">
          <el-rate v-model="temp.importance" :colors="['#99A9BF', '#F7BA2A', '#FF9900']" :max="3" style="margin-top:8px;" />
        </el-form-item>
        <el-form-item label="Remark">
          <el-input v-model="temp.remark" :autosize="{ minRows: 2, maxRows: 4}" type="textarea" placeholder="Please input" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">
          取消
        </el-button>
        <el-button type="primary" @click="dialogStatus==='create'?createData():updateData()">
          确定
        </el-button>
      </div>
    </el-dialog> -->

    <!-- 所有费用状态的弹出模态框 -->
    <el-dialog :visible.sync="dialogPvVisible_all" title="所有的费用详情">
      <el-table :data="pvData_all" border fit highlight-current-row style="width: 100%">
        <el-table-column prop="houseId" label="房间号" />
        <el-table-column prop="moneyLeft" label="预存余额" />
        <el-table-column prop="shallPay_all" label="应收总计金额" />
        <el-table-column prop="receivePay_all" label="实收总计金额" />
        <el-table-column prop="notPay_all" label="未缴总计金额" />
      </el-table>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogPvVisible_all = false">确定</el-button>
      </span>
    </el-dialog>

    <!-- 单一月份具体费用信息的弹出模态框 -->
    <el-dialog :visible.sync="dialogPvVisible_single" title="费用详情">
      <el-table :data="pvData_single" border fit highlight-current-row style="width: 100%">
        <el-table-column prop="houseId" label="房间号" />
        <el-table-column prop="month" label="月份" />
        <el-table-column prop="shallPay" label="应收金额" />
        <el-table-column prop="receivePay" label="实收金额" />
        <el-table-column prop="notPay" label="未缴金额" />
      </el-table>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogPvVisible_single = false">确定</el-button>
      </span>
    </el-dialog>

    <!-- 分页功能实现标签 -->
    <pagination v-show="total>0" :total="total" :page.sync="listQuery_all.page" @pagination="getList" />
  </div>
</template>

<script>
import { housePay_fetchListAll, housePay_fetchSearch, housePay_fetchPreView_single, housePay_fetchPreView_all } from '@/api/house_moneyGet'
import waves from '@/directive/waves' // waves directive
// import { parseTime } from '@/utils'
import Pagination from '@/components/Pagination' // secondary package based on el-pagination

export default {
  name: 'BillPay',
  components: { Pagination },
  directives: { waves },
  filters: {
    statusFilter(status) {
      const statusMap = {
        published: 'success',
        draft: 'info',
        deleted: 'danger'
      }
      return statusMap[status]
    }
  },
  data() {
    return {
      listLoading: true,
      total: 0,
      // 定义搜索按钮的query字段
      listQuery_search: {
        page: 1,
        lou_num: undefined,
        danyuan_num: undefined,
        floor_num: undefined,
        fangjian_num: undefined,
        date_picker: undefined
      },
      listQuery_all: {
        page: 1
      },
      // 定义顶部搜索框的选择字段
      lou_numOptions: ['1号楼', '2号楼', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23', '24', '25', '26', '27', '28', '29', '30', '31'],
      danyuan_numOptions: ['1单元', '2', '3'],
      floor_numOptions: ['1楼', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16', '17', '18'],
      fangjian_numOptions: ['01', '02', '03', '04', '05', '06'],
      // 声明下通过api变量
      titleData: [],
      tableColumns: [],
      // 定义模态框显示与否
      dialogFormVisible: false,
      dialogStatus: '',
      temp: {
        // 费用收缴模态框字段定义
        id: undefined,
        importance: 1,
        remark: '',
        moneyNum_get: '',
        timestamp: new Date(),
        title: '',
        type: '',
        status: 'published'
      },
      pvData_all: [],
      pvData_single: [],
      dialogPvVisible_all: false,
      dialogPvVisible_single: false,
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
      housePay_fetchListAll(this.listQuery_all).then(response => {
        this.titleData = response.data.titles
        this.tableColumns = response.data.items
        this.total = response.total
        console.log(response.total)
      })
    },
    // 根据选定信息搜索
    fetchListSearch() {
      housePay_fetchSearch(this.listQuery_search).then(response => {
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
    // handleUpdate(row) {
    //   // 转预存模态框函数调用
    //   this.temp = Object.assign({}, row) // Object.assign方法将所有可枚举属性的值从一个或多个源对象复制到目标对象，返回目标对象
    //   // this.temp.timestamp = new Date(this.temp.timestamp)
    //   this.dialogStatus = 'update' // dialogStatus具体状态，并根据此变量进行不同内容的显示，暂时现将“转预存”按钮定义为update，其对应的文本在textMap定义
    //   this.dialogFormVisible = true
    //   this.$nextTick(() => {
    //     this.$refs['dataForm'].clearValidate()
    //   })
    // },
    // handleMoneyGet(houseId) {
    //   housePay_fetchPreView_all(houseId).then(response => {
    //     this.pvData_all = response.data.pvData
    //     this.dialogPvVisible_all = true
    //   })
    // //   this.temp = Object.assign({}, row) // Object.assign方法将所有可枚举属性的值从一个或多个源对象复制到目标对象，返回目标对象
    // //   // this.temp.timestamp = new Date(this.temp.timestamp)
    // //   this.dialogStatus = 'money' // dialogStatus具体状态，并根据此变量进行不同内容的显示，暂时现将“转预存”按钮定义为update，其对应的文本在textMap定义
    // //   this.dialogFormVisible = true
    // //   this.$nextTick(() => {
    // //     this.$refs['dataForm'].clearValidate()
    // //   })
    // },
    handleFetchPv_all(hosueId) {
      // 定义具体费用字段的弹出模态框
      console.log(hosueId)
      //   console.log('currentTarget-----' + pv.currentTarget)
      housePay_fetchPreView_all(hosueId).then(response => {
        this.pvData_all = response.data.pvData
        this.dialogPvVisible_all = true
      })
    },
    handleFetchPv_single(pv, hosueId) {
      // 定义具体费用字段的弹出模态框
      console.log(pv, hosueId)
      //   console.log('currentTarget-----' + pv.currentTarget)
      housePay_fetchPreView_single(pv, hosueId).then(response => {
        this.pvData_single = response.data.pvData
        this.dialogPvVisible_single = true
      })
    }
    // sortChange(data) {
    //   const { prop, order } = data
    //   if (prop === 'id') {
    //     this.sortByID(order)
    //   }
    // },
    // sortByID(order) {
    //   if (order === 'ascending') {
    //     this.listQuery.sort = '+id'
    //   } else {
    //     this.listQuery.sort = '-id'
    //   }
    //   this.handleFilter()
    // },
    // resetTemp() {
    //   this.temp = {
    //     id: undefined,
    //     type: ''
    //   }
    // }
    // formatJson(filterVal, jsonData) {
    //   return jsonData.map(v => filterVal.map(j => {
    //     if (j === 'timestamp') {
    //       return parseTime(v[j])
    //     } else {
    //       return v[j]
    //     }
    //   }))
    // }
    // getSortClass: function(key) {
    //   const sort = this.listQuery.sort
    //   return sort === `+${key}`
    //     ? 'ascending'
    //     : sort === `-${key}`
    //       ? 'descending'
    //       : ''
    // }
  }
}
</script>

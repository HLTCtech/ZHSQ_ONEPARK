<template>
  <!-- 住宅收费界面 -->
  <div class="app-container">
    <div class="filter-container">
      <!-- <el-input v-model="listQuery.lou_num" placeholder="楼号" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" /> -->
      <el-select v-model="listQuery.lou_num" placeholder="楼号" clearable style="width: 90px" class="filter-item">
        <el-option v-for="item in lou_numOptions" :key="item" :label="item" :value="item" />
      </el-select>
      <el-select v-model="listQuery.danyuan_num" placeholder="单元号" clearable style="width: 90px" class="filter-item">
        <el-option v-for="item in danyuan_numOptions" :key="item" :label="item" :value="item" />
      </el-select>
      <el-select v-model="listQuery.floor_num" placeholder="楼层号" clearable style="width: 90px" class="filter-item">
        <el-option v-for="item in floor_numOptions" :key="item" :label="item" :value="item" />
      </el-select>
      <el-select v-model="listQuery.fangjian_num" placeholder="房间号" clearable style="width: 90px" class="filter-item">
        <el-option v-for="item in fangjian_numOptions" :key="item" :label="item" :value="item" />
      </el-select>
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
        搜索
      </el-button>
    </div>

    <!-- 动态加载表头以及内容 -->
    <el-table highlight-current-row border fit :data="tableColumns" style="width: 100%">
      <el-table-column v-for="(item,key) in titleData" :key="key" :prop="item.value" :label="item.name">
        <template slot-scope="scope">
          <!-- <el-tag @click="handleFetchPv($event)">
            {{ scope.row[scope.column.property] }}
          </el-tag> -->
          <!-- <span v-if="scope.row.houseId" class="link-type" @click="handleFetchPv(scope.row.id)">{{ scope.row[scope.column.property] }}</span> -->
          <span class="link-type" @click="handleFetchPv($event.currentTarget.innerHTML)">{{ scope.row[scope.column.property] }}</span>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog :visible.sync="dialogPvVisible" title="Reading statistics">
      <el-table :data="pvData" border fit highlight-current-row style="width: 100%">
        <el-table-column prop="key" label="Channel" />
        <el-table-column prop="pv" label="Pv" />
      </el-table>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogPvVisible = false">Confirm</el-button>
      </span>
    </el-dialog>
    <!-- 分页功能实现标签 -->
    <!-- <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" /> -->
  </div>
</template>

<script>
import { fetchList, fetchPreViewMoney } from '@/api/house_moneyGet'
import waves from '@/directive/waves' // waves directive
// import { parseTime } from '@/utils'
// import Pagination from '@/components/Pagination' // secondary package based on el-pagination

export default {
  name: 'BillPay',
  // components: { Pagination },
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
      list: null,
      listLoading: true,
      listQuery: {
        lou_num: undefined,
        danyuan_num: undefined,
        floor_num: undefined,
        fangjian_num: undefined
      },
      // 定义顶部搜索框的选择字段
      lou_numOptions: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23', '24', '25', '26', '27', '28', '29', '30', '31'],
      danyuan_numOptions: ['1', '2', '3'],
      floor_numOptions: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16', '17', '18'],
      fangjian_numOptions: ['01', '02', '03', '04', '05', '06'],
      // 声明下通过api变量
      titleData: undefined,
      tableColumns: undefined,
      // 定义模态框显示与否
      dialogFormVisible: false,
      dialogStatus: '',
      temp: {
        // 模态框字段定义
        id: undefined,
        importance: 1,
        remark: '',
        moneyNum_get: '',
        timestamp: new Date(),
        title: '',
        type: '',
        status: 'published'
      },
      pvData: [],
      dialogPvVisible: false
    }
  },
  created() {
    this.getList()
  },
  methods: {
    // getTitle() {
    //   fetchTitle(this.listQuery).then(response => {
    //     // 将api返回值传递到前端变量
    //   })
    // },
    getList() {
      fetchList(this.listQuery).then(response => {
        // 将api返回值传递到前端变量
        this.titleData = response.data.titles
        this.tableColumns = response.data.items
      })
    },
    handleFilter() {
      // 搜索功能调用
      this.getList()
    },
    handleUpdate(row) {
      // 转预存模态框函数调用
      this.temp = Object.assign({}, row) // Object.assign方法将所有可枚举属性的值从一个或多个源对象复制到目标对象，返回目标对象
      // this.temp.timestamp = new Date(this.temp.timestamp)
      this.dialogStatus = 'update' // dialogStatus具体状态，并根据此变量进行不同内容的显示，暂时现将“转预存”按钮定义为update，其对应的文本在textMap定义
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    handleMoney(row) {
      // 费用收缴模态框函数调用
      this.temp = Object.assign({}, row) // Object.assign方法将所有可枚举属性的值从一个或多个源对象复制到目标对象，返回目标对象
      // this.temp.timestamp = new Date(this.temp.timestamp)
      this.dialogStatus = 'money' // dialogStatus具体状态，并根据此变量进行不同内容的显示，暂时现将“转预存”按钮定义为update，其对应的文本在textMap定义
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    handleFetchPv(pv) {
      // 定义具体费用字段的弹出模态框
      console.log('pv----' + pv)
      console.log('currentTarget-----' + pv.currentTarget)
      fetchPreViewMoney(pv).then(response => {
        this.pvData = response.data.pvData
        this.dialogPvVisible = true
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

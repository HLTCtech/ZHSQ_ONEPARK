<template>
  <!-- 住宅收费界面 -->
  <div class="app-container">
    <div class="filter-container">
      <!-- <el-input v-model="listQuery.lou_num" placeholder="楼号" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" /> -->
      <el-select v-model="listQuery.lou_num" placeholder="楼号" clearable style="width: 90px" class="filter-item">
        <el-option v-for="item in lou_numOptions" :key="item" :label="item" :value="item" />
      </el-select>
      <el-select v-model="listQuery.fangjian_num" placeholder="房间号" clearable style="width: 90px" class="filter-item">
        <el-option v-for="item in fangjian_numOptions" :key="item" :label="item" :value="item" />
      </el-select>
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
        搜索
      </el-button>
    </div>

    <!-- 定义height=1000固定表头，后续根据适配修改 -->
    <el-table
      :data="list"
      border
      height="1000"
      fit
      highlight-current-row
      style="width: 100%;"
    >
      <!-- id列（包含排序功能）根据prop得到id -->
      <el-table-column label="ID" fixed prop="id" align="center" width="80">
        <template slot-scope="{row}">
          <span>{{ row.id }}</span>
        </template>
      </el-table-column>
      <el-table-column label="房号" fixed width="200px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.shopId }}</span>
        </template>
      </el-table-column>
      <el-table-column label="业主姓名" fixed width="200px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.shopOwner }}</span>
        </template>
      </el-table-column>
      <el-table-column label="面积大小" width="200px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.shopArea }}</span>
        </template>
      </el-table-column>

      <el-table-column label="费用状态" width="200px" align="center">
        <template slot-scope="{row}">
          <el-tag :type="row.status | statusFilter" class="link-type" @click="handleFetchPv(row.pageviews)">
            {{ row.shopArea }}
            <!-- 需要显示的具体字段变量写在上方引号中、具体费用状态字段待开发-->
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="电费费" class-name="status-col" width="100">
        <template slot-scope="{row}">
          <el-tag :type="row.status | statusFilter">123
            {{ row.status }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="物业费" class-name="status-col" width="100">
        <template slot-scope="{row}">
          <el-tag :type="row.status | statusFilter" class="link-type" @click="handleFetchPv(row.pageviews)">
            {{ row.status }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="停车管理费" class-name="status-col" width="100">
        <template slot-scope="{row}">
          <el-tag :type="row.status | statusFilter">123
            {{ row.status }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="费用收缴" align="center" width="250" class-name="small-padding fixed-width">
        <template slot-scope="{row}">
          <el-button type="primary" size="mini" @click="handleUpdate(row)">
            转预存
          </el-button>
          <el-button type="success" size="mini" @click="handleMoney(row)">
            收费
          </el-button>
          <!-- <el-button v-if="row.status!='published'" size="mini" type="success" @click="handleModifyStatus(row,'published')">
            收费
          </el-button> -->
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页功能实现标签 -->
    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />

    <!-- 转预存、费用收缴---弹出的模态框定义   -->
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form ref="dataForm" :rules="rules" :model="temp" label-position="left" label-width="80px" style="width: 400px; margin-left:50px;">
        <el-form-item label="收费类型" prop="type">
          <el-select v-model="temp.type" class="filter-item" placeholder="请选择">
            <el-option v-for="item in YuCun_TypeOptions" :key="item.key" :label="item.display_name" :value="item.key" />
          </el-select>
        </el-form-item>
        <el-form-item label="房间号码" prop="title">
          <el-input v-model="temp.houseOwner_houseId" />
        </el-form-item>
        <el-form-item label="收费方式">
          <el-select v-model="temp.status" class="filter-item" placeholder="请选择收费方式">
            <el-option v-for="item in moneyGet_Options" :key="item" :label="item" :value="item" />
          </el-select>
        </el-form-item>
        <el-form-item label="备注">
          <el-input v-model="temp.remark" :autosize="{ minRows: 2, maxRows: 4}" type="textarea" placeholder="请添加备注" />
        </el-form-item>
        <el-form-item label="金额">
          <el-input v-model="temp.moneyNum_get" :autosize="{ minRows: 2, maxRows: 4}" type="textarea" placeholder="请输入具体收费金额" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">
          取消
        </el-button>
        <el-button type="primary" @click="dialogStatus==='create'?createData():updateData()">
          提交
        </el-button>
      </div>
    </el-dialog>

    <el-dialog :visible.sync="dialogPvVisible" title="Reading statistics">
      <el-table :data="pvData" border fit highlight-current-row style="width: 100%">
        <el-table-column prop="key" label="Channel" />
        <el-table-column prop="pv" label="Pv" />
      </el-table>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogPvVisible = false">Confirm</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { fetchShopList, fetchPreViewMoney } from '@/api/shop_moneyGet'
import waves from '@/directive/waves' // waves directive
// import { parseTime } from '@/utils'
import Pagination from '@/components/Pagination' // secondary package based on el-pagination

const YuCun_TypeOptions = [
  { key: 'electric', display_name: '电费' },
  { key: 'water', display_name: '水费' },
  { key: 'property', display_name: '物业费' },
  { key: 'car', display_name: '停车管理费' }
]

// arr to obj, such as { CN : "China", US : "USA" }
// const calendarTypeKeyValue = calendarTypeOptions.reduce((acc, cur) => {
//   acc[cur.key] = cur.display_name
//   return acc
// }, {})
//

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
    // typeFilter(type) {
    //   return calendarTypeKeyValue[type]
    // }
  },
  data() {
    return {
      list: null,
      listLoading: true,
      total: 0,
      listQuery: {
        page: 1,
        limit: 20,
        lou_num: undefined,
        fangjian_num: undefined,
        sort: '+id'
      },
      // 定义顶部搜索框的选择字段
      lou_numOptions: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23', '24', '25', '26', '27', '28', '29', '30', '31'],
      fangjian_numOptions: ['01', '02', '03', '04', '05', '06'],
      moneyGet_Options: ['微信', '支付宝', '现金'],
      // calendarTypeOptions,
      // sortOptions: [{ label: 'ID Ascending', key: '+id' }, { label: 'ID Descending', key: '-id' }],
      // statusOptions: ['published', 'draft', 'deleted'],
      // showReviewer: false,
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
      // 定义模态框显示与否
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: '转预存',
        create: 'Create',
        money: '费用收缴'
      },
      YuCun_TypeOptions,
      // 预存费用选择列表声明
      pvData: [],
      dialogPvVisible: false,
      // 定义模态框需要选择填写的必要字段
      rules: {
        type: [{ required: true, message: 'type is required', trigger: 'change' }],
        timestamp: [{ type: 'date', required: true, message: 'timestamp is required', trigger: 'change' }],
        title: [{ required: true, message: 'title is required', trigger: 'blur' }]
      }
    }
  },
  created() {
    this.getList()
    // console.log('11111111111111111111111111111111111')
  },
  methods: {
    getList() {
      // debugger
      // console.log('2222222222222222222222222222')
      this.listLoading = true
      fetchShopList(this.listQuery).then(response => {
        // debugger
        // console.log('33333333333333333333333333333333')
        this.list = response.data.items
        this.total = response.data.total
      })
    },
    handleFilter() {
      // 搜索功能调用
      this.listQuery.page = 1
      // console.log(this.listQuery)
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
      fetchPreViewMoney(pv).then(response => {
        this.pvData = response.data.pvData
        this.dialogPvVisible = true
      })
    },
    sortChange(data) {
      const { prop, order } = data
      if (prop === 'id') {
        this.sortByID(order)
      }
    },
    sortByID(order) {
      // 排序实现
      if (order === 'ascending') {
        this.listQuery.sort = '+id'
      } else {
        this.listQuery.sort = '-id'
      }
      this.handleFilter()
    },
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
    getSortClass: function(key) {
      const sort = this.listQuery.sort
      return sort === `+${key}`
        ? 'ascending'
        : sort === `-${key}`
          ? 'descending'
          : ''
    }
  }
}
</script>

<template>
  <!-- 住宅收费界面 -->
  <div class="app-container">
    <div class="filter-container">
      <!-- <el-input v-model="listQuery.lou_num" placeholder="楼号" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" /> -->
      <el-select v-model="listQuery_search.buildingNum" placeholder="选择楼号" clearable style="width: 120px" class="filter-item">
        <el-option v-for="item in lou_numOptions" :key="item" :label="item" :value="item" />
      </el-select>
      <el-select v-model="listQuery_search.unitNum" placeholder="选择单元号" clearable style="width: 120px" class="filter-item">
        <el-option v-for="item in danyuan_numOptions" :key="item" :label="item" :value="item" />
      </el-select>
      <el-select v-model="listQuery_search.floorNum" placeholder="选择楼层号" clearable style="width: 120px" class="filter-item">
        <el-option v-for="item in floor_numOptions" :key="item" :label="item" :value="item" />
      </el-select>
      <el-select v-model="listQuery_search.houseNum" placeholder="选择房号" clearable style="width: 120px" class="filter-item">
        <el-option v-for="item in fangjian_numOptions" :key="item" :label="item" :value="item" />
      </el-select>
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

    <!-- 动态加载表头以及内容 -->
    <el-table highlight-current-row stripe border fit :data="tableColumns" style="width: 100%" align="center" height="800">
      <el-table-column v-for="(item,key) in titleData" :key="key" :prop="item.value" :label="item.name" align="center">
        <template slot-scope="scope">
          <span v-if="scope.column.property=='houseId'" align="center">{{ scope.row[scope.column.property] }}</span>
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

    <!-- 费用收缴按钮的模态框 -->
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
        <el-form ref="dataForm" :rules="formRules" :model="formPost" label-width="80px">
          <el-form-item label="房间号" prop="houseId">
            <el-input v-model="formPost.houseId" disabled />
          </el-form-item>
          <el-form-item label="缴费周期" required>
            <!-- <el-col :span="11">
              <el-form-item prop="date1">
                <el-date-picker v-model="formPost.date1" type="date" placeholder="请选择日期" style="width: 100%;" />
              </el-form-item>
            </el-col>
            <el-col class="line" :span="2">---</el-col>
            <el-col :span="11">
              <el-form-item prop="date2">
                <el-date-picker v-model="formPost.date2" type="date" placeholder="请选择日期" style="width: 100%;" />
              </el-form-item>
            </el-col> -->
            <el-form-item prop="dateRange">
              <el-date-picker
                v-model="formPost.dateRange"
                class="filter-item"
                type="daterange"
                align="left"
                unlink-panels
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                value-format="yyyy-MM-dd"
                validate-event
                required
              />
            </el-form-item>
          </el-form-item>
          <el-form-item label="缴费金额" prop="moneyNum" autocomplete="off">
            <el-input v-model.number="formPost.moneyNum" width="100px" />
          </el-form-item>
          <el-form-item label="缴款方式" prop="payType" required>
            <el-radio-group v-model="formPost.payType">
              <el-radio label="支付宝" />
              <el-radio label="微信" />
              <el-radio label="现金" />
            </el-radio-group>
          </el-form-item>
          <el-form-item label="备注" prop="remark">
            <el-input v-model="formPost.remark" type="textarea" placeholder="如有需要请输入不多于30字的备注" />
          </el-form-item>
          <!-- <div slot="footer" class="dialog-footer">
          <el-button @click="dialogMoneyGetFormVisible = false">
            Cancel
          </el-button>
          <el-button type="primary" @click="handlePostMoneyGet(row)">
            Confirm
          </el-button>
        </div> -->
          <el-form-item>
            <el-button type="success" @click="handleSubmitForm(formPost)">提交</el-button>
            <el-button @click="handleCleanDataForm()">取消</el-button>
          </el-form-item>
        </el-form>
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
    <pagination v-show="total>0" :total="total" :page.sync="listQuery_all.page" @pagination="getList" />
  </div>
</template>

<script>
import { fetchHouseListAll, fetchHouseSearch, fetchPreViewSingle, fetchPreViewAll, fetchAllDetailByMonth, postMoney, fetchSearchByHouseId } from '@/api/payElectric'
import waves from '@/directive/waves' // waves directive
// import { parseTime } from '@/utils'
import Pagination from '@/components/Pagination' // secondary package based on el-pagination

export default {
  name: 'ElectricHousePay',
  components: { Pagination },
  directives: { waves },
  data() {
    return {
      listLoading: true,
      total: 0,
      // 定义搜索按钮的query字段
      listQuery_search: {
        page: 1,
        buildingNum: undefined,
        unitNum: undefined,
        floorNum: undefined,
        houseNum: undefined,
        datePicker: undefined,
        houseId: undefined,
        houseName: undefined
      },
      // 定义表单提交项具体项目
      formPost: {
        houseId: undefined,
        dateRange: '',
        moneyNum: '',
        payType: '',
        remark: ''
      },
      // 定义表单提交项目规则
      formRules: {
        // date1: [{ required: true, message: '请选择时间周期起始日期', type: 'date', trigger: 'change' }],
        // date2: [{ required: true, message: '请选择时间周期终点日期', type: 'date', trigger: 'change' }],
        dateRange: [{ required: true, message: '请选择时间周期' }],
        moneyNum: [{ required: true, message: '请输入收缴金额（纯数字）', type: 'number', trigger: 'blur' }],
        payType: [{ required: true, message: '请选择费用收缴方式', trigger: 'blur' }]
      },
      // list接口请求参数
      listQuery_all: {
        page: 1
      },
      // 定义顶部搜索框的选择字段
      lou_numOptions: ['1号楼', '2号楼', '3号楼', '4号楼', '5号楼', '6号楼', '7号楼', '8号楼', '9号楼', '10号楼', '11号楼', '12号楼', '13号楼', '14号楼', '15号楼', '16号楼', '17号楼', '18号楼', '19号楼', '20号楼', '21号楼', '22号楼', '23号楼', '24号楼', '25号楼', '26号楼', '27号楼', '28号楼', '29号楼', '30号楼', '31号楼'],
      danyuan_numOptions: ['1单元', '2单元', '3单元'],
      floor_numOptions: ['1楼', '2楼', '3楼', '4楼', '5楼', '6楼', '7楼', '8楼', '9楼', '10楼', '11楼', '12楼', '13楼', '14楼', '15楼', '16楼', '17楼', '18楼'],
      fangjian_numOptions: ['01', '02', '03', '04', '05', '06'],
      // 声明下api变量
      titleData: [],
      tableColumns: [],
      // 定义模态框显示与否
      dialogMoneyGetFormVisible: false,
      dialogFormVisible: false,
      dialogPvVisibleDetailByMonth: false,
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
      pvData_details: [],
      dialogPvVisible_all: false,
      dialogPvVisible_single: false,
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
  created() {
    this.getList()
  },
  methods: {
    getList() {
      fetchHouseListAll(this.listQuery_all).then(response => {
        this.titleData = response.data.titles
        this.tableColumns = response.data.items
        this.total = response.total
      })
    },
    // 根据选定信息搜索
    fetchListSearch() {
      fetchHouseSearch(this.listQuery_search).then(response => {
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
    // 收费按钮绑定的处理事件
    handleMoneyGet(houseId) {
      this.formPost.houseId = houseId
      console.log(this.formPost.houseId)
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
    // 定义在费用收缴模态框点击确定按钮的事件
    // handlePostMoneyGet(row) {
    //   console.log(this.multipleSelection)
    //   this.dialogMoneyGetFormVisible = false
    //   this.$notify({
    //     title: 'Success',
    //     message: '提交成功',
    //     type: 'success',
    //     duration: 2000
    //   })
    // },
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
    handleSubmitForm(formPost) {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          console.log('formPost-----')
          console.log(formPost)
          postMoney(formPost).then(response => {
            if (response.codeStatus === 200) {
              this.$notify({
                title: 'Success',
                message: '提交成功',
                type: 'success',
                duration: 2000
              })
              this.dialogMoneyGetFormVisible = false
              this.$nextTick(() => {
                this.$refs['dataForm'].resetFields()
              })
              // 逻辑可能存在问题，比如id如何传到页面上
              // 暂未测试
              // 提交表单成功后跳转到指定houseid的搜索页面，返回提交房间表单的所有状态信息
              fetchSearchByHouseId(formPost.houseId).then(response => {
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
        //   this.dialogMoneyGetFormVisible = false
        //   this.$nextTick(() => {
        //     this.$refs['dataForm'].resetFields()
        //   })
        }
      })
    },
    handleCleanDataForm() {
      this.$nextTick(() => {
        this.$refs['dataForm'].resetFields()
      })
      this.dialogMoneyGetFormVisible = false
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

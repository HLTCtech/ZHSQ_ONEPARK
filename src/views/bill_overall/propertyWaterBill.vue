<template>
  <!-- 住宅物业费收费界面 -->
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
    <el-table :data="tableData" style="width: 100%" height="900">
      <el-table-column label="ID" prop="id" align="center" width="50" fixed />
      <el-table-column label="交款日期" prop="paidDate" align="center" fixed />
      <el-table-column label="房号" prop="houseId" align="center" fixed />
      <el-table-column label="业主姓名" prop="houseName" align="center" fixed />
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
          <el-table-column label="已交物业费" prop="houseCashGet" align="center" />
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
          <el-table-column label="地下室物业费" prop="basementCashGet" align="center" />
          <el-table-column label="代金券" prop="basementVoucherProperty" align="center" />
        </el-table-column>
        <el-table-column label="差额" prop="gap" align="center" />
      </el-table-column>
      <el-table-column label="装修保证金" prop="decorationDeposit" align="center" />
      <el-table-column label="已退装修保证金" prop="returnDecorationDeposit" align="center" />
      <el-table-column label="出入证工本费" prop="passCardCost" align="center" />
      <el-table-column label="出入证押金" prop="passCardDeposit" align="center" />
      <el-table-column label="停车场维护费" align="center">
        <el-table-column label="交费周期" prop="parkingCostPayCycle" align="center" />
        <el-table-column label="金额" prop="parkingCostMoney" align="center" />
      </el-table-column>
      <el-table-column label="暖气费" align="center">
        <el-table-column label="暖气费" prop="heatCostMoney" align="center" />
        <el-table-column label="暖气费代金券" prop="heatCostVoucher" align="center" />
      </el-table-column>
      <el-table-column label="水费" prop="waterCost" align="center" />
      <el-table-column label="电费" align="center">
        <el-table-column label="交费周期" prop="electricCostPayCycle" align="center" />
        <el-table-column label="金额" prop="electricCostMoney" align="center" />
      </el-table-column>
      <el-table-column label="有线电视费" prop="tvCost" align="center" />
      <el-table-column label="智能卡工本费" prop="smartCardCost" align="center" />
      <el-table-column label="垃圾清运费" prop="trashCost" align="center" />
      <el-table-column label="蓝牙卡工本费" prop="bluetoothCost" align="center" />
      <el-table-column label="蓝牙卡电池" prop="bluetoothBatteryCost" align="center" />
      <el-table-column label="对外保洁" prop="externalCleaningCost" align="center" />
      <el-table-column label="电动车充电" prop="ebikeChargeCost" align="center" />
      <el-table-column label="温泉水卡补卡" prop="hotSpringCardCost" align="center" />
      <el-table-column label="车位锁工本费" prop="parkingLockCost" align="center" />
      <el-table-column label="室内开荒" prop="indoorWastelandCost" align="center" />
      <el-table-column label="冲减预存电费" prop="blankingElectricPrestore" align="center" />
      <el-table-column label="预存电费" prop="electricPrestore" align="center" />
      <el-table-column label="营业外收入" prop="nonOperatingIncome" align="center" />
      <el-table-column label="备注" prop="remark" align="center" />
    </el-table>

    <!-- 分页功能实现标签 -->
    <pagination v-show="total>0" :total="total" :page.sync="listQuery_all.page" @pagination="getList" />
  </div>
</template>

<script>
import { fetchPropertyWaterBillListAll, fetchPropertyWaterBillSearch } from '@/api/billOverall'
import waves from '@/directive/waves' // waves directive
// import { parseTime } from '@/utils'
import Pagination from '@/components/Pagination' // secondary package based on el-pagination

export default {
  name: 'HouseStandingBook',
  components: { Pagination },
  directives: { waves },
  data() {
    return {
      listLoading: true,
      total: 0,
      // 定义搜索按钮的query字段
      listQuery_search: {
        page: 1,
        houseId: null,
        year: null,
        houseName: null,
        datePicker: null
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
      fetchPropertyWaterBillListAll(this.listQuery_all).then(response => {
        this.tableData = response.data.items
        this.total = response.total
      })
    },
    // 根据选定信息搜索
    fetchListSearch() {
      fetchPropertyWaterBillSearch(this.listQuery_search).then(response => {
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

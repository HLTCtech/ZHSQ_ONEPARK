<template>
  <!-- 住宅停车场维护费收费界面 -->
  <div class="app-container">
    <div class="filter-container">
      <el-input
        v-model="listQuery_search.houseId"
        type="text"
        placeholder="输入房号"
        style="width: 130px"
        class="filter-item"
        clearable
      />
      <el-input
        v-model="listQuery_search.houseName"
        type="text"
        placeholder="输入业主姓名"
        style="width: 130px"
        class="filter-item"
        clearable
      />
      <el-input
        v-model="listQuery_search.carNum"
        type="text"
        placeholder="输入车牌号"
        style="width: 130px"
        class="filter-item"
        clearable
      />
      <el-input
        v-model="listQuery_search.carLoc"
        type="text"
        placeholder="输入车位"
        style="width: 130px"
        class="filter-item"
        clearable
      />
      <el-button
        v-waves
        class="filter-item"
        type="primary"
        icon="el-icon-search"
        @click="handleFilter"
      >搜索</el-button>
    </div>

    <!-- 新增车位信息 -->
    <el-button
      v-waves
      class="filter-item"
      type="primary"
      icon="el-icon-search"
      @click="handleNewParking()"
    >新增车位信息</el-button>
    <br />
    <br />

    <!-- 表格 -->
    <el-table
      :data="tableData"
      style="width: 100%"
      height="1000"
      border
      stripe
      highlight-current-row
    >
      <el-table-column label="ID" prop="id" align="center" />
      <el-table-column label="房号" prop="houseId" align="center" />
      <el-table-column label="业主姓名" prop="houseName" align="center" />
      <el-table-column label="联系电话" prop="housePhone" align="center" />
      <el-table-column label="车牌号" prop="carNum" align="center" />
      <el-table-column label="车辆品牌" prop="carBrand" align="center" />
      <el-table-column label="颜色" prop="carColor" align="center" />
      <el-table-column label="指定位置" prop="carLoc" align="center" />
      <el-table-column label="有效期" prop="carValidRange" align="center" />
      <el-table-column label="备注" prop="remark" align="center" />

      <el-table-column
        label="变更信息"
        align="center"
        width="80"
        class-name="small-padding fixed-width"
        fixed="right"
      >
        <template slot-scope="{row}">
          <el-button type="primary" size="mini" @click="handleCarInfoChange(row)">变更</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 信息变更按钮：定义表单提交项 -->
    <el-dialog :visible.sync="dialogParkingInfoChangeFormVisible" title="信息变更/续费">
      <el-card class="box-card">
        <el-form ref="infoChangeData" :model="infoChangeFormPost" label-width="80px">
          <el-form-item label="房号" prop="houseId">
            <el-input v-model="infoChangeFormPost.houseId" />
          </el-form-item>
          <el-form-item label="业主姓名" prop="houseName">
            <el-input v-model="infoChangeFormPost.houseName" />
          </el-form-item>
          <el-form-item label="车牌号" prop="carNum">
            <el-input v-model="infoChangeFormPost.carNum" />
          </el-form-item>
          <el-form-item label="指定位置" prop="carLoc">
            <el-input v-model="infoChangeFormPost.carLoc" disabled />
          </el-form-item>
          <el-form-item label="缴费周期">
            <el-form-item prop="dateRange">
              <el-date-picker
                v-model="infoChangeFormPost.dateRange"
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
            <el-input v-model.number="infoChangeFormPost.moneyNum" width="100px" />
          </el-form-item>
          <el-form-item label="缴款方式" prop="payType">
            <el-radio-group v-model="infoChangeFormPost.payType">
              <el-radio label="支付宝" />
              <el-radio label="微信" />
              <el-radio label="现金" />
              <el-radio label="其他" />
              <el-radio label="特批" />
            </el-radio-group>
          </el-form-item>
          <el-form-item label="备注" prop="remark">
            <el-input
              v-model="infoChangeFormPost.remark"
              type="textarea"
              placeholder="如有需要请输入不多于30字的备注"
            />
          </el-form-item>
          <el-form-item>
            <el-button type="success" @click="handleSubmitInfoChangeForm(infoChangeFormPost)">提交</el-button>
            <el-button @click="handleCleanInfoChangeDataForm()">取消</el-button>
          </el-form-item>
        </el-form>
      </el-card>
    </el-dialog>

    <!-- 变更信息---收费类型为特批时验证码模态框处理 -->
    <el-dialog
      width="40%"
      title="领导审批"
      style="top: 20%"
      :visible.sync="changeInfoDialogApproveSmsVisible"
      append-to-body
    >
      <el-input
        ref="changeInfoSmsCode"
        v-model="infoChangeFormPost.smsCode"
        placeholder="请输入短信验证码"
        name="changeInfoSmsCode"
        type="text"
        tabindex="1"
        autocomplete="on"
      />
      <el-button
        class="show-sms"
        type="primary"
        :disabled="disabled=!show"
        style="width:175px;"
        @click="getChangeInfoSmsCode(infoChangeFormPost)"
      >
        <span v-show="show">获取验证码</span>
        <span v-show="!show" class="count">{{ count }} s</span>
      </el-button>
      <br />
      <br />
      <el-button type="success" @click="handleChangeInfoPost(infoChangeFormPost)">确定提交</el-button>
      <el-button @click="handleChangeInfoCleanSMSDataForm()">取消</el-button>
    </el-dialog>

    <!-- 新增信息按钮的模态框(包含收费功能) -->
    <el-dialog :visible.sync="dialogNewCarInfoVisible" title="新增车辆信息">
      <!-- 定义表单提交项 -->
      <el-card class="box-card">
        <el-form
          ref="newInfoForm"
          :rules="newCarInfoFormRules"
          :model="newInfoFormPost"
          label-width="80px"
        >
          <el-form-item label="房号" prop="houseId" required>
            <el-input v-model="newInfoFormPost.houseId" placeholder="请输入房号（只允许输入一个）" />
          </el-form-item>
          <el-form-item label="业主姓名" prop="houseName" required>
            <el-input v-model="newInfoFormPost.houseName" />
          </el-form-item>
          <el-form-item label="业主电话" prop="housePhone" required>
            <el-input v-model="newInfoFormPost.housePhone" />
          </el-form-item>
          <el-form-item label="车牌号" prop="carNum" required>
            <el-input v-model="newInfoFormPost.carNum" />
          </el-form-item>
          <el-form-item label="车辆品牌" prop="carBrand" required>
            <el-input v-model="newInfoFormPost.carBrand" />
          </el-form-item>
          <el-form-item label="颜色" prop="carColor" required>
            <el-input v-model="newInfoFormPost.carColor" />
          </el-form-item>
          <el-form-item label="指定位置" prop="carLoc" required>
            <el-input v-model="newInfoFormPost.carLoc" />
          </el-form-item>
          <el-form-item label="有效期" required>
            <el-form-item prop="dateRange">
              <el-date-picker
                v-model="newInfoFormPost.dateRange"
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
            <el-input v-model.number="newInfoFormPost.moneyNum" width="100px" />
          </el-form-item>
          <el-form-item label="缴款方式" prop="payType" required>
            <el-radio-group v-model="newInfoFormPost.payType">
              <el-radio label="支付宝" />
              <el-radio label="微信" />
              <el-radio label="现金" />
              <el-radio label="其他" />
              <el-radio label="特批" />
            </el-radio-group>
          </el-form-item>
          <el-form-item label="备注" prop="remark">
            <el-input
              v-model="newInfoFormPost.remark"
              type="textarea"
              placeholder="如有需要请输入不多于30字的备注"
            />
          </el-form-item>
          <el-form-item>
            <el-button type="success" @click="handleSubmitNewInfoForm(newInfoFormPost)">确认提交</el-button>
            <el-button @click="handleCleanNewInfoDataForm()">取消</el-button>
          </el-form-item>
        </el-form>
      </el-card>
    </el-dialog>

    <!-- 新增信息---收费类型为特批时验证码模态框处理 -->
    <el-dialog
      width="40%"
      title="领导审批"
      style="top: 20%"
      :visible.sync="newInfoDialogApproveSmsVisible"
      append-to-body
    >
      <el-input
        ref="newInfoSmsCode"
        v-model="newInfoFormPost.smsCode"
        placeholder="请输入短信验证码"
        name="newInfoSmsCode"
        type="text"
        tabindex="1"
        autocomplete="on"
      />
      <el-button
        class="show-sms"
        type="primary"
        :disabled="disabled=!show"
        style="width:175px;"
        @click="getNewInfoSmsCode(newInfoFormPost)"
      >
        <span v-show="show">获取验证码</span>
        <span v-show="!show" class="count">{{ count }} s</span>
      </el-button>
      <br />
      <br />
      <el-button type="success" @click="handleNewInfoPost(newInfoFormPost)">确定提交</el-button>
      <el-button @click="handleNewInfoCleanSMSDataForm()">取消</el-button>
    </el-dialog>

    <!-- 分页功能实现标签 -->
    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="listQuery_all.page"
      @pagination="getList"
    />
  </div>
</template>

<script>
import { fetchListAll, fetchSearch, fetchSearchByCarLoc, postNewCarInfo, postChangeInfo, getNewParkingSMS, getChangeParkingSMS } from '@/api/payParking'
import waves from '@/directive/waves' // waves directive
// import { parseTime } from '@/utils'
import Pagination from '@/components/Pagination' // secondary package based on el-pagination

export default {
  name: 'PayParking',
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
        houseName: null,
        carNum: null,
        carLoc: null
      },
      // 定义验证码界面计时器
      show: true,
      count: '',
      // list接口请求参数
      listQuery_all: {
        page: 1
      },
      // 定义提交新增车位信息字段
      newInfoFormPost: {
        houseId: null,
        houseName: null,
        housePhone: null,
        carNum: null,
        carBrand: null,
        carColor: null,
        carLoc: null,
        dateRange: null,
        remark: null,
        payType: null,
        moneyNum: null,
        smsCode: null,
        adminId: this.$store.getters.adminId
      },
      // 定义车位信息变更时的字段
      infoChangeFormPost: {
        houseId: null,
        houseName: null,
        housePhone: null,
        carNum: null,
        carBrand: null,
        carColor: null,
        carLoc: null,
        dateRange: null,
        remark: null,
        payType: null,
        moneyNum: null,
        smsCode: null,
        adminId: this.$store.getters.adminId
      },
      // 先注释掉信息变更模态框的校验规则
      // 定义费用收缴表单提交项目规则
      //   infoChangeFormRules: {
      //     dateRange: [{ required: true, message: '请选择时间周期' }],
      //     moneyNum: [{ required: true, message: '请输入收缴金额（纯数字）', type: 'number', trigger: 'blur' }],
      //     payType: [{ required: true, message: '请选择费用收缴方式', trigger: 'blur' }]
      //   },
      // 定义新增车位信息表单提交项目规则
      newCarInfoFormRules: {
        houseId: [{ required: true, message: '请输入房号' }],
        houseName: [{ required: true, message: '请输入业主姓名' }],
        housePhone: [{ required: true, message: '请输入业主电话' }],
        carNum: [{ required: true, message: '请输入车牌号' }],
        carBrand: [{ required: true, message: '请输入车辆品牌' }],
        carColor: [{ required: true, message: '请输入车辆颜色' }],
        carLoc: [{ required: true, message: '请输入指定位置' }],
        dateRange: [{ required: true, message: '请选择时间周期' }],
        moneyNum: [{ required: true, message: '请输入缴费金额' }],
        payType: [{ required: true, message: '请选择缴费方式' }]
      },
      // 声明下api变量
      tableData: [],
      dialogParkingMoneyGetFormVisible: false,
      dialogNewCarInfoVisible: false,
      dialogParkingInfoChangeFormVisible: false,
      newInfoDialogApproveSmsVisible: false,
      changeInfoDialogApproveSmsVisible: false,
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
      fetchListAll(this.listQuery_all).then(response => {
        this.tableData = response.data.items
        this.total = response.total
      })
    },
    // 根据选定信息搜索
    fetchListSearch() {
      fetchSearch(this.listQuery_search).then(response => {
        this.tableData = response.data.items
      })
    },
    handleFilter() {
      // 搜索功能调用
      this.fetchListSearch()
    },
    // 费用收缴按钮绑定的处理事件
    handleCarInfoChange(row) {
      this.infoChangeFormPost.carLoc = row.carLoc
      this.dialogParkingInfoChangeFormVisible = true
    },
    // 新增信息---获取验证码按钮
    getNewInfoSmsCode(formPost) {
      getNewParkingSMS(formPost).then(response => {
        if (response.codeStatus === 200) {
          this.$message({ message: '验证码会发送到您的手机上，请注意查收', type: 'success' })
        } else {
          this.$message({ message: '提交失败，请联系系统管理员', type: 'error' })
        }
      })
      // 更改获取验证码按钮倒计时
      const TIME_COUNT = 30 // 更改倒计时时间
      if (!this.timer) {
        this.count = TIME_COUNT
        this.show = false
        this.timer = setInterval(() => {
          if (this.count > 0 && this.count <= TIME_COUNT) {
            this.count--
          } else {
            this.show = true
            clearInterval(this.timer) // 清除定时器
            this.timer = null
          }
        }, 1000)
      }
    },
    // 变更信息---获取验证码按钮
    getChangeInfoSmsCode(formPost) {
      getChangeParkingSMS(formPost).then(response => {
        if (response.codeStatus === 200) {
          this.$message({ message: '验证码会发送到您的手机上，请注意查收', type: 'success' })
        } else {
          this.$message({ message: '提交失败，请联系系统管理员', type: 'error' })
        }
      })
      // 更改获取验证码按钮倒计时
      const TIME_COUNT = 30 // 更改倒计时时间
      if (!this.timer) {
        this.count = TIME_COUNT
        this.show = false
        this.timer = setInterval(() => {
          if (this.count > 0 && this.count <= TIME_COUNT) {
            this.count--
          } else {
            this.show = true
            clearInterval(this.timer) // 清除定时器
            this.timer = null
          }
        }, 1000)
      }
    },
    // 信息变更---提交收费表单
    handleSubmitInfoChangeForm(infoChangeFormPost) {
      // 收费类型为特批时验证码模态框处理
      if (this.infoChangeFormPost.payType === '特批') {
        this.changeInfoDialogApproveSmsVisible = true
      } else {
        // 操作确认框
        this.$confirm('确定提交么？', '费用收缴', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'info'
        }).then(() => {
          postChangeInfo(infoChangeFormPost).then(response => {
            if (response.codeStatus === 200) {
              this.$notify({
                title: 'Success',
                message: '提交成功',
                type: 'success',
                duration: 2000
              })
              this.dialogParkingInfoChangeFormVisible = false
              this.$nextTick(() => {
                this.$refs['infoChangeData'].resetFields()
              })
              fetchSearchByCarLoc(infoChangeFormPost.carLoc).then(response => {
                this.tableData = response.data.items
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
        })
      }
    },
    // 变更车位---缴款类型是特批时，验证码点击提交的收费表单
    handleChangeInfoPost(infoChangeFormPost) {
      if (infoChangeFormPost.smsCode === null || infoChangeFormPost.smsCode.length < 6) {
        this.$message({ message: '请输入正确的验证码', type: 'error' })
      } else {
        postChangeInfo(infoChangeFormPost).then(response => {
          if (response.codeStatus === 200) {
            this.$notify({
              title: 'Success',
              message: '提交成功',
              type: 'success',
              duration: 2000
            })
            this.dialogParkingInfoChangeFormVisible = false
            this.changeInfoDialogApproveSmsVisible = false
            this.$nextTick(() => {
              this.$refs['infoChangeData'].resetFields()
            })
            this.infoChangeFormPost.smsCode = ''
            // 逻辑可能存在问题，比如id如何传到页面上
            // 暂未测试
            // 提交表单成功后跳转到指定houseid的搜索页面，返回提交房间表单的所有状态信息
            fetchSearchByCarLoc(infoChangeFormPost.carLoc).then(response => {
              this.tableData = response.data.items
              this.total = response.total
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
      }
    },
    // 新增信息---提交新增车辆信息表单
    handleSubmitNewInfoForm(newInfoFormPost) {
      this.$refs['newInfoForm'].validate((valid) => {
        if (valid) {
          // 收费类型为特批时验证码模态框处理
          if (this.newInfoFormPost.payType === '特批') {
            this.newInfoDialogApproveSmsVisible = true
          } else {
            this.$confirm('确定提交么？', '新增信息', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'info'
            }).then(() => {
              postNewCarInfo(newInfoFormPost).then(response => {
                if (response.codeStatus === 200) {
                  this.$notify({
                    title: 'Success',
                    message: '提交成功',
                    type: 'success',
                    duration: 2000
                  })
                  this.dialogNewCarInfoVisible = false
                  this.$nextTick(() => {
                    this.$refs['newInfoForm'].resetFields()
                  })
                  fetchSearchByCarLoc(newInfoFormPost.carLoc).then(response => {
                    this.tableData = response.data.items
                    this.total = response.total
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
            })
          }
        }
      })
    },
    // 新增车位---缴款类型是特批时，验证码点击提交的收费表单
    handleNewInfoPost(newInfoFormPost) {
      if (newInfoFormPost.smsCode === null || newInfoFormPost.smsCode.length < 6) {
        this.$message({ message: '请输入正确的验证码', type: 'error' })
      } else {
        postNewCarInfo(newInfoFormPost).then(response => {
          if (response.codeStatus === 200) {
            this.$notify({
              title: 'Success',
              message: '提交成功',
              type: 'success',
              duration: 2000
            })
            this.dialogNewCarInfoVisible = false
            this.newInfoDialogApproveSmsVisible = false
            this.$nextTick(() => {
              this.$refs['newInfoForm'].resetFields()
            })
            this.newInfoFormPost.smsCode = ''
            // 逻辑可能存在问题，比如id如何传到页面上
            // 暂未测试
            // 提交表单成功后跳转到指定houseid的搜索页面，返回提交房间表单的所有状态信息
            fetchSearchByCarLoc(newInfoFormPost.carLoc).then(response => {
              this.tableData = response.data.items
              this.total = response.total
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
      }
    },
    handleNewParking() {
      this.dialogNewCarInfoVisible = true
    },
    handleCleanNewInfoDataForm() {
      this.$nextTick(() => {
        this.$refs['newInfoForm'].resetFields()
      })
      this.dialogNewCarInfoVisible = false
    },
    handleCleanInfoChangeDataForm() {
      this.$nextTick(() => {
        this.$refs['infoChangeData'].resetFields()
      })
      this.dialogParkingInfoChangeFormVisible = false
    },
    handleNewInfoCleanSMSDataForm() {
      this.newInfoFormPost.smsCode = ''
      this.newInfoDialogApproveSmsVisible = false
    },
    handleChangeInfoCleanSMSDataForm() {
      this.infoChangeFormPost.smsCode = ''
      this.changeInfoDialogApproveSmsVisible = false
    }
  }
}
</script>

<style lang="scss" scoped>
$bg: #2d3a4b;
$dark_gray: #889aa4;
$light_gray: #eee;

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

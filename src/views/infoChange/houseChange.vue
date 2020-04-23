<template>
  <!-- 信息变更界面 -->
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="listQuery_search.houseName" type="text" placeholder="输入业主姓名" style="width: 130px" class="filter-item" clearable />
      <el-input v-model="listQuery_search.houseId" type="text" placeholder="输入完整房号" style="width: 130px" class="filter-item" clearable />
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
        搜索
      </el-button>
    </div>

    <div class="filter-container">
      <el-button v-waves class="filter-item" type="success" icon="el-icon-search" @click="handleNewInfo">
        新增房源信息
      </el-button>
    </div>
    <br>
    <br>

    <!-- 表格 -->
    <el-table v-loading="listLoading" highlight-current-row stripe border fit :data="tableData" style="width: 100%" height="800">
      <el-table-column label="ID" prop="id" align="center" fixed />
      <el-table-column label="房号" prop="houseId" align="center" fixed />
      <el-table-column label="房间类型" prop="houseType" align="center" fixed />
      <el-table-column label="房间状态" prop="houseStatus" align="center" />
      <el-table-column label="房间属性" prop="houseAttribute" align="center" />
      <el-table-column label="面积" prop="area" align="center" />
      <el-table-column label="业主姓名" prop="houseName" align="center" />
      <el-table-column label="业主电话" prop="housePhone" align="center" />
      <el-table-column label="电费费率" prop="electricRate" align="center" />
      <el-table-column label="物业费费率" prop="propertyRate" align="center" />
      <el-table-column label="变更面积" align="center" style="width:120px" class-name="small-padding fixed-width" fixed="right">
        <template slot-scope="{ row }">
          <el-button type="primary" style="width:80px" size="mini" @click="handleHouseInfoArea(row)">
            变更面积
          </el-button>
        </template>
      </el-table-column>
      <el-table-column label="变更业主" align="center" style="width:120px" class-name="small-padding fixed-width" fixed="right">
        <template slot-scope="{ row }">
          <el-button type="primary" style="width:80px" size="mini" @click="handleHouseInfoUser(row)">
            变更业主
          </el-button>
        </template>
      </el-table-column>
      <el-table-column label="变更费率" align="center" style="width:120px" class-name="small-padding fixed-width" fixed="right">
        <template slot-scope="{ row }">
          <el-button type="primary" style="width:80px" size="mini" @click="handleHouseInfoRate(row)">
            变更费率
          </el-button>
        </template>
      </el-table-column>
      <el-table-column label="变更状态" align="center" style="width:120px" class-name="small-padding fixed-width" fixed="right">
        <template slot-scope="{ row }">
          <el-button type="primary" style="width:80px" size="mini" @click="handleHouseInfoStatus(row)">
            变更状态
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 房源面积变更模态框 -->
    <el-dialog :visible.sync="dialogHouseInfoVisibleArea" title="房源面积变更">
      <el-card class="box-card">
        <el-form ref="dataFormArea" :model="formPost" label-width="80px">
          <el-form-item label="房间号" prop="houseId">
            <el-input v-model="formPost.houseId" disabled />
          </el-form-item>
          <el-form-item label="房间类型" prop="houseType">
            <el-input v-model="formPost.houseType" disabled />
          </el-form-item>
          <el-form-item label="房间状态" prop="houseStatus">
            <el-input v-model="formPost.houseStatus" disabled />
          </el-form-item>
          <el-form-item label="业主姓名" prop="houseName">
            <el-input v-model="formPost.houseName" width="100px" disabled />
          </el-form-item>
          <el-form-item label="业主电话" prop="housePhone">
            <el-input v-model="formPost.housePhone" width="100px" disabled />
          </el-form-item>
          <el-form-item label="房屋面积" prop="area">
            <el-input v-model="formPost.area" width="100px" />
          </el-form-item>
          <el-form-item label="电费费率" prop="electricRate">
            <el-input v-model="formPost.electricRate" width="100px" disabled />
          </el-form-item>
          <el-form-item label="物业费费率" prop="propertyRate">
            <el-input v-model="formPost.propertyRate" width="100px" disabled />
          </el-form-item>
          <el-form-item label="备注" prop="remark">
            <el-input v-model="formPost.remark" type="textarea" placeholder="如有需要请输入不多于30字的备注" />
          </el-form-item>
          <el-form-item>
            <el-button type="success" @click="handleSubmitFormArea(formPost)">提交</el-button>
            <el-button @click="handleCleanDataForm()">取消</el-button>
          </el-form-item>
        </el-form>
      </el-card>
    </el-dialog>

    <!-- 业主信息变更模态框 -->
    <el-dialog :visible.sync="dialogHouseInfoVisibleUser" title="业主信息变更">
      <el-card class="box-card">
        <el-form ref="dataFormInfo" :model="formPost" label-width="80px">
          <el-form-item label="房间号" prop="houseId">
            <el-input v-model="formPost.houseId" disabled />
          </el-form-item>
          <el-form-item label="房间类型" prop="houseType">
            <el-input v-model="formPost.houseType" disabled />
          </el-form-item>
          <el-form-item label="房间状态" prop="houseStatus">
            <el-input v-model="formPost.houseStatus" disabled />
          </el-form-item>
          <el-form-item label="业主姓名" prop="houseName">
            <el-input v-model="formPost.houseName" width="100px" />
          </el-form-item>
          <el-form-item label="业主电话" prop="housePhone">
            <el-input v-model="formPost.housePhone" width="100px" />
          </el-form-item>
          <el-form-item label="房屋面积" prop="area">
            <el-input v-model="formPost.area" width="100px" disabled />
          </el-form-item>
          <el-form-item label="电费费率" prop="electricRate">
            <el-input v-model="formPost.electricRate" width="100px" disabled />
          </el-form-item>
          <el-form-item label="物业费费率" prop="propertyRate">
            <el-input v-model="formPost.propertyRate" width="100px" disabled />
          </el-form-item>
          <el-form-item label="备注" prop="remark">
            <el-input v-model="formPost.remark" type="textarea" placeholder="如有需要请输入不多于30字的备注" />
          </el-form-item>
          <el-form-item>
            <el-button type="success" @click="handleSubmitFormUser(formPost)">提交</el-button>
            <el-button @click="handleCleanDataForm()">取消</el-button>
          </el-form-item>
        </el-form>
      </el-card>
    </el-dialog>

    <!-- 房源状态变更模态框 -->
    <el-dialog :visible.sync="dialogHouseInfoVisibleStatus" title="房间状态变更">
      <el-card class="box-card">
        <el-form ref="dataFormStatus" :model="formPost" label-width="80px">
          <el-form-item label="房间号" prop="houseId">
            <el-input v-model="formPost.houseId" disabled />
          </el-form-item>
          <el-form-item label="房间类型" prop="houseType">
            <el-input v-model="formPost.houseType" disabled />
          </el-form-item>
          <el-form-item label="房间状态" prop="houseStatus">
            <el-select v-model="formPost.houseStatus" placeholder="请选择">
              <el-option v-for="item in houseStatusOptions" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
          </el-form-item>
          <el-form-item label="业主姓名" prop="houseName">
            <el-input v-model="formPost.houseName" width="100px" disabled />
          </el-form-item>
          <el-form-item label="业主电话" prop="housePhone">
            <el-input v-model="formPost.housePhone" width="100px" disabled />
          </el-form-item>
          <el-form-item label="房屋面积" prop="area">
            <el-input v-model="formPost.area" width="100px" disabled />
          </el-form-item>
          <el-form-item label="电费费率" prop="electricRate">
            <el-input v-model="formPost.electricRate" width="100px" disabled />
          </el-form-item>
          <el-form-item label="物业费费率" prop="propertyRate">
            <el-input v-model="formPost.propertyRate" width="100px" disabled />
          </el-form-item>
          <el-form-item label="备注" prop="remark">
            <el-input v-model="formPost.remark" type="textarea" placeholder="如有需要请输入不多于30字的备注" />
          </el-form-item>
          <el-form-item>
            <el-button type="success" @click="handleSubmitFormStatus(formPost)">提交</el-button>
            <el-button @click="handleCleanDataForm()">取消</el-button>
          </el-form-item>
        </el-form>
      </el-card>
    </el-dialog>

    <!-- 房源费率变更模态框 -->
    <el-dialog :visible.sync="dialogHouseInfoVisibleRate" title="房间费率变更">
      <el-card class="box-card">
        <el-form ref="dataFormRate" :model="formPost" label-width="80px">
          <el-form-item label="房间号" prop="houseId">
            <el-input v-model="formPost.houseId" disabled />
          </el-form-item>
          <el-form-item label="房间类型" prop="houseType">
            <el-input v-model="formPost.houseType" disabled />
          </el-form-item>
          <el-form-item label="房间状态" prop="houseStatus">
            <el-input v-model="formPost.houseStatus" disabled />
          </el-form-item>
          <el-form-item label="业主姓名" prop="houseName">
            <el-input v-model="formPost.houseName" width="100px" disabled />
          </el-form-item>
          <el-form-item label="业主电话" prop="housePhone">
            <el-input v-model="formPost.housePhone" width="100px" disabled />
          </el-form-item>
          <el-form-item label="房屋面积" prop="area">
            <el-input v-model="formPost.area" width="100px" disabled />
          </el-form-item>
          <el-form-item label="电费费率" prop="electricRate">
            <el-input v-model="formPost.electricRate" width="100px" />
          </el-form-item>
          <el-form-item label="物业费费率" prop="propertyRate">
            <el-input v-model="formPost.propertyRate" width="100px" />
          </el-form-item>
          <el-form-item label="备注" prop="remark">
            <el-input v-model="formPost.remark" type="textarea" placeholder="如有需要请输入不多于30字的备注" />
          </el-form-item>
          <el-form-item>
            <el-button type="success" @click="handleSubmitFormRate(formPost)">提交</el-button>
            <el-button @click="handleCleanDataForm()">取消</el-button>
          </el-form-item>
        </el-form>
      </el-card>
    </el-dialog>

    <!-- 新增信息按钮的模态框 -->
    <el-dialog :visible.sync="dialogNewHouseInfoVisible" title="新增房屋信息">
      <!-- 定义表单提交项 -->
      <el-card class="box-card">
        <el-form ref="newInfoForm" :rules="formRules" :model="newInfoFormPost" label-width="80px">
          <el-form-item label="房号" prop="houseId">
            <el-input v-model="newInfoFormPost.houseId" placeholder="请输入房号（只允许输入一个）" />
          </el-form-item>
          <el-form-item label="房间类型" prop="houseType">
            <el-input v-model="newInfoFormPost.houseType" placeholder="请输入房间类型" />
          </el-form-item>
          <el-form-item label="房间状态" prop="houseStatus">
            <el-select v-model="newInfoFormPost.houseStatus" placeholder="请选择房间状态">
              <el-option v-for="item in houseStatusOptions" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
          </el-form-item>
          <el-form-item label="业主姓名" prop="houseName">
            <el-input v-model="newInfoFormPost.houseName" />
          </el-form-item>
          <el-form-item label="业主电话" prop="housePhone">
            <el-input v-model="newInfoFormPost.housePhone" />
          </el-form-item>
          <el-form-item label="房屋面积" prop="area">
            <el-input v-model="newInfoFormPost.area" />
          </el-form-item>
          <el-form-item label="备注" prop="remark">
            <el-input v-model="newInfoFormPost.remark" type="textarea" placeholder="如有需要请输入不多于30字的备注" />
          </el-form-item>
          <el-form-item>
            <el-button type="success" @click="handleSubmitNewInfoForm(newInfoFormPost)">确认提交</el-button>
            <el-button @click="handleCleanNewInfoDataForm()">取消</el-button>
          </el-form-item>
        </el-form>
      </el-card>
    </el-dialog>

    <!-- 分页功能实现标签 -->
    <pagination v-show="total>0" :total="total" :page.sync="listQuery_search.page" @pagination="fetchListSearch" />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { fetchHouseInfoAll, fetchHouseInfoSearch, postHouseInfoArea, postHouseInfoUser, postHouseInfoStatus, fetchHouseInfoByHouseId, postNewHouseInfo, postHouseInfoRate } from '@/api/infoChange'
import waves from '@/directive/waves' // waves directive
// import { parseTime } from '@/utils'
import Pagination from '@/components/Pagination' // secondary package based on el-pagination

export default {
  name: 'HouseInfoChange',
  components: { Pagination },
  directives: { waves },
  data() {
    return {
      listLoading: true,
      total: 0,
      // 定义搜索按钮的query字段
      listQuery_search: {
        houseId: null,
        houseName: null
      },
      // 定义信息变更模态框提交字段
      formPost: {
        houseId: null,
        houseStatus: null,
        houseType: null,
        houseName: null,
        housePhone: null,
        area: null,
        houseAttribute: null,
        electricRate: null,
        propertyRate: null,
        remark: null,
        adminId: this.$store.getters.adminId
      },
      newInfoFormPost: {
        houseId: null,
        houseStatus: null,
        houseType: null,
        houseName: null,
        housePhone: null,
        area: null,
        houseAttribute: null,
        electricRate: null,
        propertyRate: null,
        remark: null,
        adminId: this.$store.getters.adminId
      },
      dialogHouseInfoVisibleArea: false,
      dialogHouseInfoVisibleUser: false,
      dialogHouseInfoVisibleStatus: false,
      dialogHouseInfoVisibleRate: false,
      // 房间状态选择
      houseStatusOptions: [{ value: '未售', label: '未售' }, { value: '未交房', label: '未交房' }, { value: '已交未装', label: '已交未装' }, { value: '已交在装', label: '已交在装' }, { value: '入住', label: '入住' }],
      // list接口请求参数
      listQuery_all: {
        page: 1
      },
      formRules: {
        houseId: [{ required: true, message: '请输入房号（只输入一个）', trigger: 'blur' }],
        houseType: [{ required: true, message: '请选择房间类型', trigger: 'blur' }],
        houseStatus: [{ required: true, message: '请输入房间状态', trigger: 'blur' }],
        houseName: [{ required: true, message: '请输入客户姓名' }],
        housePhone: [{ required: true, message: '请输入业主电话', trigger: 'blur' }]
      },
      dialogNewHouseInfoVisible: false,
      // 声明下api变量
      tableData: []
    }
  },
  computed: {
    ...mapGetters([
      'adminName',
      'adminId',
      'roles'
    ])
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.listLoading = true
      fetchHouseInfoAll(this.listQuery_all).then(response => {
        this.tableData = response.data.items
        this.total = response.total
        this.listLoading = false
      })
    },
    // 分页绑定
    fetchListSearch() {
      this.listLoading = true
      fetchHouseInfoSearch(this.listQuery_search).then(response => {
        this.tableData = response.data.items
        this.total = response.total
        this.listLoading = false
      })
    },
    // 搜索按钮绑定
    handleFilter() {
      this.listLoading = true
      this.listQuery_search.page = 1
      fetchHouseInfoSearch(this.listQuery_search).then(response => {
        this.tableData = response.data.items
        this.total = response.total
        this.listLoading = false
      })
    },
    // 变更面积按钮模态框
    handleHouseInfoArea(row) {
      this.formPost.houseId = row.houseId
      this.formPost.houseStatus = row.houseStatus
      this.formPost.houseName = row.houseName
      this.formPost.housePhone = row.housePhone
      this.formPost.area = row.area
      this.formPost.houseType = row.houseType
      this.formPost.houseAttribute = row.houseAttribute
      this.formPost.electricRate = row.electricRate
      this.formPost.propertyRate = row.propertyRate
      this.formPost.remark = row.remark
      this.dialogHouseInfoVisibleArea = true
    },
    // 变更业主按钮模态框
    handleHouseInfoUser(row) {
      this.formPost.houseId = row.houseId
      this.formPost.houseStatus = row.houseStatus
      this.formPost.houseName = row.houseName
      this.formPost.housePhone = row.housePhone
      this.formPost.area = row.area
      this.formPost.houseType = row.houseType
      this.formPost.houseAttribute = row.houseAttribute
      this.formPost.electricRate = row.electricRate
      this.formPost.propertyRate = row.propertyRate
      this.formPost.remark = row.remark
      this.dialogHouseInfoVisibleUser = true
    },
    // 变更状态按钮模态框
    handleHouseInfoStatus(row) {
      this.formPost.houseId = row.houseId
      this.formPost.houseStatus = row.houseStatus
      this.formPost.houseName = row.houseName
      this.formPost.housePhone = row.housePhone
      this.formPost.area = row.area
      this.formPost.houseType = row.houseType
      this.formPost.houseAttribute = row.houseAttribute
      this.formPost.electricRate = row.electricRate
      this.formPost.propertyRate = row.propertyRate
      this.formPost.remark = row.remark
      this.dialogHouseInfoVisibleStatus = true
    },
    // 变更费率按钮模态框
    handleHouseInfoRate(row) {
      this.formPost.houseId = row.houseId
      this.formPost.houseStatus = row.houseStatus
      this.formPost.houseName = row.houseName
      this.formPost.housePhone = row.housePhone
      this.formPost.area = row.area
      this.formPost.houseType = row.houseType
      this.formPost.houseAttribute = row.houseAttribute
      this.formPost.electricRate = row.electricRate
      this.formPost.propertyRate = row.propertyRate
      this.formPost.remark = row.remark
      this.dialogHouseInfoVisibleRate = true
    },
    // 提交时弹出确认框
    open() {
      this.$confirm('是否确认提交', '注意', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$message({
          type: 'success',
          message: '准备提交'
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消提交'
        })
      })
    },
    // 房源信息变更提交
    handleSubmitFormArea(formPost) {
      console.log(this.formPost)
      this.$confirm('确定提交么？', '变更信息', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'info'
      }).then(() => {
        postHouseInfoArea(formPost).then(response => {
          if (response.codeStatus === 200) {
            this.$notify({
              title: 'Success',
              message: '提交成功',
              type: 'success',
              duration: 2000
            })
            this.dialogHouseInfoVisibleArea = false
            this.$nextTick(() => {
              this.$refs['dataFormArea'].clearValidate()
            })
            // 逻辑可能存在问题，比如id如何传到页面上
            // 暂未测试
            // 提交表单成功后跳转到指定houseid的搜索页面，返回提交房间表单的所有状态信息
            fetchHouseInfoByHouseId(formPost.houseId).then(response => {
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
    },
    // 业主信息变更提交
    handleSubmitFormUser(formPost) {
      console.log(this.formPost)
      this.$confirm('确定提交么？', '变更信息', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'info'
      }).then(() => {
        postHouseInfoUser(formPost).then(response => {
          if (response.codeStatus === 200) {
            this.$notify({
              title: 'Success',
              message: '提交成功',
              type: 'success',
              duration: 2000
            })
            this.dialogHouseInfoVisibleUser = false
            this.$nextTick(() => {
              this.$refs['dataFormInfo'].clearValidate()
            })
            // 逻辑可能存在问题，比如id如何传到页面上
            // 暂未测试
            // 提交表单成功后跳转到指定houseid的搜索页面，返回提交房间表单的所有状态信息
            fetchHouseInfoByHouseId(formPost.houseId).then(response => {
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
    },
    // 房间状态变更提交
    handleSubmitFormStatus(formPost) {
      this.$confirm('确定提交么？', '变更信息', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'info'
      }).then(() => {
        postHouseInfoStatus(formPost).then(response => {
          if (response.codeStatus === 200) {
            this.$notify({
              title: 'Success',
              message: '提交成功',
              type: 'success',
              duration: 2000
            })
            this.dialogHouseInfoVisibleStatus = false
            this.$nextTick(() => {
              this.$refs['dataFormStatus'].clearValidate()
            })
            // 逻辑可能存在问题，比如id如何传到页面上
            // 暂未测试
            // 提交表单成功后跳转到指定houseid的搜索页面，返回提交房间表单的所有状态信息
            fetchHouseInfoByHouseId(formPost.houseId).then(response => {
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
    },
    // 房间费率变更提交
    handleSubmitFormRate(formPost) {
      this.$confirm('确定提交么？', '变更信息', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'info'
      }).then(() => {
        postHouseInfoRate(formPost).then(response => {
          if (response.codeStatus === 200) {
            this.$notify({
              title: 'Success',
              message: '提交成功',
              type: 'success',
              duration: 2000
            })
            this.dialogHouseInfoVisibleRate = false
            this.$nextTick(() => {
              this.$refs['dataFormRate'].clearValidate()
            })
            // 逻辑可能存在问题，比如id如何传到页面上
            // 暂未测试
            // 提交表单成功后跳转到指定houseid的搜索页面，返回提交房间表单的所有状态信息
            fetchHouseInfoByHouseId(formPost.houseId).then(response => {
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
    },
    handleCleanDataForm() {
      this.$nextTick(() => {
        this.$refs['dataForm'].resetFields()
      })
      this.dialogHouseInfoVisibleArea = false
      this.dialogHouseInfoVisibleUser = false
      this.dialogHouseInfoVisibleStatus = false
      this.dialogHouseInfoVisibleRate = false
    },
    handleSubmitNewInfoForm(newInfoFormPost) {
      console.log('user id-------------------')
      console.log(newInfoFormPost.adminId)
      this.$refs['newInfoForm'].validate((valid) => {
        if (valid) {
          this.$confirm('确定提交么？', '新增信息', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'info'
          }).then(() => {
            postNewHouseInfo(newInfoFormPost).then(response => {
              if (response.codeStatus === 200) {
                this.$notify({
                  title: 'Success',
                  message: '提交成功',
                  type: 'success',
                  duration: 2000
                })
                this.dialogNewHouseInfoVisible = false
                this.$nextTick(() => {
                  this.$refs['newInfoForm'].resetFields()
                })
                // 逻辑可能存在问题，比如id如何传到页面上
                // 暂未测试
                // 提交表单成功后跳转到指定houseid的搜索页面，返回提交房间表单的所有状态信息
                fetchHouseInfoByHouseId(newInfoFormPost.houseId).then(response => {
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
      })
    },
    handleCleanNewInfoDataForm() {
      this.$nextTick(() => {
        this.$refs['newInfoForm'].resetFields()
      })
      this.dialogNewHouseInfoVisible = false
    },
    handleNewInfo() {
      this.dialogNewHouseInfoVisible = true
    }
  }
}
</script>

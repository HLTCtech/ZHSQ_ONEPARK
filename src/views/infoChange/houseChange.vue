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
    <el-table v-loading="listLoading" :data="tableData" style="width: 100%" height="800" highlight-current-row>
      <el-table-column label="ID" prop="id" align="center" fixed />
      <el-table-column label="房号" prop="houseId" align="center" fixed />
      <el-table-column label="类型" prop="houseType" align="center" fixed />
      <el-table-column label="房间状态" prop="houseStatus" align="center" fixed />
      <el-table-column label="业主姓名" prop="houseName" align="center" fixed />
      <el-table-column label="业主电话" prop="housePhone" align="center" />
      <el-table-column label="面积" prop="area" align="center" />
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
        <el-form ref="dataForm" :model="formPost" label-width="80px">
          <el-form-item label="房间号" prop="houseId">
            <el-input v-model="formPost.houseId" disabled />
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
          <el-form-item label="住宅面积" prop="houseArea">
            <el-input v-model="formPost.houseArea" width="100px" />
          </el-form-item>
          <el-form-item label="地下室面积" prop="basementArea">
            <el-input v-model="formPost.basementArea" width="100px" />
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
        <el-form ref="dataForm" :model="formPost" label-width="80px">
          <el-form-item label="房间号" prop="houseId">
            <el-input v-model="formPost.houseId" disabled />
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
          <el-form-item label="住宅面积" prop="houseArea">
            <el-input v-model="formPost.houseArea" width="100px" disabled />
          </el-form-item>
          <el-form-item label="地下室面积" prop="basementArea">
            <el-input v-model="formPost.basementArea" width="100px" disabled />
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
        <el-form ref="dataForm" :model="formPost" label-width="80px">
          <el-form-item label="房间号" prop="houseId">
            <el-input v-model="formPost.houseId" disabled />
          </el-form-item>
          <el-form-item label="房间状态" prop="houseStatus">
            <el-input v-model="formPost.houseStatus" />
          </el-form-item>
          <el-form-item label="业主姓名" prop="houseName">
            <el-input v-model="formPost.houseName" width="100px" disabled />
          </el-form-item>
          <el-form-item label="业主电话" prop="housePhone">
            <el-input v-model="formPost.housePhone" width="100px" disabled />
          </el-form-item>
          <el-form-item label="住宅面积" prop="houseArea">
            <el-input v-model="formPost.houseArea" width="100px" disabled />
          </el-form-item>
          <el-form-item label="地下室面积" prop="basementArea">
            <el-input v-model="formPost.basementArea" width="100px" disabled />
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

    <!-- 新增信息按钮的模态框 -->
    <el-dialog :visible.sync="dialogNewHouseInfoVisible" title="新增房屋信息">

      <!-- 定义表单提交项 -->
      <el-card class="box-card">
        <el-form ref="newInfoForm" :rules="formRules" :model="newInfoFormPost" label-width="80px">
          <el-form-item label="房号" prop="houseId">
            <el-input v-model="newInfoFormPost.houseId" placeholder="请输入房号（只允许输入一个）" />
          </el-form-item>
          <el-form-item label="房间状态" prop="houseStatus">
            <el-input v-model="newInfoFormPost.houseStatus" placeholder="请输入房间状态" />
          </el-form-item>
          <el-form-item label="业主姓名" prop="houseName">
            <el-input v-model="newInfoFormPost.houseName" />
          </el-form-item>
          <el-form-item label="业主电话" prop="housePhone">
            <el-input v-model="newInfoFormPost.housePhone" />
          </el-form-item>
          <el-form-item label="住宅面积" prop="houseArea">
            <el-input v-model="newInfoFormPost.houseArea" />
          </el-form-item>
          <el-form-item label="地下室面积" prop="basementArea">
            <el-input v-model="newInfoFormPost.basementArea" />
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
import { fetchHouseInfoAll, fetchHouseInfoSearch, postHouseInfoArea, postHouseInfoUser, postHouseInfoStatus, fetchHouseInfoByHouseId, postNewHouseInfo } from '@/api/infoChange'
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
        houseName: null,
        housePhone: null,
        houseArea: null,
        basementArea: null,
        remark: null,
        adminId: this.$store.getters.adminId
      },
      newInfoFormPost: {
        houseId: null,
        houseStatus: null,
        houseName: null,
        housePhone: null,
        houseArea: null,
        basementArea: null,
        remark: null,
        adminId: this.$store.getters.adminId
      },
      dialogHouseInfoVisibleArea: false,
      dialogHouseInfoVisibleUser: false,
      dialogHouseInfoVisibleStatus: false,
      // 年份选择
      lou_numOptions: ['1号楼', '2号楼', '3号楼', '4号楼', '5号楼', '6号楼', '7号楼', '8号楼', '9号楼', '10号楼', '11号楼', '12号楼', '13号楼', '14号楼', '15号楼', '16号楼', '17号楼', '18号楼', '19号楼', '20号楼', '21号楼', '22号楼', '23号楼', '24号楼', '25号楼', '26号楼', '27号楼', '28号楼', '29号楼', '30号楼', '31号楼', '32号楼', '33号楼', '34号楼', '35号楼', '36号楼', '37号楼', '38号楼'],
      danyuan_numOptions: ['1单元', '2单元', '3单元'],
      floor_numOptions: ['1楼', '2楼', '3楼', '4楼', '5楼', '6楼', '7楼', '8楼', '9楼', '10楼', '11楼', '12楼', '13楼', '14楼', '15楼', '16楼', '17楼', '18楼'],
      fangjian_numOptions: ['01', '02', '03', '04', '05', '06'],
      Shopfangjian_numOptions: ['101', '102', '103', '104', '105', '106', '107', '108', '109', '110', '111', '112', '113', '114', '115',
        '116', '117', '118', '119', '120', '121', '122', '123', '124', '125', '126', '127', '128', '129', '130', '131', '132', '133',
        '134', '135', '136', '137', '138', '139', '140', '141', '142', '143', '144', '145', '146', '147', '148', '149', '150'],
      // list接口请求参数
      listQuery_all: {
        page: 1
      },
      formRules: {
        houseId: [{ required: true, message: '请输入房号（只输入一个）', trigger: 'blur' }],
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
      this.formPost.houseArea = row.houseArea
      this.formPost.basementArea = row.basementArea
      this.dialogHouseInfoVisibleArea = true
    },
    // 变更业主按钮模态框
    handleHouseInfoUser(row) {
      this.formPost.houseId = row.houseId
      this.formPost.houseStatus = row.houseStatus
      this.formPost.houseName = row.houseName
      this.formPost.housePhone = row.housePhone
      this.formPost.houseArea = row.houseArea
      this.formPost.basementArea = row.basementArea
      this.dialogHouseInfoVisibleUser = true
    },
    // 变更状态按钮模态框
    handleHouseInfoStatus(row) {
      this.formPost.houseId = row.houseId
      this.formPost.houseStatus = row.houseStatus
      this.formPost.houseName = row.houseName
      this.formPost.housePhone = row.housePhone
      this.formPost.houseArea = row.houseArea
      this.formPost.basementArea = row.basementArea
      this.dialogHouseInfoVisibleStatus = true
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
              this.$refs['dataForm'].resetFields()
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
              this.$refs['dataForm'].resetFields()
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
              this.$refs['dataForm'].resetFields()
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

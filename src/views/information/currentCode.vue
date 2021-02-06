<template>
  <!-- 新增科目编码 -->
  <div class="app-container">
    <el-button
      v-waves
      class="filter-item"
      style="width:150px;"
      type="success"
      icon="el-icon-coin"
      @click="handleNewSubjectCode"
    >新增科目编码</el-button>
    <br>
    <br>

    <!-- 新增科目编码模态框 -->
    <el-dialog :visible.sync="dialogNewSubjectCode" title="新增科目编码">
      <el-card class="box-card">
        <!-- 新增科目编码表单提交 -->
        <el-form
          ref="newSubjectForm"
          :rules="newSubjectFormRules"
          :model="newSubjectFormPost"
          label-width="80px"
        >
          <!-- <el-form-item label="费用类型" label-width="100px" prop="payItem">
            <el-select v-model="newSubjectFormPost.payItem" placeholder="请选择">
              <el-option
                v-for="item in payItemOptions"
                :key="item"
                :label="item"
                :value="item"
              />
            </el-select>
          </el-form-item> -->
          <!-- <el-form-item label="房间号" label-width="100px" prop="houseId">
            <el-input v-model="newSubjectFormPost.houseId" placeholder="请输入完整房号（不要输入多个房号）" />
          </el-form-item> -->
          <el-form-item label="电表号" label-width="100px" prop="electricMeterId">
            <el-input v-model="newSubjectFormPost.electricMeterId" placeholder="请输入电表号" />
          </el-form-item>
          <el-form-item label="地下车位号" label-width="100px" prop="parkingId">
            <el-input v-model="newSubjectFormPost.parkingId" placeholder="请输入地下车位号" />
          </el-form-item>
          <el-form-item label="地下室号" label-width="100px" prop="basementId">
            <el-input v-model="newSubjectFormPost.basementId" placeholder="请输入地下室号" />
          </el-form-item>
          <el-form-item label="科目编码" label-width="100px" prop="subjectCode">
            <el-input v-model="newSubjectFormPost.subjectCode" placeholder="请输入科目编码" />
          </el-form-item>
          <el-form-item label="科目名称" label-width="100px" prop="subjectName">
            <el-input v-model="newSubjectFormPost.subjectName" placeholder="请输入科目名称" />
          </el-form-item>
          <el-form-item>
            <el-button type="success" @click="newSubjectCodePost(newSubjectFormPost)">提交</el-button>
            <el-button @click="CleanDataForm()">取消</el-button>
          </el-form-item>
        </el-form>
      </el-card>
    </el-dialog>
    <div class="filter-container">
      <el-input
        v-model="listQuery_search.subjectCode"
        type="text"
        placeholder="科目编码"
        style="width: 130px"
        class="filter-item"
        clearable
      />
      <el-input
        v-model="listQuery_search.subjectName"
        type="text"
        placeholder="科目名称"
        style="width: 130px"
        class="filter-item"
        clearable
      />
      <!-- <el-select
        v-model="listQuery_search.Item"
        placeholder="费用类别"
        style="top: -4px;position: relative"
      >
        <el-option
          v-for="item in payItemOptions"
          :key="item"
          :label="item"
          :value="item"
        />
      </el-select> -->
      <el-button
        v-waves
        class="filter-item"
        type="primary"
        icon="el-icon-search"
        @click="getList"
      >搜索</el-button>
    </div>
    <div class="printTable">
      <el-table
        v-loading="tableLoading"
        :data="tableData"
        highlight-current-row
        stripe
        border
        fit
        max-height="900px"
      >
        <el-table-column label="ID" prop="subjectCodeId" align="center" />
        <el-table-column label="级次" prop="orderNum" align="center" />
        <el-table-column label="科目编码" prop="subjectCode" align="center" />
        <el-table-column label="科目名称" prop="subjectName" align="center" />
        <el-table-column label="科目分类" prop="subjectKind" align="center" />
        <el-table-column label="余额方向" prop="accountDirection" align="center" />
        <el-table-column label="账页格式" prop="pageForm" align="center" />
        <el-table-column label="是否可用" prop="isStop" align="center" />
        <el-table-column label="费用类别" prop="Item" align="center" />
      </el-table>
    <pagination v-show="total>0" :total="total" :page.sync="listQuery_search.page" @pagination="getList" />

    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
// import { subjectNew, subjectList } from '@/api/subjectCode'
import waves from '@/directive/waves' // waves directive
import {subjectList,subjectNew,subjectCodeDelete} from '@/api/information'
import Pagination from '@/components/Pagination' // secondary package based on el-pagination

export default {
  name: 'SubjectCodeNew',
  components: { Pagination },
  directives: { waves },
  data() {
    return {
      total:0,
      // 费用选项
      payItemOptions: [

      ],
      listLoading: true,
      // 新增科目编码表单项目
      newSubjectFormPost: {
        // houseId: null,
        electricMeterId: null,
        parkingId: null,
        basementId: null,
        subjectCode: null,
        subjectName: null,
        // payItem: null,
        adminId: this.$store.getters.adminId
      },
      // 新增科目编码表单提交项目规则
      newSubjectFormRules: {
        payItem: [
          { required: true, message: '请选择费用类型', trigger: 'change' }
        ],
        houseId: [
          {
            required: true,
            message: '请输入单一的完整房间号',
            trigger: 'change'
          }
        ],
        subjectCode: [
          { required: true, message: '请输入科目编码', trigger: 'change' }
        ],
        subjectName: [
          { required: true, message: '请输入科目名称', trigger: 'blur' }
        ]
      },
      // 收费页面模态框
      dialogMoneyPost: false,
      dialogNewSubjectCode: false,
      listQuery_search: {
        page: 1,
      },
      tableData: [],
      tableLoading: false
    }
  },
  computed: {
    ...mapGetters(['adminName', 'adminId', 'roles'])
  },
  //   watch: {
  //     payPatternChange(val) {
  //       if (this.$refs['singleDataForm'] !== undefined) {
  //         this.$refs['singleDataForm'].clearValidate()
  //       }
  //       if (this.$refs['mixDataForm'] !== undefined) {
  //         this.$refs['mixDataForm'].clearValidate()
  //       }
  //     }
  //   },
  created() {
    this.getList()
    // this.getSundriesOptions()
  },
  methods: {
    // 点击收费按钮
    handleNewSubjectCode() {
      this.dialogNewSubjectCode = true
    },
    // 提交新增科目编码表单
    newSubjectCodePost(newSubjectFormPost) {
      // 表单项规则验证
      this.$refs['newSubjectForm'].validate((valid) => {
        if (valid) {
          // 操作确认框
          this.$confirm('确定提交么？', '费用收缴', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'info'
          }).then(() => {
            subjectNew(newSubjectFormPost).then((response) => {
              if (response.codeStatus === 200) {
                this.$notify({
                  title: 'Success',
                  message: '提交成功',
                  type: 'success',
                  duration: 2000
                })
                this.$nextTick(() => {
                  this.$refs['newSubjectForm'].resetFields()
                })
                this.getList()
                // this.getSundriesOptions()
                this.dialogNewSubjectCode = false
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
    // 收费页面取消按钮
    CleanDataForm() {
      if (this.$refs['newSubjectForm'] !== undefined) {
        this.$nextTick(() => {
          this.$refs['newSubjectForm'].resetFields()
        })
      }
      this.dialogNewSubjectCode = false
    },
  getSundriesOptions(){
      getSundriesListall({sundries: ""}).then(res=>{
        this.payItemOptions = res.data.items.map(item=>item.sundriesitem)
      })
    },
    getList() {
      this.tableLoading = true
      console.log(this.listQuery_search)
      subjectList(this.listQuery_search)
        .then((res) => {
          this.tableLoading = false
          this.tableData = res.data.items
          this.total = res.total
        })
        .catch((err) => {
          this.tableLoading = false
        })
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

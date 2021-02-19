<template>
<!-- 基础信息 > 新增杂费类型 -->
  <div class="app-container">
    <div class="filter-container">
      <el-input
        v-model="listQuery_search.sundries"
        type="text"
        placeholder="输入杂费类型"
        style="width: 130px"
        class="filter-item"
        clearable
      />
      <el-button
        v-waves
        class="filter-item"
        type="primary"
        icon="el-icon-search"
        @click="getSundriesList"
      >
        搜索
      </el-button>
      <el-button
        type="success"
        icon="el-icon-coin"
        class="filter-item"
        @click="dialogSundriesAdd = true"
        >新增费用类型</el-button
      >
    </div>
    <br />
    <br />

    <!-- 新增杂费 -->
    <el-dialog :visible.sync="dialogSundriesAdd" title="新增费用类型">
      <el-form
        ref="formSundriesAdd"
        :rules="formSundriesRules"
        :model="formSundriesAdd"
        label-width="80px"
      >
        <el-form-item label="费用类型" label-width="100px" prop="sundries">
          <el-input
            v-model="formSundriesAdd.sundries"
            placeholder="请输入费用类型"
          />
        </el-form-item>
        <el-form-item label="费用类别" label-width="100px" prop="status">
          <el-input
            v-model="formSundriesAdd.status"
            placeholder="请输入费用类别"
          />
        </el-form-item>

        <el-form-item>
          <el-button type="success" @click="handleAdd">提交</el-button>
          <el-button @click="dialogSundriesAdd = false">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>

    <el-table
      v-loading="tableLoading"
      :data="tableData"
      highlight-current-row
      stripe
      border
      fit
      max-height="900px"
    >
      <el-table-column label="ID" prop="id" align="center" />
      <el-table-column label="费用类型" prop="sundriesitem" align="center" />
      <el-table-column label="费用类别" prop="status" align="center" />
      <el-table-column label="操作" align="center">
        <template slot-scope="{ row }">
          <el-button type="danger" size="mini" @click="handleDel(row.id)"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import {
  sundriesListall,
  sundriesAdd,
  sundriesDelete,
  sundriesList
} from '@/api/information'
export default {
  data() {
    return {
      dialogSundriesAdd: false,
      formSundriesAdd: { sundries: null, status: null },
      tableData: [],
      listQuery_search: { sundries: '' },
      tableLoading: false,
      formSundriesRules: {
        sundries: [
          { required: true, message: '请选择费用类型', trigger: 'blur' }
        ],
        status: [{ required: true, message: '请选择费用类别', trigger: 'blur' }]
      }
    }
  },
  created() {
    this.getSundriesList()
  },
  methods: {
    // 获取杂项
    getSundriesList() {
      this.tableLoading = true
      sundriesListall(this.listQuery_search)
        .then(res => {
          this.tableLoading = false
          console.log(res)
          this.tableData = res.data.items
        })
        .catch(() => {
          this.tableLoading = false
        })
    },
    handleDel(id) {
      this.$confirm('确定删除该项？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          sundriesDelete({ id: id }).then(res => {
            if (res.codeStatus == 200) {
              this.$message.success('删除成功')
              this.getSundriesList()
            }
          })
        })
        .catch(() => {})
    },
    handleAdd() {
      this.$refs['formSundriesAdd'].validate(valid => {
        if (valid) {
          sundriesAdd(this.formSundriesAdd).then(res => {
            if (res.codeStatus == 200) {
              this.$message.success('添加成功')
              this.getSundriesList()
              this.dialogSundriesAdd = false
              this.formSundriesAdd.sundries = null
              this.formSundriesAdd.status = '是'
            }
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    }
  }
}
</script>

<style></style>

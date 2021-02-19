<template>
  <!-- 基础信息 > 往来编码 -->
  <div class="app-container">
    <div class="filter-container">
      <el-input
        v-model="listQuery_search.code"
        type="text"
        placeholder="输入往来编码"
        style="width: 130px"
        class="filter-item"
        clearable
      /><el-input
        v-model="listQuery_search.name"
        type="text"
        placeholder="输入编码名称"
        style="width: 130px"
        class="filter-item"
        clearable
      />
      <el-button
        class="filter-item"
        type="primary"
        icon="el-icon-search"
        @click="getList"
      >
        搜索
      </el-button>
      <el-button
        type="success"
        icon="el-icon-coin"
        class="filter-item"
        @click="dialogSundriesAdd = true"
        >新增往来编码</el-button
      >
    </div>
    <br />
    <br />

    <!-- 新增往来编码 -->
    <el-dialog :visible="dialogSundriesAdd" title="新增往来编码" @close="close">
      <el-form
        ref="formSundriesAdd"
        :rules="formSundriesRules"
        :model="formSundriesAdd"
        label-width="80px"
      >
        <el-form-item label="往来编码" label-width="100px" prop="code">
          <el-input
            v-model="formSundriesAdd.code"
            placeholder="请输入往来编码"
          />
        </el-form-item>
        <el-form-item label="编码名称" label-width="100px" prop="name">
          <el-input
            v-model="formSundriesAdd.name"
            placeholder="请输入编码名称"
          />
        </el-form-item>

        <el-form-item>
          <el-button type="success" @click="handleAdd">提交</el-button>
          <el-button @click="close">取消</el-button>
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
      max-height="800px"
    >
      <el-table-column label="ID" prop="contactUnitId" align="center" />
      <el-table-column label="往来编码" prop="code" align="center" />
      <el-table-column label="编码名称" prop="name" align="center" />
      <el-table-column label="时间" prop="date" align="center" />
      <el-table-column label="操作" align="center">
        <template slot-scope="{ row }">
          <el-button
            type="danger"
            size="mini"
            @click="handleDel(row.contactUnitId)"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import {
  contactunitList,
  deleteContactUnit,
  subjectCodeAdd
} from '@/api/information'
export default {
  data() {
    return {
      dialogSundriesAdd: false,
      formSundriesAdd: { code: null, name: null },
      tableData: [],
      listQuery_search: { page: 1, name: '', code: '' },
      tableLoading: false,
      formSundriesRules: {
        code: [{ required: true, message: '请输入往来编码', trigger: 'blur' }],
        name: [{ required: true, message: '请输入编码名称', trigger: 'blur' }]
      }
    }
  },
  created() {
    this.getList()
  },
  methods: {
    // 获取杂项
    getList() {
      this.tableLoading = true
      console.log(this.listQuery_search)
      contactunitList(this.listQuery_search)
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
          console.log(id)
          deleteContactUnit({ id: id }).then(res => {
            if (res.codeStatus == 200) {
              this.$message.success('删除成功')
              this.getList()
            }
          })
        })
        .catch(() => {})
    },
    handleAdd() {
      this.$refs['formSundriesAdd'].validate(valid => {
        if (valid) {
          subjectCodeAdd(this.formSundriesAdd).then(res => {
            if (res.codeStatus == 200) {
              this.$message.success('添加成功')
              this.getList()
              this.close()
            }
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    close(){
      this.dialogSundriesAdd = false
      this.formSundriesAdd={ code: null, name: null }
    }
  }
}
</script>

<style></style>

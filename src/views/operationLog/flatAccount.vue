<template>
  <!-- 操作记录 > 平账记录 -->
  <div class="flat-account">
    <!-- 顶部搜索区域 -->
    <div class="top-handle">
      <el-input
        v-model="searchForm.houseId"
        class="one-input"
        placeholder="输入房间号"
        :clearable="true"
      ></el-input>
      <el-input
        v-model="searchForm.userName"
        class="one-input"
        placeholder="输入业主姓名"
        :clearable="true"
      ></el-input>
      <el-button type="primary" @click="handleSearch">搜索</el-button>
    </div>
    <!-- 表格区域 -->
    <el-table
      :data="tableData"
      :border="true"
      style="width:100%"
      v-loading="tableLoading"
    >
      <el-table-column label="序号" type="index" width="60"> </el-table-column>
      <el-table-column label="业主姓名" prop="openName"> </el-table-column>
      <el-table-column label="开户人电话" prop="openPhone"> </el-table-column>
      <el-table-column label="房间号" prop="houseId"> </el-table-column>
      <el-table-column label="电表号" prop="electriMeterID"> </el-table-column>
      <el-table-column label="平账金额" prop="balanceamount"> </el-table-column>
      <el-table-column label="开户日期" prop="openTime"> </el-table-column>
      <el-table-column label="备注" prop="remark"> </el-table-column>
      <el-table-column label="操作人" prop="operatorName"> </el-table-column>
    </el-table>
    <!-- 页面分页 -->
    <div style="margin:20px 0" v-if="searchForm.limit">
      <el-pagination
        background
        layout="prev, pager, next"
        :total="total"
        @current-change="currentChange"
      >
      </el-pagination>
    </div>
  </div>
</template>

<script>
import { getListOpen, search } from '@/api/flatAccount'
export default {
  data() {
    return {
      searchForm: {
        adminId: this.$store.getters.adminId,
        page: 1,
        limit: 20,
        houseId: '', //房间号
        userName: '' //业主姓名
      },
      tableData: [],
      total: 0, //总数据量
      tableLoading: false
    }
  },
  mounted() {
    this.getList()
  },
  methods: {
    currentChange(i) {
      console.log(i)
      this.searchForm.page = i
      this.getList()
    },
    /* 获取页面数据 */
    getList() {
      this.tableLoading = true
      this.$set(this.searchForm, 'limit', 20)
      getListOpen(this.searchForm)
        .then(res => {
          console.log(res)
          if (res.code === 200) {
            this.tableData = res.data.items
            this.total = res.total
            this.tableLoading = false
          }
        })
        .catch(err => {
          console.log(err)
          this.tableLoading = false
        })
    },
    /* 点击搜索按钮 */
    handleSearch() {
      this.tableLoading = true
      if (this.searchForm.houseId === '' && this.searchForm.userName === '') {
        this.getList()
      } else {
        delete this.searchForm.limit
        search(this.searchForm)
          .then(res => {
            console.log(res)
            if (res.code === 200) {
              this.tableData = res.data.items
              this.tableLoading = false
            }
          })
          .catch(err => {
            console.log(err)
            this.tableLoading = false
          })
      }
    }
  }
}
</script>

<style lang="scss">
.flat-account {
  padding: 15px;
  .top-handle {
    display: flex;
    align-items: center;
    margin-bottom: 15px;
    .one-input {
      width: 150px;
    }
  }
}
</style>

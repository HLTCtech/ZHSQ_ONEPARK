<template>
  <!-- 操作记录--平账记录 -->
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
        v-model="searchForm.houseName"
        class="one-input"
        placeholder="输入业主姓名"
        :clearable="true"
      ></el-input>
      <el-button type="primary" @click="handleSearch">搜索</el-button>
    </div>
    <!-- 表格区域 -->
    <el-table :data="tableData" :border="true">
      <el-table-column label="ID" prop="aa"> </el-table-column>
    </el-table>
  </div>
</template>

<script>
export default {
  data() {
    return {
      searchForm: {
        houseId: '', //房间号
        houseName: '' //业主姓名
      },
      tableData: []
    }
  },
  methods: {
    /* 点击搜索按钮 */
    handleSearch() {}
  }
}
</script>

<style lang="scss">
.flat-account {
  .top-handle {
    display: flex;
    align-items: center;
    .one-input {
      width: 250px;
    }
  }
}
</style>

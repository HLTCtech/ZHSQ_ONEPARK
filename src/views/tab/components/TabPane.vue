<template>
  <el-table :data="list" border fit highlight-current-row style="width: 100%">
    <el-table-column
      v-loading="loading"
      align="center"
      label="ID"
      width="65"
      element-loading-text="请给我点时间！"
    >
      <template slot-scope="scope">
        <span>{{ scope.row.id }}</span>
      </template>
    </el-table-column>

    <!-- 原本为date  span内部为日期标准格式转换-->
    <el-table-column width="180px" align="center" label="房间号">
      <template slot-scope="scope">
        <span>{{ scope.row.timestamp | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
      </template>
    </el-table-column>

    <!-- 原本为Title  有title/type两个属性值 原本宽度定义为min-width-->
    <el-table-column width="110px" label="业主姓名">
      <template slot-scope="{row}">
        <span>{{ row.title }}</span>
        <!-- <el-tag>{{ row.type }}</el-tag> -->
      </template>
    </el-table-column>

    <!-- 原本为Author -->
    <el-table-column width="110px" align="center" label="具体信息">
      <template slot-scope="scope">
        <span>{{ scope.row.author }}</span>
      </template>
    </el-table-column>

    <!-- 具体的收费细则 -->
    <el-table-column width="110px" align="center" label="原始读数">
      <template slot-scope="scope">
        <!-- 参数中均为假变量 -->
        <span>{{ scope.row.author }}</span>
      </template>
    </el-table-column>

    <!-- 具体的收费细则 -->
    <el-table-column width="110px" align="center" label="1月读数">
      <template slot-scope="scope">
        <!-- 参数中均为假变量 -->
        <span>{{ scope.row.author }}</span>
      </template>
    </el-table-column>

    <!-- 具体的收费细则 -->
    <el-table-column width="110px" align="center" label="1月用量">
      <template slot-scope="scope">
        <!-- 参数中均为假变量 -->
        <span>{{ scope.row.author }}</span>
      </template>
    </el-table-column>

    <!-- 具体的收费细则 -->
    <el-table-column width="110px" align="center" label="1月应收">
      <template slot-scope="scope">
        <!-- 参数中均为假变量 -->
        <span>{{ scope.row.author }}</span>
      </template>
    </el-table-column>

    <!-- 具体的收费细则 -->
    <el-table-column width="110px" align="center" label="2月读数">
      <template slot-scope="scope">
        <!-- 参数中均为假变量 -->
        <span>{{ scope.row.author }}</span>
      </template>
    </el-table-column>

    <!-- 具体的收费细则 -->
    <el-table-column width="110px" align="center" label="2月用量">
      <template slot-scope="scope">
        <!-- 参数中均为假变量 -->
        <span>{{ scope.row.author }}</span>
      </template>
    </el-table-column>

    <!-- 具体的收费细则 -->
    <el-table-column width="110px" align="center" label="2月应收">
      <template slot-scope="scope">
        <!-- 参数中均为假变量 -->
        <span>{{ scope.row.author }}</span>
      </template>
    </el-table-column>

    <!-- 具体的收费细则 -->
    <el-table-column width="110px" align="center" label="3月读数">
      <template slot-scope="scope">
        <!-- 参数中均为假变量 -->
        <span>{{ scope.row.author }}</span>
      </template>
    </el-table-column>

    <!-- 具体的收费细则 -->
    <el-table-column width="110px" align="center" label="3月用量">
      <template slot-scope="scope">
        <!-- 参数中均为假变量 -->
        <span>{{ scope.row.author }}</span>
      </template>
    </el-table-column>

    <!-- 具体的收费细则 -->
    <el-table-column width="110px" align="center" label="3月应收">
      <template slot-scope="scope">
        <!-- 参数中均为假变量 -->
        <span>{{ scope.row.author }}</span>
      </template>
    </el-table-column>
    <!-- 具体的收费细则 -->
    <el-table-column width="110px" align="center" label="4月读数">
      <template slot-scope="scope">
        <!-- 参数中均为假变量 -->
        <span>{{ scope.row.author }}</span>
      </template>
    </el-table-column>

    <!-- 具体的收费细则 -->
    <el-table-column width="110px" align="center" label="4月用量">
      <template slot-scope="scope">
        <!-- 参数中均为假变量 -->
        <span>{{ scope.row.author }}</span>
      </template>
    </el-table-column>

    <!-- 具体的收费细则 -->
    <el-table-column width="110px" align="center" label="4月应收">
      <template slot-scope="scope">
        <!-- 参数中均为假变量 -->
        <span>{{ scope.row.author }}</span>
      </template>
    </el-table-column>
    <!-- 具体的收费细则 -->
    <el-table-column width="110px" align="center" label="5月读数">
      <template slot-scope="scope">
        <!-- 参数中均为假变量 -->
        <span>{{ scope.row.author }}</span>
      </template>
    </el-table-column>

    <!-- 具体的收费细则 -->
    <el-table-column width="110px" align="center" label="5月用量">
      <template slot-scope="scope">
        <!-- 参数中均为假变量 -->
        <span>{{ scope.row.author }}</span>
      </template>
    </el-table-column>

    <!-- 具体的收费细则 -->
    <el-table-column width="110px" align="center" label="5月应收">
      <template slot-scope="scope">
        <!-- 参数中均为假变量 -->
        <span>{{ scope.row.author }}</span>
      </template>
    </el-table-column>

    <!-- 原本为Importance -->
    <el-table-column width="120px" label="1月应收">
      <template slot-scope="scope">
        <svg-icon v-for="n in +scope.row.importance" :key="n" icon-class="star" />
      </template>
    </el-table-column>

    <el-table-column align="center" label="Readings" width="95">
      <template slot-scope="scope">
        <span>{{ scope.row.pageviews }}</span>
      </template>
    </el-table-column>

    <el-table-column class-name="status-col" label="Status" width="110">
      <template slot-scope="{row}">
        <el-tag :type="row.status | statusFilter">
          {{ row.status }}
        </el-tag>
      </template>
    </el-table-column>
  </el-table>
</template>

<script>
import { fetchList } from '@/api/article'

export default {
  filters: {
    statusFilter(status) {
      const statusMap = {
        published: 'success',
        draft: 'info',
        deleted: 'danger'
      }
      return statusMap[status]
    }
  },
  props: {
    type: {
      type: String,
      default: 'CN'
    }
  },
  data() {
    return {
      list: null,
      listQuery: {
        page: 1,
        limit: 5,
        type: this.type,
        sort: '+id'
      },
      loading: false
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.loading = true
      this.$emit('create') // for test
      fetchList(this.listQuery).then(response => {
        this.list = response.data.items
        this.loading = false
      })
    }
  }
}
</script>


<template>
  <div class="app-container">
    <!-- 上方固定标题栏 -->
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

    <!-- 导入复杂表格栏 -->
    <div class="filter-container">
      <el-input v-model="listQuery.title" placeholder="Title" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-select v-model="listQuery.importance" placeholder="Imp" clearable style="width: 90px" class="filter-item">
        <el-option v-for="item in importanceOptions" :key="item" :label="item" :value="item" />
      </el-select>
      <el-select v-model="listQuery.type" placeholder="Type" clearable class="filter-item" style="width: 130px">
        <el-option v-for="item in calendarTypeOptions" :key="item.key" :label="item.display_name+'('+item.key+')'" :value="item.key" />
      </el-select>
      <el-select v-model="listQuery.sort" style="width: 140px" class="filter-item" @change="handleFilter">
        <el-option v-for="item in sortOptions" :key="item.key" :label="item.label" :value="item.key" />
      </el-select>
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
        Search
      </el-button>
      <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit" @click="handleCreate">
        Add
      </el-button>
      <el-button v-waves :loading="downloadLoading" class="filter-item" type="primary" icon="el-icon-download" @click="handleDownload">
        Export
      </el-button>
      <el-checkbox v-model="showReviewer" class="filter-item" style="margin-left:15px;" @change="tableKey=tableKey+1">
        reviewer
      </el-checkbox>
    </div>

    <el-table
      :key="tableKey"
      v-loading="listLoading"
      :data="list"
      border
      fit
      highlight-current-row
      style="width: 100%;"
      @sort-change="sortChange"
    >
      <el-table-column label="序号" prop="id" sortable="custom" align="center" width="80" :class-name="getSortClass('id')">
        <template slot-scope="{row}">
          <span>{{ row.id }}</span>
        </template>
      </el-table-column>
      <el-table-column label="日期" width="150px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.timestamp | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="具体信息" min-width="150px">
        <template slot-scope="{row}">
          <span class="link-type" @click="handleUpdate(row)">{{ row.title }}</span>
          <el-tag>{{ row.type | typeFilter }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="姓名" width="110px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.author }}</span>
        </template>
      </el-table-column>
      <el-table-column v-if="showReviewer" label="Reviewer" width="110px" align="center">
        <template slot-scope="{row}">
          <span style="color:red;">{{ row.reviewer }}</span>
        </template>
      </el-table-column>
      <el-table-column label="Imp" width="80px">
        <template slot-scope="{row}">
          <svg-icon v-for="n in + row.importance" :key="n" icon-class="star" class="meta-item__icon" />
        </template>
      </el-table-column>
      <el-table-column label="Readings" align="center" width="95">
        <template slot-scope="{row}">
          <span v-if="row.pageviews" class="link-type" @click="handleFetchPv(row.pageviews)">{{ row.pageviews }}</span>
          <span v-else>0</span>
        </template>
      </el-table-column>
      <el-table-column label="Status" class-name="status-col" width="100">
        <template slot-scope="{row}">
          <el-tag :type="row.status | statusFilter">
            {{ row.status }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="Actions" align="center" width="230" class-name="small-padding fixed-width">
        <template slot-scope="{row}">
          <el-button type="primary" size="mini" @click="handleUpdate(row)">
            编辑
            <!-- Edit -->
          </el-button>
          <el-button v-if="row.status!='published'" size="mini" type="success" @click="handleModifyStatus(row,'published')">
            发布
            <!-- Publish -->
          </el-button>
          <el-button v-if="row.status!='draft'" size="mini" @click="handleModifyStatus(row,'draft')">
            草稿
            <!-- Draft -->
          </el-button>
          <el-button v-if="row.status!='deleted'" size="mini" type="danger" @click="handleModifyStatus(row,'deleted')">
            删除
            <!-- Delete -->
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form ref="dataForm" :rules="rules" :model="temp" label-position="left" label-width="70px" style="width: 400px; margin-left:50px;">
        <el-form-item label="Type" prop="type">
          <el-select v-model="temp.type" class="filter-item" placeholder="Please select">
            <el-option v-for="item in calendarTypeOptions" :key="item.key" :label="item.display_name" :value="item.key" />
          </el-select>
        </el-form-item>
        <el-form-item label="Date" prop="timestamp">
          <el-date-picker v-model="temp.timestamp" type="datetime" placeholder="Please pick a date" />
        </el-form-item>
        <el-form-item label="Title" prop="title">
          <el-input v-model="temp.title" />
        </el-form-item>
        <el-form-item label="Status">
          <el-select v-model="temp.status" class="filter-item" placeholder="Please select">
            <el-option v-for="item in statusOptions" :key="item" :label="item" :value="item" />
          </el-select>
        </el-form-item>
        <el-form-item label="Imp">
          <el-rate v-model="temp.importance" :colors="['#99A9BF', '#F7BA2A', '#FF9900']" :max="3" style="margin-top:8px;" />
        </el-form-item>
        <el-form-item label="Remark">
          <el-input v-model="temp.remark" :autosize="{ minRows: 2, maxRows: 4}" type="textarea" placeholder="Please input" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">
          Cancel
        </el-button>
        <el-button type="primary" @click="dialogStatus==='create'?createData():updateData()">
          Confirm
        </el-button>
      </div>
    </el-dialog>

    <el-dialog :visible.sync="dialogPvVisible" title="Reading statistics">
      <el-table :data="pvData" border fit highlight-current-row style="width: 100%">
        <el-table-column prop="key" label="Channel" />
        <el-table-column prop="pv" label="Pv" />
      </el-table>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogPvVisible = false">Confirm</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { fetchList, fetchPv, createArticle, updateArticle } from '@/api/article'
import waves from '@/directive/waves' // waves directive
import { parseTime } from '@/utils'
import Pagination from '@/components/Pagination' // secondary package based on el-pagination
import tabPane from '@/views/tab/components/TabPane'

const calendarTypeOptions = [
  { key: 'CN', display_name: '物业' },
  { key: 'US', display_name: '财务' },
  { key: 'JP', display_name: '尚郡' },
  { key: 'EU', display_name: '壹号院' }
]

// arr to obj, such as { CN : "China", US : "USA" }
const calendarTypeKeyValue = calendarTypeOptions.reduce((acc, cur) => {
  acc[cur.key] = cur.display_name
  return acc
}, {})

export default {
  name: 'ComplexTable',
  components: { Pagination,
    // eslint-disable-next-line vue/no-unused-components
    tabPane
  },
  directives: { waves },
  filters: {
    statusFilter(status) {
      const statusMap = {
        published: 'success',
        draft: 'info',
        deleted: 'danger'
      }
      return statusMap[status]
    },
    typeFilter(type) {
      return calendarTypeKeyValue[type]
    }
  },
  data() {
    return {
      tableKey: 0,
      list: null,
      total: 0,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 20,
        importance: undefined,
        title: undefined,
        type: undefined,
        sort: '+id',
        // 定义上方年份选择框
        tabMapOptions: [
          { label: '汇总', key: 'all' },
          { label: '2020', key: '2020' },
          { label: '2019', key: '2019' },
          { label: '2018', key: '2018' },
          { label: '2017', key: '2017' },
          { label: '2016', key: '2016' },
          { label: '2015', key: '2015' }
        ],
        activeName: 'CN',
        createdTimes: 0
      },
      watch: {
        activeName(val) {
          this.$router.push(`${this.$route.path}?tab=${val}`)
        }
      },
      created() {
      // init the default selected tab
        const tab = this.$route.query.tab
        if (tab) {
          this.activeName = tab
        }
      },
      importanceOptions: [1, 2, 3],
      calendarTypeOptions,
      sortOptions: [{ label: 'ID Ascending', key: '+id' }, { label: 'ID Descending', key: '-id' }],
      statusOptions: ['published', 'draft', 'deleted'],
      showReviewer: false,
      temp: {
        id: undefined,
        importance: 1,
        remark: '',
        timestamp: new Date(),
        title: '',
        type: '',
        status: 'published'
      },
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: 'Edit',
        create: 'Create'
      },
      dialogPvVisible: false,
      pvData: [],
      rules: {
        type: [{ required: true, message: 'type is required', trigger: 'change' }],
        timestamp: [{ type: 'date', required: true, message: 'timestamp is required', trigger: 'change' }],
        title: [{ required: true, message: 'title is required', trigger: 'blur' }]
      },
      downloadLoading: false
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.listLoading = true
      fetchList(this.listQuery).then(response => {
        this.list = response.data.items
        this.total = response.data.total

        // Just to simulate the time of the request
        setTimeout(() => {
          this.listLoading = false
        }, 1.5 * 1000)
      })
    },
    handleFilter() {
      this.listQuery.page = 1
      this.getList()
    },
    handleModifyStatus(row, status) {
      this.$message({
        message: '操作Success',
        type: 'success'
      })
      row.status = status
    },
    sortChange(data) {
      const { prop, order } = data
      if (prop === 'id') {
        this.sortByID(order)
      }
    },
    sortByID(order) {
      if (order === 'ascending') {
        this.listQuery.sort = '+id'
      } else {
        this.listQuery.sort = '-id'
      }
      this.handleFilter()
    },
    resetTemp() {
      this.temp = {
        id: undefined,
        importance: 1,
        remark: '',
        timestamp: new Date(),
        title: '',
        status: 'published',
        type: ''
      }
    },
    handleCreate() {
      this.resetTemp()
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    createData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          this.temp.id = parseInt(Math.random() * 100) + 1024 // mock a id
          this.temp.author = 'vue-element-admin'
          createArticle(this.temp).then(() => {
            this.list.unshift(this.temp)
            this.dialogFormVisible = false
            this.$notify({
              title: 'Success',
              message: 'Created Successfully',
              type: 'success',
              duration: 2000
            })
          })
        }
      })
    },
    handleUpdate(row) {
      this.temp = Object.assign({}, row) // copy obj
      this.temp.timestamp = new Date(this.temp.timestamp)
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    updateData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          const tempData = Object.assign({}, this.temp)
          tempData.timestamp = +new Date(tempData.timestamp) // change Thu Nov 30 2017 16:41:05 GMT+0800 (CST) to 1512031311464
          updateArticle(tempData).then(() => {
            for (const v of this.list) {
              if (v.id === this.temp.id) {
                const index = this.list.indexOf(v)
                this.list.splice(index, 1, this.temp)
                break
              }
            }
            this.dialogFormVisible = false
            this.$notify({
              title: 'Success',
              message: 'Update Successfully',
              type: 'success',
              duration: 2000
            })
          })
        }
      })
    },
    handleDelete(row) {
      this.$notify({
        title: 'Success',
        message: 'Delete Successfully',
        type: 'success',
        duration: 2000
      })
      const index = this.list.indexOf(row)
      this.list.splice(index, 1)
    },
    handleFetchPv(pv) {
      fetchPv(pv).then(response => {
        this.pvData = response.data.pvData
        this.dialogPvVisible = true
      })
    },
    handleDownload() {
      this.downloadLoading = true
      import('@/vendor/Export2Excel').then(excel => {
        const tHeader = ['timestamp', 'title', 'type', 'importance', 'status']
        const filterVal = ['timestamp', 'title', 'type', 'importance', 'status']
        const data = this.formatJson(filterVal, this.list)
        excel.export_json_to_excel({
          header: tHeader,
          data,
          filename: 'table-list'
        })
        this.downloadLoading = false
      })
    },
    formatJson(filterVal, jsonData) {
      return jsonData.map(v => filterVal.map(j => {
        if (j === 'timestamp') {
          return parseTime(v[j])
        } else {
          return v[j]
        }
      }))
    },
    getSortClass: function(key) {
      const sort = this.listQuery.sort
      return sort === `+${key}`
        ? 'ascending'
        : sort === `-${key}`
          ? 'descending'
          : ''
    }
  }
}
</script>

<template>
  <!-- 操作记录 > 抄表记录 -->
  <div class="electric-record">
    <div class="top-handle">
      <!-- <el-input
        v-model="formData.houseId"
        clearable
        class="short"
        placeholder="房间号"
      ></el-input>
      <el-input
        v-model="formData.houseName"
        clearable
        class="short"
        placeholder="业主姓名"
      ></el-input> -->
      <el-date-picker
        v-model="formData.month"
        type="month"
        placeholder="选择月"
        value-format="yyyy-MM"
        clearable
      >
      </el-date-picker>
      <el-button type="primary" @click="getList" icon="el-icon-search"
        >搜索</el-button
      >
    </div>
    <!-- 表格导出区域 -->
    <div>
      <FilenameOption v-model="filename" />
      <el-button
        :loading="downloading"
        style="margin:0 0 20px 20px;"
        type="primary"
        icon="el-icon-document"
        @click="handleDownload"
      >
        导出Excel
      </el-button>
    </div>
    <el-table
      v-loading="tableLoading"
      :data="tableData"
      :border="true"
      style="width:100%"
      fit
      height="800px"
    >
      <el-table-column
        v-for="(item, i) of tableCol"
        :key="i"
        :label="item.label"
        :prop="item.prop"
        align="center"
      ></el-table-column>
    </el-table>
  </div>
</template>

<script>
import { electricExportsSearchall } from '@/api/operationLog'
import FilenameOption from '@/views/excel/components/FilenameOption'
export default {
  components: {
    FilenameOption
  },
  data() {
    return {
      tableLoading: false, //表格加载中
      downloading: false, //下载中
      filename: '', //导出文件的名称
      /* 请求的表单数据 */
      formData: {
        // houseId: '', //房间号
        // houseName: '', //业主姓名
        month: '' //月份
      },
      tableData: [],
      tableCol: [
        {
          label: 'ID',
          prop: 'id'
        },
        {
          label: '房号',
          prop: 'houseId'
        },
        {
          label: '房间状态',
          prop: 'saleStatus'
        },
        {
          label: '房间类型',
          prop: 'houseAttribute'
        },
        {
          label: '业主姓名',
          prop: 'userName'
        },
        {
          label: '业主手机号',
          prop: 'userPhone'
        },
        {
          label: '电表号',
          prop: 'electricMeterId'
        },
        {
          label: '月份',
          prop: 'month'
        },
        {
          label: '首次购电日期',
          prop: 'firstDate'
        },
        {
          label: '上月抄表日期',
          prop: 'watchStartTime'
        },
        {
          label: '上月用电量',
          prop: 'thisMonth'
        },
        {
          label: '本月抄表日期',
          prop: 'endTime'
        },
        {
          label: '本月用电量',
          prop: 'lastMonth'
        },
        {
          label: '差值',
          prop: 'difference'
        },
        {
          label: '用电次数',
          prop: 'electricNum'
        },
        {
          label: '总用电金额',
          prop: 'electricMoney'
        },
        {
          label: '剩余金额',
          prop: 'electricSurMoney'
        },
        {
          label: '总用电量',
          prop: 'electricTotal'
        },
        {
          label: '备注',
          prop: 'remark'
        }
      ]
    }
  },
  mounted() {
    this.getList()
  },
  methods: {
    // excel导出
    handleDownload() {
      this.downloading = true
      import('@/vendor/Export2Excel').then(excel => {
        const tHeader = [
          'Id',
          '房号',
          '房间状态',
          '房间类型',
          '业主姓名',
          '业主手机号',
          '电表号',
          '月份',
          '首次购电日期',
          '上月抄表日期',
          '上月用电量',
          '本月抄表日期',
          '本月用电量',
          '差值',
          '用电次数',
          '总用电金额',
          '剩余金额',
          '总用电量',
          '备注'
        ]
        const filterVal = [
          'id',
          'houseId',
          'saleStatus',
          'houseAttribute',
          'userName',
          'userPhone',
          'electricMeterId',
          'month',
          'firstDate',
          'watchStartTime',
          'thisMonth',
          'endTime',
          'lastMonth',
          'difference',
          'electricNum',
          'electricMoney',
          'electricSurMoney',
          'electricTotal',
          'remark'
        ]
        const list = this.tableData
        console.log(list)
        const data = this.formatJson(filterVal, list)
        console.log(data)
        excel.export_json_to_excel({
          header: tHeader,
          data,
          filename: this.filename,
          autoWidth: this.autoWidth,
          bookType: this.bookType
        })
        this.downloading = false
      })
    },
    formatJson(filterVal, jsonData) {
      return jsonData.map(v =>
        filterVal.map(j => {
          if (j === 'timestamp') {
            return parseTime(v[j])
          } else {
            return v[j]
          }
        })
      )
    },
    /* 获取table数据 */
    getList() {
      this.tableLoading = true
      electricExportsSearchall(this.formData)
        .then(res => {
          this.tableLoading = false
          console.log(res)
          if (res.code === 200) {
            this.tableData = res.data
          }
        })
        .catch(err => {
          console.log(err)
          this.tableLoading = false
        })
    }
  }
}
</script>

<style lang="scss">
.electric-record {
  padding: 15px;
  .top-handle {
    display: flex;
    align-items: center;
    margin-bottom: 15px;
  }
  .short {
    width: 200px;
  }
}
</style>

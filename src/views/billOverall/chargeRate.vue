<template>
  <div class="app-container">
    <div class="filter-container" v-if="pathname==='/chargeRateProperty/house'||pathname==='/chargeRateProperty/shop'">
      <el-date-picker
        v-model="listQuery_search.dateRange"
        type="month"
        class="filter-item"
        value-format="yyyy-MM"
        placeholder="选择月份"
      ></el-date-picker>
      <el-button class="filter-item" type="primary" icon="el-icon-search" @click="getList">搜索</el-button>
    </div>
    <!-- excel导出功能 -->
    <div>
      <FilenameOption v-model="filename" />
      <el-button
        :loading="downloadLoading"
        style="margin:0 0 20px 20px;"
        type="primary"
        icon="el-icon-document"
        @click="handleDownload"
      >导出Excel</el-button>
    </div>
    <!-- 动态加载表头以及内容 -->
    <el-table
      v-loading="listLoading"
      highlight-current-row
      stripe
      border
      fit
      :data="tableData"
      style="width: 100%"
      align="center"
      height="800"
    >
      <el-table-column
        v-for="(item,key) in titles"
        :key="key"
        :prop="item.value"
        :label="item.name"
        align="center"
      >
        <el-table-column
          v-for="(child,k) in item.children"
          :key="k"
          :prop="child.value"
          :label="child.name"
          align="center"
        ></el-table-column>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import { chargeRate } from "@/api/chargeRate";
import { parseTime } from "@/utils";
import FilenameOption from "@/views/excel/components/FilenameOption";

export default {
  components: { FilenameOption },
  data() {
    return {
      filename: "",
      downloadLoading: false,
      listLoading: false,
      listQuery_search: {
        dateRange:
          this.$route.name.indexOf("chargeRateProperty") != -1
            ? parseTime(new Date(), "{y}-{m}")
            : null,
      },
      tableData: [],
      titles: [],
      pathname: "",
    };
  },
  created() {
    this.pathname = this.$route.name;
    this.getList();
  },
  methods: {
    getList() {
      this.listLoading = true;
      chargeRate(this.listQuery_search, this.pathname)
        .then((res) => {
          this.listLoading = false;
          if (res.code == 200) {
            this.tableData = res.items;
            this.titles = res.titles;
          }
        })
        .catch((err) => {
          this.listLoading = false;
        });
    },
    handleDownload() {
      this.downloadLoading = true;
      import("@/vendor/Export2Excel").then((excel) => {
        const multiHeader = [this.getFirstRow(this.titles)]; // 前一行的表头数据，二维数组，不够的用空白补全
        const tHeader = this.getSecondRow(this.titles);

        const filterVal = this.getFilterVal(this.titles);
        const list = this.tableData;
        const merges = [
          "A1:A2",
          ...this.getMerges(this.getFirstRow(this.titles)),
        ];//合并单元格
        const data = this.formatJson(filterVal, list);
        excel.export_json_to_excel({
          multiHeader,
          header: tHeader,
          merges,
          data,
          filename: this.filename,
        });
        this.downloadLoading = false;
      });
    },
    formatJson(filterVal, jsonData) {
      return jsonData.map((v) =>
        filterVal.map((j) => {
          return v[j];
        })
      );
    },
    number2Char(n) {
      var ordA = "A".charCodeAt(0);
      var ordZ = "Z".charCodeAt(0);
      var len = ordZ - ordA + 1;
      var s = "";
      while (n >= 0) {
        s = String.fromCharCode((n % len) + ordA) + s;
        n = Math.floor(n / len) - 1;
      }
      return s;
    },
    number2Number(num) {
      return num + 1;
    },
    getFirstRow(titles) {
      console.log(titles);
      let titlesArray = [];
      titles.forEach((item) => {
        if (item.children) {
          item.children.forEach((child, index) => {
            if (index == 0) {
              titlesArray.push(item.name);
            } else {
              titlesArray.push("");
            }
          });
        } else {
          titlesArray.push(item.name);
        }
      });
      return titlesArray;
    },
    getSecondRow(titles) {
      let titlesArray = [];
      titles.forEach((item) => {
        if (item.children) {
          item.children.forEach((child, index) => {
            titlesArray.push(child.name);
          });
        } else {
          titlesArray.push("");
        }
      });
      return titlesArray;
    },
    getFilterVal(titles) {
      let filterArray = [];
      titles.forEach((item) => {
        if (item.children) {
          item.children.forEach((child) => {
            filterArray.push(child.value);
          });
        } else {
          filterArray.push(item.value);
        }
      });
      return filterArray;
    },
    getMerges(tit) {
      var titArr = [];
      tit.forEach((item, index) => {
        if (item === "" && tit[index - 1] !== "") {
          titArr.push(this.number2Char(index - 1));
        }
        if (item === "" && tit[index + 1] !== "") {
          titArr.push(this.number2Char(index));
        }
      });
      var finallyArr = [];
      titArr.forEach((item, index) => {
        if (index % 2 === 0) {
          finallyArr.push(`${item}1:${titArr[index + 1]}1`);
        }
      });
      return finallyArr;
    },
  },
};
</script>

<style>
</style>

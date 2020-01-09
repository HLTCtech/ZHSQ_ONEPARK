<template>
  <div class="app-container">
    <div class="filter-container">
      <el-checkbox-group v-model="checkboxVal">
        <el-checkbox label="apple">
          apple
        </el-checkbox>
        <el-checkbox label="banana">
          banana
        </el-checkbox>
        <el-checkbox label="orange">
          orange
        </el-checkbox>
        <el-checkbox label="orange1">
          orange1
        </el-checkbox>
        <el-checkbox label="orange2">
          orange2
        </el-checkbox>
        <el-checkbox label="orange3">
          orange3
        </el-checkbox>
        <el-checkbox label="orange4">
          orange4
        </el-checkbox>
        <el-checkbox label="orange5">
          orange5
        </el-checkbox>
      </el-checkbox-group>
    </div>

    <el-table :key="key" :data="tableData" border fit highlight-current-row style="width: 100%">
      <el-table-column prop="name" label="fruitName" width="180" />
      <el-table-column v-for="fruit in formThead" :key="fruit" :label="fruit">
        <template slot-scope="scope">
          {{ scope.row[fruit] }}
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
const defaultFormThead = ['apple', 'banana']

export default {
  data() {
    return {
      tableData: [
        {
          name: 'fruit-1',
          apple: 'apple-10',
          banana: 'banana-10',
          orange: 'orange-10',
          orange1: 'orange-10',
          orange2: 'orange-10',
          orange3: 'orange-10',
          orange4: 'orange-10',
          orange5: 'orange-10'
        },
        {
          name: 'fruit-2',
          apple: 'apple-20',
          banana: 'banana-20',
          orange: 'orange-20',
          orange1: 'orange-10',
          orange2: 'orange-10',
          orange3: 'orange-10',
          orange4: 'orange-10',
          orange5: 'orange-10'
        }
      ],
      key: 1, // table key
      formTheadOptions: ['apple', 'banana', 'orange', 'orange1', 'orange2', 'orange3', 'orange4', 'orange5'],
      checkboxVal: defaultFormThead, // checkboxVal
      formThead: defaultFormThead // 默认表头 Default header
    }
  },
  watch: {
    checkboxVal(valArr) {
      this.formThead = this.formTheadOptions.filter(i => valArr.indexOf(i) >= 0)
      this.key = this.key + 1// 为了保证table 每次都会重渲 In order to ensure the table will be re-rendered each time
    }
  }
}
</script>


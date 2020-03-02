<template>
  <div style="display:inline-block;">
    <!-- <el-tag type:success style="padding-left:0; margin:0 0 20px 20px;" >导出的excel文件名：</el-tag> -->
    <el-input v-model="filename" placeholder="请输入导出Excel的文件名(默认excel-list)" style="width:330px;" prefix-icon="el-icon-document" />
  </div>
</template>

<script>
export default {
  props: {
    value: {
      type: String,
      default: ''
    }
  },
  computed: {
    filename: {
      get() {
        return this.value
      },
      set(val) {
        this.$emit('input', val)
      }
    }
  }
}
</script>

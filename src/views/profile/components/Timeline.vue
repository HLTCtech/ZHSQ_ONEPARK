<template>
  <div class="block">
    <el-timeline>
      <el-timeline-item v-for="(item,index) of logData" :key="index" :timestamp="item.timestamp" placement="top">
        <el-card>
          <h4>{{ item.title }}</h4>
          <p>{{ item.content }}</p>
        </el-card>
      </el-timeline-item>
    </el-timeline>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { getUserLog } from '@/api/user'
export default {
  data() {
    return {
      logData: [],
      adminId: this.$store.getters.adminId
    }
  },
  computed: {
    ...mapGetters([
      'adminName',
      'adminId',
      'roles'
    ])
  },
  created() {
    this.getList()
  },
  methods: {
    // 获取表格数据
    getList() {
      getUserLog(this.adminId).then(response => {
        this.logData = response.data.items
      })
    }
  }
}
</script>

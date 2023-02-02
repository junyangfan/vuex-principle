<template>
   <div>
      <!-- vuex 把状态放到一个公共的地方，哪个组件使用，就直接可以从公共的地方获取状态 -->
      {{this.$store.state.name}}
      <!-- 打印出 Fan -->
      {{this.$store.getters.myName}}
      <!-- 打印出 FanJun -->
      <hr> {{this.$store.state.age}}
      <!-- 同步加 -->
      <button @click="add">Add</button>
      <!-- 异步减 -->
      <button @click="sub">Async Sub</button>
   </div>
</template>
<script>
export default {
  name: "app",
  mounted() {
    // console.log(this.$store);
    // 是异步的
    setTimeout(() => {
      this.$store.state.age = 666;
    }, 1000);
    // 是同步的
    console.log(this.$store.state);
  },
  methods: {
    add() {
      //commit一个mutations
      this.$store.commit("add", 10);
    },
    sub(){
      this.$store.dispatch("asyncSub",10)
    }
  }
};
</script>
<style scoped>
</style>

<template>
  <div class="app-container">
    <div class="pkm-search" ref="search">
      <div class="pkm-logo">PKM</div>
      <div class="pkm-input">
        <el-input placeholder="请输入关键词进行搜索" v-model="search" prefix-icon="el-icon-search" @change="doSearch"></el-input>
      </div>
    </div>
  </div>
</template>

<script>
import Util from "@/util";
export default {
  name: 'knowledgeSearch',
  data(){
    return {
      search: null
    }
  },
  methods: {
    doSearch(){
      let $search = this.$refs['search']
      Util.addClass($search, 'search-result')
    }
  },
}
</script>

<style scoped lang="scss">
.pkm-search{
  margin-top: 60px;
  margin-left: auto;
  margin-right: auto;
  position: relative;
  height: 233px;
  transition: all .5s;
  .pkm-logo{
    font-size: 50px;
    color: blueviolet;
    font-weight: bold;
    line-height: 90px;
    padding-top: 50px;
    text-align: center;
  }
  .pkm-input{
    height: 44px;
    line-height: 44px;
    width: 500px;
    margin: 0 auto;
    input{
      display: flex;
      flex: 1;
    }
  }
}
.search-result{
  position: fixed;
  top: 85px;
  height: 44px;
  margin: 0;
  .pkm-logo{
    display:none;
  }
}
</style>


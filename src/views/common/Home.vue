<template>
    <div class="wrapper">
        <div class="content-box" :class="{'content-collapse':collapse}">
            <div class="content">
                <transition name="fade-transform" mode="out-in">
                    <keep-alive :include="tagsList">
                        <router-view></router-view>
                    </keep-alive>
                </transition>
            </div>
        </div>
    </div>
</template>

<script>
    import {mapState} from 'vuex'
    export default {
        data(){
            return {
            }
        },
        computed: {
            ...mapState('common',['collapse', 'tagsList', 'currentTag']),
        },
        mounted () {

        },
        beforeDestory(){

        },
        methods: {
        }
    }
</script>

<style scoped>
    .table{
        min-height: 100%;
    }
</style>

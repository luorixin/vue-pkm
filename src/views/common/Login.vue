<template>
    <div class="login-wrap">
        <div class="ms-login">
            <div class="ms-title">个人知识库管理系统</div>
            <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="0px" class="ms-content">
                <el-form-item prop="name">
                    <el-input v-model="ruleForm.name" placeholder="name" ref="name">
                        <el-button slot="prepend" icon="el-icon-lx-people"></el-button>
                    </el-input>
                </el-form-item>
                <el-form-item prop="password">
                    <el-input type="password" placeholder="password" ref="password" v-model="ruleForm.password" @keyup.enter.native="submitForm('ruleForm')">
                        <el-button slot="prepend" icon="el-icon-lx-lock"></el-button>
                    </el-input>
                </el-form-item>
                <div class="login-btn">
                    <el-button :loading="loading" type="primary" @click.native.prevent="submitForm">登录</el-button>
                </div>
            </el-form>
        </div>
    </div>
</template>

<script>
    import Util from '@/util';
    export default {
        data: function(){
            return {
                ruleForm: {
                    name: 'luorixin',
                    password: '123456'
                },
                rules: {
                    name: [
                        { required: true, message: '请输入用户名', trigger: 'blur' }
                    ],
                    password: [
                        { required: true, message: '请输入密码', trigger: 'blur' }
                    ]
                },
                loading: false,
                redirect: undefined
            }
        },
        watch: {
            $route: {
                handler: function(route) {
                    this.redirect = route.query && route.query.redirect
                },
                immediate: true
            }
        },
        mounted() {
            if (this.ruleForm.name === '') {
                this.$refs.name.focus()
            } else if (this.ruleForm.password === '') {
                this.$refs.password.focus()
            }
        },
        methods: {
            submitForm() {
                this.$refs['ruleForm'].validate((valid) => {
                    if (valid) {
                        this.loading = true
                        this.$store.dispatch('user/login', this.ruleForm)
                        .then(() => {
                            this.$router.push({ path: this.redirect || '/' })
                            this.loading = false
                        })
                        .catch((error) => {
                            Util.errorProcessor(this, error);
                            this.loading = false
                        })
                        // localStorage.setItem('ms_name',this.ruleForm.name);
                        // this.$cookie.set('token', 'eyJhbGciOiJIUzUxMiJ9.eyJhdXRob3JpdGllcyI6ImJhY2stcXVhbGl0eS1jaGVja2dvb2RzLWxpc3Rnb29kcy1jYXJlLWxpc3RzZWxsX2xpc3Rnb29kcy1wcmljZXNlbGwtcXVhbGl0eS1yZXZpZXdiYXNpY19kYXRhX2J1eWVyaW4tcXVhbGl0eS1jaGVja291dC1vcmRlci1saXN0YmFzaWNfZGF0YV9zdXBwbGllcmJ1eV9vcmRlcnNlbGwtYmFjay1hcHBseS1jaGVja3NlbGwtc2FsZS1yZXZpZXdnb29kcy1icmFuZHNlbGxfY3VzdG9tZXJfbGlzdGFubm91bmNlbWVudG91dC1jaGVja2Jhc2ljX2RhdGFfc2FsZWhvbWUtYmFubmVyc3RvcmVfbm93YnV5X29yZGVyX3Jldmlld2Jhc2ljX2RhdGFfc2hpcGluZGV4c2VsbF9vcmRlcmJ1eV9yZWNlaXZlaW52ZW50b3J5LWxpc3RvdXQtcmV2aWV3LW5leHRjaGFuZ2UtcmVwZXJ0b3J5LWluZGV4c2VsbC1iYWNrLXF1YWxpdHktY2hlY2tpbnZlbnRvcnktYWRkYmFjay1hcHBseS1jaGVja2JhY2stYXBwbHlzZWxsLWJhY2stZmluYWwtY2hlY2tiYXNpY19kYXRhX2ZhY3Rvcnl3aF9zZXR0aW5nYmFzaWNfZGF0YV9jdXN0b21lcmluLW1ha2ViYXNpY19kYXRhX2JpbGxib2FyZHNlbGwtYmFjay1hcHBseXN5c3RlbS1jb25maWdiYWNrLWZpbmFsLWNoZWNrZmluYW5jaWFsLXByZS1wYWlkaW4tY2hlY2tmaW5hbmNpYWwtZmxvd291dC1yZXZpZXdjb21wYW55c2VsbC1iYWNrLXJlY2VpdmViYXNpY19kYXRhX2ZpbGVhY2Nlc3NfaW5kZXhnb29kcy1jYXRlZ29yeWdvb2RzLXNwZWNzZWxsUmVwb3J0c2VsbF9nb29kc19saXN0ZmluYW5jaWFsLXByZS1yZWNlaXZlaW4tb3JkZXItbGlzdGdvb2RzLWF0dHJpYnV0ZWJyb2tlbi1vdXQtaW5kZXhhZGRfdXNlciIsInVzZXIiOiJ7XCJhdmF0YXJVcmxcIjpcImh0dHBzOi8veWliYW5lcnAub3NzLWNuLXNoYW5naGFpLmFsaXl1bmNzLmNvbS82LzIxLzIwMTgwNjE5XzlWNWZmSzN1SzFvN2daY1NWNDJBLmpwZ1wiLFwiY29tcGFueUlkXCI6NixcImNyZWF0ZWRUaW1lXCI6MTUyMzc1MjkxODAwMCxcImlkXCI6MjEsXCJpZGNhcmRcIjpcIjQ1MDkwMjE5ODgxMDE2MjU5WFwiLFwibGFzdExvZ2luVGltZVwiOjE1NTQ5Mjg4OTgwMDAsXCJtb2JpbGVcIjpcIjEzOTE4MDcxMTAwXCIsXCJuaWNrbmFtZVwiOlwidGVzdFwiLFwicGhvbmVcIjpcIjAyMS00NTQ1NDU0NVwiLFwicmVhbG5hbWVcIjpcIumUgOS4u-euoVwiLFwic3RhdHVzXCI6MSxcInVwZGF0ZWRUaW1lXCI6MTUyOTQxNzgwMzAwMH0iLCJleHAiOjE1NTYwMjYyMDJ9.7zOHa5FixBCKChi4mnyGmmK3H7aRVmzbILYd3hMJxzW15HwthtDCtbpFjMW02O8CQbARoWZ3PosHuHzirLC-hA')
                        // this.$router.push('/');
                    } else {
                        return false;
                    }
                });
            }
        }
    }
</script>

<style scoped>
    .login-wrap{
        position: relative;
        width:100%;
        height:100%;
        background-image: url(../../assets/img/login-bg.jpg);
        background-size: 100%;
    }
    .ms-title{
        width:100%;
        line-height: 50px;
        text-align: center;
        font-size:20px;
        color: #333;
        border-bottom: 1px solid #ddd;
    }
    .ms-login{
        position: absolute;
        left:50%;
        top:50%;
        width:350px;
        margin:-190px 0 0 -175px;
        border-radius: 5px;
        background: rgba(255,255,255, 0.3);
        overflow: hidden;
    }
    .ms-content{
        padding: 30px 30px;
    }
    .login-btn{
        text-align: center;
    }
    .login-btn button{
        width:100%;
        height:36px;
        margin-bottom: 10px;
    }
    .login-tips{
        font-size:12px;
        line-height:30px;
        color:#fff;
    }
</style>
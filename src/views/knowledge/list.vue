<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="listQuery.name" placeholder="请输入文档名称" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" clearable/>
      <el-select v-model="listQuery.type" placeholder="请选择文档类型" clearable class="filter-item" style="width: 150px" @change="handleFilter">
        <el-option v-for="item in fileTypes" :key="item.value" :label="item.label" :value="item.value" />
      </el-select>
      <el-select v-model="listQuery.status" placeholder="状态" class="filter-item" @change="handleFilter" clearable>
        <el-option v-for="item in fileStatus" :key="item.value" :label="item.label" :value="item.value" />
      </el-select>
      <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
        查询
      </el-button>
      <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit" @click="handleCreate">
        添加
      </el-button>
    </div>

    <el-table
      v-loading="loading"
      :data="dataList"
      border
      fit
      highlight-current-row
      style="width: 100%;"
    >
      <el-table-column label="ID" prop="id" align="center" width="80">
        <template slot-scope="scope">
          <span>{{ scope.row.id }}</span>
        </template>
      </el-table-column>
      <el-table-column label="文档名称" prop="name" min-width="150px"></el-table-column>
      <el-table-column label="文档类型" prop="type" :formatter="typeFormatter" width="110px" align="center"></el-table-column>
      <el-table-column label="文档状态" prop="status" width="80px">
        <template slot-scope="scope">
          <el-tag :type="statusFormatter(scope.row,null,scope.row.status).type">
            {{statusFormatter(scope.row,null,scope.row.status).label}}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="创建时间" prop="createdAt" width="120px"></el-table-column>
      <el-table-column label="修改时间" prop="updatedAt" width="120px"></el-table-column>
      <el-table-column label="存放位置" prop="position" :show-overflow-tooltip="true" width="250px"></el-table-column>
      <el-table-column label="操作" align="center" width="150px" fixed="right">
        <template slot-scope="{row}">
          <el-button type="text" icon="el-icon-edit" size="mini" @click="handleEdit(row)">
            编辑
          </el-button>
          <el-button type="text" icon="el-icon-delete" @click="handleDelete(row)">
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <div class="pagination">
        <el-pagination background 
          @current-change="handleCurrentChange" 
          :current-page="listQuery.pageNo"
          :page-sizes="pageSizes"
          :page-size="listQuery.pageSize"
          layout="total, sizes, prev, pager, next" 
          :total="totalCount">
        </el-pagination>
    </div>

    <!-- 删除提示框 -->
    <el-dialog title="提示" :visible.sync="delVisible" width="300px" center>
        <div class="del-dialog-cnt">删除不可恢复，是否确定删除？</div>
        <span slot="footer" class="dialog-footer">
            <el-button @click="delVisible = false">取 消</el-button>
            <el-button type="primary" @click="deleteDoc" :loading="subLoading">确 定</el-button>
        </span>
    </el-dialog>
    <!-- 文档提示框 -->
    <el-dialog :title="documentForm.title" :visible.sync="documentVisible" width="600px" center>
        <el-form :model="documentForm" :rules="rules" class="documentForm" ref="documentForm" label-width="120px">
            <el-form-item label="文档名称" prop="name">
                <el-input v-model="documentForm.name" :maxlength="15"></el-input>
            </el-form-item>
            <el-form-item label="文档描述">
                <el-input v-model="documentForm.desc" :maxlength="30"></el-input>
            </el-form-item>
            <el-form-item label="文档来源" prop="type">
              <el-radio-group v-model="documentForm.type">
                <el-radio v-for="item in fileTypes" :key="item.value" :label="item.value">{{item.label}}</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item :required="true" label="上传文档" v-if="documentForm.type=='0'">
                <el-upload
                    :action="uploadUrl"
                    :multiple="false"
                    :headers="headers"
                    accept="txt,doc,docx,xls,xlsx"
                    :on-remove="handleRemoveArr"
                    :on-success="handleSuccessArr"
                    :beforeUpload="beforeUpload"
                    :limit="9"
                    :file-list="documentForm.docsArr">
                    <el-button size="small" type="primary">点击上传</el-button>
                    <div slot="tip" class="el-upload__tip">只能上传txt,doc,docx,xls,xlsx文件</div>
                </el-upload>
            </el-form-item>
            <el-form-item label="文档链接" v-else prop="position">
                <el-input v-model="documentForm.position" :maxlength="30"></el-input>
            </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
            <el-button @click="documentVisible = false">取 消</el-button>
            <el-button type="primary" @click="changeDoc" :loading="subLoading">确 定</el-button>
        </span>
    </el-dialog>
  </div>
</template>

<script>
    import * as documentApi from '@/api/document.js';
    import Util from '@/util';
    import { FILE_TYPES, FILE_STATUS, convertType, PAGE_SIZES} from '@/util/constant.js';
    import moment from 'moment';
    export default {
        name: 'document',
        components: {
        },
        data() {
            return {
                fileTypes: FILE_TYPES,
                fileStatus: FILE_STATUS,
                dataList: [],
                listQuery: {
                    name: null,
                    status: null,
                    type: null,
                    pageNo: 1,
                    pageSize: 20,
                },
                documentForm: {
                    title: '新增文档',
                    id: null,
                    name: null,
                    type: '0',
                    desc: null,
                    docs:null,
                    docsArr: [],
                },
                rules: {
                    name: [
                        { required: true, message: '请输入文档名称', trigger: 'blur' }
                    ],
                    position: [
                        { required: true, message: '请输入文档链接', trigger: 'blur' }
                    ]
                },
                uploadUrl: `${this.BASE_URL}/api/upload`,
                headers: this.HEADERS,
                totalCount: 0,
                pageSizes: PAGE_SIZES,
                loading: false,
                subLoading: false,
                documentVisible: false,
                delVisible: false,
                deleteItem: null
            }
        },
        created() {
            this.getDataList();
        },
        methods: {
            getDataList(){
                this.loading = true;
                documentApi.documentList(this.listQuery)
                .then(response => {
                    if (response.data.code === "000001") {
                        this.totalCount = Number(response.data.data.count)
                        this.dataList = response.data.data.rows
                    }else {
                        this.$message.error(response.data.msg);
                    }
                })
                .catch(error => {
                    
                    Util.errorProcessor(this, error);
                }).finally(() => {
                    this.loading = false;
                });
            },
            // row日期转换
            dateFormater(row, column, cellValue) {
                return moment(cellValue).format('YYYY-MM-DD HH:mm:ss');
                // return cellValue;
            },
            typeFormatter(row, column, cellValue){
                return convertType(cellValue, FILE_TYPES).label
            },
            statusFormatter(row, column, cellValue){
                return convertType(cellValue, FILE_STATUS)
            },
            // 分页导航
            handleCurrentChange(val) {
                this.listQuery.pageNo = val;
                this.getDataList();
            },
            handleFilter() {
                this.listQuery.pageNo = 1;
                this.getDataList();
            },
            //上传相关
            beforeUpload(file) {
                const isLt12M = file.size / 1024 / 1024 < 12;
                
                if (!isLt12M) {
                  this.$message.error('上传图片大小不能超过 12MB!');
                }
                return isLt12M;
            },
            handleRemoveArr(file, fileList) {
                const key = 'docsArr'
                if(!fileList){
                    this.documentForm[key]=[]
                }else{
                    this.documentForm[key] = fileList.map((item,index) => {
                        return {
                            url: item.response ? item.response.data.filePath : item.url,
                            imgUrl: item.response ? item.response.data.filePath : item.url,
                            name: item.response ? item.response.data.filePath : item.url,
                            sortIndex: index
                        }
                    })
                }
            },
            handleSuccessArr(res){
                const key = 'docsArr'
                if(!this.documentForm[key]) this.documentForm[key] = []
                this.documentForm[key].push({
                    url: res.data.filePath,
                    imgUrl: res.data.filePath,
                    name: res.data.filePath,
                    sortIndex: this.documentForm[key].length+1
                })
            },
            handleCreate() {
                this.documentForm = {
                    title: '新增文档',
                    id: null,
                    name: null,
                    type: '0',
                    status: '0',
                    desc: null,
                    docs: null,
                    docsArr: []
                }
                this.documentVisible = true;
            },
            handleEdit(row) {
                this.documentForm = {
                    title: '修改文档',
                    id: row.id,
                    name: row.name,
                    status: row.status,
                    type: row.type,
                    desc: row.desc,
                    docs: row.position
                }
                this.documentForm.docsArr = this.documentForm.position ? this.documentForm.position.split(",").map(item => { return {name: 'doc', url: item}}) : []
                this.documentVisible = true;
            },
            handleDelete(row){
                this.delVisible = true;
                this.deleteItem = row
            },
            deleteDoc(){
              if(this.deleteItem){
                  // this.subLoading = true
                  
              }
            },
            changeDoc(){
              this.$refs["documentForm"].validate((valid)=>{
                  if (valid){
                      let title = this.documentForm.id ? '修改' : '新增';
                      this.subLoading = true
                      if(this.documentForm.type=='0'){
                          this.documentForm.position = this.documentForm.docs = this.documentForm.docsArr.length>0 ? this.documentForm.docsArr.map(item => item.url).join(","):""
                          if(this.documentForm.position===''){
                              this.$message.error('请先上传文档');
                              return
                          }
                      }
                      let req = Object.assign({}, this.documentForm)
                      req.status = Number(req.status)
                      req.type = Number(req.type)
                      documentApi.documentCreate(req)
                      .then(response => {
                          if (response.data.code === "000001") {
                              this.$message.success(`${title}成功`);
                              this.getDataList();
                          }else {
                              this.$message.error(response.data.msg);
                          }
                      })
                      .catch(error => {
                          
                          Util.errorProcessor(this, error);
                      }).finally(() => {
                          this.documentVisible = false;
                          this.subLoading = false
                      });
                  }
              })
            }
        }
    }
</script>

<style scoped>
    .filter-item{
      margin-right: 10px;
    }
</style>

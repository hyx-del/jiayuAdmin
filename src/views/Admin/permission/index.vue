<!--
  *  @Author:  wei.chen
  *  @Date:  2020-07-18  10:03:47
 * @LastEditors: jiu yin zhen jing
 * @LastEditTime: 2021-11-10 16:46:05
 * @Descripttion:
-->
<template>
  <div class="permission">
    <!-- 搜索 -->
    <el-form :inline="true" :model="searchfrom" ref="searchForm" class="demo-form-inline">
      <el-form-item prop="roleName" label="角色组名称：">
        <el-input
            v-model.trim="searchfrom.roleName"
            size="small"
            placeholder="请输入角色名称"
            prefix-icon="el-icon-search"
        ></el-input>
      </el-form-item>

      <el-form-item>
        <el-button type="primary" @click="onClickSearch" size="small">查询</el-button>
        <el-button type="primary" icon="el-icon-plus" @click="addRole" size="small">
          新增角色
        </el-button>
      </el-form-item>
    </el-form>

    <!-- 表格 -->
    <Table :loadData="getList" :column="column" ref="TableList" refHead="searchForm" :showSortIndex="{ show: true, lable: '序号'}"></Table>

    <!-- 新增/编辑角色模态窗 -->
    <el-dialog
        :title="title"
        center
        top="50px"
        :visible.sync="dialogFormVisible"
        v-if="dialogFormVisible"
        @close="resetForm('form')"
        custom-class="role_dialog"
        :close-on-click-modal="false"
    >
      <el-form class="role_dialog_tree" :model="form" :rules="rules" ref="form" label-position="top">
        <el-form-item label="名称：" prop="roleName">
          <el-input v-model.trim="form.roleName" placeholder="请输入名称"></el-input>
        </el-form-item>
        <el-form-item label="角色权限" prop="type" class="rule">
          <el-tree
              :props="props"
              :data="menuList"
              show-checkbox
              node-key="code"
              ref="tree"
              :highlight-current="true"
              :default-expand-all="true"
              :default-checked-keys="checkedKeys"
              :default-expanded-keys="checkedKeys"
              @check="handleCheckChange"
              style="max-height: 300px;overflow-y: auto;"
          />
        </el-form-item>
        <el-form-item label="备注：" prop="remarks">
          <el-input
              type="textarea"
              v-model.trim="form.remarks"
              placeholder="请输入备注"
              rows="5"
          ></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="resetForm('form')">取 消</el-button>
        <el-button type="primary" @click="submitForm('form')">确 定</el-button>
      </div>
    </el-dialog>

    <!-- 查看人员模态窗 -->
    <el-dialog
        title=""
        center
        :visible.sync="dialogTableVisible"
        :close-on-click-modal="false"
        width="200px"
    >
      <el-table
          border
          :data="userData"
          style="max-height: 500px;overflow: hidden;overflow-y: auto;"
      >
        <el-table-column align="center" property="name" label="姓名"></el-table-column>
        <el-table-column align="center" property="phone" label="手机号"></el-table-column>
      </el-table>
      <div slot="footer" class="dialog-footer">
        <!-- <el-button @click="dialogTableVisible = false">取 消</el-button> -->
        <el-button type="primary" @click="dialogTableVisible = false">关闭</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import Table from '@/components/Table/index';
import {differenceArray, parseTime} from '@/utils';
import { Message } from 'element-ui';
import {
  getRoleList,
  getAllUser,
  addRole,
  editRole,
  deleteRole,
  getRoleOperator,
  getRolePermission,
  addRolePermission,
  getPermissionList,
  getMenuList,
  roleInfo,
} from '@/api/admin';

import {menuList} from '@/views/Admin/permission/cs'

export default {
  name: 'permission',
  components: {
    Table,
  },
  data() {
    return {
      props: {
        label: 'name',
        children: 'nodes',
        // isLeaf: 'leaf',
      },
      //  搜索表单数据
      searchfrom: {
        roleName: '',
      },
      //  表头
      column: [
        { prop: 'roleName', label: '角色名称' },
        { prop: 'remarks', label: '备注' },
        {
          prop: 'action',
          label: '操作',
          actives: [
            {
              name: '编辑',
              method: val => {
                roleInfo({ roleId: val.id }).then(res => {
                  if (res.code === 200) {
                    this.form.roleName = res.data.roleName;
                    this.form.roleMenus = res.data.roleMenus;
                    this.form.remarks = res.data.remarks;
                    this.form.id = res.data.id;
                    this.dialogFormVisible = true;
                    this.title = '编辑角色';
                    let madArr=res.data.menus.map(v=>v.code)
                    setTimeout(() => {
                      this.setTreeValue(madArr)
                    }, 100)
                  }
                });
              },
            },
          ],
        },
      ],
      form: {
        // 新增/编辑角色模态窗表单数据
        roleName: '', // 角色名称
        // operatorIdSet: [], // 人员id
        roleMenus: [], // 菜单权限 id
        remarks: '', // 备注
      },
      title: '', // 新增/编辑角色模态窗的 title
      // 新增/编辑角色模态窗表单校检
      rules: {
        roleName: [{ required: true, message: '请输入名称', trigger: 'blur' }],
        // operatorIdSet: [{ required: true, message: '请选择人员', trigger: 'blur' }],
        remarks: [{ required: true, message: '请输入备注', trigger: 'blur' }],
      },
      dialogFormVisible: false, //  新增/编辑角色模态窗是否显示
      // options: [], //  新增角色选择人员列表
      dialogTableVisible: false,
      userData: [], // 查看人员列表数据
      //-------------------
      permissionVisible: false,
      permissionList: [], // 权限列表
      params: {
        id: null, // 角色id
        codeSet: [], //  权限code
      },
      checkedKeys: [], // 已有的权限ID
      expandedKeys: [],
      menuList: [],
      checkArr:[]
    };
  },
  computed: {
    getList() {
      return getRoleList; //  return 数据列表接口
    },
  },
  mounted() {
    // getAllUser().then(res => {
    // 	if (res.success) {
    // 		this.options = res.data;
    // 	}
    // });
    getMenuList().then(res => {
      if (res.code == 200) {
        this.menuList = res.data;
      }
    });
  },
  methods: {
    //获取数图选中的值
    getTreeValue(){
      this.checkArr=[]
      this.$refs.tree.root.childNodes.forEach(item=>this.getTreeCheck(item))
    },
    // 递归检查选中状态
    getTreeCheck(item){
      if (item.checked||item.indeterminate) {
        this.checkArr.push(item.data.id)
      }
      if (item.childNodes&&item.childNodes.length>0) {
        item.childNodes.forEach(v=>this.getTreeCheck(v))
      }
    },
    // 设置结果
    setTreeValue(arr){
      let end=this.setTreeFun(arr)
      this.$refs.tree&&this.$refs.tree.setCheckedKeys(end)
    },
    setTreeFun(arr){
      let brr=[]
      arr.forEach(item=>{
        if (item.length>1) {
          let s=''
          let mid=item.split('')
          mid.forEach((v,i)=>{
            if (mid.length-1>i) {
              s+=v
              brr.push(s)
            }
          })
        }
      })

      brr=Array.from(new Set([...brr]))
      return differenceArray(brr,arr)
    },


    // 获取要设置的权限 Code
    handleCheckChange(data, checked) {
      let _codeSet = [...checked.checkedKeys, ...checked.halfCheckedKeys];

      let n = {}; //存放新的数据
      // 设置去重
      for (let i = 0; i < _codeSet.length; i++) {
        let v = _codeSet[i];
        n[v] = 1;
      }
      _codeSet = [];
      for (let i in n) {
        _codeSet[_codeSet.length] = i;
      }
      //  ;
      this.params.codeSet = _codeSet;
    },
    // 设置权限确定事件
    onClickPermission() {
      addRolePermission({ ...this.params }).then(res => {
        if (res.code === 200) {
          Message.success('操作成功！！！');
          this.permissionVisible = false;
          this.permissionList = [];
          this.$refs.tree.setCheckedKeys([]); // 重置树节点勾选状态
          this.$refs.TableList.reset();
        }
      });
    },
    // 设置权限取消事件
    onClickCancel() {
      this.permissionVisible = false;
      this.permissionList = [];
      this.$refs.tree.setCheckedKeys([]); // 重置树节点勾选状态
    },
    // 搜索事件
    onClickSearch() {
      this.$refs.TableList.update({ ...this.searchfrom });
    },
    // 新增 Btu 事件
    addRole() {
      this.dialogFormVisible = true;
      this.title = '新增角色';
      this.form = {
        // 新增/编辑角色模态窗表单数据
        roleName: '', // 角色名称
        roleMenus: ['1', '16'], // 菜单权限 id
        // operatorIdSet: [], // 人员id
        remarks: '', // 备注
      };
    },
    // 模态窗确认保存事件
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {

          this.getTreeValue()
          this.form.roleMenus = this.unique(this.checkArr);
          if (this.title === '新增角色') {
            const _par = { ...this.form };
            addRole(_par).then(res => {
              if (res.code === 200) {
                this.dialogFormVisible = false;
                Message.success('新增角色成功！！！');
                this.$refs.TableList.reset();
              }
            });
          } else {
            const _par = { ...this.form };
            editRole(_par).then(res => {
              if (res.code === 200) {
                this.dialogFormVisible = false;
                Message.success('修改成功！！！');
                this.$refs.TableList.reset();
              }
            });
          }
        } else {
          return false;
        }
      });
    },
    unique(arr) {
      const res = new Map();
      return arr.filter(a => !res.has(a) && res.set(a, 1));
    },
    // 模态窗取消事件
    resetForm(formName) {
      this.$refs[formName].resetFields();
      this.dialogFormVisible = false;
    },
    handleCheckAllChange(val) {
      if (this.form.roleMenus.indexOf(val.id) !== -1) {
        for (let item of val.nodes) {
          this.form.roleMenus.push(item.id);
        }
      } else {
        for (let item of val.nodes) {
          this.form.roleMenus.splice(
              this.form.roleMenus.findIndex(val => val.id === item.id),
              1
          );
        }
      }
      this.form.roleMenus = this.unique(this.form.roleMenus);
    },
    handleCheckedCitiesChange(value, data) {
      this.form.roleMenus.push(value.pid);
    },
  },
};
</script>

<style lang="scss" scoped>
.permission {
  padding: 20px;
}
.rule {
  //height: 300px;
  //overflow-y: auto;
  .rule-item {
    display: flex;
    flex-direction: column;
  }
}
.role_dialog_tree{
  width: 100%;
}
</style>

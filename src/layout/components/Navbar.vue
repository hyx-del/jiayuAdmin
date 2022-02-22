<template>
	<div class="navbar">
		<hamburger
			:is-active="sidebar.opened"
			class="hamburger-container"
			@toggleClick="toggleSideBar"
		/>

		<breadcrumb class="breadcrumb-container" />

		<div class="right-menu">
			<el-dropdown class="avatar-container" trigger="click">
				<div class="avatar-wrapper">
					<img
						:src="'http://oss.faceinner.com/custom/admin_avatar.png'"
						class="user-avatar"
					/>
					<span v-text="name" class="user_name"></span>
					<i class="el-icon-caret-bottom" />
				</div>
				<el-dropdown-menu slot="dropdown" class="user-dropdown">
					<el-dropdown-item>
						<router-link to="/">首页</router-link>
					</el-dropdown-item>
					<el-dropdown-item @click.native="dialogFormVisible = true" divided>
						修改密码
					</el-dropdown-item>
					<el-dropdown-item divided @click.native="logout">
						退出
					</el-dropdown-item>
				</el-dropdown-menu>
			</el-dropdown>
		</div>
		<el-dialog
			title="修改密码"
			:visible.sync="dialogFormVisible"
			:modal-append-to-body="false"
			:close-on-click-modal="false"
			:close-on-press-escape="false"
			:destroy-on-close="true"
			label-position="left"
			custom-class="dialogStyle"
			width="400px"
		>
			<el-form
				:model="form"
				label-position="left"
				label-width="120px"
				:rules="passWordForm"
				ref="form"
			>
				<el-form-item label="输入新密码" prop="newPassword" required>
					<el-input
						v-model="form.newPassword"
						autocomplete="off"
						type="password"
					></el-input>
				</el-form-item>
				<el-form-item label="再次确认密码" prop="confirmPassword" required>
					<el-input
						v-model="form.confirmPassword"
						autocomplete="off"
						type="password"
					></el-input>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click="dialogFormVisible = false">取 消</el-button>
				<el-button type="primary" @click="changePasswords('form')">确认修改</el-button>
			</div>
		</el-dialog>
	</div>
</template>

<script>
import { mapGetters } from 'vuex';
import Breadcrumb from '@/components/Breadcrumb';
import Hamburger from '@/components/Hamburger';
import { changePassword } from '@/api/admin';
import md5 from 'js-md5';
export default {
	components: {
		Breadcrumb,
		Hamburger,
	},
	data() {
		const checkPassword = (rule, value, callback) => {
			if (value !== this.form.newPassword) {
				return callback('两次输入的密码不一致，请检查!');
			} else if (!value) {
				return callback('确认密码不能为空!');
			} else {
				callback();
			}
		};
		return {
			dialogFormVisible: false,
			form: {
				newPassword: null,
				confirmPassword: null,
			},
			passWordForm: {
				newPassword: {
					type: 'string',
					required: true,
					message: '新密码不能为空！',
				},
				confirmPassword: {
					validator: checkPassword,
					type: 'string',
				},
			},
		};
	},
	computed: {
		...mapGetters(['sidebar', 'avatar', 'name']),
	},
	methods: {
		toggleSideBar() {
			this.$store.dispatch('app/toggleSideBar');
		},
		async logout() {
			await this.$store.dispatch('user/logout');
			this.$router.push(`/login?redirect=${this.$route.fullPath}`);
		},
		changePasswords(formName) {
			this.$refs[formName].validate(valid => {
				if (valid) {
					let data = {
						id: sessionStorage.getItem('userids'),
						password: this.form.newPassword,
					};
					data.password = md5(data.password);
					changePassword(data).then(res => {
						if (res.code == 200) {
							this.$message.success('修改成功');
							setTimeout(() => {
								this.logout();
							}, 2000);
						}
					});
					this.dialogFormVisible = false;
				} else {
					console.log('error submit!!');
					return false;
				}
			});
		},
	},
};
</script>

<style lang="scss" scoped>
.navbar {
	height: 50px;
	overflow: hidden;
	position: relative;
	background: #fff;
	box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);
	.el-dialog__header {
		text-align: center;
	}
	.el-dialog__body {
		padding: 30px 80px;
	}
	.hamburger-container {
		line-height: 46px;
		height: 100%;
		float: left;
		cursor: pointer;
		transition: background 0.3s;
		-webkit-tap-highlight-color: transparent;

		&:hover {
			background: rgba(0, 0, 0, 0.025);
		}
	}

	.breadcrumb-container {
		float: left;
	}

	.right-menu {
		float: right;
		height: 100%;
		line-height: 50px;

		&:focus {
			outline: none;
		}

		.right-menu-item {
			display: inline-block;
			padding: 0 8px;
			height: 100%;
			font-size: 18px;
			color: #5a5e66;
			vertical-align: text-bottom;
			text-align: center;
			&.hover-effect {
				cursor: pointer;
				transition: background 0.3s;

				&:hover {
					background: rgba(0, 0, 0, 0.025);
				}
			}
		}

		.avatar-container {
			margin-right: 30px;
			cursor: pointer;

			.avatar-wrapper {
				margin-top: 5px;
				position: relative;

				.user-avatar {
					width: 26px;
					height: 26px;
					// line-height: 50px;
					margin-top: 8px;
					margin-left: 10px;
					border-radius: 10px;
				}
				.user_name {
					position: relative;
					padding: 0 10px;
					// width: 100px;
					// left: 20px;
					top: -7px;
				}

				.el-icon-caret-bottom {
					cursor: pointer;
					position: absolute;
					right: -20px;
					top: 16px;
					font-size: 12px;
				}
			}
		}
	}
}
</style>

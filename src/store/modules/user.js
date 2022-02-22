import { login, logout, getInfo, getMenuInfo } from '@/api/user';
import { getToken, setToken, removeToken } from '@/utils/auth';
import { resetRouter } from '@/router';
import getRouterList from '@/router/router';

const getDefaultState = () => {
	return {
		token: '',
		name: '',
		avatar: '',
	};
};

const state = getDefaultState();

const mutations = {
	RESET_STATE: state => {
		Object.assign(state, getDefaultState());
	},
	SET_TOKEN: (state, token) => {
		state.token = token;
	},
	SET_NAME: (state, name) => {
		state.name = name;
	},
	SET_AVATAR: (state, avatar) => {
		state.avatar = avatar;
	},
};

const actions = {
	// user login
	login({ commit }, userInfo) {
		return new Promise((resolve, reject) => {
			login(userInfo)
				.then(response => {
					// console.log(response);

					const data = response;

					if (data) {
						commit('SET_TOKEN', data.access_token);
						commit('SET_NAME', data.account_info.nickname || 'name');
						// commit('SET_AVATAR', data.admin.avatar);
						setToken(data.access_token);
						sessionStorage.setItem('token', data.access_token);
						sessionStorage.setItem('userids', data.account_info.id);
						// 设置菜单权限
						// sessionStorage.setItem('role_router', JSON.stringify(data.permissionCodeSet));
						resolve();
					} else {
						reject(response);
					}
				})
				.catch(error => {
					// console.log('error', error);
					reject(error);
				});
		});
	},

	// get user info
	getInfo({ commit, state }) {
		return new Promise((resolve, reject) => {
			getInfo(state.token)
				.then(response => {
					const { data } = response;

					if (!data) {
						reject('Verification failed, please Login again.');
					}

					const { name, avatar } = data.admin;

					commit('SET_NAME', name);
					commit('SET_AVATAR', avatar);
					resolve(data);
				})
				.catch(error => {
					reject(error);
				});
		});
	},

	// user logout
	logout({ commit, state }) {
		return new Promise((resolve, reject) => {
			// logout(state.token)
			// 	.then(() => {
			removeToken(); // must remove  token  first
			resetRouter();
			commit('RESET_STATE');
			commit('SET_TOKEN', null);
			// sessionStorage.removeItem('role_router');
			sessionStorage.removeItem('token');
			sessionStorage.removeItem('qiniuToken');
			resolve();
			// })
			// .catch(error => {
			// 	reject(error)
			// })
		});
	},
	getMenuInfo({ commit, state }) {
		return new Promise((resolve, reject) => {
			getMenuInfo()
				.then(res => {
					if (res.code === 200) {
						// 设置菜单权限
						const _tempArray = [];
						res.data.roles[0].menus.forEach(item => {
							_tempArray.push(item.code);
						});
						sessionStorage.setItem('role_router', JSON.stringify(_tempArray));
						resolve();
					}
				})
				.catch(error => {
					reject(error);
				});
		});
	},

	// remove token
	resetToken({ commit }) {
		return new Promise(resolve => {
			removeToken(); // must remove  token  first
			commit('RESET_STATE');
			resolve();
		});
	},
};

export default {
	namespaced: true,
	state,
	mutations,
	actions,
};

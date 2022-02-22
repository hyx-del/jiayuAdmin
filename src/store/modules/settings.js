/*
 * @Author: wei.chen
 * @Date: 2020-07-06 11:16:11
 * @LastEditors: wei.chen
 * @LastEditTime: 2020-11-09 12:51:21
 * @Descripttion:
 */
import defaultSettings from '@/settings';

const { showSettings, fixedHeader, sidebarLogo } = defaultSettings;

const state = {
	showSettings: showSettings,
	fixedHeader: fixedHeader,
	sidebarLogo: sidebarLogo,
};

const mutations = {
	CHANGE_SETTING: (state, { key, value }) => {
		if (state.hasOwnProperty(key)) {
			state[key] = value;
		}
	},
};

const actions = {
	changeSetting({ commit }, data) {
		commit('CHANGE_SETTING', data);
	},
};

export default {
	namespaced: true,
	state,
	mutations,
	actions,
};

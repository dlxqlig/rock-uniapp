import Vue from 'vue'
import Vuex from 'vuex'
import fetch from '../common/request.js'

Vue.use(Vuex)

const store = new Vuex.Store({
	state: {
		version: "1.0.0",
		isLogin: uni.getStorageSync("token") ? true : false,
		token:uni.getStorageSync("token"),
		username:''

	},
	mutations: {
		login(state, payload) {
			if(payload) {
				state.token = payload.token;
			}
			state.isLogin = true;
		},
		logout(state) {
			state.memberId = "";
			state.token = "";
			state.isLogin = false;
		},
		// 设置用户信息
		setUserInfo(state, payload) {
			for (let i in payload) {
				for (let j in state.userInfo) {
					if (i === j) {
						state.userInfo[j] = payload[i]
					}
				}
			}
		}

	},
	actions: {

	}
})

export default store

import Vue from 'vue'
import App from './App'
import store from './store'
import * as filters from './filters'
import * as config from './config'

Vue.config.productionTip = false

Object.keys(filters).forEach(key => {
	Vue.filter(key, filters[key])
})

const defConfig = config.def
let loginLock = false

const api = {
	toast: function(text, duration, success) {
		uni.showToast({
			title: text,
			icon: success ? 'success' : 'none',
			duration: duration || 2000
		})
	},
	constNum: function() {
		const res = uni.getSystemInfoSync();
		return res.platform.toLocaleLowerCase() == "android" ? 300 : 0;
	},
	px: function(num) {
		return uni.upx2px(num) + 'px';
	},
	request: function(url, _method, postData, contentType, hideLoading, failCallback) {
		//接口请求
		if (!hideLoading) {
			uni.showLoading({
				mask: true,
				title: '请稍候...'
			})
		}
		let _contentType =  (_method=='POST') ? 'application/json':'application/x-www-form-urlencoded';
		if(contentType != undefined)
			_contentType = contentType
	
		return new Promise((resolve, reject) => {
			uni.request({
				url: defConfig().baseUrl + url,
				data: postData,
				header: {
					'content-type': _contentType,
					'Authorization': 'Bearer ' + this.getToken()
				},
				method: _method, //'GET','POST'
				dataType: 'json',
				success: (res) => {
					!hideLoading && uni.hideLoading()
					if (res.statusCode === 200) {
						if (res.data.code === 200) {
							resolve(res.data);
						} else if (res.data.code === 401) {
							if (failCallback) {
								failCallback(res.data)
							}
							if (!loginLock) {
								loginLock = true
								uni.showModal({
									title: '登录提示',
									content: '您尚未登录，是否立即登录？',
									showCancel: true,
									confirmText: '登录',
									success: (e) => {
										if (e.confirm) {
											uni.navigateTo({
												url: '/pages/public/login'
											})
										}
									},
									fail: () => {},
									complete: () => {
										loginLock = false
									}
								})
							}
						} else {
							if (failCallback) {
								failCallback(res.data)
							} else {
								uni.showToast({
									title: res.data.message,
									icon: 'none'
								})
							}
						}
					}
				},
				fail: (res) => {
					if (!hideLoading) {
						this.toast("网络不给力，请稍后再试~")
					}
					reject(res)
				}
			})
		})
	},
	uploadFile: function(src) {
		const that = this
		uni.showLoading({
			title: '请稍候...'
		})
		return new Promise((resolve, reject) => {
			const uploadTask = uni.uploadFile({
				url: defConfig().uploadUrl,
				filePath: src,
				name: 'file',
				header: {
					'content-type': 'multipart/form-data'
				},
				formData: {},
				success: function(res) {
					uni.hideLoading()
					let d = JSON.parse(res.data)
					if (d.code === 1) {
						let fileObj = JSON.parse(d.data)[0];
						//文件上传成功后把图片路径数据提交到服务器，数据提交成功后，再进行下张图片的上传
						resolve(fileObj)
					} else {
						that.toast(res.message);
					}
				},
				fail: function(res) {
					reject(res)
					uni.hideLoading();
					that.toast(res.message);
				}
			})
		})
	},
	setToken: function(token) {
		uni.setStorageSync("token", token)
	},
	getToken() {
		return uni.getStorageSync("token")
	},
	isLogin: function() {
		return uni.getStorageSync("token") ? true : false
	},
	logOut: function() {
		uni.removeStorage("token")
	},
	webURL:function(){
		return defConfig().webUrl;
	},
    prePage: function() {
		let pages = getCurrentPages();
		let prePage = pages[pages.length - 2];
		// #ifdef H5
		return prePage;
		// #endif
		return prePage.$vm;
	},
	setUserName: function(username) {
		uni.setStorageSync("username", username)
	},
	getUserName: function() {
		return uni.getStorageSync("username")
	}

}

Vue.prototype.$api = {
	api,
	defConfig
}

Vue.prototype.$eventHub = Vue.prototype.$eventHub || new Vue()
Vue.prototype.$store = store
App.mpType = 'app'

const app = new Vue({
	store,
	...App
})
app.$mount()

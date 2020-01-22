<template>
	<view>
		<view class="container">
			<tui-list-cell padding="0" :hover="false" :arrow="true" @click="inputShowModal('nickname')">
				<view class="tui-list-cell tui-pr30">
					<view>昵称</view>
					<view class="tui-content">{{ userinfo.nickname }}</view>
				</view>
			</tui-list-cell>
			<tui-list-cell padding="0" :arrow="true" @click="genderShowModal">
				<view class="tui-list-cell  tui-pr30">
					<view>性别</view>
					<view class="tui-content">{{ genderText }}</view>
				</view>
			</tui-list-cell>
			<tui-button type="danger" shape="rightAngle" @click="submit()">提交</tui-button>

			<neil-modal :show="inputShow" @close="cancel" title="编辑" @cancel="cancel" @confirm="confirm">
				<input v-model="inputContent" style="margin:20upx" placeholder="请输入..." />
			</neil-modal>

			<neil-modal :show="genderShow" @close="cancel" title="选择性别" @cancel="cancel" @confirm="confirmGender">
				<view>
					<radio-group style="text-align:center" @change="genderRadioChange">
						<label v-for="(item, index) in genders" :key="item.value">
							<radio :value="item.value + ''" :checked="index === gender" style="margin:10upx" />
							{{ item.name }}
						</label>
					</radio-group>
				</view>
			</neil-modal>
		</view>
	</view>
</template>

<script>
import neilModal from '@/components/neil-modal/neil-modal.vue';
import tuiListCell from '@/components/list-cell/list-cell';
import tuiButton from "@/components/button/button"
export default {
	components: {
		neilModal,
		tuiListCell,
		tuiButton
	},
	data() {
		return {
			inputShow: false,
			feild: undefined,
			inputContent: '',
			genderText: '',
			userinfo: {},
			genderShow: false,
			gender: undefined,
			genders: [{ name: '保密', value: 0 }, { name: '男', value: 1 }, { name: '女', value: 2 }]
		};
	},

	onLoad: function(options) {
		let that = this;
		that.$api.api
			.request('/sso/GetUser', 'GET',
				{userName: that.$api.api.getUserName()})
			.then(res => {
				that.userinfo = res.data
				if(that.userinfo.nickname) {
					that.nickname = that.userinfo.nickname;
				} else {
					that.nickname = '';
				}

				if(that.userinfo.gender)
					that.gender = that.userinfo.gender;

				if (that.gender == 1) {
					that.genderText = '男';
				} else if (that.gender == 2) {
					that.genderText = '女';
				} else {
					that.genderText = '保密';
				}
			});
	},
	methods: {
		cancel() {
			this.inputShow = false;
			this.genderShow = false;
		},
		inputShowModal(feild) {
			this.feild = feild;
			this.inputShow = true;
			this.inputContent = '';
		},
		genderShowModal() {
			this.genderShow = true;
			this.gender = this.userInfo.gender;
		},
		confirm() {
			const that = this;
			if (!that.inputContent) {
				that.$api.api.toast('输入不能为空');
				return;
			}
			that.userinfo[that.feild] = that.inputContent;
			that.inputContent = '';
		},
		submit() {
			const that = this;
			let member = {};
			member.id = that.userinfo.id;
			member.username = that.userinfo.username;
			member.nickname = that.userinfo.nickname;
			member.gender = that.gender;
			that.$api.api.request('/sso/update', 'POST', JSON.stringify(member)).then(res => {
				that.$store.commit('login', that.userInfo);
			});
		},
		genderRadioChange(e) {
			this.gender = parseInt(e.detail.value);
			if (this.gender == 1) {
				this.genderText = '男';
			} else if (this.gender == 2) {
				this.genderText = '女';
			} else {
				this.genderText = '保密';
			}
		},
		confirmGender() {
			const that = this;
			if (this.gender === undefined) {
				that.$api.api.toast('请选择性别');
				return;
			}
		}
	}
};
</script>

<style lang="scss">
.tui-list-cell {
	width: 100%;
	display: flex;
	align-items: center;
	justify-content: space-between;
	padding: 24rpx 60rpx 24rpx 30rpx;
	font-size: 30rpx;
}

.tui-pr30 {
	padding-right: 200rpx;
}
.tui-content {
	font-size: 26rpx;
	color: #666;
}
.tui-btn{
	margin-bottom: 26upx;
	margin-right: 20upx;
}
page {
	background: $page-color-base;
}

page {
	background: $page-color-base;
}
.list-cell {
	display: flex;
	align-items: baseline;
	padding: 20upx $page-row-spacing;
	line-height: 60upx;
	position: relative;
	background: #fff;
	justify-content: center;
	&.log-out-btn {
		margin-top: 40upx;
		.cell-tit {
			color: $uni-color-primary;
			text-align: center;
			margin-right: 0;
		}
	}
	&.cell-hover {
		background: #fafafa;
	}
	&.b-b:after {
		left: 30upx;
	}
	&.m-t {
		margin-top: 16upx;
	}
	.cell-more {
		align-self: baseline;
		font-size: $font-lg;
		color: $font-color-light;
		margin-left: 10upx;
	}
	.cell-tit {
		flex: 1;
		font-size: $font-base + 2upx;
		color: $font-color-dark;
		margin-right: 10upx;
	}
	.cell-tip {
		font-size: $font-base;
		color: $font-color-light;
	}
	switch {
		transform: translateX(16upx) scale(0.84);
	}
}
</style>

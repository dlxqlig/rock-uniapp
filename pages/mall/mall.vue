<template>
	<view class="container">
		<!--header-->
		<view class="tui-header">
			<view class="tui-rolling-search">
				<!-- #ifdef APP-PLUS || MP -->
				<icon type="search" :size="13" color="#999"></icon>
				<!-- #endif -->
				<!-- #ifdef H5 -->
				<view><tui-icon name="search" :size="16" color="#999"></tui-icon></view>
				<!-- #endif -->
				<input confirm-type="search" @confirm='doSearch' placeholder="" :focus="true" auto-focus placeholder-class="tui-input-plholder"
				 class="tui-input" v-model.trim="key" />
				<!-- #ifdef APP-PLUS || MP -->
				<icon type="clear" :size='13' color='#bcbcbc' @tap="cleanKey" v-show="key"></icon>
				<!-- #endif -->
				<!-- #ifdef H5 -->
				<view @tap="cleanKey" v-show="key"><tui-icon name="close-fill" :size='16' color='#bcbcbc'></tui-icon></view>
				<!-- #endif -->
			</view>
		</view>
		<!--header-->
		<view class="tui-header-banner">
			<view class="tui-banner-bg">
				<view class="tui-primary-bg tui-route-left"></view>
				<view class="tui-primary-bg tui-route-right"></view>
				<!--banner-->
				<view class="tui-banner-box">
					<swiper
						:indicator-dots="true"
						:autoplay="true"
						:interval="5000"
						:duration="150"
						class="tui-banner-swiper"
						:circular="true"
						indicator-color="rgba(255, 255, 255, 0.8)"
						indicator-active-color="#fff"
					>
					<swiper-item v-for="(item, index) in advertiseList" :key="index" @tap.stop="detail">
							<image :src="item.pic" class="tui-slide-image" mode="scaleToFill" />
						</swiper-item>
					</swiper>
				</view>
			</view>
		</view>

		<view class="tui-product-category">
			<view class="tui-category-item" v-for="(item, index) in brandList" :key="index" :data-key="item.name" @tap="more">
				<image :src="item.logo" class="tui-category-img" mode="scaleToFill"></image>
				<view class="tui-category-name">{{ item.name }}</view>
			</view>
		</view>

		<view class="tui-product-box tui-pb-20 tui-bg-white">
			<view class="tui-group-name" @tap="more">
				<text>新品推荐</text>
				<tui-icon name="arrowright" :size="20" color="#555"></tui-icon>
			</view>
			<view class="tui-new-box">
				<view class="tui-new-item" :class="[index != 0 && index != 1 ? 'tui-new-mtop' : '']" v-for="(item, index) in newProductList" :key="index" @tap="detail(item.id)">
					<image :src="'/static/images/mall/new/' + (item.newStatus == 1 ? 'new' : 'discount') + '.png'" class="tui-new-label"></image>
					<view class="tui-title-box">
						<view class="tui-new-title">{{ item.name }}</view>
						<view class="tui-new-price">
							<text class="tui-new-present">￥{{ item.price }}</text>
						</view>
					</view>
					<image :src="item.pic" class="tui-new-img"></image>
				</view>
			</view>
		</view>

		<view class="tui-product-box">
			<view class="tui-group-name"><text>热门推荐</text></view>
			<view class="tui-product-list">
				<view class="tui-product-container">
					<block v-for="(item, index) in hotProductList" :key="index" v-if="(index + 1) % 2 != 0">
						<!--商品列表-->
						<view class="tui-pro-item" hover-class="hover" :hover-start-time="150" @tap="detail(item.id)">
							<image :src="item.pic" class="tui-pro-img" mode="widthFix" />
							<view class="tui-pro-content">
								<view class="tui-pro-tit">{{ item.name }}</view>
								<view>
									<view class="tui-pro-price">
										<text class="tui-sale-price">￥{{ item.price }}</text>
									</view>
								</view>
							</view>
						</view>
					</block>
				</view>
				<view class="tui-product-container">
					<block v-for="(item, index) in hotProductList" :key="index" v-if="(index + 1) % 2 == 0">
						<!--商品列表-->
						<view class="tui-pro-item" hover-class="hover" :hover-start-time="150" @tap="detail(item.id)">
							<image :src="item.pic" class="tui-pro-img" mode="widthFix" />
							<view class="tui-pro-content">
								<view class="tui-pro-tit">{{ item.name }}</view>
								<view>
									<view class="tui-pro-price">
										<text class="tui-sale-price">￥{{ item.sale }}</text>
									</view>
								</view>
							</view>
						</view>
					</block>
				</view>
			</view>
		</view>

		<!--加载loadding-->
		<tui-loadmore :visible="loadding" :index="3" type="red"></tui-loadmore>
		<!-- <tui-nomore visible="{{!pullUpOn}}"></tui-nomore> -->
		<!--加载loadding-->
		<view class="tui-safearea-bottom"></view>
	</view>
</template>
<script>
import tuiIcon from '@/components/icon/icon';
import tuiTag from '@/components/tag/tag';
import tuiLoadmore from '@/components/loadmore/loadmore';
import tuiNomore from '@/components/nomore/nomore';
export default {
	components: {
		tuiIcon,
		tuiTag,
		tuiLoadmore,
		tuiNomore
	},
	data() {
		return {
			current: 0,
			hotSearch: ['休闲零食', '自热火锅', '小冰箱迷你'],
			pageIndex: 1,
			loadding: false,
			pullUpOn: true,

			advertiseList: [],
			brandList:[],
			homeFlashPromotion: {},
			newProductList:[],
			hotProductList:[],
			subjectList:[],
			key: '',
			defaultKeyword: ''
		};
	},
	onLoad(options) {
		this.loadData()
	},
	methods: {
		async loadData() {
			let that = this;
			that.$api.api.request('/home/content', 'GET', {}).then(res => {
				console.log('success to get home content.')
				let data = res.data
				that.advertiseList = data.advertiseList,
				that.brandList = data.brandList,
				that.homeFlashPromotion = data.homeFlashPromotion,
				that.newProductList = data.newProductList,
				that.hotProductList = data.hotProductList,
				that.subjectList = data.subjectList

			})
		},
		detail: function(productId) {
			uni.navigateTo({
				url: '../product/productDetail?productId=' + productId
			});
		},
		more: function(e) {
			let key = e.currentTarget.dataset.key || '';
			uni.navigateTo({
				url: '../product/List?searchKey=' + key
			});
		},
		cleanKey: function() {
			this.key = ''
		},
		doSearch(key) {
			key = key ? key : this.keyword ? this.keyword : this.defaultKeyword;
			this.keyword = key;
			uni.navigateTo({
				url: `/pages/product/list?keywords=${key}`
			})
		},
	},
	onPullDownRefresh: function() {
		let loadData = JSON.parse(JSON.stringify(this.hotProductList));
		loadData = loadData.splice(0, 10);
		this.hotProductList = loadData;
		this.pageIndex = 1;
		this.pullUpOn = true;
		this.loadding = false;
		uni.stopPullDownRefresh();
	},
	onReachBottom: function() {
		if (!this.pullUpOn) return;
		this.loadding = true;
		if (this.pageIndex == 4) {
			this.loadding = false;
			this.pullUpOn = false;
		} else {
			let loadData = JSON.parse(JSON.stringify(this.hotProductList));
			loadData = loadData.splice(0, 10);
			if (this.pageIndex == 1) {
				loadData = loadData.reverse();
			}
			this.hotProductList = this.hotProductList.concat(loadData);
			this.pageIndex = this.pageIndex + 1;
			this.loadding = false;
		}
	},

};
</script>

<style>
page {
	background: #f7f7f7;
}

.container {
	padding-bottom: 100rpx;
	color: #333;
}

/*tabbar*/

.tui-tabbar {
	width: 100%;
	position: fixed;
	display: flex;
	align-items: center;
	justify-content: space-between;
	z-index: 99999;
	background: #fff;
	height: 100rpx;
	left: 0;
	bottom: 0;
	padding-bottom: env(safe-area-inset-bottom);
}

.tui-safearea-bottom {
	width: 100%;
	height: env(safe-area-inset-bottom);
}

.tui-tabbar::before {
	content: '';
	width: 100%;
	border-top: 1rpx solid #d9d9d9;
	position: absolute;
	top: 0;
	left: 0;
	-webkit-transform: scaleY(0.5);
	transform: scaleY(0.5);
}

.tui-tabbar-item {
	flex: 1;
	width: 25%;
	display: flex;
	align-items: center;
	flex-direction: column;
	justify-content: space-between;
	font-size: 24rpx;
	color: #666;
	height: 80rpx;
}

.tui-ptop-4 {
	padding-top: 4rpx;
}

.tui-scale {
	font-weight: bold;
	transform: scale(0.8);
	transform-origin: center 100%;
	line-height: 30rpx;
}

.tui-item-active {
	color: #e41f19 !important;
}

/*tabbar*/

.tui-header {
	width: 100%;
	height: 100rpx;
	padding: 0 30rpx 0 20rpx;
	box-sizing: border-box;
	background: #e41f19;
	display: flex;
	align-items: center;
	justify-content: space-between;
	position: fixed;
	left: 0;
	top: 0;
	/* #ifdef H5 */
	top: 44px;
	/* #endif */
	z-index: 999;
}

.tui-rolling-search {
	width: 100%;
	height: 60rpx;
	border-radius: 35rpx;
	padding: 0 40rpx 0 30rpx;
	box-sizing: border-box;
	background: #fff;
	display: flex;
	align-items: center;
	flex-wrap: nowrap;
	color: #999;
}

.tui-category {
	font-size: 24rpx;
	color: #fff;
	display: flex;
	align-items: center;
	justify-content: center;
	flex-direction: column;
	margin: 0;
	margin-right: 22rpx;
	flex-shrink: 0;
}

.tui-category-scale {
	transform: scale(0.7);
	line-height: 24rpx;
}

.tui-icon-category {
	line-height: 20px !important;
	margin-bottom: 0 !important;
}

.tui-swiper {
	font-size: 26rpx;
	height: 60rpx;
	flex: 1;
	padding-left: 12rpx;
}

.tui-swiper-item {
	display: flex;
	align-items: center;
}

.tui-hot-item {
	line-height: 26rpx;
	white-space: nowrap;
	overflow: hidden;
	text-overflow: ellipsis;
}

.tui-header-banner {
	padding-top: 100rpx;
	box-sizing: border-box;
	background: #e41f19;
}

.tui-hot-search {
	color: #fff;
	font-size: 24rpx;
	display: flex;
	align-items: center;
	justify-content: space-between;
	padding: 0 20rpx;
	box-sizing: border-box;
	position: relative;
	z-index: 2;
}

.tui-hot-tag {
	background: rgba(255, 255, 255, 0.15);
	padding: 10rpx 24rpx;
	border-radius: 30rpx;
	display: flex;
	align-items: center;
	justify-content: center;
	line-height: 24rpx;
	/* margin-left: 20rpx; */
}

.tui-banner-bg {
	display: flex;
	height: 180rpx;
	background: #e41f19;
	position: relative;
}

.tui-primary-bg {
	width: 50%;
	display: inline-block;
	height: 224rpx;
	border: 1px solid transparent;
	position: relative;
	z-index: 1;
	background: #e41f19;
}

.tui-route-left {
	transform: skewY(8deg);
}

.tui-route-right {
	transform: skewY(-8deg);
}

.tui-banner-box {
	width: 100%;
	padding: 0 20rpx;
	box-sizing: border-box;
	position: absolute;
	/* overflow: hidden; */
	z-index: 99;
	bottom: -80rpx;
	left: 0;
}

.tui-banner-swiper {
	width: 100%;
	height: 240rpx;
	border-radius: 12rpx;
	overflow: hidden;
	transform: translateY(0);
}

.tui-slide-image {
	width: 100%;
	height: 240rpx;
	display: block;
}

/* #ifdef APP-PLUS || MP */
.tui-banner-swiper .wx-swiper-dot {
	width: 8rpx;
	height: 8rpx;
	display: inline-flex;
	background: none;
	justify-content: space-between;
}

.tui-banner-swiper .wx-swiper-dot::before {
	content: '';
	flex-grow: 1;
	background: rgba(255, 255, 255, 0.8);
	border-radius: 16rpx;
	overflow: hidden;
}

.tui-banner-swiper .wx-swiper-dot-active::before {
	background: #fff;
}

.tui-banner-swiper .wx-swiper-dot.wx-swiper-dot-active {
	width: 16rpx;
}

/* #endif */

/* #ifdef H5 */
>>> .tui-banner-swiper .uni-swiper-dot {
	width: 8rpx;
	height: 8rpx;
	display: inline-flex;
	background: none;
	justify-content: space-between;
}

>>> .tui-banner-swiper .uni-swiper-dot::before {
	content: '';
	flex-grow: 1;
	background: rgba(255, 255, 255, 0.8);
	border-radius: 16rpx;
	overflow: hidden;
}

>>> .tui-banner-swiper .uni-swiper-dot-active::before {
	background: #fff;
}

>>> .tui-banner-swiper .uni-swiper-dot.uni-swiper-dot-active {
	width: 16rpx;
}

/* #endif */

.tui-product-category {
	background: #fff;
	padding: 80rpx 20rpx 30rpx 20rpx;
	box-sizing: border-box;
	display: flex;
	align-items: center;
	justify-content: space-between;
	flex-wrap: wrap;
	font-size: 24rpx;
	color: #555;
	margin-bottom: 20rpx;
}

.tui-category-item {
	width: 20%;
	height: 118rpx;
	display: flex;
	align-items: center;
	justify-content: space-between;
	flex-direction: column;
	padding-top: 30rpx;
}

.tui-category-img {
	height: 80rpx;
	width: 80rpx;
	display: block;
}

.tui-category-name {
	line-height: 24rpx;
}

.tui-product-box {
	margin-top: 20rpx;
	padding: 0 20rpx;
	box-sizing: border-box;
}

.tui-pb-20 {
	padding-bottom: 20rpx;
}

.tui-bg-white {
	background: #fff;
}

.tui-group-name {
	font-size: 32rpx;
	font-weight: bold;
	text-align: center;
	padding: 24rpx 0;
}

.tui-activity-box {
	display: flex;
	border-radius: 12rpx;
	overflow: hidden;
}

.tui-activity-img {
	width: 50%;
	display: block;
}

.tui-new-box {
	display: flex;
	align-items: center;
	justify-content: space-between;
	flex-wrap: wrap;
}

.tui-new-item {
	width: 49%;
	height: 200rpx;
	padding: 0 20rpx;
	box-sizing: border-box;
	display: flex;
	align-items: center;
	background: #f5f2f9;
	position: relative;
	border-radius: 12rpx;
}

.tui-new-mtop {
	margin-top: 2%;
}

.tui-title-box {
	font-size: 24rpx;
}

.tui-new-title {
	line-height: 32rpx;
	word-break: break-all;
	overflow: hidden;
	text-overflow: ellipsis;
	display: -webkit-box;
	-webkit-box-orient: vertical;
	-webkit-line-clamp: 2;
}

.tui-new-price {
	padding-top: 18rpx;
}

.tui-new-present {
	color: #ff201f;
	font-weight: bold;
}

.tui-new-original {
	display: inline-block;
	color: #a0a0a0;
	text-decoration: line-through;
	padding-left: 12rpx;
	transform: scale(0.8);
	transform-origin: center center;
}

.tui-new-img {
	width: 160rpx;
	height: 160rpx;
	display: block;
	flex-shrink: 0;
}

.tui-new-label {
	width: 56rpx;
	height: 56rpx;
	border-top-left-radius: 12rpx;
	position: absolute;
	left: 0;
	top: 0;
}

.tui-product-list {
	display: flex;
	justify-content: space-between;
	flex-direction: row;
	flex-wrap: wrap;
	box-sizing: border-box;
	/* padding-top: 20rpx; */
}

.tui-product-container {
	flex: 1;
	margin-right: 2%;
}

.tui-product-container:last-child {
	margin-right: 0;
}

.tui-pro-item {
	width: 100%;
	margin-bottom: 4%;
	background: #fff;
	box-sizing: border-box;
	border-radius: 12rpx;
	overflow: hidden;
}

.tui-pro-img {
	width: 100%;
	display: block;
}

.tui-pro-content {
	display: flex;
	flex-direction: column;
	justify-content: space-between;
	box-sizing: border-box;
	padding: 20rpx;
}

.tui-pro-tit {
	color: #2e2e2e;
	font-size: 26rpx;
	word-break: break-all;
	overflow: hidden;
	text-overflow: ellipsis;
	display: -webkit-box;
	-webkit-box-orient: vertical;
	-webkit-line-clamp: 2;
}

.tui-pro-price {
	padding-top: 18rpx;
}

.tui-sale-price {
	font-size: 34rpx;
	font-weight: 500;
	color: #e41f19;
}

.tui-factory-price {
	font-size: 24rpx;
	color: #a0a0a0;
	text-decoration: line-through;
	padding-left: 12rpx;
}

.tui-pro-pay {
	padding-top: 10rpx;
	font-size: 24rpx;
	color: #656565;
}

.tui-input {
	flex: 1;
	color: #333;
	padding: 0 16upx;
	font-size: 28upx;
}

.tui-input-plholder {
	font-size: 28upx;
	color: #b2b2b2;
}

</style>

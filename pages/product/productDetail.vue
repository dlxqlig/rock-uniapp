<template>
	<view class="container">
		<view class="carousel">
			<swiper indicator-dots circular=true duration="400">
				<swiper-item class="swiper-item" v-for="(item, index) in pics" :key="index">
					<view class="image-wrapper">
						<image :src="item" class="loaded" mode="aspectFill"></image>
					</view>
				</swiper-item>
			</swiper>
		</view>

		<view class="introduce-section">
			<text class="title">{{product.title}}</text>
			<view class="price-box">
				<text class="price-tip">¥</text>
				<text class="price">{{product.price}}</text>
			</view>
			<view class="bot-row">
				<text>销量: {{product.sale}}</text>
				<text>库存: {{product.stock}}</text>
			</view>
		</view>

		<view class="c-list">
			<view class="c-row b-b" @click="toggleSpec">
				<text class="tit">购买类型</text>
				<view class="con">
					<text class="selected-text">
						{{ selectedSkuAttrs ? selectedSkuAttrs : '请选择'}}
					</text>
				</view>
				<text class="yticon icon-you"></text>
			</view>
<!-- 			<view v-if="couponList.length > 0" @click="toggleMask('show')" class="c-row b-b">
				<text class="tit">优惠券</text>
				<text class="con t-r red">领取优惠券</text>
				<text class="yticon icon-you"></text>
			</view> -->
			<view class="c-row b-b">
				<text class="tit">配送费用</text>
				<view v-if="product.feightTemplateName" class="con-list">
					<text>{{product.feightTemplateName}}</text>
				</view>
			</view>

			</view>

		<!-- 评价 -->
<!-- 		<view v-if="goods.appraisePage && goods.appraisePage.items.length > 0" class="eva-section">
			<view class="e-header">
				<text class="tit">评价</text>
				<text>({{goods.appraisePage.count}})</text>
				<text @click="navAllAppraise" class="tip">全部评论</text>
				<text class="yticon icon-you"></text>
			</view>
			<view class="eva-box">
				<image class="portrait" :src="goods.appraisePage.items[0].userAvatarUrl ? goods.appraisePage.items[0].userAvatarUrl : '/static/missing-face.png'" mode="aspectFill"></image>
				<view class="right">
					<text class="name">{{goods.appraisePage.items[0].userNickName?goods.appraisePage.items[0].userNickName:('用户' + goods.appraisePage.items[0].userId)}}</text>
					<text class="con">{{goods.appraisePage.items[0].content}}</text>
					<view class="bot">
						<text class="attr">购买类型：{{goods.appraisePage.items[0].skuTitle}}</text>
						<text class="time">{{goods.appraisePage.items[0].gmtCreate}}</text>
					</view>
				</view>
			</view>
		</view> -->

		<view class="detail-desc">
			<view class="d-header">
				<text>图文详情</text>
			</view>
			<rich-text style="width: 750upx;" :nodes="product.detailMobileHtml"></rich-text>
		</view>

		<!-- 底部操作菜单 -->
		<view class="page-bottom">
			<navigator url="/pages/mall/mall" open-type="switchTab" class="p-b-btn">
				<text class="yticon icon-xiatubiao--copy"></text>
				<text>首页</text>
			</navigator>
			<navigator url="/pages/cart/cart" open-type="switchTab" class="p-b-btn">
				<text class="yticon icon-gouwuche"></text>
				<text>购物车</text>
			</navigator>

<!-- 			<view class="p-b-btn" :class="{active: goods.collect}" @click="toFavorite">
				<text class="yticon icon-shoucang"></text>
				<text>收藏</text>
			</view> -->
			<view class="action-btn-group">
				<button type="primary" class=" action-btn no-border buy-now-btn" @click="buy">立即购买</button>
				<button type="primary" class=" action-btn no-border add-cart-btn" @click="addCart">加入购物车</button>
			</view>
		</view>

		<view class="mask" :class="maskState===0 ? 'none' : maskState===1 ? 'show' : ''" @click="toggleMask">
			<view class="mask-content" @click.stop.prevent="stopPrevent">
				<view @click="obtainCoupon(index)" class="coupon-item" v-for="(item,index) in couponList" :key="index">
					<view class="con">
						<view class="left">
							<text class="title">{{item.title}}</text>
							<text v-if="item.gmtEnd" class="time">在{{item.gmtEnd}}前有效。 可领{{item.limit}}张，已领{{item.nowCount}}张</text>
							<text v-if="!item.gmtEnd" class="time">在领取后{{item.days}}天内有效。可领{{item.limit}}张，已领{{item.nowCount}}张</text>
						</view>
						<view class="right">
							<text class="price">{{item.discount / 100.0}}</text>
							<text>满{{item.min / 100.0}}可用</text>
						</view>
						<view class="circle l"></view>
						<view class="circle r"></view>
					</view>
					<text class="tips">{{item.categoryTitle?'限' + item.categoryTitle + '可用': '全品类可用'}}</text>
				</view>
			</view>
		</view>


		<!-- 规格-模态层弹窗 -->
		<view class="popup spec" :class="specClass" @touchmove.stop.prevent="stopPrevent">
			<!-- 遮罩层 -->
			<view class="mask"></view>
			<view class="layer attr-content" @click.stop="stopPrevent">
				<view class="a-t">
					<view class="right">
						<text class="price">{{selectedSku.price}}</text>
						<text class="stock">库存：{{selectedSku.stock}}件</text>
						<view class="selected">
							已选：
							<text>
								{{selectedSkuAttrs}}
							</text>
						</view>
					</view>
				</view>
				<view class="attr-list">
					<view class="item-list">
						<text v-for="(skuItem, skuIndex) in skuList" 
							:key="skuIndex" 
							class="tit"
							:class="{selected: skuIndex === selectedSkuIndex}"
							@click="selectSpec(skuItem, skuIndex)">
							{{skuItem.sp1 + " " + skuItem.sp2}}
						</text>
					</view>
				</view>
				<button class="btn" @click="toggleSpec">完成</button>
			</view>
		</view>
		<!-- 分享 -->
		<share ref="share" :contentHeight="580" :shareList="shareList"></share>
	</view>
</template>

<script>
	import share from '@/components/share/share';
	export default {
		components: {
			share
		},
		data() {
			return {
				product: {
				},
				skuList:[],
				attrList:[],
				pics: [],
				specClass: 'none',
				specSelected: [],
				shareList: [],
				selectedSku: {},
				selectedSkuIndex: -1,
				selectedSkuAttrs: '',
				toggleCallback: undefined,
				maskState: 0, //优惠券面板显示状态
				couponList: [],
				submiting: false

			};
		},
		onShow() {
		},
		async onLoad(options) {
			const that = this
			that.$api.api.request('/home/getProduct', 'GET', {productId:options.productId})
				.then(res => {
				that.product = res.data;
				that.skuList = that.product.skuStockList;
				that.pics = that.product.albumPics.split(",");
				that.attrList = that.product.productAttributeList;
			})
			// that.$api.request('coupon', 'getObtainableCoupon').then(res => {
			// 	that.couponList = res.data
			// })
		},
		methods: {
			toggleMask(type) {
				let timer = type === 'show' ? 10 : 300;
				let state = type === 'show' ? 1 : 0;
				this.maskState = 2;
				setTimeout(() => {
					this.maskState = state;
				}, timer)
			},
			//领取优惠券
			obtainCoupon(index) {
				// const that = this
				// that.$api.request('coupon', 'obtainCoupon', {
				// 	couponId : that.couponList[index].id
				// }).then(res => {
				// 	that.$api.msg('领取成功')
				// 	that.couponList[index].nowCount++
				// 	that.toggleMask()
				// })
			},
			//规格弹窗开关
			toggleSpec(e) {
				if (this.specClass === 'show') {
					this.specClass = 'hide';
					
					setTimeout(() => {
						this.specClass = 'none';
						if (this.toggleCallback) {
							this.toggleCallback()
							this.toggleCallback = undefined
						}
					}, 150);
				} else if (this.specClass === 'none') {
					this.specClass = 'show';
					if (!this.selectedSku.name) {
						this.selectedSku = this.skuList[0]
						this.selectedSkuIndex = 0
					}
				}
			},
			//选择规格
			selectSpec(skuItem, skuIndex) {
				this.selectedSku = skuItem
				this.selectedSkuIndex = skuIndex
				this.selectedSkuAttrs = this.selectedSku.sp1 + " " + this.selectedSku.sp2
			},
			//加入购物车
			addCart(e) {
				const that = this
				if (!that.selectedSku.id) {
					that.specClass = 'none'
					that.toggleSpec()
					that.toggleCallback = that.addCart
				} else {
					//添加到购车车
					let cartItem = that.selectedSku
					cartItem.productId = that.product.id;
					cartItem.quantity = 1;
					that.$api.api.request('/cart/add', 'POST', 
						JSON.stringify(cartItem)
					).then(res => {
						that.$api.msg('添加购物车成功')
					})
				}
			},

			//分享
			share() {
				this.$refs.share.toggleMask();
			},
			//收藏
			toFavorite() {
				const that = this
				// if (that.goods.collect) {
				// 	//取消收藏
				// 	that.goods.collect = false
				// 	this.$api.request('collect','deleteCollect', {
				// 		spuId : that.goods.id
				// 	}).then(res => {
						
				// 	})
				// } else {
				// 	//添加收藏
				// 	that.goods.collect = true
				// 	this.$api.request('collect','addCollect', {
				// 		spuId: that.goods.id
				// 	})
				// }
			},
			buy() {
				const that = this
				// if (!that.selectedSku.id) {
				// 	that.specClass = 'none'
				// 	that.toggleSpec()
				// 	that.toggleCallback = that.buy
				// } else {
				// 	let skuItem = {
				// 		skuId: that.selectedSku.id,
				// 		num: 1,
				// 		title: that.goods.title,
				// 		originalPrice: that.selectedSku.originalPrice,
				// 		price: that.selectedSku.price,
				// 		vipPrice: that.selectedSku.vipPrice,
				// 		skuTitle: that.selectedSku.title,
				// 		spuImg: that.goods.img,
				// 		skuImg: that.selectedSku.img,
				// 		stock: that.selectedSku.stock,
				// 		spuId: that.goods.id,
				// 		categoryId: that.goods.categoryId,
				// 		categoryIdList: that.goods.categoryIds
				// 	}
				// 	let skuList = [1]
				// 	skuList[0] = skuItem
				// 	uni.navigateTo({
				// 		url: `/pages/order/create?takeway=buy&data=${JSON.stringify(skuList)}`
				// 	})
				// }
				
				
			},
			//查看所有评价
			navAllAppraise() {
				uni.navigateTo({
					url: `/pages/product/appraise?spuid=${this.goods.id}&firstpage=${JSON.stringify(this.goods.appraisePage)}`
				})
			},
			stopPrevent() {}
		},

	}
</script>

<style lang='scss'>
	page {
		background: #f7f7f7;
	}
	.container {
		padding-top: 20upx;
		padding-bottom: 20upx;
	}
	.icon-you {
		font-size: 28upx + 2upx;
		color: #888;
	}

	.carousel {
		height: 722upx;
		position: relative;

		swiper {
			height: 100%;
		}

		.image-wrapper {
			width: 100%;
			height: 100%;
		}

		.swiper-item {
			display: flex;
			justify-content: center;
			align-content: center;
			height: 750upx;
			overflow: hidden;

			image {
				width: 100%;
				height: 100%;
			}
		}

	}

	/* 标题简介 */
	.introduce-section {
		background: #fff;
		padding: 20upx 30upx;

		.title {
			font-size: 32upx;
			color: #DCDFE6;
			height: 50upx;
			line-height: 50upx;
		}

		.price-box {
			display: flex;
			align-items: baseline;
			height: 64upx;
			padding: 10upx 0;
			font-size: 26upx;
			color: #fa436a;
		}

		.price {
			font-size: 32upx + 2upx;
		}

		.m-price {
			margin: 0 12upx;
			color: #909399;
			text-decoration: line-through;
		}

		.coupon-tip {
			align-items: center;
			padding: 4upx 10upx;
			background: #fa436a;
			font-size: 24upx;
			color: #fff;
			border-radius: 6upx;
			line-height: 1;
			transform: translateY(-4upx);
		}

		.bot-row {
			display: flex;
			align-items: center;
			height: 50upx;
			font-size: 24upx;
			color: #909399;

			text {
				flex: 1;
			}
		}
	}

	/* 分享 */
	.share-section {
		display: flex;
		align-items: center;
		color: #606266;
		background: linear-gradient(left, #fdf5f6, #fbebf6);
		padding: 12upx 30upx;

		.share-icon {
			display: flex;
			align-items: center;
			width: 70upx;
			height: 30upx;
			line-height: 1;
			border: 1px solid #fa436a;
			border-radius: 4upx;
			position: relative;
			overflow: hidden;
			font-size: 22upx;
			color: #fa436a;

			&:after {
				content: '';
				width: 50upx;
				height: 50upx;
				border-radius: 50%;
				left: -20upx;
				top: -12upx;
				position: absolute;
				background: #fa436a;
			}
		}

		.icon-xingxing {
			position: relative;
			z-index: 1;
			font-size: 24upx;
			margin-left: 2upx;
			margin-right: 10upx;
			color: #fff;
			line-height: 1;
		}

		.tit {
			font-size: 28upx;
			margin-left: 10upx;
		}

		.icon-bangzhu1 {
			padding: 10upx;
			font-size: 30upx;
			line-height: 1;
		}

		.share-btn {
			flex: 1;
			text-align: right;
			font-size: 24upx;
			color: #fa436a;
		}

		.icon-you {
			font-size: 24upx;
			margin-left: 4upx;
			color: #fa436a;
		}
	}

	.c-list {
		font-size: 24upx + 2upx;
		color: #606266;
		background: #fff;

		.c-row {
			display: flex;
			align-items: center;
			padding: 20upx 30upx;
			position: relative;
		}

		.tit {
			width: 140upx;
		}

		.con {
			flex: 1;
			color: #303133;

			.selected-text {
				margin-right: 10upx;
			}
		}

		.bz-list {
			height: 40upx;
			font-size: 24upx+2upx;
			color: #303133;

			text {
				display: inline-block;
				margin-right: 30upx;
			}
		}

		.con-list {
			flex: 1;
			display: flex;
			flex-direction: column;
			color: #303133;
			line-height: 40upx;
		}

		.red {
			color: #fa436a;
		}
	}

	/* 评价 */
	.eva-section {
		display: flex;
		flex-direction: column;
		padding: 20upx 30upx;
		background: #fff;
		margin-top: 16upx;

		.e-header {
			display: flex;
			align-items: center;
			height: 70upx;
			font-size: 24upx + 2upx;
			color: #909399;

			.tit {
				font-size: 28upx + 2upx;
				color: #303133;
				margin-right: 4upx;
			}

			.tip {
				flex: 1;
				text-align: right;
			}

			.icon-you {
				margin-left: 10upx;
			}
		}
	}

	.eva-box {
		display: flex;
		padding: 20upx 0;

		.portrait {
			flex-shrink: 0;
			width: 80upx;
			height: 80upx;
			border-radius: 100px;
		}

		.right {
			flex: 1;
			display: flex;
			flex-direction: column;
			font-size: 28upx;
			color: #606266;
			padding-left: 26upx;

			.con {
				font-size: 28upx;
				color: #303133;
				padding: 20upx 0;
			}

			.bot {
				display: flex;
				justify-content: space-between;
				font-size: 24upx;
				color: #909399;
			}
		}
	}

	/*  详情 */
	.detail-desc {
		background: #fff;
		margin-top: 16upx;
		width: 750upx;

		.d-header {
			display: flex;
			justify-content: center;
			align-items: center;
			height: 80upx;
			font-size: 28upx + 2upx;
			color: #DCDFE6;
			position: relative;

			text {
				padding: 0 20upx;
				background: #fff;
				position: relative;
				z-index: 1;
			}

			&:after {
				position: absolute;
				left: 50%;
				top: 50%;
				transform: translateX(-50%);
				width: 300upx;
				height: 0;
				content: '';
				border-bottom: 1px solid #ccc;
			}
		}
	}

	/* 规格选择弹窗 */
	.attr-content {
		padding: 10upx 30upx;

		.a-t {
			display: flex;

			image {
				width: 170upx;
				height: 170upx;
				flex-shrink: 0;
				margin-top: -40upx;
				border-radius: 8upx;
				;
			}

			.right {
				display: flex;
				flex-direction: column;
				padding-left: 24upx;
				font-size: 24upx + 2upx;
				color: #606266;
				line-height: 42upx;

				.price {
					font-size: 32upx;
					color: #fa436a;
					margin-bottom: 10upx;
				}

				.selected-text {
					margin-right: 10upx;
				}
			}
		}

		.attr-list {
			display: flex;
			flex-direction: column;
			font-size: 28upx + 2upx;
			color: #606266;
			padding-top: 30upx;
			padding-left: 10upx;
		}

		.item-list {
			padding: 20upx 0 0;
			display: flex;
			flex-wrap: wrap;

			text {
				display: flex;
				align-items: center;
				justify-content: center;
				background: #eee;
				margin-right: 20upx;
				margin-bottom: 20upx;
				border-radius: 100upx;
				min-width: 60upx;
				height: 60upx;
				padding: 0 20upx;
				font-size: 28upx;
				color: #606266;
			}

			.selected {
				background: #fbebee;
				color: #fa436a;
			}
		}
	}

	/*  弹出层 */
	.popup {
		position: fixed;
		left: 0;
		top: 0;
		right: 0;
		bottom: 0;
		z-index: 99;

		&.show {
			display: block;

			.mask {
				animation: showPopup 0.2s linear both;
			}

			.layer {
				animation: showLayer 0.2s linear both;
			}
		}

		&.hide {
			.mask {
				animation: hidePopup 0.2s linear both;
			}

			.layer {
				animation: hideLayer 0.2s linear both;
			}
		}

		&.none {
			display: none;
		}

		.mask {
			position: fixed;
			top: 0;
			width: 100%;
			height: 100%;
			z-index: 1;
			background-color: rgba(0, 0, 0, 0.4);
		}

		.layer {
			position: fixed;
			z-index: 99;
			bottom: 0;
			width: 100%;
			min-height: 40vh;
			border-radius: 10upx 10upx 0 0;
			background-color: #fff;

			.btn {
				height: 66upx;
				line-height: 66upx;
				border-radius: 100upx;
				background: #fa436a;
				font-size: 28upx + 2upx;
				color: #fff;
				margin: 30upx auto 20upx;
			}
		}

		@keyframes showPopup {
			0% {
				opacity: 0;
			}

			100% {
				opacity: 1;
			}
		}

		@keyframes hidePopup {
			0% {
				opacity: 1;
			}

			100% {
				opacity: 0;
			}
		}

		@keyframes showLayer {
			0% {
				transform: translateY(120%);
			}

			100% {
				transform: translateY(0%);
			}
		}

		@keyframes hideLayer {
			0% {
				transform: translateY(0);
			}

			100% {
				transform: translateY(120%);
			}
		}
	}

	/* 底部操作菜单 */
	.page-bottom {
		position: fixed;
		left: 30upx;
		bottom: 30upx;
		z-index: 95;
		display: flex;
		justify-content: center;
		align-items: center;
		width: 690upx;
		height: 100upx;
		background: rgba(255, 255, 255, .9);
		box-shadow: 0 0 20upx 0 rgba(0, 0, 0, .5);
		border-radius: 16upx;

		.p-b-btn {
			display: flex;
			flex-direction: column;
			align-items: center;
			justify-content: center;
			font-size: 24upx;
			color: #606266;
			width: 96upx;
			height: 80upx;

			.yticon {
				font-size: 40upx;
				line-height: 48upx;
				color: #909399;
			}

			&.active,
			&.active .yticon {
				color: #fa436a;
			}

			.icon-fenxiang2 {
				font-size: 42upx;
				transform: translateY(-2upx);
			}

			.icon-shoucang {
				font-size: 46upx;
			}
		}

		.action-btn-group {
			display: flex;
			height: 76upx;
			border-radius: 100px;
			overflow: hidden;
			box-shadow: 0 20upx 40upx -16upx #fa436a;
			box-shadow: 1px 2px 5px rgba(219, 63, 96, 0.4);
			background: linear-gradient(to right, #ffac30, #fa436a, #F56C6C);
			margin-left: 20upx;
			position: relative;

			&:after {
				content: '';
				position: absolute;
				top: 50%;
				right: 50%;
				transform: translateY(-50%);
				height: 28upx;
				width: 0;
				border-right: 1px solid rgba(255, 255, 255, .5);
			}

			.action-btn {
				display: flex;
				align-items: center;
				justify-content: center;
				width: 180upx;
				height: 100%;
				font-size: 28upx;
				padding: 0;
				border-radius: 0;
				background: transparent;
			}
		}
	}
	/* 优惠券面板 */
	.mask {
		display: flex;
		align-items: flex-end;
		position: fixed;
		left: 0;
		top: var(--window-top);
		bottom: 0;
		width: 100%;
		background: rgba(0, 0, 0, 0);
		z-index: 9995;
		transition: .3s;

		.mask-content {
			width: 100%;
			min-height: 30vh;
			max-height: 70vh;
			background: #f3f3f3;
			transform: translateY(100%);
			transition: .3s;
			overflow-y: scroll;
		}

		&.none {
			display: none;
		}

		&.show {
			background: rgba(0, 0, 0, .4);

			.mask-content {
				transform: translateY(0);
			}
		}
	}

	/* 优惠券列表 */
	.coupon-item {
		display: flex;
		flex-direction: column;
		margin: 20upx 24upx;
		background: #fff;

		.con {
			display: flex;
			align-items: center;
			position: relative;
			height: 120upx;
			padding: 0 30upx;

			&:after {
				position: absolute;
				left: 0;
				bottom: 0;
				content: '';
				width: 100%;
				height: 0;
				border-bottom: 1px dashed #f3f3f3;
				transform: scaleY(50%);
			}
		}

		.left {
			display: flex;
			flex-direction: column;
			justify-content: center;
			flex: 1;
			overflow: hidden;
			height: 100upx;
		}

		.title {
			font-size: 32upx;
			color: #DCDFE6;
			margin-bottom: 10upx;
		}

		.time {
			font-size: 24upx;
			color: #909399;
		}

		.right {
			display: flex;
			flex-direction: column;
			justify-content: center;
			align-items: center;
			font-size: 26upx;
			color: #606266;
			height: 100upx;
		}

		.price {
			font-size: 44upx;
			color: #fa436a;

			&:before {
				content: '￥';
				font-size: 34upx;
			}
		}

		.tips {
			font-size: 24upx;
			color: #909399;
			line-height: 60upx;
			padding-left: 30upx;
		}

		.circle {
			position: absolute;
			left: -6upx;
			bottom: -10upx;
			z-index: 10;
			width: 20upx;
			height: 20upx;
			background: #f3f3f3;
			border-radius: 100px;

			&.r {
				left: auto;
				right: -6upx;
			}
		}
	}
	
	rich-text .rich-img {
		width: 100%;
		height: auto;
		margin: 0;
		padding: 0;
	}
</style>

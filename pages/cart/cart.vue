<template>
	<view class="container">
		<!-- 空白页 -->
		<view v-if="!isLogin || empty===true" class="empty-cart">
			<image src="/static/images/cart/emptyCart.png" mode="aspectFit"></image>
			<view v-if="isLogin" class="empty-tips">
				空空如也
				<navigator class="navigator" v-if="isLogin" url="/pages/mall/mall" open-type="switchTab">随便逛逛></navigator>
			</view>
			<view v-else class="empty-tips">
				空空如也
				<view class="navigator" @click="navToLogin">去登陆></view>
			</view>
		</view>
		<view v-else>
			<!-- #ifdef MP || H5-->
			<view class="tui-edit-goods">
				<view>购物车共<text class="tui-goods-num">{{cartSize}}</text>件商品</view>
				<view>
					<tui-button type="gray" :plain="true" shape="circle" width="160rpx" height="60rpx" :size="24" @click="editGoods">{{isEdit?"完成":"编辑商品"}}</tui-button>
				</view>
			</view>
			<!-- #endif -->
			<checkbox-group>
				<view class="tui-cart-cell  tui-mtop" v-for="(item,index) in cartList" :key="index">
					<tui-swipe-action :actions="actions" @click="handlerButton" :params="item">
						<template v-slot:content>
							<view class="tui-goods-item">
								<label class="tui-checkbox" >
									<checkbox color="#fff" :checked="item.checked" @click="check('item', index)"></checkbox>
								</label>
								<image :src="(item.productPic) + '?x-oss-process=style/100px'" class="tui-goods-img" @tap="detail"/>
								<view class="tui-goods-info">
									<view class="tui-goods-title" @tap="detail">
										{{item.productName}}
									</view>
									<view class="tui-goods-title" @tap="detail">
										{{item.productSubTitle}}
									</view>
									<view class="tui-price-box">
										<view class="tui-goods-price">￥{{item.price}}</view>
										<view class="tui-scale">
											<tui-numberbox :value="item.quantity" :height="40" :width="74" :min="1" :index="index" @change="numberChange"></tui-numberbox>
										</view>
									</view>
								</view>
							</view>
						</template>
					</tui-swipe-action>
				</view>
			</checkbox-group>
	
			<!--tabbar-->
			<view class="tui-tabbar">
				<view class="tui-checkAll">
					<checkbox-group>
						<label class="tui-checkbox">
							<checkbox color="#fff" :checked="allChecked" @click="check('all')"></checkbox>
							<text class="tui-checkbox-pl">全选</text>
						</label>
					</checkbox-group>
					<view class="clear-btn"  @click="clearCart">
						清空
					</view>
					<view class="tui-total-price">
					 <text class="tui-goods-price">¥{{total}}</text>
					 <text class="tui-bold">
					 	总共
					 	<text>{{totalItems}}</text>
					 	件
					 </text>
					  </view>
				</view>
				<view>
					<tui-button width="200rpx" height="70rpx" :size="30" type="danger" shape="circle" v-if="!isEdit" @click="createOrder()">去结算</tui-button>
					<tui-button width="200rpx" height="70rpx" :size="30" type="danger" shape="circle" :plain="true" @click="deleteCartItem()" v-else>删除</tui-button>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import {
		mapState
	} from 'vuex';
	import tuiSwipeAction from "@/components/swipe-action/swipe-action"
	import tuiButton from "@/components/extend/button/button"
	import tuiNumberbox from "@/components/numberbox/numberbox"
	import tuiIcon from "@/components/icon/icon"
	import tuiDivider from "@/components/divider/divider"
	import tuiLoadmore from "@/components/loadmore/loadmore"
	export default {
		components: {
			tuiSwipeAction,
			tuiButton,
			tuiNumberbox,
			tuiIcon,
			tuiDivider,
			tuiLoadmore
		},
		data() {
			return {
				totalItems: 0, //总数量
				total: 0, //总价格
				allChecked: false, //全选状态  true|false
				empty: false, //空白页现实  true|false
				cartList: [],
				cartSize: 0,
				actions: [
					{
						name: '删除',
						color: '#fff',
						fontsize: 28,
						width: 64,
						background: '#F82400'
					}
				],
				isEdit: false,
			};
		},
		onLoad(){
			
		},
		onShow() {
			this.loadData();
		},
		watch:{
			//显示空白页
			cartList(e){
				let empty = e.length === 0 ? true: false;
				if(this.empty !== empty){
					this.empty = empty;
				}
			}
		},
		computed:{
			...mapState(['isLogin'])
		},
		methods: {
			//请求数据
			async loadData(){
				const that = this
				that.$api.api.request('/cart/list', 'GET', {}).then(res => {
					that.cartList = res.data
					that.cartList.forEach(item => {
						item.checked = true
					})
					that.cartSize = that.cartList.length;
					that.allChecked = true;
					that.totalItems = that.cartSize;
					that.calcTotal();  //计算总价
				})
			},
			//选中状态处理
			check(type, index){
				if(type === 'item'){
					this.cartList[index].checked = !this.cartList[index].checked;
				}else{
					const checked = !this.allChecked
					const list = this.cartList;
					list.forEach(item=>{
						item.checked = checked;
					})
					this.allChecked = checked;
				}
				this.calcTotal(type);
			},
			handlerButton: function(e) {
				let index = e.index;
				let item = e.item;
				this.deleteCartItem(index);
			},
			editGoods: function() {
				// #ifdef H5 || MP
				this.isEdit = !this.isEdit;
				// #endif
			},
			detail: function() {
				uni.navigateTo({
					url: '../product/productDetail'
				})
			},
			navToLogin(){
				uni.navigateTo({
					url: '/pages/public/login'
				})
			},
			//数量
			numberChange(data){
				const that = this
				that.$api.api.request('/cart/update/quantity','POST', {
					id: that.cartList[data.index].id,
					quantity: data.value
				}).then(res => {
					that.cartList[data.index].quantity = data.value;
					that.calcTotal();
				})
			},
			// delete selected item 
			deleteSelectedItem() {
				let ids = [];
				let catListBak = cartList;
				const that = this
				for(i=0; i<cartList.length; i++) {
					if (item.checked) {
						ids.push(that.item.id);
						catListBak.splice(i, 1)
					}
				}

				if (ids.length === 0) {
					that.$api.api.msg('您没有选中任何商品')
					return
				}

				that.$api.api.request('/cart/delete', 'POST', {
					ids:ids
				}).then(res => {
					that.cartList = catListBak
				})	
				that.cartSize = that.cartList.size();
				that.calcTotal();

			},
			//删除
			deleteCartItem(index){
				const that = this
				let ids = [];
				ids.push(that.cartList[index].id);
				that.$api.api.request('/cart/delete', 'POST', {
					ids: ids
				}).then(res => {
					that.cartList.splice(index, 1);
					that.cartSize =that.cartList.size();
					that.calcTotal();
				})				
			},
			//清空
			clearCart(){
				const that = this
				uni.showModal({
					content: '清空购物车？',
					success: (e)=>{
						if(e.confirm){
							that.$api.api.request('/cart/clear','POST').then(res => {
								that.cartList = []
							})
						}
					}
				})
			},
			//计算总价
			calcTotal(){
				const that = this
				let list = that.cartList;
				if(list.length === 0){
					that.empty = true;
					return;
				}
				let total = 0;
				let totalItems = 0;
				let checked = true;
				list.forEach(item=>{
					if(item.checked === true){
						totalItems += item.quantity
						total += (item.price) * item.quantity;
					}else if(checked === true){
						checked = false;
					}
				})
				this.allChecked = checked;
				this.total = Number(total.toFixed(2));
				this.totalItems = totalItems
			},
			//创建订单
			createOrder(){
				//滤除未被选择的item
				let selectedItems = []
				this.cartList.forEach(item => {
					if (item.checked) {
						selectedItems.push(item)
					}
				})
				if (selectedItems.length === 0) {
					this.$api.api.msg('您没有选中任何商品')
					return
				}
				uni.navigateTo({
					url: `/pages/order/create`
				})
			}
		}
	}
</script>

<style>
	
	.container{
		padding-bottom: 134upx;
	}
	.empty-cart{
		position:fixed;
		left: 20upx;
		top: 20upx;
		width: 100%;
		height: 100vh;
		padding-bottom:100upx;
		display:flex;
		justify-content: center;
		flex-direction: column;
		align-items:center;
		background: #fff;
		image{
			width: 240upx;
			height: 160upx;
			margin-bottom:30upx;
			margin-left:30upx;
		}
		.empty-tips{
			justify-content: center;
			display:flex;
			font-size: 24upx+2upx;
			color: #C0C4CC;
			.navigator{
				color: #fa436a;
				margin-left: 16upx;
			};
			padding-left:48upx;
		}
	}
	.tui-mtop {
		margin-top: 24rpx;
	}
	.tui-edit-goods {
		width: 100%;
		border-radius: 12rpx;
		overflow: hidden;
		padding: 24rpx 30rpx 0 30rpx;
		box-sizing: border-box;
		display: flex;
		justify-content: space-between;
		align-items: center;
		color: #333;
		font-size: 24rpx;
	}
	.tui-goods-num {
		font-weight: bold;
		color: #e41f19;
	}
	.tui-cart-cell {
		width: 100%;
		border-radius: 12rpx;
		background: #FFFFFF;
		padding: 40rpx 0;
		overflow: hidden;
	}
	.tui-goods-item {
		display: flex;
		padding: 0 30rpx;
		box-sizing: border-box;
	}

	.tui-checkbox {
		/* width: 40rpx; */
		padding-right: 30rpx;
		display: flex;
		align-items: center;
	}
	/* #ifdef APP-PLUS || MP */
	.tui-checkbox .wx-checkbox-input {
		width: 36rpx;
		height: 36rpx;
		border-radius: 50%;
		margin: 0;
	}
	.tui-checkbox .wx-checkbox-input.wx-checkbox-input-checked {
		background: #F82400;
		width: 40rpx;
		height: 40rpx;
		border: none;
	}
	/* #endif */
	/* #ifdef H5 */
	>>>.tui-checkbox .uni-checkbox-input {
		width: 36rpx;
		height: 36rpx;
		border-radius: 50% !important;
		margin: 0;
	}
	>>>.tui-checkbox .uni-checkbox-input.uni-checkbox-input-checked {
		background: #F82400;
		width: 40rpx;
		height: 40rpx;
		border: none;
	}
	/* #endif */

	.tui-goods-img {
		width: 220rpx;
		height: 220rpx !important;
		border-radius: 12rpx;
		flex-shrink: 0;
		display: block;
	}
	.tui-goods-info {
		width: 100%;
		padding-left: 20rpx;
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		justify-content: space-between;
		box-sizing: border-box;
		overflow: hidden;
	}
	.tui-goods-title {
		white-space: normal;
		word-break: break-all;
		overflow: hidden;
		text-overflow: ellipsis;
		display: -webkit-box;
		-webkit-box-orient: vertical;
		-webkit-line-clamp: 2;
		font-size: 24rpx;
		color: #333;
	}
	.tui-goods-model {
		max-width: 100%;
		color: #333;
		background: #F5F5F5;
		border-radius: 40rpx;
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 0 16rpx;
		box-sizing: border-box;
	}
	.tui-model-text {
		max-width: 100%;
		transform: scale(0.9);
		transform-origin: 0 center;
		font-size: 24rpx;
		line-height: 32rpx;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}
	.tui-price-box {
		width: 100%;
		display: flex;
		align-items: flex-end;
		justify-content: space-between;
	}
	.tui-goods-price {
		font-size: 34rpx;
		font-weight: 500;
		color: #e41f19;
	}
	.tui-scale {
		transform: scale(0.8);
		transform-origin: 100% 100%;
	}
	.tui-activity {
		font-size: 24rpx;
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 0 30rpx 20rpx 100rpx;
		box-sizing: border-box;
	}
	.tui-buy {
		display: flex;
		align-items: center
	}
	.tui-bold {
		font-weight: bold;
	}
	.tui-sub-info {
		max-width: 532rpx;
		font-size: 24rpx;
		line-height: 24rpx;
		padding: 20rpx 30rpx 10rpx 30rpx;
		box-sizing: border-box;
		color: #333;
		transform: scale(0.8);
		transform-origin: 100% center;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
		margin-left: auto
	}
	.tui-invalid-text {
		width: 66rpx;
		margin-right: 4rpx;
		text-align: center;
		font-size: 24rpx;
		color: #fff;
		background: rgba(0, 0, 0, .3);
		transform: scale(0.8);
		transform-origin: center center;
		border-radius: 4rpx;
		flex-shrink: 0;
	}
	.tui-invalid-pr {
		padding-right: 0 !important;
	}
	.tui-gray {
		color: #B2B2B2 !important;
	}
	.tui-goods-invalid {
		color: #555;
		font-size: 24rpx;
	}
	.tui-flex-center {
		align-items: center !important;
	}
	.tui-invalid-ptop {
		padding-top: 40rpx;
	}
	.tui-tabbar {
		width: 100%;
		height: 100rpx;
		background: #fff;
		position: fixed;
		left: 0;
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 0 30rpx;
		box-sizing: border-box;
		font-size: 24rpx;
		z-index: 99999;
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
	.tui-checkAll {
		display: flex;
		align-items: center;
	}
	.tui-checkbox-pl {
		padding-left: 12rpx;
	}
	.tui-total-price {
		padding-left: 20rpx;
		font-size: 30rpx !important;
	}
	/*猜你喜欢*/
	.tui-youlike {
		padding-left: 12rpx
	}
	.tui-product-list {
		display: flex;
		justify-content: space-between;
		flex-direction: row;
		flex-wrap: wrap;
		box-sizing: border-box;
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
	
	.clear-btn{
		padding-left: 12rpx;
		color: #4399fc;
		border-radius:0 50px 50px 0;
	}
	
</style>

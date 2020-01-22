<template>
	<view class="container">
		<scroll-view scroll-y scroll-with-animation class="tab-view" :scroll-top="scrollTop" :style="{ height: height + 'px', top: top + 'px' }">
			<view v-for="(item, index) in flist" :key="index" class="tab-bar-item" :class="[currentTab == index ? 'active' : '']" :data-current="index" @tap.stop="swichNav">
				<text>{{ item.name }}</text>
			</view>
		</scroll-view>
		<scroll-view scroll-y scroll-with-animation class="right-box" :style="{ height: height + 'px', top: top + 'px' }">
			<view class="page-view">
				<view class="g-container">
					<view v-for="item in slist" :key="item.id" class="class-box">
						<view class="g-box" @tap.stop="productList" data-key="item.name">
							<view class="tui-icon-box">
								<tui-icon :name="item.icon" :size="36" color='#f0ad4e'></tui-icon>
							</view>
							<view class="g-title">{{ item.name }}</view>
						</view>
					</view>
				</view>
				`
			</view>
		</scroll-view>
	</view>
</template>

<script>
import tuiIcon from "@/components/icon/icon"
export default {
	components: {
		tuiIcon
	},
	data() {
		return {
			flist: [],
			slist: [],
			currentId: 0,
			height: 0, //scroll-view高度
			top: 0,
			currentTab: 0, //预设当前项的值
			scrollTop: 0 //tab标题的滚动条位置
		};
	},
	onLoad: function(options) {
		setTimeout(() => {
			uni.getSystemInfo({
				success: res => {
					let header = 92;
					let top = 0;
					//#ifdef H5
					top = 44;
					//#endif
					this.height = res.windowHeight - uni.upx2px(header);
					this.top = top + uni.upx2px(header);
				}
			});
		}, 50);

		this.loadData();
	},
	methods: {
		loadData() {
			const that = this;
			that.$api.api.request('/home/productCateList', 'GET', {}).then(res => {
				console.log('success to get product cat.');
				that.rawData = res.data;

				that.flist = that.rawData.filter(item => item.parentId === 0);
				if (that.flist && that.flist.length > 0) {
					that.currentId = that.flist[0].id;
					that.slist = that.rawData.filter(item => item.parentId === that.currentId);
				}
			});
		},
		// 点击标题切换当前页时改变样式
		swichNav: function(e) {
			let that = this;
			let cur = e.currentTarget.dataset.current;
			if (this.currentTab == cur) {
				return false;
			} else {
				this.currentTab = cur;
				this.checkCor();
				if (that.flist && that.flist.length > 0) {
					that.currentId = that.flist[cur].id;
					that.slist = that.rawData.filter(item => item.parentId === that.currentId);
				}
			}
		},
		//判断当前滚动超过一屏时，设置tab标题滚动条。
		checkCor: function() {
			let that = this;
			//这里计算按照实际情况进行修改，动态数据要进行动态分析
			//思路：窗体高度/单个分类高度 200rpx 转px计算 =>得到一屏幕所显示的个数，结合后台传回分类总数进行计算
			//数据很多可以多次if判断然后进行滚动距离计算即可
			if (that.currentTab > 7) {
				that.scrollTop = 500;
			} else {
				that.scrollTop = 0;
			}
		},
		detail(e) {
			uni.navigateTo({
				url: '../productDetail/productDetail'
			});
		},
		productList(e) {
			let key = e.currentTarget.dataset.key;
			uni.navigateTo({
				url: '../productList/productList?searchKey=' + key
			});
		},
		search: function() {
			uni.navigateTo({
				url: '../product-search/product-search'
			});
		}
	}
};
</script>

<style>
page {
	background: #fcfcfc;
}

/* 左侧导航布局 start*/

/* 隐藏scroll-view滚动条*/

::-webkit-scrollbar {
	width: 0;
	height: 0;
	color: transparent;
}

.tab-view {
	/* height: 100%; */
	width: 200upx;
	position: fixed;
	left: 0;
	z-index: 10;
}

.tab-bar-item {
	width: 200upx;
	height: 110upx;
	background: #f6f6f6;
	box-sizing: border-box;
	display: flex;
	align-items: center;
	justify-content: center;
	font-size: 26upx;
	color: #444;
	font-weight: 400;
}

.active {
	position: relative;
	color: #000;
	font-size: 30upx;
	font-weight: 600;
	background: #fcfcfc;
}

.active::before {
	content: '';
	position: absolute;
	border-left: 8upx solid #e41f19;
	height: 30upx;
	left: 0;
}

/* 左侧导航布局 end*/

.right-box {
	width: 100%;
	position: fixed;
	padding-left: 220upx;
	box-sizing: border-box;
	left: 0;
}

.page-view {
	width: 100%;
	overflow: hidden;
	padding-top: 20upx;
	padding-right: 20upx;
	box-sizing: border-box;
	padding-bottom: env(safe-area-inset-bottom);
}

.class-box {
	padding-top: 30upx;
}

.class-item {
	background: #fff;
	width: 100%;
	box-sizing: border-box;
	padding: 20upx;
	margin-bottom: 20upx;
	border-radius: 12upx;
}

.class-name {
	font-size: 22upx;
}

.g-container {
	/* padding-top: 20upx; */
	display: flex;
	display: -webkit-flex;
	justify-content: flex-start;
	flex-direction: row;
	flex-wrap: wrap;
}

.g-box {
	width: 100%;
	text-align: center;
	padding-top: 20upx;
}

.g-image {
	width: 120upx;
	height: 120upx;
}

.g-title {
	font-size: 22upx;
}

.tui-icon-box {
	width: 96upx;
	height: 96upx;	
}
</style>

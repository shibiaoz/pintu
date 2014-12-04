var Scroll = function  (obj) {
	this.wraperId = '.j_scroll_wraper';
	this.closeId = '.j_close_btn';
	this.startX = 0;
	this.startY = 0;
	this.clientWidth = $(window).width();
	this.leftFlag = 0;
	this.init();
}
Scroll.prototype ={
	init:function  () {
		var wraperId  = this.wraperId;
		var closeId = this.closeId;
		this.$wraper = $(wraperId);
		this.$imgs =this.$wraper.find('img');
		this.$close  = $(closeId);
		this.bindEvent();
	},
	bindEvent:function  () {
		var self = this;
		self.$wraper.on('touchstart',function  (event) {
			console.log('----start----',event)
			event.preventDefault();
			self.leftFlag = self.$wraper.offset().left;
			var touches = event.touches[0];//zepto
			self.startX = touches.pageX;
			self.startY = touches.pageY;
		});

		self.$wraper.on('touchmove',function  (event) {
			event.preventDefault();
			console.log('----move----',event)
			var touches =event.touches[0];//zepto
			var imgWidth = self.$wraper.find('img').eq(0).width();// img width
			var width = self.$wraper.find("img").size()*imgWidth;//wraper width
			var leftBoundary = width - self.clientWidth;
			var offset = self.$wraper.offset();// wraper offsets
			var dx = touches.pageX - self.startX  ;
			if(Math.abs(offset.left) >= leftBoundary && dx < 0){
				return ;
			}else if(offset.left>=0 && dx>0){

			}else{
				var left = dx + offset.left;
				$(this).css('left',left);
			}
		});
		self.$wraper.on('touchend',function  (event) {
			window.aa = event;
			console.log(event,'end');
			if(self.leftFlag == self.$wraper.offset().left){
				//没有改变
				self.imgSrc = $(event.target).attr('src');
				self.gameStart();
			}
		});
		self.$close.on('touchstart',function  () {
			alert("aaa");
		});
	},
	gameStart:function  () {
		var self = this;
		self.$wraper.closest('.j_scroll_mask').hide();
		self.$wraper.closest('.j_scroll_mask').hide();
		var canvas = document.getElementById('canvas');
		var context = canvas.getContext('2d');
		var  size = 3;
		var offset = $("#canvas").offset();
		var imgSrc = self.imgSrc;
		console.log(imgSrc)
		//pic='img/270.jpg'
		new Game({
			canvas:canvas,
			ctx:context,
			size:size,
			pic:imgSrc,
			picWidth:270,
			picHeight:270,
			pos:offset
		});
		$('.j_btn').on('click',function  () {
			canvas = document.getElementById('canvas');
			context = canvas.getContext('2d');
			game = new Game({
				canvas:canvas,
				ctx:context,
				size:size,
				pic:imgSrc,
				picWidth:270,
				picHeight:270,
				pos:offset
			});
		});
	}

}
var Scroll = function  (obj) {
	this.wraperId = '.j_scroll_wraper';
	this.closeId = '.j_close_btn';
	this.startX = 0;
	this.startY = 0;
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
			event.preventDefault();
			var touches = event.changedTouches[0];//jquery 需要访问原生的事件
			self.startX = touches.pageX;
			self.startY = touches.pageY;
			console.log('start',event);
			/*var touches = event.originalEvent.touches[0];//jquery 需要访问原生的事件
			self.startX = touches.pageX;
			self.startY = touches.pageY;*/
		});

		self.$wraper.on('touchmove',function  (event) {
			event.preventDefault();
			var touches =event.changedTouches[0];//需要访问原生的事件
			console.log(event,event.pageX)
			var dx = touches.pageX - self.startX ;
			var dy = touches.pageY - self.startY ;
			
			$(this).css('left',dx);
		});

		self.$close.on('tap',function  () {
			self.$wraper.parent().hide();
		});
	}

}
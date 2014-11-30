function Game (obj) {
	this.canvas = obj['canvas'];
	this.ctx = obj['ctx'];
	this.size = obj['size'];//维度
	this.pic = obj['pic'];//图片url
	this.img = {};//拼图对象
	this.posArr = [];//位置对象数组
	this.randArr = [];//随机位置数组
	this.rowColArr = [];
	this.conf = $.extend({},obj);//所有的参数
	this.startX = 0;
	this.startY = 0;
	this.clickIndex = 0;
	this.eventData = {};
	this.isCompleted = false;
	this.offset = offset;
	this.init();
}
Game.prototype = {
	init:function  () {
		this.initData();
		this.initImage();
		this.bindEvent();
	},
	//初始化拼图相关数据
	initData:function  () {
		var self = this;
		var conf = this.conf;
		var size = this.size;
		var globalRand = Math.floor(Math.random()*(size*size)+1)-1;//空格
		this.picWidth = conf['picWidth'];
		this.picHeight = conf['picHeight'];
		this.globalRand = globalRand;//随机生成的位置
		var offsetX = parseInt(self.picWidth/size);
		var offsetY = parseInt(self.picHeight/size);
		var posObj = Tools.martrix(size,offsetX,offsetY);
		this.offsetX = offsetX;
		this.offsetY = offsetY;
		this.posArr = posObj['posObjArr'];//正常顺序的位置数组 
		console.log("初始化的位置数组",this.posArr);
		this.lineArr = posObj['lineArr'];
		this.randArr =  this.getAvaiableRandArr(posObj['lineArr']);
		console.log("随机数组",this.randArr);
		this.rowColArr = posObj['rowColArr'];
	},
	//获得可解的排列数组
	getAvaiableRandArr:function  (arr) {
		var size = this.size;
		var tmp = arr.slice(0);
		var globalRand = this.globalRand;
		randArr = Tools.createRightPath(tmp,size,globalRand);
		console.log("-----33--",randArr)
		/*var randArr = tmp.sort(Tools.randomsort);
		console.log("空白的索引",this.globalRand);
		while(!Tools.solvability(randArr,size,this.globalRand)){
			randArr = randArr.sort(Tools.randomsort);
		}*/
		return randArr;
	},
	//加载图片
	initImage:function  () {
		var self = this;
		var pic = this.pic;
		var img = new  Image();
		img.src = pic;
		img.onload = function(){
			self.img = img;
			var size = self.size;
			var offsetX = self.offsetX;
			var offsetY = self.offsetY;
			var posArr = self.posArr;
			var randArr = self.randArr;
			self.initDraw(posArr,randArr);
		}
	},

	//开始绘制图片在画板上，扩展每个对象生成随机位置
	initDraw:function  (posArr,randArr) {
		if(Object.prototype.toString.call(posArr)!=="[object Array]" && posArr.lenght<1){
			return ;
		}
		var globalRand = this.globalRand;
		var ctx = this.ctx;
		var img = this.img;
		var self = this;
		var offsetX = this.offsetX;
		var offsetY = this.offsetY;
		//posArr[globalRand]['isSpace'] = true;
		posArr.forEach(function(value,index){
			var x = value['x'];
			var y = value['y'];
			var randKey = randArr[index];
			var cur = posArr[randKey];//随机的位置，扩展对象属性
			value['cur'] = cur;
			value['curIndex'] = randKey;
			var cx = cur ? cur['x'] : 'no';
			var cy = cur ? cur['y'] : 'no';	
			value['isRight'] = (x==cx && y==cy) ? true:false;
			var width = self['picWidth'];
			var height = self['picHeight'];
			if(randKey==self.globalRand){
				value['isSpace'] = true;
				self.drawRect(value);
				value['cur'] = null;//空白的截取碎片为空
				return;
			}
			ctx.drawImage(img,cx,cy,offsetX,offsetY,x,y,offsetX,offsetY);
		});
		Tools.checkIsOk(posArr,this.size);
	},
	bindEvent:function  () {
		var self = this;
		var canvas = this.canvas;
		var size = this.size;
		var rowCol = this.rowColArr;
		var offsetX = this.offsetX;
		var offsetY = this.offsetY;
		var rowColArr  = this.rowColArr;
		canvas.addEventListener('touchstart',function  (e) {
			self.touchStart(e);
		},false);
		canvas.addEventListener('touchmove',function  (e) {
			//self.touchMove(e);
			self.eventData = e;
		},false);
		canvas.addEventListener('touchend',function  (e) {
			self.touchMove(self.eventData);
		},false);
	},
	touchStart:function  (event) {
		event.preventDefault();
		var self = this;
		if(self.isCompleted){
			return ;
		}
		var touch = event.touches[0],
         	startX = touch.pageX,
         	startY = touch.pageY;
	    self.startX = startX;
	    self.startY = startY;
	    var index = Tools.getIndex(startX,startY,self.offsetX,self.offsetY,self.rowColArr,self.offset);
	    self.clickIndex = index;
	},
	//移动事件，所处当前点击对象和所要移动的目的对象的索引
	touchMove:function(event){
		event.preventDefault();
		var self = this;
		if(self.isCompleted){
			return ;
		}
		var touch = event.touches[0],
         	endX = touch.pageX,
         	endY = touch.pageY;
        var index = self.clickIndex;
        var rowColPos = self.rowColArr[index];// x-y 被点击的对象的行和列信息
        var row = parseInt( rowColPos ? rowColPos[0] : 0 );//点击对象的行号
        var col = parseInt( rowColPos ? rowColPos[2] : 0 );//点击对象的列号
        var dataX = endX - this.startX;
        var dataY = endY - this.startY;
        var directX = dataX > 0 ? 'right':'left';
        var directY = dataY > 0 ? 'down' :'up' ;
        var direct = Math.abs(dataX) > Math.abs(dataY) ? directX :directY;
        var targetIndex =  0;
        var targetRandIndex = 0;
        var curRandIndex = self.randArr[rowColPos];
        if(direct==directX) {
        	//左右方向
        	var curCol = (directX =='left') ? col-1 : col+1;
       		var targetPos = row +"-" +curCol;
        	targetIndex = self.rowColArr.indexOf(row+"-"+curCol);
        	//targetRandIndex = self.randArr[targetIndex];
        }else{
        	//垂直方向
        	var curRow = (directY=='up') ? row-1 : row+1;
        	var targetPos = curRow +"-" +row;
        	targetIndex = self.rowColArr.indexOf(curRow+"-"+col);
        	//targetRandIndex = self.randArr[targetIndex];//目标的cur
        } 
        var curPosObj = self.posArr[index];
        var targetPosObj = self.posArr[targetIndex];
        var isMove = targetPosObj && targetPosObj['isSpace'];
        if(isMove){
        	curPosObj['isSpace'] = true;
        	targetPosObj['cur'] = curPosObj['cur'];//注意这里是吧目前的位置
        	//targetPosObj['isSpace'] = false;
        	delete targetPosObj['isSpace'];
        	curPosObj['cur'] = false;//空格的截取碎片为空
        	var drawObjArr = [curPosObj,targetPosObj];
        	self.moveDraw(drawObjArr);
        }
	},
	moveDraw:function  (drawObjArr) {
		var self = this;
		var tmpSpace = {};
		drawObjArr.forEach(function  (value,index) {
			if(value['isSpace']){
				//绘制空格
				tmpSpace = value;
				self.drawRect(value);
			}else{
				self.justDrawOne(value);
			}
		});
		var posArr = this.posArr;
		var size = this.size;
		var isOk = Tools.checkIsOk(posArr,size);
		if(isOk){
			self.isCompleted = true;
			var spaceImg = posArr[self.globalRand];
			var cx = spaceImg['x'];
			var cy = spaceImg['y'];
			var x = tmpSpace['x'];
			var y = tmpSpace['y'];
			var offsetX = self.offsetX;
			var offsetY = self.offsetY;
			tmpSpace && self.ctx.drawImage(self.img,cx,cy,offsetX,offsetY,x,y,offsetX,offsetY); 
			setTimeout(function() {
				alert("congratulations, you get it!!!");
			}, 500);
		}
	},
	justDrawOne:function  (onePos) {
		var ctx = this.ctx;
		var img = this.img;
		var cur = onePos['cur'];
		var x = onePos['x'];//绘制的位置
		var y = onePos['y'];
		var cx = cur['x'];//裁剪的图片
		var cy = cur['y'];
		var offsetX = this.offsetX;
		var offsetY = this.offsetY;
		ctx.drawImage(img,cx,cy,offsetX,offsetY,x,y,offsetX,offsetY);
	},
	searchCurInPosArr:function  (targetRandIndex) {
		var self = this;
		var posArr = this.posArr;
		posArr.forEach(function  (value,index) {
			if(value['cur']==targetRandIndex){
				return value;
			}
		});
	},
	drawRect:function  (obj) {
		var self = this.ctx;
		var ctx = this.ctx;
		var x = obj['x'];
		var y = obj['y'];
		var offsetX = this.offsetX;
		var offsetY = this.offsetY;
		ctx.beginPath();
		ctx.fillStyle = "blue";
		ctx.fillRect(x,y,offsetX,offsetY);
	}
}

var Tools = {
	//ox,oy x方向的偏移量，也就是碎片的宽度
	//返回位置对象数组，行展开的一维数组
	martrix:function  (size,ox,oy) {
		if(parseInt(size)<1 || !ox || !oy){
			return;
		}
		var posObjArr = [];//位置对象数组数组
		var lineArr = [];//[0,1,2,3,4,5,6...]
		var rowColArr = [];
		var tmp  = {};
		for (var i = 0,z=0; i < size; i++) {
			for(var j = 0;j < size;j++){
				tmp  = {};
				tmp['x'] = j*ox;
				tmp['y'] = i*oy;
				tmp['index'] = z;
				lineArr.push(z);
				posObjArr.push(tmp);
				rowColArr.push(i+"-"+j);
				z++;
			}
		}
		var obj = {
			lineArr:lineArr,
			posObjArr:posObjArr,
			rowColArr:rowColArr
		}
		return obj;
	},

	//排序函数
	randomsort:function(a,b){
		return Math.random()>.5 ? -1 : 1;
	},

	//00 01 02,10 11 12,20 21 22
	rowColArr:function(size){
		var arr = [];
		for (var i = 0; i < size; i++) {
			for (var j = 0; j < size; j++) {
				arr.push(i+"-"+j);	
			}
		}
		return arr;
	},

	// returun index by event pos
	//根据x,y坐标获得点击的碎片的索引
	getIndex:function(x,y,offsetX,offsetY,rowColArr){
		var index = 0;
		var rowIndex = parseInt(y/offsetX);//行号
		var colIndex = parseInt(x/offsetY);//列号
		var rowCol = rowIndex +"-"+ colIndex;
		index = rowColArr.indexOf(rowCol);
		return index;
	},

	//每次移动都要去检测是否已经都在指定的位置了
	//便利posarr 看每个对象的x y 和实际cur 的x y是否相等，求个数=size*size-1
	checkIsOk:function  (posArr,size) {
		var okSize = 0;
		var isOk = false;
		posArr.forEach(function  (value,index) {
			var x = value['x'];
			var y = value['y'];
			var cur = value['cur'];
			var cx = cur && cur['x'];
			var cy = cur && cur['y'];
			if(!value['isSpace'] &&  x==cx && y==cy){
				okSize++;
			}
		});
		if(okSize==(size*size-1)){
			isOk =  true;
		}
		console.log("检查是否已拼完",posArr,okSize);
		return isOk;
	},
	solvability:function(order, size){//判断当前的拼图是否可以还原
			// 定理1：图形A与图形B等价的充要条件图形A的排列的逆序数加上0元素行号和列号的奇偶性等于图形B的排列的逆序数加上0元素行号和列号的奇偶性。为方便表述，把图形排列的逆序数加上0元素行号和列号的奇偶性称为图形的奇偶性。
			var a;
			var count = 0;
			var m = 0;
			var n = 0;
			
			var len = order.length;
			size = size || 3;
			//[0,1,2,3,4,5,7,6,8]
			for(var i=0; i<len; i++){
				var a = order[i];
				
				if(a == 8){
					m = parseInt(i/size);
					n = parseInt(i%size);
				}
					
				for(var j=i+1; j<len; j++){
					
					if(order[j]<a){
						count++;
					}
				}
			}
			count += m;
			count += n;
			return count%2 == 0;
		},
		isOkay:function(){
			var okay = true;
			var list = this.itemList;
			for(var i=0, len=list.length; i<len; i++){
				if( !list[i].isOkay() ){
					okay = false;
					break;
				};
			};
			return okay;
		},
}
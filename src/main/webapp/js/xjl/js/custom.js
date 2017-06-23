/*
 * 用于页面自定义插件与方法
 */
/*设定验证码库*/
var codeChars = new Array(0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 
        'a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z',
        'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z',
        '1','2','3','4','5','6','7','8','9','10','11','12'); 
/*创建验证码*/
function createCode(){
	var code = "";
    var codeLength = 4; //验证码的长度
    var checkCode = document.getElementById("checkCode");
    for (var i = 0; i < codeLength; i++) {
        var charNum = Math.floor(Math.random() * 52);
        code += codeChars[charNum];
    }
    if (checkCode) {
        checkCode.className = "code";
        checkCode.innerHTML = code;
    }
    return code;
}
/*序列化表单*/
function toSerialize(){
	var data="{";
	$("#registerForm input[type=text],[type=password]").each(function(i){
			data+="'"+$(this).attr("name")+"':'"+$("#"+$(this).attr("id")).val()+"',";
	});
	data= data.substring(0,data.length-1);
	data+="}";
	return data;
}
/*post提交*/
function restPost(url,data){
	$.restPost({
			 url:url,
			 data:data,
			 success:function(data){
				 if(data.success){
				 }else{
					showMsg("警告",data.errorMsg);
					return;
				 }
			 }
		});  
}
/*警告框*/
function showMsg(title,msg){
	$("#myAlert").css('display',"block");
	$("#myAlert").html("<strong>"+title+"！</strong>"+msg);
	window.setTimeout(function(){
		$("#myAlert").css('display',"none");
	},3000);
}

/*警告框*/
function showCustomMsg(id,title,msg){
	$("#"+id).css('display',"block");
	$("#"+id).html("<strong>"+title+"！</strong>"+msg);
	window.setTimeout(function(){
		$("#"+id).css('display',"none");
	},3000);
}
/*获取参数*/
function GetQueryString(name){
     var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
     var r = window.location.search.substr(1).match(reg);
     if(r!=null)return  decodeURIComponent(r[2]); return null;
}
/*鼠标控制页面图片或者div拖拽*/
function fnMix(){
	
}
function fnNotMix(){
	
}


function initMove(){
	function Pointer(x, y) {
		this.x = x ;
		this.y = y ;
	}
	function Position(left, top) {
		this.left = left ;
		this.top = top ;
	}
	$(".item_content .item").each(function(i) {
		this.init = function() { // 初始化
			this.box = $(this).parent() ;
			$(this).attr("index", i).css({
				position : "absolute",
				left : this.box.offset().left,
				top : this.box.offset().top
			}).appendTo(".item_content") ;
			this.drag() ;
		},
		this.move = function(callback) {  // 移动
			$(this).stop(true).animate({
				left : this.box.offset().left,
				top : this.box.offset().top
			}, 500, function() {
				if(callback) {
					callback.call(this) ;
				}
			}) ;
		},
		this.collisionCheck = function() {
			var currentItem = this ;
			var direction = null ;
			$(this).siblings(".item").each(function(e) {
				if(
					currentItem.pointer.x > this.box.offset().left &&
					currentItem.pointer.y > this.box.offset().top &&
					(currentItem.pointer.x < this.box.offset().left + this.box.width()) &&
					(currentItem.pointer.y < this.box.offset().top + this.box.height()) 
				){	
					
					var s=currentItem.childNodes[0].childNodes[0].getAttribute("alt");//currentItem是起始的div
					var licenceId=currentItem.childNodes[0].getAttribute("name");//获取要证照的id
//					this.box.each(function(){
//						alert($(this).find("img").alt);
//					});
					var e=$(this).find("a").find("img").attr("alt");
					var catalogId=$(this).find("a").attr("name");//获取要存入证照的目录id
					if(s=="image"&& e=="file"){
						if(!confirm("确定执行添加操作吗?")){
							return;
						};
						$(currentItem).remove();
						$.ajax({
							type:'POST',
							url:'../rest/catalog/saveToCatalog',
							data:{
								"licenceId":licenceId,
								"catalogId":catalogId
							},
							success:function(data){
								if(data.success==true){
									alert("添加成功");
								}
							}
							
						});
					}else{
						if(currentItem.box.offset().top < this.box.offset().top) {
							direction = "down" ;
						} else if(currentItem.box.offset().top > this.box.offset().top) {
							direction = "up" ;
						} else {
							direction = "normal" ;
						}
						this.swap(currentItem, direction) ;
					}
				}
			});
		},
		this.swap = function(currentItem, direction) { // 交换位置
			if(this.moveing) return false ;
			var directions = {
				normal : function() {
					var saveBox = this.box ;
					this.box = currentItem.box ;
					currentItem.box = saveBox ;
					this.move() ;
					$(this).attr("index", this.box.index()) ;
					$(currentItem).attr("index", currentItem.box.index()) ;
				},
				down : function() {
					// 移到上方
					var box = this.box ;
					var node = this ;
					var startIndex = currentItem.box.index() ;
					var endIndex = node.box.index(); ;
					for(var i = endIndex; i > startIndex ; i--) {
						var prevNode = $(".item_content .item[index="+ (i - 1) +"]")[0] ;
						node.box = prevNode.box ;
						$(node).attr("index", node.box.index()) ;
						node.move() ;
						node = prevNode ;
					}
					currentItem.box = box ;
					$(currentItem).attr("index", box.index()) ;
				},
				up : function() {
					// 移到上方
					var box = this.box ;
					var node = this ;
					var startIndex = node.box.index() ;
					var endIndex = currentItem.box.index(); ;
					for(var i = startIndex; i < endIndex; i++) {
						var nextNode = $(".item_content .item[index="+ (i + 1) +"]")[0] ;
						node.box = nextNode.box ;
						$(node).attr("index", node.box.index()) ;
						node.move() ;
						node = nextNode ;
					}
					currentItem.box = box ;
					$(currentItem).attr("index", box.index()) ;
				}
			}
			directions[direction].call(this) ;
		},
		this.drag = function() { // 拖拽
			var oldPosition = new Position() ;
			var oldPointer = new Pointer() ;
			var isDrag = false ;
			var currentItem = null ;
			$(this).mousedown(function(e) {
				e.preventDefault() ;
				oldPosition.left = $(this).position().left ;
				oldPosition.top =  $(this).position().top ;
				oldPointer.x = e.clientX ;
				oldPointer.y = e.clientY ;
				isDrag = true ;
				currentItem = this ;
			}) ;
			$(document).mousemove(function(e) {
				var currentPointer = new Pointer(e.clientX, e.clientY) ;
				if(!isDrag) return false ;
				$(currentItem).css({
					"opacity" : "0.8",
					"z-index" : 999
				}) ;
				var left = currentPointer.x - oldPointer.x + oldPosition.left ;
				var top = currentPointer.y - oldPointer.y + oldPosition.top ;
				$(currentItem).css({
					left : left,
					top : top
				}) ;
				currentItem.pointer = currentPointer ;
				// 开始交换位置
				currentItem.collisionCheck() ;
			}) ;
			$(document).mouseup(function() {
				if(!isDrag) return false ;
				isDrag = false ;
				currentItem.move(function() {
					$(this).css({
						"opacity" : "1",
						"z-index" : 0
					}) ;
				}) ;
			}) ;
		}
		this.init() ;
	}) ;
}

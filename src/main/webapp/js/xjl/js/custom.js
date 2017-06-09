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


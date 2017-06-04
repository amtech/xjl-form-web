var XJL = {
		getUrlParam:function (name){
			console.log("getUrlParam方法开始调用");
			if (!this.urlParams){
				console.log("urlParams为空，开始构建");
				this.urlParams=new Object();   
				var query=location.search.substring(1);//获取查询串   
				var pairs=query.split("&");//在逗号处断开   
				for(var   i=0;i<pairs.length;i++) {   
						var pos=pairs[i].indexOf('=');//查找name=value   
						if(pos==-1)   continue;//如果没有找到就跳过   
						var argname=pairs[i].substring(0,pos);//提取name   
						var value=pairs[i].substring(pos+1);//提取value   
						this.urlParams[argname]=decodeURI(value);//存为属性
						console.log("参数" +(i+1),argname +"="+ decodeURI(value));
				}
			}
			console.log("返回",name + "的值" + this.urlParams[name]);
			return this.urlParams[name];
		},
		bindCloseWindowEvent:function(){
			console.log("executeBindCloseWindow",this.executeBindCloseWindow);
			console.log("绑定关闭窗口事件");
			console.log("父窗口",window.opener);
			console.log("parentEvent", this.getUrlParam("parentEvent"));
			if (window.opener && XJL.getUrlParam("parentEvent")){
				console.log("父窗口不为空，并且父窗口事件也不为空")
				$(window).bind('beforeunload',function(){
					if (this.executeBindCloseWindow){
						var parentEvent = XJL.getUrlParam("parentEvent");
						eval("window.opener."+parentEvent+"()");
					}
				});
			}
		},
		executeBindCloseWindow : true
}
XJL.bindCloseWindowEvent();
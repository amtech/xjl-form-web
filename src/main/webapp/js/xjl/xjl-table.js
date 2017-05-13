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
			console.log("绑定关闭窗口事件");
			console.log("父窗口",window.opener);
			console.log("parentEvent", this.getUrlParam("parentEvent"));
			if (window.opener && this.getUrlParam("parentEvent")){
				console.log("父窗口不为空，并且父窗口事件也不为空")
				$(window).bind('beforeunload',function(){
					var parentEvent = XJL.getUrlParam("parentEvent");
					eval("window.opener."+parentEvent+"()");
				});
			}
		},
		initTable:function (tableDiv,baseURL,pageSize) {
	        //绑定table的viewmodel
	        this.tableViewModel = new ko.bootstrapTableViewModel({
	            url:baseURL,         //请求后台的URL（*）
	            method: 'get',                      //请求方式（*）
	            toolbar: '#toolbar',                //工具按钮用哪个容器
	            queryParams: function (param) {
	            	this.url = baseURL + "/" + this.pageNumber + "/" + this.pageSize;
	                return {search:param.search };
	            },//传递参数（*）
	            pagination: true,                   //是否显示分页（*）
	            detailView:true,
	            queryParamsType:'limit',
	            sidePagination: "server",           //分页方式：client客户端分页，server服务端分页（*）
	            pageNumber: 1,                      //初始化加载第一页，默认第一页
	            pageSize: pageSize||2,                       //每页的记录行数（*）
	            pageList: [2, 4, 6, 8],        //可供选择的每页的行数（*）
	           
	          //注册加载子表的事件。注意下这里的三个参数！
	            onExpandRow: function (index, row, $detail) {
	            	alert("abc");
	                //oInit.InitSubTable(index, row, $detail);
	            },
	            detailFormatter:function(index, row, element) {
	            	console.log(index);
	            	console.log(row);
	            	console.log(element);
	            	return 'aaa';
	            }
	        });
	        ko.applyBindings(this.tableViewModel, document.getElementById(tableDiv));
	    },
	    initOperate:function (baseURL,domainModel) {
	        this.operateAdd(baseURL,jQuery.extend({}, domainModel));
	        this.operateUpdate(baseURL);
	        this.operateDelete(baseURL);
	        
	        this.domainModel =  jQuery.extend(true, {}, domainModel);
	    },
	    //新增
	    operateAdd: function(baseURL,domainModel){
	        $('#btn_add').on("click", function () {
	            $("#myModal").modal().on("shown.bs.modal", function () {
	            	$("#myModalLabel").text("新增");
	            	var emptyDomainModel={};
	            	jQuery.each(domainModel, function(i, val) {  
	            		emptyDomainModel[i] = ko.observable();
	            	}); 
	                ko.utils.extend(XJL.domainModel, emptyDomainModel);
	                ko.applyBindings(XJL.domainModel, document.getElementById("myModal"));
	                XJL.operateSave(baseURL+"/add");
	            }).on('hidden.bs.modal', function () {
	                ko.cleanNode(document.getElementById("myModal"));
	            });
	        });
	    },
	    //编辑
	    operateUpdate: function (baseURL) {
	        $('#btn_edit').on("click", function () {
	        	
	        	var arrselectedData = XJL.tableViewModel.getSelections();
	            if (!XJL.operateCheck(arrselectedData)) { 
	            	return; 
	            }
	            $("#myModalLabel").text("修改");
	            $("#myModal").modal().on("shown.bs.modal", function () {
	                //将选中该行数据有数据Model通过Mapping组件转换为viewmodel
	                ko.utils.extend(XJL.domainModel, ko.mapping.fromJS(arrselectedData[0]));
	                ko.applyBindings(XJL.domainModel, document.getElementById("myModal"));
	                XJL.operateSave(baseURL+"/modify");
	            }).on('hidden.bs.modal', function () {
	                //关闭弹出框的时候清除绑定(这个清空包括清空绑定和清空注册事件)
	                ko.cleanNode(document.getElementById("myModal"));
	            });
	        });
	    },
	    //删除
	    operateDelete: function (baseURL) {
	        $('#btn_delete').on("click", function () {
	            var arrselectedData = XJL.tableViewModel.getSelections();
	            $.ajax({
	                url: baseURL+"/delete",
	                type: "post",
	                contentType: 'application/json',
	                data: JSON.stringify(arrselectedData),
	                success: function (data, status) {
	                    XJL.tableViewModel.refresh();
	                }
	            });
	        });
	    },
	    //保存数据
	    operateSave: function (url) {
	        $('#btn_submit').on("click", function () {
	        	console.log("submit click");
	            //取到当前的viewmodel
	            var oViewModel = XJL.domainModel;
	            XJL.beforeSubmit(oViewModel);
	            console.log("oViewModel", oViewModel);
	            //将Viewmodel转换为数据model
	            var oDataModel = ko.toJS(oViewModel);
	            console.log("oDataModel", oDataModel);
	            $.restPost({
	                url: url,
	                data: oDataModel,
	                success: function (data, status) {
	                	console.log("data",data);
	                	console.log("status",status);
	                    XJL.tableViewModel.refresh();
	                }
	            });
	        });
	    },
	    //数据校验
	    operateCheck:function(arr){
	        if (arr.length <= 0) {
	            alert("请至少选择一行数据");
	            return false;
	        }
	        if (arr.length > 1) {
	            alert("只能编辑一行数据");
	            return false;
	        }
	        return true;
	    },
	    beforeSubmit:function(oViewModel){
	    	
	    }
		
}

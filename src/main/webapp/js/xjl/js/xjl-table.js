jQuery.extend(XJL,{
		initTable:function (tableDiv,baseURL,pageSize) {
			this.baseURL = baseURL;
			pageSize = pageSize||10,
	        //绑定table的viewmodel
	        this.tableViewModel = new ko.bootstrapTableViewModel({
	            url:baseURL,         //请求后台的URL（*）
	            method: 'get',                      //请求方式（*）
	            toolbar: '#toolbar',                //工具按钮用哪个容器
	            queryParams: function (param) {
	            	this.url = XJL.baseURL + "/query/" + this.pageNumber + "/" + this.pageSize;
	                return XJL.queryParams({search:param.search});
	            },//传递参数（*）
	            pagination: true,                   //是否显示分页（*）
	            detailView:true,
	            queryParamsType:'limit',
	            sidePagination: "server",           //分页方式：client客户端分页，server服务端分页（*）
	            pageNumber: 1,                      //初始化加载第一页，默认第一页
	            pageSize: pageSize,                       //每页的记录行数（*）
	            pageList: [pageSize,pageSize*2],        //可供选择的每页的行数（*）
	        });
	        ko.applyBindings(this.tableViewModel, document.getElementById(tableDiv));
	    },
	    initOperate:function (baseURL,domainModel) {
	    	this.operateButtonStatus();
	        this.operateAdd(baseURL,jQuery.extend({}, domainModel));
	        this.operateUpdate(baseURL,jQuery.extend({}, domainModel));
	        this.operateDelete(baseURL);
	        this.operateSelect();
	        this.operateBack();
	        //this.domainModel =  jQuery.extend(true, {}, domainModel);
	    },
	    //支持字段列表模式
	    initOperate2:function (baseURL,fieldList) {
	    	var fieldNameList = fieldList.split(",");
	    	var domainModel = {};
	    	$.each(fieldNameList,function(key,val){
	    		domainModel[val]=ko.observable();
	    	});
	        this.initOperate(baseURL,domainModel);
	    },
	    operateSelect:function(){
	    	$('#btn_select').on("click", function () {
	        	var arrselectedData = XJL.tableViewModel.getSelections();
	            if (!XJL.operateCheck(arrselectedData)) { 
	            	return; 
	            }
	            //XJL.executeBindCloseWindow = false;
	            if (window.opener && XJL.getUrlParam("parentSelectEvent")){
					var parentSelectEvent = XJL.getUrlParam("parentSelectEvent");
					eval("window.opener."+parentSelectEvent+"(arrselectedData[0])");
					window.close();
					
				}
	    	});
	    },
	    operateBack:function(){
	    	$('#btn_back').on("click", function () {
				window.close();
	    	});
	    },
	    operateButtonStatus:function(){
	    	if (XJL.getUrlParam("editFlag") == "true"){
	    		$('#btn_add').show();
	    		$('#btn_edit').show();
	    		$('#btn_delete').show();
	    	} else {
	    		$('#btn_add').hide();
	    		$('#btn_edit').hide();
	    		$('#btn_delete').hide();
	    	}
	    	if (XJL.getUrlParam("selectFlag")=="true"){
	        	//如果只是选择，隐藏增删改按钮
	    		$('#btn_select').show();
	        } else {
	        	$('#btn_select').hide();
	        }
	    	if (window.opener){
	    		$('#btn_back').show();
	    	} else {
	    		$('#btn_back').hide();
	    	}
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
	                ko.utils.extend(domainModel, emptyDomainModel);
	                ko.applyBindings(domainModel, document.getElementById("myModal"));
	                console.log("add pk,设置checked为false");
	                XJL.beforeShowAdd();
	                XJL.operateSave(baseURL+"/add",domainModel);
	            }).on('hidden.bs.modal', function () {
	                ko.cleanNode(document.getElementById("myModal"));
	                XJL.afterHiddenModal();
	            });
	        });
	    },
	    //编辑
	    operateUpdate: function (baseURL,oViewModel) {
	        $('#btn_edit').on("click", function () {
	        	
	        	var arrselectedData = XJL.tableViewModel.getSelections();
	            if (!XJL.operateCheck(arrselectedData)) { 
	            	return; 
	            }
	            $("#myModalLabel").text("修改");
	            $("#myModal").modal().on("shown.bs.modal", function () {
	                //将选中该行数据有数据Model通过Mapping组件转换为viewmodel
	                ko.utils.extend(oViewModel, ko.mapping.fromJS(arrselectedData[0]));
	                ko.applyBindings(oViewModel, document.getElementById("myModal"));
	                XJL.beforeShowUpdate(arrselectedData[0]);
	                XJL.operateSave(baseURL+"/modify",oViewModel);
	            }).on('hidden.bs.modal', function () {
	                //关闭弹出框的时候清除绑定(这个清空包括清空绑定和清空注册事件)
	                ko.cleanNode(document.getElementById("myModal"));
	                XJL.afterHiddenModal();
	                
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
	    operateSave: function (url,oViewModel) {
	        $('#btn_submit').on("click", function () {
	        	console.log("submit click");
	            //取到当前的viewmodel
	            //var oViewModel = XJL.domainModel;
	           
	            //将Viewmodel转换为数据model
	            var oDataModel = ko.toJS(oViewModel);
	            XJL.beforeSubmit(oDataModel);
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
	    	//编辑模态窗口提交之前
	    },
	    queryParams:function(params){
	    	return params;
	    },
	    beforeShowAdd:function(){
	    	//新增窗口显示之前
	    },
	    beforeShowUpdate:function(oDataModel){
	    	//编辑窗口显示之前
	    },
	    afterHiddenModal:function(){
	    	//编辑窗口隐藏后出发的事件
	    }
})

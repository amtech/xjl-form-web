jQuery.extend(XJL,{
		loadSelectOption:function (param) {
			 $.restGet({  
		            url: param.url,  
		            type: "get",
		            contentType: 'application/json',
		            success: function (data) {  
		                $.each(data.rows, function (index, row) {  
		                	$("#"+param.selectId).append($("<option value='"+row[param.valueName]+"'>" + row[param.textName] + "</option>"));  
		                });  
		                $('#'+param.selectId).selectpicker('render');
		                $('#'+param.selectId).selectpicker('refresh');
		            }  
		        });  
		},
		//清除下拉框的包装器，由于放到modal中每次加载都会重复执行包装器操作，因此在每次关闭modal的时候都需要手动清除
		clearSelectPicker:function(selectId){
			var selectId = $('#'+selectId);
			var selectDiv = selectId.parent();
			var selectLabel = selectDiv.prev();
			selectLabel.after(selectId);
			selectDiv.remove();
		}
})

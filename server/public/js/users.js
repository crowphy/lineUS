$(document).ready(function() {
	fetch('/user/getallusers')
		.then(function(res) {
			if (res.status !== 200) {  
		        console.log(res.status);  
		        return;  
      		}
      		res.json().then(function(data) {
      			jQuery("#list").jqGrid({       	
					datatype: "json",
					mtype: "get",
					colNames: [ 'ID', '姓名', '手机号', '年龄', '性别', '地区', '签名'],
					colModel: [ 
					             {name: '_id', index: '_id', key: true, width: 200}, 
					             {name: 'username', key: true, width: 100}, 
					             {name: 'userPhoneNum', width: 150},
					             {name: 'age', width: 40}, 
					             {name: 'genders', width: 40}, 
					             {name: 'district', width: 50}, 
					             {name: 'sign', width: 200},  
					             //{name: 'contacts', index: 'contacts', width: 200},
					           ],
					rowNum: 20,
					rowList: [ 10, 20, 30 ],
					pager: '#pager',
					sortname: 'username',
					viewrecords: true,
					sortorder: "asc",
					rownumbers: true,
		            autowidth: true,
		            autoheight: true,
		            height: 250,
		            editurl: '/user/edit',
				});

				var ids = [], names = [], phones = [];
				for ( var i = 0; i < data.length; i++){
				    jQuery("#list").jqGrid('addRowData', data[i]['_id'], data[i]);
				    ids[i] = data[i]['_id'];
				    names[i] = data[i]['username'];
					phones[i] = data[i]['userPhoneNum'];
				}
				jQuery("#list").jqGrid('navGrid', "#pager", {
				    edit : false,
				    add : false,
				    del : true,
				    search: false,
				    refresh: false,
				}).
				navButtonAdd('#pager', {
					caption: '',
					id: 'talk',
					buttonicon: 'ui-icon-comment',
					position: 'last',
					onClickButton: function() {
						var id = $("#list").jqGrid('getGridParam','selrow');
						var index = ids.indexOf(id);
						console.log(names[index]);
						var username = names[index];
						var userPhoneNum = phones[index];
						location.href = '/admin/chat' + '?username=' + username + '&userPhoneNum=' + userPhoneNum;
					}				
				});
				
				jQuery("#list").jqGrid('inlineNav', "#pager");
      		})
		})
		.catch(function(err) {
			console.log(err);
		})
})


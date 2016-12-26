

var allmarks = {};
var globalChilden = {};
var globalFlag = "true";
$(function() {
	$("#result").text("");
	updateList();
});

var updateList = function(){
	$.ajax({
		url:address.listURL,
		type:"GET",
		success:function(data){
			$("#list").empty();
			for(var i = data.list.length-1;i>=0;i--){
				var optionString = '<option value='+data.list[i]+'>'+data.list[i]+'</option>';
				$("#list").append(optionString);
			}
		}
	})
}

$("#backup").click(function(){
	chrome.bookmarks.getTree(function callback(data){
		var postData = {
			bookmarks:data[0].children[0],
			versionString:getVersionString()
		}
		//var bm = allmarks.children;
		$.ajax({
			url:address.backupURL,
			type:"POST",
			contentType: "application/json",
			data:JSON.stringify(postData),
			success:function(data){
				if(data.status === "200"){
					updateList();
					$("#result").text("    备份成功");
					$("#result").attr("name",postData.versionString);
				}
			}
		})
	});
})

$("#recovery").click(function(){
	var postData = {
		versionString:$("#list").val()
	}
	$.ajax({
		url:address.recoveryURL,
		type:"POST",
		contentType: "application/json",
		data:JSON.stringify(postData),
		success:function(data){
			console.log(data);
			if(data.status === "200"){
				$("#result").text("  数据获取成功 正在还原……");
				var responseBookmarks = JSON.parse(data.bookmarks);
				console.log(responseBookmarks);
				deleteAllBookMarks();
				addFisrtBookMarks(responseBookmarks.children,"1");
				chrome.bookmarks.getTree(function callback(data){
					var currentbm = data[0].children[0].children;
					addSecondBookMarks(responseBookmarks.children,data[0].children[0].children);
					chrome.bookmarks.getTree(function callback(data2){
						var currentbm2 = data2[0].children[0].children;
						addThirdBookMarks(responseBookmarks.children,data2[0].children[0].children);
						$("#result").text("   还原成功");
						$("#result").attr("name",postData.versionString);
					})
				});
			}
		}
	})
	//


})

function deleteAllBookMarks(){
	chrome.bookmarks.getTree(function callback(data){
		for(var i=0;i<data[0].children[0].children.length;i++){
			chrome.bookmarks.removeTree(data[0].children[0].children[i].id)
		}
	});

}


function addFisrtBookMarks(bm,parentId){
	for(var i = 0; i < bm.length; i++){
		if(bm[i].hasOwnProperty('children')){
			var o = {
				parentId:parentId,
				index:bm[i].index,
				title:bm[i].title
			}
			chrome.bookmarks.create(o);
		}else{
			var o = {
				parentId:parentId,
				index:bm[i].index,
				title:bm[i].title,
				url:bm[i].url
			}
			chrome.bookmarks.create(o);
		}
	}
}

function addSecondBookMarks(bm,currentbm){
	for(var i = 0; i < bm.length; i++){
		if(bm[i].hasOwnProperty('children')){
			addFisrtBookMarks(bm[i].children,currentbm[i].id)
		}
	}
}

function addThirdBookMarks(bm,currentbm){
	for(var i = 0; i < bm.length; i++){
		if(bm[i].hasOwnProperty('children')){
			for(var j = 0; j < bm[i].children.length;j++){
				if(bm[i].children[j].hasOwnProperty('children')){
					addFisrtBookMarks(bm[i].children[j].children,currentbm[i].children[j].id);
				}
			}
		}
	}
}

var getVersionString = function(){
	//以日期代表书签版本号
	var d = new Date();
	var resultString = d.getFullYear().toString() + (d.getMonth()+1).toString() + d.getDate();
	return resultString;
}
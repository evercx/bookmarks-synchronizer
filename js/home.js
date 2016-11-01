

var allmarks = {};
var globalChilden = {};
var globalFlag = "true";
$(function() {
	$("#result").text("");

});



$("#backup").click(function(){
	chrome.bookmarks.getTree(function callback(data){
		var postData = {
			bookmarks:data[0].children[0]
		}
		//var bm = allmarks.children;
		$.ajax({
			url:address.backupURL,
			type:"POST",
			contentType: "application/json",
			data:JSON.stringify(postData),
			success:function(data){
				if(data.status === "200"){
					$("#result").text("    备份成功");
				}
			}
		})
		//deleteAllBookMarks();
	});



})

$("#recovery").click(function(){

	$.ajax({
		url:address.recoveryURL,
		type:"get",
		// contentType: "application/json",
		// data:JSON.stringify(postData),
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


// function travelAllBookMarks2(bm,parentId){
//
// 	if(typeof(parentId)==="undefined"){
// 		for(var i = 0; i < bm.length; i++){
// 			if(bm[i].hasOwnProperty('children')){
// 				var o = {
// 					parentId:'1',
// 					index:bm[i].index,
// 					title:bm[i].title
// 				}
//
// 				globalChilden = bm;
// 				(function(i){
// 					chrome.bookmarks.create(o,function(data){
// 						console.log(i);
// 						console.log(globalChilden[i]);
// 						travelAllBookMarks(globalChilden[i].children,data.id)
// 					});
//
// 				})(i)
//
// 			}else{
// 				var o = {
// 					parentId:'1',
// 					index:bm[i].index,
// 					title:bm[i].title,
// 					url:bm[i].url
// 				}
// 				chrome.bookmarks.create(o);
// 			}
// 		}
// 	}else{
// 		for(var i = 0; i < bm.length; i++){
// 			if(bm[i].hasOwnProperty('children')){
// 				var o = {
// 					parentId:parentId,
// 					index:bm[i].index,
// 					title:bm[i].title
// 				}
//
// 				globalChilden = bm;
// 				(function(i){
// 					chrome.bookmarks.create(o,function(data){
// 						// console.log(i);
// 						// console.log(globalChilden[i]);
// 						travelAllBookMarks(globalChilden[i].children,data.id)
// 					});
//
// 				})(i)
//
// 			}else{
// 				var o = {
// 					parentId:parentId,
// 					index:bm[i].index,
// 					title:bm[i].title,
// 					url:bm[i].url
// 				}
// 				chrome.bookmarks.create(o);
//
// 			}
// 		}
// 	}
// 	return;
// }
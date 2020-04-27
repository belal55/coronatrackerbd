var countryList;
var districtList;

$(function(){
	loadData();

});


function loadData(){
	$.ajax({
		method:"GET",
		url:"/getData/",
		data:{},
		dataType: "json",
		success: function(data){
			$("#loader").addClass('d-none');
			countryList=data.countryList
			districtList=data.districtList
			var globalData="";
			var nationalData="";
			$.each(countryList,function(i,item){
				globalData+="<tr>"+
				"<td>"+item.name+"</td>"+
				"<td>"+item.TotalCases+"</td>"+
				"<td>"+item.NewCases+"</td>"+
				"<td>"+item.TotalDeaths+"</td>"+
				"<td>"+item.NewDeaths+"</td>"+
				"<td>"+item.TotalRecovered+"</td>"+
				"<td>"+item.SeriousCases+"</td>"+
				"<td>"+item.RationPerMillion+"</td>"+
				"</tr>"
			});
			$.each(districtList.features,function(i,item){
				nationalData+="<tr>"+
				"<td>"+item.properties.name+"</td>"+
				"<td>"+item.properties.confirmed+"</td>"+
				"</tr>"
			});

			$("#globalTbl tbody").html(globalData);
			$('#globalTbl').DataTable({
				"pageLength": 15,
				responsive: true
			});
			$("#nationalTbl tbody").html(nationalData);
			$('#nationalTbl').DataTable({
				"pageLength": 15,
				responsive: true
			});
		},
		error:function(err){
			alert("Something went wrong, try again.");
		}


	});
}
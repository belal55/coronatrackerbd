
var map;
var circles=[];
var countryList=[];
var districtList=[];
var barChartInitialData=[];
setInterval(function() {fetchData();}, 2*60000 ); 

$(function(){
	
	loadData();
	loadBarchartInitialData('BGD','Bangladesh');

	$(document).delegate( ".list-group-item", "click", function() {
		var iso3 = $(this).data().iso3;
		var key = $(this).data().key;
		var latlng = $(this).data().point.split(',');
		var lat = latlng[0];
		var lng = latlng[1];
		var zoom = 7;
		map.setView([lat, lng], zoom);
	
		for (var i in circles){
			var markerID = circles[i].options.title;
			if (circles[i].options.title == key){
				circles[i].openPopup();
			};
		}
		var con=countryList.filter(x=>x.id==iso3)[0];
		loadDonutchart(con.TotalCases,con.TotalDeaths,con.TotalRecovered,con.name);
		loadBarchartInitialData(iso3,con.name)
	});
	
	$(document).delegate( "#countrySearch", "input paste", function() {
		var con=countryList.filter(x=>x.name.toLowerCase().indexOf($(this).val().toLowerCase())!=-1);
		loadCountryLink(con);
	});
	
})

function fetchData(){
	$.ajax({
		method:"GET",
		url:"/fetchData/",
		data:{},
		dataType: "json",
		success: function(data){
			console.log("data fetching");
			if(data.success==true)
				window.location.reload();
		},
		error:function(err){
			console.log("Error on data fetching");
		}


	});
}

function loadBDMarker(){
	
	map.setView([23.685, 90.3563], 7);
	var cr = circles.filter(x=>x.options.title=="Bangladesh")[0];
	cr.openPopup();
}



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
			loadMap(data.countryList,data.districtList);
			var global=countryList.filter(x => x.name == 'Global');
			var bd=countryList.filter(x => x.name == 'Bangladesh');
			$('#GTotal').text(global[0].TotalCases);
			$('#txtGRatio').text(global[0].RationPerMillion);
			$('#txtGActive').text(global[0].ActiveCases);
			$('#txtGActiveNew').text('+'+global[0].NewCases);
			$('#txtGRecovered').text(global[0].TotalRecovered);
			$('#txtGRecoveredNew').text();
			$('#txtGFatal').text(global[0].TotalDeaths);
			$('#txtGFatalNew').text('+'+global[0].NewDeaths);
			const sortedObjs = _.sortBy(countryList,'name');
			loadCountryLink(sortedObjs);
			loadDonutchart(bd[0].TotalCases,bd[0].TotalDeaths,bd[0].TotalRecovered,'Bangladesh');
			loadBDMarker();
		},
		error:function(err){
			alert("Something went wrong, try again.");
		}


	});
}


function loadCountryLink(countryList){
	var countryHtml="";
	$.each(countryList,function(i,item){
		countryHtml+='<a class="list-group-item" data-point="'+item.latitude+','+item.longitude+'" data-key="'+item.name+'" data-iso3="'+item.id+'" href="#">'+item.name+'</a>';
	});
	$('#countryGroup').html(countryHtml);
}

function sortCountry(key){
	const sortedObjs = _.sortBy(countryList,key);
	if(key==='name')
		loadCountryLink(sortedObjs);
	else
		loadCountryLink(sortedObjs.reverse());
	
}

function loadMap(countryList,districtList){

	// mapid is the id of the div where the map will appear
	map = L.map('mapid',{worldCopyJump: true}).setView([24, 90], 6.5);

	// Add a tile to the map = a background. Comes from OpenStreetmap
	L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
		attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
		maxZoom: 18,
		id: 'mapbox/streets-v11',
		tileSize: 512,
		zoomOffset: -1,
		accessToken: 'pk.eyJ1IjoiYmVsYWw1NSIsImEiOiJjazk5M3ZhMmgwNWdxM2xya3AwaHV1dzJ1In0.5MLwZiTzjar6DIq_K1x7BA'
	}).addTo(map);

	// Add a svg layer to the map
	L.svg().addTo(map);

	$.each(countryList,function(i,item){
		var r = 0;
		if(item.TotalCases<1000)
			r=20000
		else if(item.TotalCases>1000 && item.TotalCases<10000)
			r=30000
		else if(item.TotalCases>10000 && item.TotalCases<50000)
			r=50000
		else if(item.TotalCases>50000 && item.TotalCases<250000)
			r=70000
		else if(item.TotalCases>250000 && item.TotalCases<500000)
			r=90000
		else if(item.TotalCases>500000 && item.TotalCases<1000000)
			r=110000
		else if(item.TotalCases>1000000)
			r=150000
		
		var circle = L.circle([item.latitude, item.longitude], {
			color: 'red',
			fillColor: '#f03',
			fillOpacity: 0.5,
			radius: r,
			title:item.name,
		}).addTo(map);
		
		circle.bindPopup(
			"<p style='font-weight:bold;'>"+item.name+"</p>"
			+"<li>Total Cases: <span>"+item.TotalCases+"</span></li>"
			+"<li>New Cases: <span>"+item.NewCases+"</span></li>"
			+"<li>Total Death: <span>"+item.TotalDeaths+"</span></li>"
			+"<li>New Death: <span>"+item.NewDeaths+"</span></li>"
			+"<li>Recovered: <span>"+item.TotalRecovered+"</span></li>"
			+"<li>Active Cases: <span>"+item.ActiveCases+"</span></li>"
			+"<li>Serious Cases: <span>"+item.SeriousCases+"</span></li>"
			+"<li>Ratio / Million: <span>"+item.RationPerMillion+"</span></li>",
			{className:'circleToolTip',direction:'auto',opacity:0.8}
		);
		circles.push(circle);
		circle.on('mouseover', function(event){
		circle.openPopup();
		});
	
	});

	L.geoJSON(districtList, {
		style: function (feature) {
			if(feature.properties.confirmed>200)
				return {weight:2,fillColor:'red',fillOpacity:0.5};
			else if(feature.properties.confirmed>100 && feature.properties.confirmed<200)
				return {weight:2,fillColor:'#fc9660',fillOpacity:0.8};
			else if(feature.properties.confirmed>50 && feature.properties.confirmed<100)
				return {weight:2,fillColor:'#fcc860',fillOpacity:0.8};
			else if(feature.properties.confirmed>20 && feature.properties.confirmed<50)
				return {weight:2,fillColor:'#edde2b',fillOpacity:0.8};
			else if(feature.properties.confirmed>0 && feature.properties.confirmed<20)
				return {weight:2,fillColor:'#c1df49',fillOpacity:0.8};
			else if(feature.properties.confirmed==0)
				return {weight:2,fillColor:'green',fillOpacity:0.5};
		}
	}).addTo(map);
	
	
	var geoJsonLayer = L.geoJson(districtList, {
		onEachFeature: function (feature, layer) {
			// Check if feature is a polygon
			
			// Don't stroke and do opaque fill
			layer.setStyle({
				'weight': 0,
				'fillOpacity': 0
			});
			// Get bounds of polygon
			var bounds = layer.getBounds();
			// Get center of bounds
			var center = bounds.getCenter();
			// Use center to put marker on map
			var myIcon = L.divIcon({html:feature.properties.confirmed,className: 'my-div-icon'});
			if(feature.properties.confirmed>0){
				var marker = L.marker(center,{icon: myIcon}).addTo(map);
				marker.bindTooltip(feature.properties.name);
			}
				
			
		}
	}).addTo(map);
}

//for chart 

function loadDonutchart(confirmed,deaths,recovered,name){

	  Highcharts.chart('canvasContainer', {
		chart: {
		  plotBackgroundColor: null,
		  plotBorderWidth: null,
		  plotShadow: false,
		  type: 'pie'
		},
		title: {
		  text: 'Total Status Of '+name
		},
		tooltip: {
		  pointFormat: '{series.name}: <b>{point.y}</b>'
		},
		accessibility: {
		  point: {
			valueSuffix: '%'
		  }
		},
		plotOptions: {
		  pie: {
			allowPointSelect: true,
			cursor: 'pointer',
			dataLabels: {
			  enabled: true,
			  format: '<b>{point.name}</b>: {point.y}'
			}
		  }
		},
		series: [{
		  name: 'Cases',
		  colorByPoint: true,
		  data: [{
			name: 'Confirmed',
			y: confirmed,
			selected: true
		  }, {
			name: 'Deaths',
			y: deaths
		  }, {
			name: 'Recovered',
			y: recovered
		  }]
		}]
	  });

}

function loadBarchartInitialData(iso3,name){
	var ul="https://wuhan-coronavirus-api.laeyoung.endpoint.ainize.ai/jhu-edu/timeseries?iso3="+iso3+"&onlyCountries=true";
	$.ajax({
		method:"GET",
		url:ul,
		data:{},
		dataType: "json",
		success: function(data){
			var categories=[]
			var confirmedList=[]
			var confirmedList2=[]
			var deathList=[]
			var deathList2=[]
			var recoveredList=[]
			var recoveredList2=[]
			$.each(data[0].timeseries,function(i,item){
				if(item.confirmed>0){
					categories.push(Date.parse(i).toString("MMMM dS"));
					confirmedList.push(item.confirmed);
					deathList.push(item.deaths);
					recoveredList.push(item.recovered);
				}
			})

			$.each(confirmedList,function(i,item){
				if(i>0){
					confirmedList2.push(confirmedList[i]-confirmedList[i-1]);
				}else{
					confirmedList2.push(confirmedList[i]);
				}
			})
			$.each(deathList,function(i,item){
				if(i>0){
					deathList2.push(deathList[i]-deathList[i-1]);
				}else{
					deathList2.push(deathList[i]);
				}
			})
			$.each(recoveredList,function(i,item){
				if(i>0){
					recoveredList2.push(recoveredList[i]-recoveredList[i-1]);
				}else{
					recoveredList2.push(recoveredList[i]);
				}
			})

			loadBarchartData(categories,confirmedList2,deathList2,recoveredList2,name);
		},
		error:function(err){
			alert("Something went wrong, try again.");
		}
	});
}


function loadBarchartData(categories,confirmedList,deathList,recoveredList,name){
	Highcharts.chart('container', {
		chart: {
		  zoomType: 'xy'
		},
		title: {
		  text: 'Daily Status of '+name
		},
		subtitle: {
		  text: ''
		},
		xAxis: {
		  categories: categories,
		  crosshair: true
		},
		yAxis: [{ // Primary yAxis
			labels: {
				format: '{value}',
				style: {
					color: Highcharts.getOptions().colors[2]
				}
			},
			title: {
				text: 'Recovered Level',
				style: {
					color: Highcharts.getOptions().colors[2]
				}
			},
			opposite: true
	
		}, { // Secondary yAxis
			gridLineWidth: 1,
			title: {
				text: 'Confirmed Cases',
				style: {
					color: Highcharts.getOptions().colors[0]
				}
			},
			labels: {
				format: '{value}',
				style: {
					color: Highcharts.getOptions().colors[0]
				}
			}
	
		}, { // Tertiary yAxis
			gridLineWidth: 1,
			title: {
				text: 'Death & Recovered Cases',
				style: {
					color: Highcharts.getOptions().colors[1]
				}
			},
			labels: {
				format: '{value}',
				style: {
					color: Highcharts.getOptions().colors[1]
				}
			},
			opposite: true
		}],
		tooltip: {
			shared: true
		},
		legend: {
			layout: 'vertical',
			align: 'left',
			x: 80,
			verticalAlign: 'top',
			y: 55,
			floating: true,
			backgroundColor:
				Highcharts.defaultOptions.legend.backgroundColor || // theme
				'rgba(255,255,255,0.25)'
		},
		
		series: [{
		  name: 'Confirmed',
		  type:'column',
		  yAxis: 1,
		  data: confirmedList
	  
		}, {
		  name: 'Deaths',
		  yAxis: 2,
		  type: 'spline',
		  data: deathList
	  
		}, {
		  name: 'Recovered',
		  yAxis: 2,
		  type: 'spline',
		  data: recoveredList
	  
		}],
		responsive: {
			rules: [{
				condition: {
					maxWidth: 500
				},
				chartOptions: {
					legend: {
						floating: false,
						layout: 'horizontal',
						align: 'center',
						verticalAlign: 'bottom',
						x: 0,
						y: 0
					},
					yAxis: [{
						labels: {
							align: 'right',
							x: 0,
							y: -6
						},
						showLastLabel: false
					}, {
						labels: {
							align: 'left',
							x: 0,
							y: -6
						},
						showLastLabel: false
					}, {
						visible: false
					}]
				}
			}]}
	  });
	
}

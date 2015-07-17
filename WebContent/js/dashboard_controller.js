var processJSON;
var agediagnosis_chart_data_json;
var gender_chart_data_json;
var bmi_chart_data_json;
var comorb_chart_data_json;
var cvr_chart_data_json;

var complClassJsonRawValuesMacro;
var complClassJsonRawValuesMicro;
var complClassJsonRawValuesNonVascular; 
var complClassJsonRawValues;
var comorb_chart_macro;
var comorb_chart_micro;
var comorb_chart_nv;
var comorb_chart2;
var comorbidityData;
var comorbidityDataDetail;
var dataTableLOC;
var dataTableHOSPITALIZATION;
var dataTableDRUG;
var dataTableCOMPLICATION;
var dataTableCVR;
var processChartLOC;
var processChartHOSPITALIZATION;
var processChartDRUG;
var processChartCOMPLICATION;
var processChartCVR;

var complicationDataPost;
var scatterChartDataComplication;
var optionalInfoComplication;
var historySelected = 0;
var patientIdSelected;
var patientCompleteNameSelected;


var processDataCategories = ["LOC","DRUG","HOSPITALIZATION", "CVR", "COMPLICATION"];
//var processDataCategories = ["LOC","DRUG","HOSPITALIZATION","COMPLICATION"];

$(function(){
	renderContainer();

});

$( window ).resize(function() {
	renderContainer();    		
});

function renderContainer(){
	$('#chart_container').width(Math.floor($('#dashboard_container').innerWidth() - $('#menu_container').innerWidth()-50));

	$('#chart_container').height($('#dashboard_container').height());
	$('#menu_container').height($('#dashboard_container').height());

	//setloader position
	$('.loader').css('left',($('#dashboard_container').innerWidth()/2)-$('.loader').innerWidth());

	$("#singlePatientDataContainer").hide();

	hideFilters();
	hideLoader();
	hideGraphs(2);
	hideGraphs(3);
	showTooltip(1);

	//setting search patient action
	bindSearchPatient();
}


google.load("visualization", "1", {packages:["corechart", "timeline"]});
google.setOnLoadCallback(drawCharts);

function drawCharts() {
	$('#comorb_chart_ex_container').hide();
//	GENDER
	gender_chart_data_json = $.ajax({
		url: "./i2b2Servlet/",
		dataType:"json",
		async: false,
		data: {step: "1",chart_type: "gender"}
	}).responseText;

	var gender_chart_data = new google.visualization.DataTable(gender_chart_data_json);

	var gender_options = {
			chartArea:{top:20,width:"80%",height:"80%"},
			legend: {position: 'right', alignment: 'center', textStyle: { fontName: 'MyriadPro', fontSize: 14 }},
			slices: {0: {color: '#015E84'}, 1:{color: '#90C8D1'}},
			tooltip: { textStyle: { fontName: 'MyriadPro', fontSize: 14 } },
			pieSliceText: 'value'
	};

	var gender_chart = new google.visualization.PieChart(document.getElementById('gender_chart'));
	gender_chart.draw(gender_chart_data, gender_options);

//	BMI        

	bmi_chart_data_json = $.ajax({
		url: "./i2b2Servlet/",
		dataType:"json",
		async: false,
		data: {step: "1",chart_type: "bmi"}
	}).responseText;

	var bmi_chart_data = new google.visualization.DataTable(bmi_chart_data_json);


	var bmi_options = {
			chartArea:{top:20,width:"80%",height:"80%"},
			hAxis: {slantedTextAngle: 90},
			//isStacked: true,
			tooltip: { textStyle: { fontName: 'MyriadPro', fontSize: 14 } },
			legend: {position: 'top', alignment: 'center', textStyle: { fontName: 'MyriadPro', fontSize: 14 } },
			explorer: { actions: ['dragToZoom', 'rightClickToReset'],  maxZoomIn: .01 },
			series: [{color: '#015E84', visibleInLegend: true}, 
			         {color: '#AF5E5E', visibleInLegend: true}],
			         curveType: 'function'
	};

	var bmi_chart = new google.visualization.ColumnChart(document.getElementById('bmi_chart'));
//	var bmi_chart = new google.visualization.LineChart(document.getElementById('bmi_chart'));
	bmi_chart.draw(bmi_chart_data, bmi_options);


//	COMORBIDITY
	comorb_chart_data_json = $.ajax({
		url: "./i2b2Servlet/",
		dataType:"json",
		async: false,
		data: {step: "1",chart_type: "comorbidity"}
	}).responseText;

	var outerJson = jQuery.parseJSON(comorb_chart_data_json);
	var complClassJson = outerJson.comorb_class;
	var complClassJsonData = complClassJson.chart_data;
	complClassJsonRawValues = complClassJson.raw_data;
	var comorb_chart_data = new google.visualization.DataTable(complClassJsonData);
	comorbidityData = comorb_chart_data;

	//var comorb_chart_data = new google.visualization.DataTable(comorb_chart_data_json);

	var comorb_options = {
			chartArea:{top:20,width:"80%",height:"80%"},
			tooltip: { textStyle: { fontName: 'MyriadPro', fontSize: 14 } },
			legend: {position: 'right', alignment: 'center', textStyle: { fontName: 'MyriadPro', fontSize: 14 }},
			slices: {0: {color: '#015E84'}, 1:{color: '#90C8D1'},  2:{color: '#D4B667'},3:{color: '#927D62'},4:{color: '#D8C4A0'},
				5:{color: '#D18369'},6:{color: '#AF5E5E'},7:{color: '#BC7D7D'},8:{color: '#01827C'},9:{color: '#7CC3AE'},10:{color: '#015E84'}},
				pieSliceText: 'value'
	};

	comorb_chart2 = new google.visualization.PieChart(document.getElementById('comorb_chart'));
	comorb_chart2.draw(comorb_chart_data, comorb_options);

//	AGE@DIAGNOSIS

	agediagnosis_chart_data_json = $.ajax({
		url: "./i2b2Servlet/",
		dataType:"json",
		async: false,
		data: {step: "1", chart_type: "age_diagnosis"}
	}).responseText;

	agediagnosis_chart_data_json = jQuery.parseJSON(agediagnosis_chart_data_json);

	var agediagnosis_chart_data = new google.visualization.DataTable(agediagnosis_chart_data_json.chart_json);

	var agediagnosis_options = {
			chartArea:{top:20,width:"80%",height:"80%"},
			legend: {position: 'right', alignment: 'center',textStyle: { fontName: 'MyriadPro', fontSize: 14 } },
			tooltip: { textStyle: { fontName: 'MyriadPro', fontSize: 14 } },
			slices: {0: {color: '#D18369'}, 1:{color: '#AF5E5E'},  2:{color: '#BC7D7D'},3:{color: '#927D62'},4:{color: '#D8C4A0'},
				5:{color: '#015E84'},6:{color: '#90C8D1'},7:{color: '#D4B667'},8:{color: '#01827C'},9:{color: '#7CC3AE'},10:{color: '#D18369'}},
				pieSliceText: 'value'
	};

	var agediagnosis_chart = new google.visualization.PieChart(document.getElementById('agediagnosis_chart'));
	agediagnosis_chart.draw(agediagnosis_chart_data, agediagnosis_options);


	//CARDIOVASCULAR RISK
	cvr_chart_data_json = $.ajax({
		url: "./i2b2Servlet/",
		dataType:"json",
		async: false,
		data: {step: "1",chart_type: "cvr"}
	}).responseText;

	var cvr_chart_data = new google.visualization.DataTable(cvr_chart_data_json);

	var cvr_options = {
			chartArea:{top:20,width:"80%",height:"80%"},
			tooltip: { textStyle: { fontName: 'MyriadPro', fontSize: 14 } },
			legend: {position: 'right', alignment: 'center', textStyle: { fontName: 'MyriadPro', fontSize: 14 }},
			slices: {0: {color: '#015E84'}, 1:{color: '#90C8D1'},  2:{color: '#D4B667'},
				3: {color: '#AF5E5E'}, 4:{color: '#BC7D7D'},  5:{color: '#01827C'}},
				pieSliceText: 'value'
	};

	var cvr_chart = new google.visualization.PieChart(document.getElementById('cvr_chart'));
	cvr_chart.draw(cvr_chart_data, cvr_options);

//	ADD SELECTORS FOR STEP2

	//GENDER SELECTOR
	google.visualization.events.addListener(gender_chart, 'select', selectGenderHandler);

	function selectGenderHandler(e) {
		//alert('A table row was selected');
		var selected = gender_chart.getSelection();

		var selectedStr = "";
		if(parseInt(selected[0].row)==0){
			selectedStr = "M";
		}
		else{
			selectedStr = "F";
		}

		hideGraphs(1);
		showLoader();
		$(".step_two_two").html("");
		//$(".step_two_two").append('<div id="prova_post"></div>');
		for(var i=0; i<processDataCategories.length; i++){
			$.ajax({
				url: "./i2b2Servlet/",
				dataType:"json",
				async: true,
				data: { step: "2",
					chart_type: "gender_process",
					data_category: processDataCategories[i],
					selected_value:  selected[0].row  
				},
				complete: function(results){
					$('#step_item_1 > span').text("Gender: " + selectedStr);
					$('#step_item_1').show();
					showTooltip(2);
					gender_chart.setSelection(null);
					getProcess(results.responseText);
				}
			});
		}
	}

	//AGE@DIAGNOSIS SELECTOR
	google.visualization.events.addListener(agediagnosis_chart, 'select', selectAgeHandler);

	function selectAgeHandler(e) {
		//alert('A table row was selected');
		var selected = agediagnosis_chart.getSelection();

		var selectedStr = "";
		if(parseInt(selected[0].row)==0){
			selectedStr = "0-10";
		}
		else if(parseInt(selected[0].row)<=9){
			selectedStr = selected[0].row +"0-"+(parseInt(selected[0].row)+1)+"0"; 
		}
		else{
			selectedStr = "sup-100";
		}

		hideGraphs(1);
		showLoader();

		$(".step_two_two").html("");
		//	$(".step_two_two").append('<div id="prova_post"></div>');
		for(var i=0; i<processDataCategories.length; i++){
			$.ajax({
				url: "./i2b2Servlet/",
				dataType:"json",
				async: true,
				data: { step: "2",
					chart_type: "age_process",
					data_category: processDataCategories[i],
					selected_value:  agediagnosis_chart_data_json.raw_values[selected[0].row].patient_nums  
				},
				complete: function(results){
					$('#step_item_1 > span').text("Age: " + selectedStr);
					$('#step_item_1').show();
					showTooltip(2);
					agediagnosis_chart.setSelection(null);
					getProcess(results.responseText);
				}
			});
		}
	}

	//CVR SELECTOR
	google.visualization.events.addListener(cvr_chart, 'select', selectVRHandler);
	function selectVRHandler(e) {	
		var selected = cvr_chart.getSelection();
		//alert('A table row was selected '+selected[0].row);
		var selectedStr = "";
		if(parseInt(selected[0].row)==0){
			selectedStr = "I";
		}
		else if(parseInt(selected[0].row)==1){
			selectedStr = "II";
		}else if(parseInt(selected[0].row)==2){
			selectedStr = "III";
		}else if(parseInt(selected[0].row)==3){
			selectedStr = "IV";
		}else if(parseInt(selected[0].row)==4){
			selectedStr = "V";
		}
		else{
			selectedStr = "VI";
		}

		hideGraphs(1);
		showLoader();

		$(".step_two_two").html("");
		//	$(".step_two_two").append('<div id="prova_post"></div>');
		for(var i=0; i<processDataCategories.length; i++){
			$.ajax({
				url: "./i2b2Servlet/",
				dataType:"json",
				async: true,
				data: { step: "2",
					chart_type: "cvr_process",
					data_category: processDataCategories[i],
					selected_value:  selected[0].row  
				},
				complete: function(results){
					$('#step_item_1 > span').text("CVR: " + selectedStr);
					$('#step_item_1').show();
					showTooltip(2);
					cvr_chart.setSelection(null);
					getProcess(results.responseText);
				}
			});
		}
	}

	//COMORBIDITY SELECTOR
//	var complClassJsonRawValuesMacro;
//	var complClassJsonRawValuesMicro;
//	var complClassJsonRawValuesNonVascular; 
//	var comorb_chart_macro;
//	var comorb_chart_micro;
//	var comorb_chart_nv;
	google.visualization.events.addListener(comorb_chart2, 'select', selectComorbHandler);
	function selectComorbHandler(e) {
		var selected = comorb_chart2.getSelection();
		var selectedString = comorbidityData.getValue(selected[0].row,0);
		//	alert('A table row was selected '+selected[0].row);
		var checked = document.getElementById('comorbidity_cb').checked;
		if(!checked){
			$('#comorb_chart_ex_container').show();
			$('#comorb_chart_container').hide();
			if(parseInt(selected[0].row)==0){
				var outerJson = jQuery.parseJSON(comorb_chart_data_json);
				var complClassJson = outerJson.macro;
				var complClassJsonData = complClassJson.chart_data;
				complClassJsonRawValuesMacro = complClassJson.raw_data;
				var comorb_chart_data_macro = new google.visualization.DataTable(complClassJsonData);
				comorbidityDataDetail = comorb_chart_data_macro;
				//var comorb_chart_data = new google.visualization.DataTable(comorb_chart_data_json);

				var comorb_options = {
						chartArea:{top:20,width:"80%",height:"80%"},
						tooltip: { textStyle: { fontName: 'MyriadPro', fontSize: 14 } },
						legend: {position: 'right', alignment: 'center', textStyle: { fontName: 'MyriadPro', fontSize: 14 }},
						slices: {0: {color: '#015E84'}, 1:{color: '#90C8D1'},  2:{color: '#D4B667'},3:{color: '#927D62'},4:{color: '#D8C4A0'},
							5:{color: '#D18369'},6:{color: '#AF5E5E'},7:{color: '#BC7D7D'},8:{color: '#01827C'},9:{color: '#7CC3AE'},10:{color: '#015E84'}},
							pieSliceText: 'value'
				};

				comorb_chart_macro = new google.visualization.PieChart(document.getElementById('comorb_chart_ex'));
				comorb_chart_macro.draw(comorb_chart_data_macro, comorb_options);	
				google.visualization.events.addListener(comorb_chart_macro, 'select', selectComorbHandlerMacro);
			}
			else if(parseInt(selected[0].row)==1){
				var outerJson = jQuery.parseJSON(comorb_chart_data_json);
				var complClassJson = outerJson.micro;
				var complClassJsonData = complClassJson.chart_data;
				complClassJsonRawValuesMicro = complClassJson.raw_data;
				var comorb_chart_data_micro = new google.visualization.DataTable(complClassJsonData);
				comorbidityDataDetail = comorb_chart_data_micro;
				//var comorb_chart_data = new google.visualization.DataTable(comorb_chart_data_json);

				var comorb_options = {
						chartArea:{top:20,width:"80%",height:"80%"},
						tooltip: { textStyle: { fontName: 'MyriadPro', fontSize: 14 } },
						legend: {position: 'right', alignment: 'center', textStyle: { fontName: 'MyriadPro', fontSize: 14 }},
						slices: {0: {color: '#015E84'}, 1:{color: '#90C8D1'},  2:{color: '#D4B667'},3:{color: '#927D62'},4:{color: '#D8C4A0'},
							5:{color: '#D18369'},6:{color: '#AF5E5E'},7:{color: '#BC7D7D'},8:{color: '#01827C'},9:{color: '#7CC3AE'},10:{color: '#015E84'}},
							pieSliceText: 'value'
				};

				comorb_chart_micro = new google.visualization.PieChart(document.getElementById('comorb_chart_ex'));
				comorb_chart_micro.draw(comorb_chart_data_micro, comorb_options);
				google.visualization.events.addListener(comorb_chart_micro, 'select', selectComorbHandlerMicro);
			}else if(parseInt(selected[0].row)==2){
				var outerJson = jQuery.parseJSON(comorb_chart_data_json);
				var complClassJson = outerJson.not_vascular;
				var complClassJsonData = complClassJson.chart_data;
				complClassJsonRawValuesNonVascular = complClassJson.raw_data;
				var comorb_chart_data_nv = new google.visualization.DataTable(complClassJsonData);
				comorbidityDataDetail = comorb_chart_data_nv;
				//var comorb_chart_data = new google.visualization.DataTable(comorb_chart_data_json);

				var comorb_options = {
						chartArea:{top:20,width:"80%",height:"80%"},
						tooltip: { textStyle: { fontName: 'MyriadPro', fontSize: 14 } },
						legend: {position: 'right', alignment: 'center', textStyle: { fontName: 'MyriadPro', fontSize: 14 }},
						slices: {0: {color: '#015E84'}, 1:{color: '#90C8D1'},  2:{color: '#D4B667'},3:{color: '#927D62'},4:{color: '#D8C4A0'},
							5:{color: '#D18369'},6:{color: '#AF5E5E'},7:{color: '#BC7D7D'},8:{color: '#01827C'},9:{color: '#7CC3AE'},10:{color: '#015E84'}},
							pieSliceText: 'value'
				};

				comorb_chart_nv = new google.visualization.PieChart(document.getElementById('comorb_chart_ex'));
				comorb_chart_nv.draw(comorb_chart_data_nv, comorb_options);
				google.visualization.events.addListener(comorb_chart_nv, 'select', selectComorbHandlerNV);
			}
		}else{
			var selectedComorb = comorb_chart2.getSelection();
			var comorbIndexSlice = selectedComorb[0].row;

			//alert('A table row was selected from Comorb '+comorbIndexSlice+ " "+complClassJsonRawValues[comorbIndexSlice].patient_nums);
			hideGraphs(1);
			showLoader();

			$(".step_two_two").html("");
			//	$(".step_two_two").append('<div id="prova_post"></div>');
			for(var i=0; i<processDataCategories.length; i++){
				$.ajax({
					url: "./i2b2Servlet/",
					dataType:"json",
					async: true,
					data: { step: "2",
						chart_type: "comorb_process",
						data_category: processDataCategories[i],
						selected_value:  complClassJsonRawValues[comorbIndexSlice].patient_nums  
					},
					complete: function(results){
						$('#step_item_1 > span').text("Comorbidity: " + selectedString);
						$('#step_item_1').show();
						showTooltip(2);
						comorb_chart2.setSelection(null);
						getProcess(results.responseText);
					}
				});
			}
		}
	}

	function selectComorbHandlerMacro(e) {
		var selectedMacro = comorb_chart_macro.getSelection();
		var macroIndexSlice = selectedMacro[0].row;
		var selectedStringMacro = comorbidityDataDetail.getValue(selectedMacro[0].row,0);
		//alert('A table row was selected from Macro '+macroIndexSlice+ " "+complClassJsonRawValuesMacro[macroIndexSlice].patient_nums);
		hideGraphs(1);
		showLoader();
		$(".step_two_two").html("");
		//$(".step_two_two").append('<div id="prova_post"></div>');
		for(var i=0; i<processDataCategories.length; i++){
			$.ajax({
				url: "./i2b2Servlet/",
				dataType:"json",
				async: true,
				data: { step: "2",
					chart_type: "comorb_process",
					data_category: processDataCategories[i],
					selected_value:  complClassJsonRawValuesMacro[macroIndexSlice].patient_nums  
				},
				complete: function(results){
					$('#step_item_1 > span').text("Comorbidity: " + selectedStringMacro);
					$('#step_item_1').show();
					showTooltip(2);
					comorb_chart_macro.setSelection(null);
					getProcess(results.responseText);
				}
			});
		}
	}

	function selectComorbHandlerMicro(e) {
		var selectedMicro = comorb_chart_micro.getSelection();
		var microIndexSlice = selectedMicro[0].row;
		var selectedStringMicro = comorbidityDataDetail.getValue(selectedMicro[0].row,0);
		//alert('A table row was selected from Micro '+microIndexSlice+ " "+complClassJsonRawValuesMicro[microIndexSlice].patient_nums);
		hideGraphs(1);
		showLoader();
		$(".step_two_two").html("");
		for(var i=0; i<processDataCategories.length; i++){
			$.ajax({
				url: "./i2b2Servlet/",
				dataType:"json",
				async: true,
				data: { step: "2",
					chart_type: "comorb_process",
					data_category: processDataCategories[i],
					selected_value:  complClassJsonRawValuesMicro[microIndexSlice].patient_nums  
				},
				complete: function(results){
					$('#step_item_1 > span').text("Comorbidity: " + selectedStringMicro);
					$('#step_item_1').show();
					showTooltip(2);
					comorb_chart_micro.setSelection(null);
					getProcess(results.responseText);
				}
			});
		}
	}

	function selectComorbHandlerNV(e) {
		var selectedNV = comorb_chart_nv.getSelection();
		var nvIndexSlice = selectedNV[0].row;
		var selectedStringNV = comorbidityDataDetail.getValue(selectedNV[0].row,0);
		//alert('A table row was selected from Non Vascular '+nvIndexSlice+ " "+complClassJsonRawValuesNonVascular[nvIndexSlice].patient_nums);
		hideGraphs(1);
		showLoader();

		$(".step_two_two").html("");
		//$(".step_two_two").append('<div id="prova_post"></div>');


		for(var i=0; i<processDataCategories.length; i++){
			$.ajax({
				url: "./i2b2Servlet/",
				dataType:"json",
				async: true,
				data: { step: "2",
					chart_type: "comorb_process",
					data_category: processDataCategories[i],
					selected_value:  complClassJsonRawValuesNonVascular[nvIndexSlice].patient_nums 
				},
				complete: function(results){
					$('#step_item_1 > span').text("Comorbidity: " + selectedStringNV);
					$('#step_item_1').show();
					showTooltip(2);
					comorb_chart_nv.setSelection(null);
					getProcess(results.responseText);
				}
			});
		}
	}


}

function backToComorbidityClasses(){
	$('#comorb_chart_ex_container').hide();
	$('#comorb_chart_container').show();	
}

function getProcess(data){
	hideLoader();
	setMenu(2);
	showGraphs(2);
	drawProcessChart(data);	
}

function hideGraphs(step){
	manageGraphs(step, false);
}

function showGraphs(step){
	manageGraphs(step, true);
}

function manageGraphs(step, show){
	var classStr = ".";
	if (step == 1) {
		classStr += "step_one";
	} 
	else if (step == 2) {
		classStr += "step_two";
	}
	else if (step == 3) {
		classStr += "step_three";
	}
	else if (step == 0) {
		classStr += "step_zero";
	}
	else if (step == 4) {
		classStr += "step_four";
	}

	$(classStr).each(function() {
		if(show){
			$(this).show();
		}
		else{
			$(this).hide();
		}
	});
}

function setMenu(level_int){
	$(".menu_item_selected").removeClass("menu_item_selected");
	$("#menu_item_"+level_int).addClass("menu_item_selected");
}

function showLoader() {
	$('#loader').show();
}

function showTooltip(step){
	$('#menu_tooltip > div').each(function(){
		$(this).hide();
	});
	$('#step_'+step+'_tooltip').show();

}

function hideLoader() {
	$('#loader').hide();
}

function hidePatientsData(){
	$('#singlePatientDataContainer').hide();
}

function hideFilters(step){
	if(!step){
		$('.step_item').hide();
	}
	else{
		$('#step_item_'+step).hide();
	}
}

function reloadPage(){
	window.location.reload();
}

function homeClick(){
	showTooltip(1);
	hideFilters();
	hideGraphs(2);
	hideGraphs(3);
	hideGraphs(4);
	hidePatientsData();
	showGraphs(1);
	showGraphs(0);
	$('#comorb_chart_ex_container').hide();
	setMenu(1);
}


var processChart;

function drawProcessChart(data){

	var FROM_MS_TO_DAY = 86400000;
	function myHandlerHOSPITALIZATION(e){
		if(e.row != null){
//			$(".google-visualization-tooltip").html(dataTable.getValue(e.row,4)).css({width:"auto",height:"auto" ,
//			position:"absolute"});
			$(".google-visualization-tooltip").html(dataTableHOSPITALIZATION.getValue(e.row,4)).css({padding:"5px"});
		}        
	}
	function myHandlerLOC(e){
		if(e.row != null){
//			$(".google-visualization-tooltip").html(dataTable.getValue(e.row,4)).css({width:"auto",height:"auto" ,
//			position:"absolute"});
			$(".google-visualization-tooltip").html(dataTableLOC.getValue(e.row,4)+"<br>25 Percentile: "+dataTableLOC.getValue(e.row,10)).css({padding:"5px"});
		}        
	}
	function myHandlerCVR(e){
		if(e.row != null){
//			$(".google-visualization-tooltip").html(dataTable.getValue(e.row,4)).css({width:"auto",height:"auto" ,
//			position:"absolute"});
			$(".google-visualization-tooltip").html(dataTableCVR.getValue(e.row,4)+"<br>25 Percentile: "+dataTableCVR.getValue(e.row,10)).css({padding:"5px"});
		}        
	}
	function myHandlerDRUG(e){
		if(e.row != null){
//			$(".google-visualization-tooltip").html(dataTable.getValue(e.row,4)).css({width:"auto",height:"auto" ,
//			position:"absolute"});
			$(".google-visualization-tooltip").html(dataTableDRUG.getValue(e.row,4)).css({padding:"5px"});
		}        
	}
	function myHandlerCOMPLICATION(e){
		if(e.row != null){
//			$(".google-visualization-tooltip").html(dataTable.getValue(e.row,4)).css({width:"auto",height:"auto" ,
//			position:"absolute"});
			$(".google-visualization-tooltip").html(dataTableCOMPLICATION.getValue(e.row,4)).css({padding:"5px"});
		}        
	}
	function selectHandlerLOC() {
		var selected = processChartLOC.getSelection();
		//	alert('A TIMELINE table row was selected '+dataTableLOC.getValue(selected[0].row,5)+"--"+dataTableLOC.getValue(selected[0].row,6));

		hideGraphs(2);
		showLoader();

		var p_num_param = dataTableLOC.getValue(selected[0].row,5);
		var duration_param = dataTableLOC.getValue(selected[0].row,6);
		var history =dataTableLOC.getValue(selected[0].row,0);
		var step =dataTableLOC.getValue(selected[0].row,1);
		var maxDurationValue = dataTableLOC.getValue(selected[0].row,7);
		var numClassesValue = dataTableLOC.getValue(selected[0].row,8);
		var minDurationValue = dataTableLOC.getValue(selected[0].row,9);

		$.ajax({
			url: "./i2b2Servlet/",
			dataType:"json",
			async: true,
			data: { step: "3",
				chart_type: "comorb",
				patient_nums: p_num_param, 
				duration_nums: duration_param,
				num_classes : numClassesValue,
				max_duration : maxDurationValue,
				min_duration : minDurationValue
			},
			complete: function(results){
				$('#step_item_2 > span').text("History: " + history.replace("_"," "));
				$('#step_item_3 > span').text("Step: " + step);
				$('#step_item_2').show();
				$('#step_item_3').show();
				showTooltip(3);
				hideLoader();
				setMenu(3);
				showGraphs(3);
				drawDrillDown(results.responseText);
			}
		});
	}
	function selectHandlerCVR() {
		var selected = processChartCVR.getSelection();
		//	alert('A TIMELINE table row was selected '+dataTableLOC.getValue(selected[0].row,5)+"--"+dataTableLOC.getValue(selected[0].row,6));

		hideGraphs(2);
		showLoader();

		var p_num_param = dataTableCVR.getValue(selected[0].row,5);
		var duration_param = dataTableCVR.getValue(selected[0].row,6);
		var history =dataTableCVR.getValue(selected[0].row,0);
		var step =dataTableCVR.getValue(selected[0].row,1);
		var maxDurationValue = dataTableCVR.getValue(selected[0].row,7);
		var numClassesValue = dataTableCVR.getValue(selected[0].row,8);
		var minDurationValue = dataTableCVR.getValue(selected[0].row,9);

		$.ajax({
			url: "./i2b2Servlet/",
			dataType:"json",
			async: true,
			data: { step: "3",
				chart_type: "comorb",
				patient_nums: p_num_param, 
				duration_nums: duration_param,
				num_classes : numClassesValue,
				max_duration : maxDurationValue,
				min_duration : minDurationValue
			},
			complete: function(results){
				$('#step_item_2 > span').text("History: " + history.replace("_"," "));
				$('#step_item_3 > span').text("Step: " + step);
				$('#step_item_2').show();
				$('#step_item_3').show();
				showTooltip(3);
				hideLoader();
				setMenu(3);
				showGraphs(3);
				drawDrillDown(results.responseText);
			}
		});
	}
	function selectHandlerHOSPITALIZATION() {
		var selected = processChartHOSPITALIZATION.getSelection();
		if(dataTableHOSPITALIZATION.getValue(selected[0].row,1)!='wait'){		
			//	alert('A TIMELINE table row was selected '+dataTableHOSPITALIZATION.getValue(selected[0].row,5)+"--"+dataTableHOSPITALIZATION.getValue(selected[0].row,6));
			hideGraphs(2);
			showLoader();
			var p_num_param = dataTableHOSPITALIZATION.getValue(selected[0].row,5);
			var duration_param = dataTableHOSPITALIZATION.getValue(selected[0].row,6);
			var history =dataTableHOSPITALIZATION.getValue(selected[0].row,0);
			var step =dataTableHOSPITALIZATION.getValue(selected[0].row,1);
			var maxDurationValue = dataTableHOSPITALIZATION.getValue(selected[0].row,7);
			var numClassesValue = dataTableHOSPITALIZATION.getValue(selected[0].row,8);
			var minDurationValue = dataTableHOSPITALIZATION.getValue(selected[0].row,9);
			$.ajax({
				url: "./i2b2Servlet/",
				dataType:"json",
				async: true,
				data: { step: "3",
					chart_type: "comorb",
					patient_nums: p_num_param, 
					duration_nums: duration_param,
					num_classes : numClassesValue,
					max_duration : maxDurationValue,
					min_duration : minDurationValue
				},
				complete: function(results){
					$('#step_item_2 > span').text("History: " + history.replace("_"," "));
					$('#step_item_3 > span').text("Step: " + step);
					$('#step_item_2').show();
					$('#step_item_3').show();
					showTooltip(3);
					hideLoader();
					setMenu(3);
					showGraphs(3);
					drawDrillDown(results.responseText);
				}
			});
		}
	}
	function selectHandlerDRUG() {
		var selected = processChartDRUG.getSelection();
		if(dataTableDRUG.getValue(selected[0].row,1)!='wait'){		
			//	alert('A TIMELINE table row was selected '+dataTableDRUG.getValue(selected[0].row,5)+"--"+dataTableDRUG.getValue(selected[0].row,6));
			hideGraphs(2);
			showLoader();
			var p_num_param = dataTableDRUG.getValue(selected[0].row,5);
			var duration_param = dataTableDRUG.getValue(selected[0].row,6);
			var history =dataTableDRUG.getValue(selected[0].row,0);
			var step =dataTableDRUG.getValue(selected[0].row,1);
			var maxDurationValue = dataTableDRUG.getValue(selected[0].row,7);
			var numClassesValue = dataTableDRUG.getValue(selected[0].row,8);
			var minDurationValue = dataTableDRUG.getValue(selected[0].row,9);
			$.ajax({
				url: "./i2b2Servlet/",
				dataType:"json",
				async: true,
				data: { step: "3",
					chart_type: "comorb",
					patient_nums: p_num_param, 
					duration_nums: duration_param,
					num_classes : numClassesValue,
					max_duration : maxDurationValue,
					min_duration : minDurationValue
				},
				complete: function(results){
					$('#step_item_2 > span').text("History: " + history.replace("_"," "));
					$('#step_item_3 > span').text("Step: " + step);
					$('#step_item_2').show();
					$('#step_item_3').show();
					showTooltip(3);
					hideLoader();
					setMenu(3);
					showGraphs(3);
					drawDrillDown(results.responseText);
				}
			});
		}
	}
	function selectHandlerCOMPLICATION() {
		var selected = processChartCOMPLICATION.getSelection();
		if(dataTableCOMPLICATION.getValue(selected[0].row,1)!='wait'){		
			alert('A TIMELINE table row was selected '+dataTableCOMPLICATION.getValue(selected[0].row,5)+"--"+dataTableCOMPLICATION.getValue(selected[0].row,6));
			hideGraphs(2);
			showLoader();
			var p_num_param = dataTableCOMPLICATION.getValue(selected[0].row,5);
			var duration_param = dataTableCOMPLICATION.getValue(selected[0].row,6);
			var history =dataTableCOMPLICATION.getValue(selected[0].row,0);
			var step =dataTableCOMPLICATION.getValue(selected[0].row,1);
			var maxDurationValue = dataTableCOMPLICATION.getValue(selected[0].row,7);
			var numClassesValue = dataTableCOMPLICATION.getValue(selected[0].row,8);
			var minDurationValue = dataTableCOMPLICATION.getValue(selected[0].row,9);
			$.ajax({
				url: "./i2b2Servlet/",
				dataType:"json",
				async: true,
				data: { step: "3",
					chart_type: "comorb",
					patient_nums: p_num_param, 
					duration_nums: duration_param,
					num_classes : numClassesValue,
					max_duration : maxDurationValue,
					min_duration : minDurationValue
				},
				complete: function(results){
					$('#step_item_2 > span').text("History: " + history.replace("_"," "));
					$('#step_item_3 > span').text("Step: " + step);
					$('#step_item_2').show();
					$('#step_item_3').show();
					showTooltip(3);
					hideLoader();
					setMenu(3);
					showGraphs(3);
					drawDrillDown(results.responseText);
				}
			});
		}
	}
	//il file in ingresso � ancora da modificare con gli attributi label e steps corretti
	var obj = jQuery.parseJSON(data);
	processJSON = obj;
	$(".step_two_two").append('<div class="chart_step_two_container" id="div_container_'+obj.data_category+'"><div>'+obj.data_category+' CHART</div><div class="chart_step_two" id="div_process_'+obj.data_category+'"></div></div>');
	if(obj.data_category=='LOC'){
		var containerLOC = document.getElementById('div_process_'+obj.data_category);
		processChartLOC = new google.visualization.Timeline(containerLOC);
		dataTableLOC = new google.visualization.DataTable();
		google.visualization.events.addListener(processChartLOC, 'onmouseover', myHandlerLOC); 

		google.visualization.events.addListener(processChartLOC, 'select', selectHandlerLOC);


		dataTableLOC.addColumn({ type: 'string', id: 'Story' });
		dataTableLOC.addColumn({ type: 'string', id: 'Step' });
		dataTableLOC.addColumn({ type: 'number', id: 'Start' });
		dataTableLOC.addColumn({ type: 'number', id: 'End' });
		dataTableLOC.addColumn({'type': 'string', 'role': 'tooltip', 'p': {'html': true}});
		dataTableLOC.addColumn({'type': 'string'});
		dataTableLOC.addColumn({'type': 'string'});
		dataTableLOC.addColumn({ type: 'number'});
		dataTableLOC.addColumn({ type: 'number'});
		dataTableLOC.addColumn({ type: 'number'});
		dataTableLOC.addColumn({ type: 'number'});
		dataTableLOC.addColumn({ type: 'number'});

		var dtRows = 0;
		for(k=0;k<obj.histories.length;k++){
			dtRows += obj.histories[k].steps.length;
		}

		dataTableLOC.addRows(dtRows);

		var row = 0;

		for(i=0; i<obj.histories.length;i++){
			var start = 0;
			var path = obj.histories[i];
			for(j=0;j<path.steps.length;j++){
				dataTableLOC.setCell(row, 0, path.label);
				dataTableLOC.setCell(row, 1, path.steps[j].label);
				dataTableLOC.setCell(row, 2, start*FROM_MS_TO_DAY);
				dataTableLOC.setCell(row, 3, (start+parseInt(path.steps[j].time))*FROM_MS_TO_DAY);
				dataTableLOC.setCell(row, 4, "Duration: "+path.steps[j].time+" days");



				var patientString = "";
				var patientDurationString = "";
				$.each(path.steps[j].patients, function(i, item) {
					patientString = patientString.concat(item.idcod).concat(",");
					patientDurationString = patientDurationString.concat(item.duration).concat(",");
				});
				dataTableLOC.setCell(row, 5, patientString);
				dataTableLOC.setCell(row, 6, patientDurationString);
				dataTableLOC.setCell(row, 7, path.steps[j].max);
				dataTableLOC.setCell(row, 8, path.steps[j].num_classes);
				dataTableLOC.setCell(row, 9, path.steps[j].min);
				dataTableLOC.setCell(row, 10, path.steps[j].prctile);
				dataTableLOC.setCell(row, 11, path.steps[j].prctile);

				path.steps[j].fb=row;

				start+=parseInt(path.steps[j].time);
				row++;
			}
		}

		var optionsLOC = {
				timeline: { 
					groupByRowLabel: true,
					rowLabelStyle: {fontName: 'MyriadPro', fontSize: 14},
					barLabelStyle: { fontName: 'MyriadPro', fontSize: 12 }
				}, 
				avoidOverlappingGridLines: false,
				colors: ["#B9E3E8","#7CC3AE","#DDBF79","#D18369","#F5F6F7"],
				tooltip: { textStyle: { fontName: 'MyriadPro', fontSize: 14 } },
				backgroundColor: '#F5F6F7'
		};


		var viewLOC = new google.visualization.DataView(dataTableLOC);
		viewLOC.setColumns([0,1,2,3]);  
		//processChart.draw(dataTable, options);
		processChartLOC.draw(viewLOC, optionsLOC);
		//hide x-labels
		$($('svg', $('#div_process_'+obj.data_category)).children()[2]).hide();	
		$("#div_container_LOC").hide();
	}else if(obj.data_category=='CVR'){		
		var containerCVR = document.getElementById('div_process_'+obj.data_category);
		processChartCVR = new google.visualization.Timeline(containerCVR);
		dataTableCVR = new google.visualization.DataTable();
		google.visualization.events.addListener(processChartCVR, 'onmouseover', myHandlerCVR); 

		google.visualization.events.addListener(processChartCVR, 'select', selectHandlerCVR);


		dataTableCVR.addColumn({ type: 'string', id: 'Story' });
		dataTableCVR.addColumn({ type: 'string', id: 'Step' });
		dataTableCVR.addColumn({ type: 'number', id: 'Start' });
		dataTableCVR.addColumn({ type: 'number', id: 'End' });
		dataTableCVR.addColumn({'type': 'string', 'role': 'tooltip', 'p': {'html': true}});
		dataTableCVR.addColumn({'type': 'string'});
		dataTableCVR.addColumn({'type': 'string'});
		dataTableCVR.addColumn({ type: 'number'});
		dataTableCVR.addColumn({ type: 'number'});
		dataTableCVR.addColumn({ type: 'number'});
		dataTableCVR.addColumn({ type: 'number'});
		dataTableCVR.addColumn({ type: 'number'});

		var dtRows = 0;
		for(k=0;k<obj.histories.length;k++){
			dtRows += obj.histories[k].steps.length;
		}

		dataTableCVR.addRows(dtRows);

		var row = 0;
		var cvr_label_order = new Array();
		var arrayIndex=0;

		for(i=0; i<obj.histories.length;i++){
			var start = 0;
			var path = obj.histories[i];
			for(j=0;j<path.steps.length;j++){
				dataTableCVR.setCell(row, 0, path.label);
				dataTableCVR.setCell(row, 1, path.steps[j].label);
				dataTableCVR.setCell(row, 2, start*FROM_MS_TO_DAY);
				dataTableCVR.setCell(row, 3, (start+parseInt(path.steps[j].time))*FROM_MS_TO_DAY);
				dataTableCVR.setCell(row, 4, "Duration: "+path.steps[j].time+" days");

				if(arrayIndex==0){
					cvr_label_order[arrayIndex] = path.steps[j].label;
					arrayIndex = arrayIndex+1;
				}else{
					if($.inArray(path.steps[j].label,cvr_label_order)>=0){
						//donothing
					}else{
						cvr_label_order[arrayIndex] = path.steps[j].label;
						arrayIndex = arrayIndex+1;
					}
				}

				var patientString = "";
				var patientDurationString = "";
				$.each(path.steps[j].patients, function(i, item) {
					patientString = patientString.concat(item.idcod).concat(",");
					patientDurationString = patientDurationString.concat(item.duration).concat(",");
				});
				dataTableCVR.setCell(row, 5, patientString);
				dataTableCVR.setCell(row, 6, patientDurationString);
				dataTableCVR.setCell(row, 7, path.steps[j].max);
				dataTableCVR.setCell(row, 8, path.steps[j].num_classes);
				dataTableCVR.setCell(row, 9, path.steps[j].min);
				dataTableCVR.setCell(row, 10, path.steps[j].prctile);
				dataTableCVR.setCell(row, 11, path.steps[j].prctile);

				path.steps[j].fb=row;

				start+=parseInt(path.steps[j].time);
				row++;
			}
		}

		var colorsArray = [];
		var colorMap = {
				'I': '#84D1AD',
				'II': '#01AE76',
				'III': '#FDD687',
				'IV': '#FF944C',
				'V': '#F34930',
				'VI': '#C479B1'
		};
		for (var i = 0; i < cvr_label_order.length; i++) {
			colorsArray.push(colorMap[cvr_label_order[i]]);
		}

		var optionsCVR = {
				timeline: { 
					groupByRowLabel: true,
					rowLabelStyle: {fontName: 'MyriadPro', fontSize: 14},
					barLabelStyle: { fontName: 'MyriadPro', fontSize: 12 }
				}, 
				avoidOverlappingGridLines: false,
				colors: colorsArray,
				tooltip: { textStyle: { fontName: 'MyriadPro', fontSize: 14 } },
				backgroundColor: '#F5F6F7'
		};


		var viewCVR = new google.visualization.DataView(dataTableCVR);
		viewCVR.setColumns([0,1,2,3]);  
		//processChart.draw(dataTable, options);
		processChartCVR.draw(viewCVR, optionsCVR);
		//hide x-labels
		$($('svg', $('#div_process_'+obj.data_category)).children()[2]).hide();	
		$("#div_container_CVR").hide();
	}else if(obj.data_category=='HOSPITALIZATION'){
		var containerHOSPITALIZATION = document.getElementById('div_process_'+obj.data_category);
		processChartHOSPITALIZATION = new google.visualization.Timeline(containerHOSPITALIZATION);
		dataTableHOSPITALIZATION = new google.visualization.DataTable();
		google.visualization.events.addListener(processChartHOSPITALIZATION, 'onmouseover', myHandlerHOSPITALIZATION); 

		google.visualization.events.addListener(processChartHOSPITALIZATION, 'select', selectHandlerHOSPITALIZATION);

		dataTableHOSPITALIZATION.addColumn({ type: 'string', id: 'Story' });
		dataTableHOSPITALIZATION.addColumn({ type: 'string', id: 'Step' });
		dataTableHOSPITALIZATION.addColumn({ type: 'number', id: 'Start' });
		dataTableHOSPITALIZATION.addColumn({ type: 'number', id: 'End' });
		dataTableHOSPITALIZATION.addColumn({'type': 'string', 'role': 'tooltip', 'p': {'html': true}});
		dataTableHOSPITALIZATION.addColumn({'type': 'string'});
		dataTableHOSPITALIZATION.addColumn({'type': 'string'});
		dataTableHOSPITALIZATION.addColumn({ type: 'number'});
		dataTableHOSPITALIZATION.addColumn({ type: 'number'});
		dataTableHOSPITALIZATION.addColumn({ type: 'number'});

		var dtRows = 0;
		for(k=0;k<obj.histories.length;k++){
			dtRows += obj.histories[k].steps.length;
		}

		dataTableHOSPITALIZATION.addRows(dtRows);

		var row = 0;
		var hospitalization_label_order = new Array();
		var arrayIndex=0;

		for(i=0; i<obj.histories.length;i++){
			var start = 0;
			var path = obj.histories[i];
			for(j=0;j<path.steps.length;j++){
				dataTableHOSPITALIZATION.setCell(row, 0, path.label);
				dataTableHOSPITALIZATION.setCell(row, 1, path.steps[j].label);
				dataTableHOSPITALIZATION.setCell(row, 2, start*FROM_MS_TO_DAY);
				dataTableHOSPITALIZATION.setCell(row, 3, (start+parseInt(path.steps[j].time))*FROM_MS_TO_DAY);
				dataTableHOSPITALIZATION.setCell(row, 4, "Duration: "+path.steps[j].time+" days");
				if(arrayIndex==0){
					hospitalization_label_order[arrayIndex] = path.steps[j].label;
					arrayIndex = arrayIndex+1;
				}else{
					if($.inArray(path.steps[j].label,hospitalization_label_order)>=0){
						//donothing
					}else{
						hospitalization_label_order[arrayIndex] = path.steps[j].label;
						arrayIndex = arrayIndex+1;
					}
				}

				var patientString = "";
				var patientDurationString = "";
				$.each(path.steps[j].patients, function(i, item) {
					patientString = patientString.concat(item.idcod).concat(",");
					patientDurationString = patientDurationString.concat(item.duration).concat(",");
				});
				dataTableHOSPITALIZATION.setCell(row, 5, patientString);
				dataTableHOSPITALIZATION.setCell(row, 6, patientDurationString);
				dataTableHOSPITALIZATION.setCell(row, 7, path.steps[j].max);
				dataTableHOSPITALIZATION.setCell(row, 8, path.steps[j].num_classes);
				dataTableHOSPITALIZATION.setCell(row, 9, path.steps[j].min);
				path.steps[j].fb=row;

				start+=parseInt(path.steps[j].time);
				row++;
			}
		}

		var colorsArray = [];
		var colorMap = {
				'DayHospital': '#015E84',
				'InHospital': '#90C8D1',
				'wait': '#BABABA'
		};
		for (var i = 0; i < hospitalization_label_order.length; i++) {
			colorsArray.push(colorMap[hospitalization_label_order[i]]);
		}

		var optionsHOSPITALIZATION = {
				timeline: { 
					groupByRowLabel: true,
					rowLabelStyle: {fontName: 'MyriadPro', fontSize: 14},
					barLabelStyle: { fontName: 'MyriadPro', fontSize: 12 }
				}, 
				avoidOverlappingGridLines: false,
				//	colors: ["#B9E3E8","#7CC3AE","#DDBF79","#D18369","#F5F6F7"],
				colors: colorsArray,
				tooltip: { textStyle: { fontName: 'MyriadPro', fontSize: 14 } },
				backgroundColor: '#F5F6F7'
		};


		var viewHOSPITALIZATION = new google.visualization.DataView(dataTableHOSPITALIZATION);
		viewHOSPITALIZATION.setColumns([0,1,2,3]);  
		//processChart.draw(dataTable, options);
		processChartHOSPITALIZATION.draw(viewHOSPITALIZATION, optionsHOSPITALIZATION);
		//hide x-labels
//		$($('svg', $('#div_process_'+obj.data_category)).children()[1]).hide();
//		$($('svg', $('#div_process_'+obj.data_category)).children()[2]).hide();
		$("#div_container_HOSPITALIZATION").hide();
	}else if(obj.data_category=='DRUG'){
		var containerDRUG = document.getElementById('div_process_'+obj.data_category);
		processChartDRUG = new google.visualization.Timeline(containerDRUG);
		dataTableDRUG = new google.visualization.DataTable();
		google.visualization.events.addListener(processChartDRUG, 'onmouseover', myHandlerDRUG); 
		google.visualization.events.addListener(processChartDRUG, 'select', selectHandlerDRUG);

		dataTableDRUG.addColumn({ type: 'string', id: 'Story' });
		dataTableDRUG.addColumn({ type: 'string', id: 'Step' });
		dataTableDRUG.addColumn({ type: 'number', id: 'Start' });
		dataTableDRUG.addColumn({ type: 'number', id: 'End' });
		dataTableDRUG.addColumn({'type': 'string', 'role': 'tooltip', 'p': {'html': true}});
		dataTableDRUG.addColumn({'type': 'string'});
		dataTableDRUG.addColumn({'type': 'string'});
		dataTableDRUG.addColumn({ type: 'number'});
		dataTableDRUG.addColumn({ type: 'number'});
		dataTableDRUG.addColumn({ type: 'number'});

		var dtRows = 0;
		for(k=0;k<obj.histories.length;k++){
			var path = obj.histories[k];
			for(j=0;j<path.steps.length;j++){
				if(path.steps[j].label!='wait'){
					dtRows = dtRows+1;
				}
			}
			//dtRows += obj.histories[k].steps.length;
		}
		dataTableDRUG.addRows(dtRows);

		var row = 0;
//		var hospitalization_label_order = new Array();
//		var arrayIndex=0;

		for(i=0; i<obj.histories.length;i++){
			var start = 0;
			var path = obj.histories[i];
			for(j=0;j<path.steps.length;j++){
				if(path.steps[j].label!='wait'){
					dataTableDRUG.setCell(row, 0, path.label);
					dataTableDRUG.setCell(row, 1, path.steps[j].label);
					dataTableDRUG.setCell(row, 2, start*FROM_MS_TO_DAY);
					dataTableDRUG.setCell(row, 3, (start+parseInt(path.steps[j].time))*FROM_MS_TO_DAY);
					dataTableDRUG.setCell(row, 4, "Duration: "+path.steps[j].time+" days");
//					if(arrayIndex==0){
//					hospitalization_label_order[arrayIndex] = path.steps[j].label;
//					arrayIndex = arrayIndex+1;
//					}else{
//					if($.inArray(path.steps[j].label,hospitalization_label_order)>=0){
//					//donothing
//					}else{
//					hospitalization_label_order[arrayIndex] = path.steps[j].label;
//					arrayIndex = arrayIndex+1;
//					}
//					}

					var patientString = "";
					var patientDurationString = "";
					$.each(path.steps[j].patients, function(i, item) {
						patientString = patientString.concat(item.idcod).concat(",");
						patientDurationString = patientDurationString.concat(item.duration).concat(",");
					});
					dataTableDRUG.setCell(row, 5, patientString);
					dataTableDRUG.setCell(row, 6, patientDurationString);
					dataTableDRUG.setCell(row, 7, path.steps[j].max);
					dataTableDRUG.setCell(row, 8, path.steps[j].num_classes);
					dataTableDRUG.setCell(row, 9, path.steps[j].min);
					path.steps[j].fb=row;

					start+=parseInt(path.steps[j].time);
					row++;
				}else{
					path.steps[j].fb=row;
					start+=parseInt(path.steps[j].time);
				}

			}
		}

//		var colorsArray = [];
//		var colorMap = {
//		'DayHospital': '#015E84',
//		'InHospital': '#90C8D1',
//		'wait': '#BABABA'
//		};
//		for (var i = 0; i < hospitalization_label_order.length; i++) {
//		colorsArray.push(colorMap[hospitalization_label_order[i]]);
//		}

		var optionsDRUG = {
				timeline: { 
					groupByRowLabel: true,
					rowLabelStyle: {fontName: 'MyriadPro', fontSize: 14},
					barLabelStyle: { fontName: 'MyriadPro', fontSize: 12 }
				}, 
				avoidOverlappingGridLines: false,
				colors: ["#D18369","#7CC3AE","#BC7D7D","#927D62","#D8C4A0",
				         "#015E84","#90C8D1","#D4B667","#01827C","#7CC3AE",
				         "#D18369","#A3D5C6","#B9E3E8","#DDBF79","#DDA679",
				         "#AB77AB","#FF52b2"],
				         //colors: colorsArray,
				         tooltip: { textStyle: { fontName: 'MyriadPro', fontSize: 14 } },
				         backgroundColor: '#F5F6F7'
		};


		var viewDRUG = new google.visualization.DataView(dataTableDRUG);
		viewDRUG.setColumns([0,1,2,3]);  
		//processChart.draw(dataTable, options);
		processChartDRUG.draw(viewDRUG, optionsDRUG);
		//hide x-labels
//		$($('svg', $('#div_process_'+obj.data_category)).children()[1]).hide();
//		$($('svg', $('#div_process_'+obj.data_category)).children()[2]).hide();
		$("#div_container_DRUG").hide();
	}else if(obj.data_category=='COMPLICATION'){
		$('#div_process_COMPLICATION').remove();
		$("#div_container_COMPLICATION").prepend('<div id="prova_post"></div>');
		$('#prova_post').next().remove();
		//******************************************************************************
		$.ajax({
			url: "./i2b2Servlet/",
			type: "POST",
			dataType:"json",
			async: true,
			data: {data_in: data
			},

			success: function(data, textStatus, jqXHR)
			{
				complicationDataPost = data;
				var historyOneStepData = data.historyOneStepArray;
				var myHtmlOneStep ='<div id=historyDivOneCount>'+
				'<div class="chart_title">Histories with 1 complication</div>'+
				'<table class="example-table3" border="1"><tr><th>Complication</th><th>Number of patients</th></tr>';		
				for (var i = 0; i < historyOneStepData.length; i++) {
					var historyOneStep = historyOneStepData[i];
					myHtmlOneStep = myHtmlOneStep.concat("<tr><td>"+historyOneStep.historyName+"</td><td>"+historyOneStep.patientCounter+"</td></tr>");
				}
				myHtmlOneStep = myHtmlOneStep.concat('</table></div>'); 
				$("#prova_post").append(myHtmlOneStep);
				var hNames = data.h_names;
				optionalInfoComplication = data.optionalInfo;


				var myHtml ='<div class="chart_title">Histories with more than 1 complication</div>'+
				'<div id=historyDiv>'+'<table class="example-table2" width="75%" border="1"><tr>';				
				var first2display = true;
				for (var i = 0; i < hNames.length; i++) {
					var historyName = hNames[i];
					var dataChart = complicationDataPost.complicationChart[i];
					if(dataChart.cols.length>4 || (dataChart.cols.length==4 && dataChart.rows.length>1)){
						if(first2display){
							myHtml = myHtml.concat("<td><div  class='hSelected historyItem' onclick='handleClickH($(\"#"+historyName+"_"+i+"\"));'  id='"+historyName+"_"+i+"' >"
									+historyName+"</div></td>");
							historySelected = i;
							first2display=false;
						}else{
							myHtml = myHtml.concat("<td><div  class='hUnselected historyItem' onclick='handleClickH($(\"#"+historyName+"_"+i+"\"));'  id='"+historyName+"_"+i+"' >"
									+historyName+"</div></td>");
						}
					}
				}	
				myHtml = myHtml.concat('</tr></table></div>'); 
				myHtml = myHtml.concat('<div id=prova_post2></div>'); 
				$("#prova_post").append(myHtml);
				var dataChart = data.complicationChart[0];
				for (var i = 0; i < hNames.length; i++) {
					dataChart = complicationDataPost.complicationChart[i];
					if(dataChart.cols.length>4){
						break;
					}
				}
				var scatterChartData = new google.visualization.DataTable(dataChart);
				var chartHeight = (dataChart.rows.length)*40;
				var scatterChartOptions = {
						//title: 'Hba1c' ,
						tooltip: { textStyle: { fontName: 'MyriadPro', fontSize: 14 } },
						vAxis: { minValue: 0, textStyle:{fontSize: '14',fontName: 'MyriadPro' }, ticks: [{v:25, f:''}]},
						hAxis: {textStyle:{fontSize: '14',fontName: 'MyriadPro' }},	
						lineDashStyle: [2, 6],
						height: chartHeight,
						//lineDashStyle: [2, 2],
						colors: ['#D4B667', '#927D62', '#01827C', '7CC3AE', '#D8C4A0', '#D18369',
						         '#AF5E5E', '#BC7D7D','#015E84', '#90C8D1'],
						         pointSize: 5,
						         pointShape: 'circle',
						         seriesType: "line",
						         legend: {position: 'none'},
						         explorer: { actions: ['dragToZoom', 'rightClickToReset'],  maxZoomIn: .01 },
				};
				scatterChartDataComplication = new google.visualization.ComboChart(document.getElementById('prova_post2'));
				google.visualization.events.addListener(scatterChartDataComplication, 'select', selectHandlerComplicationPoint);
				scatterChartDataComplication.draw(scatterChartData, scatterChartOptions);
			},
			error: function (jqXHR, textStatus, errorThrown)
			{
				complicationDataPost = null;
				optionalInfoComplication = null;
			}
		});



		//******************************************************************************		
		/**
		// START - COMPLICATION CHART TIMELINE

		var containerCOMPLICATION = document.getElementById('div_process_'+obj.data_category);
		processChartCOMPLICATION = new google.visualization.Timeline(containerCOMPLICATION);
		dataTableCOMPLICATION = new google.visualization.DataTable();
		google.visualization.events.addListener(processChartCOMPLICATION, 'onmouseover', myHandlerCOMPLICATION); 
		google.visualization.events.addListener(processChartCOMPLICATION, 'select', selectHandlerCOMPLICATION);

		dataTableCOMPLICATION.addColumn({ type: 'string', id: 'Story' });
		dataTableCOMPLICATION.addColumn({ type: 'string', id: 'Step' });
		dataTableCOMPLICATION.addColumn({ type: 'number', id: 'Start' });
		dataTableCOMPLICATION.addColumn({ type: 'number', id: 'End' });
		dataTableCOMPLICATION.addColumn({'type': 'string', 'role': 'tooltip', 'p': {'html': true}});
		dataTableCOMPLICATION.addColumn({'type': 'string'});
		dataTableCOMPLICATION.addColumn({'type': 'string'});
		dataTableCOMPLICATION.addColumn({ type: 'number'});
		dataTableCOMPLICATION.addColumn({ type: 'number'});
		dataTableCOMPLICATION.addColumn({ type: 'number'});

		var dtRows = 0;
		for(k=0;k<obj.histories.length;k++){
			var path = obj.histories[k];
			for(j=0;j<path.steps.length;j++){
				if(path.steps[j].label!='wait'){
					dtRows = dtRows+1;
				}
			}
			//dtRows += obj.histories[k].steps.length;
		}
		dataTableCOMPLICATION.addRows(dtRows);

		var row = 0;
		var max_transition_array = new Array();
//		var hospitalization_label_order = new Array();
//		var arrayIndex=0;

		//cerco la durata massima per ogni storia
		for(i=0; i<obj.histories.length;i++){
			var path = obj.histories[i];
			var max_transition_time = 0;
			for(j=0;j<path.steps.length;j++){
				if(path.steps[j].label!='wait'){
				}else{
					max_transition_time = max_transition_time + parseInt(path.steps[j].time);
				}			
			}
			max_transition_array[i] = max_transition_time;
		}


		for(i=0; i<obj.histories.length;i++){
			var start = 0;
			var path = obj.histories[i];
			var max_transition_time = 0;
			for(j=0;j<path.steps.length;j++){
				if(path.steps[j].label!='wait'){
					dataTableCOMPLICATION.setCell(row, 0, path.label);
					dataTableCOMPLICATION.setCell(row, 1, path.steps[j].label);
					dataTableCOMPLICATION.setCell(row, 2, start*FROM_MS_TO_DAY);
					var durationJ = 0;
					if(j==0){
						durationJ = max_transition_array[i];
					}else{
						durationJ = parseInt(path.steps[j].time);
					}
					dataTableCOMPLICATION.setCell(row, 3, (start+durationJ)*FROM_MS_TO_DAY);
					dataTableCOMPLICATION.setCell(row, 4, "Duration: "+durationJ+" days");
//					if(arrayIndex==0){
//					hospitalization_label_order[arrayIndex] = path.steps[j].label;
//					arrayIndex = arrayIndex+1;
//					}else{
//					if($.inArray(path.steps[j].label,hospitalization_label_order)>=0){
//					//donothing
//					}else{
//					hospitalization_label_order[arrayIndex] = path.steps[j].label;
//					arrayIndex = arrayIndex+1;
//					}
//					}

					var patientString = "";
					var patientDurationString = "";
					$.each(path.steps[j].patients, function(i, item) {
						patientString = patientString.concat(item.idcod).concat(",");
						patientDurationString = patientDurationString.concat(item.duration).concat(",");
					});
					dataTableCOMPLICATION.setCell(row, 5, patientString);
					dataTableCOMPLICATION.setCell(row, 6, patientDurationString);
					dataTableCOMPLICATION.setCell(row, 7, path.steps[j].max);
					dataTableCOMPLICATION.setCell(row, 8, path.steps[j].num_classes);
					dataTableCOMPLICATION.setCell(row, 9, path.steps[j].min);
					path.steps[j].fb=row;

					start+=parseInt(path.steps[j].time);
					row++;
				}else{
					//max_transition_time = max_transition_time + parseInt(path.steps[j].time);
					path.steps[j].fb=row;
					start+=parseInt(path.steps[j].time);
				}			
			}
			//	max_transition_array[i] = max_transition_time;
		}

//		var colorsArray = [];
//		var colorMap = {
//		'DayHospital': '#015E84',
//		'InHospital': '#90C8D1',
//		'wait': '#BABABA'
//		};
//		for (var i = 0; i < hospitalization_label_order.length; i++) {
//		colorsArray.push(colorMap[hospitalization_label_order[i]]);
//		}

		var optionsCOMPLICATION = {
				timeline: { 
					groupByRowLabel: true,
					rowLabelStyle: {fontName: 'MyriadPro', fontSize: 14},
					barLabelStyle: { fontName: 'MyriadPro', fontSize: 12 }
				},
				avoidOverlappingGridLines: false,
				colors: ["#D18369","#7CC3AE","#BC7D7D","#927D62","#D8C4A0",
				         "#015E84","#90C8D1","#D4B667","#01827C","#7CC3AE",
				         "#D18369"],
				         //	colors: ["#B9E3E8","#7CC3AE","#DDBF79","#D18369","#F5F6F7"],
				         //colors: colorsArray,
				         tooltip: { textStyle: { fontName: 'MyriadPro', fontSize: 14 } },
				         backgroundColor: '#F5F6F7'
		};


		var viewCOMPLICATION = new google.visualization.DataView(dataTableCOMPLICATION);
		viewCOMPLICATION.setColumns([0,1,2,3]);  
		//processChart.draw(dataTable, options);
		processChartCOMPLICATION.draw(viewCOMPLICATION, optionsCOMPLICATION);
		//hide x-labels
		$($('svg', $('#div_process_'+obj.data_category)).children()[2]).hide();

		// END - COMPLICATION CHART TIMELINE
		 */

	}
}


function handleClickH(caller) {
	if(complicationDataPost!=null){
		//var iesimaH = cb.id.split("_")[1];
		var iesimaH = caller.selector.split("_")[1];
		if(caller.hasClass("hUnselected")){
			$(".hSelected").removeClass("hSelected").addClass("hUnselected");
			caller.removeClass("hUnselected").addClass("hSelected");	
			historySelected = iesimaH;
			var dataChart = complicationDataPost.complicationChart[iesimaH];
			var scatterChartData = new google.visualization.DataTable(dataChart);
			var chartHeight = (dataChart.rows.length)*40;
//			var viewH = new google.visualization.DataView(scatterChartData);
//			viewH.setColumns([0, 1, 2, 3]);

			var scatterChartOptions = {
					//title: 'Hba1c' ,
					tooltip: { textStyle: { fontName: 'MyriadPro', fontSize: 14 } },
					//vAxis: { title: "Percentage", minValue: 0, textStyle:{fontSize: '14',fontName: 'MyriadPro' }, titleTextStyle:{fontSize: '14',fontName: 'MyriadPro' }},
					vAxis: { minValue: 0, textStyle:{fontSize: '14',fontName: 'MyriadPro' }, ticks: [{v:25, f:''}]},
					hAxis: {textStyle:{fontSize: '14',fontName: 'MyriadPro' }},	
					lineDashStyle: [2, 6],
					height: chartHeight,
					//colors: ['#015E84'],
					//colors: ['#D4B667', '#927D62', '#D8C4A0', '#D18369','#AF5E5E', '#BC7D7D', '#01827C', '7CC3AE','#015E84', '#90C8D1'],
					colors: ['#D4B667', '#927D62', '#01827C', '7CC3AE', '#D8C4A0', '#D18369',
					         '#AF5E5E', '#BC7D7D','#015E84', '#90C8D1'],
					         pointSize: 5,
					         pointShape: 'circle',
					         seriesType: "line",
					         legend: {position: 'none'},
					         explorer: { actions: ['dragToZoom', 'rightClickToReset'],  maxZoomIn: .01 },
			};
			scatterChartDataComplication = new google.visualization.ComboChart(document.getElementById('prova_post2'));
			google.visualization.events.addListener(scatterChartDataComplication, 'select', selectHandlerComplicationPoint);
			scatterChartDataComplication.draw(scatterChartData, scatterChartOptions);
			//$(".historySelect").prop( "checked", false );	

			//$("#"+cb.id).removeClass("historyUnselect").addClass("historySelect");
		}else{
			//do nothing
			//caller.removeClass("hSelected").addClass("hUnselected");	
			//$("#"+cb.id).removeClass("historySelect").addClass("historyUnselect");
		}		
	}
}

function selectHandlerComplicationPoint(){
	var selected = scatterChartDataComplication.getSelection()[0].row;
	if(optionalInfoComplication !=null){
		var innerArray = optionalInfoComplication[historySelected];
		var myalert = innerArray[selected].idNode;
		hideGraphs(2);
		showLoader();
		var p_num_param = innerArray[selected].patientString;
		var duration_param = innerArray[selected].patientDurationString;
		var maxDurationValue = innerArray[selected].max;
		var numClassesValue = innerArray[selected].num_classes;
		var minDurationValue = innerArray[selected].min;
		var history = innerArray[selected].history;
		var step = innerArray[selected].step;

		$.ajax({
			url: "./i2b2Servlet/",
			dataType:"json",
			async: true,
			data: { step: "3",
				chart_type: "comorb",
				patient_nums: p_num_param, 
				duration_nums: duration_param,
				num_classes : numClassesValue,
				max_duration : maxDurationValue,
				min_duration : minDurationValue
			},
			complete: function(results){
				$('#step_item_2 > span').text("History: " + history.replace("_"," "));
				$('#step_item_3 > span').text("Step: " + step);
				$('#step_item_2').show();
				$('#step_item_3').show();
				showTooltip(3);
				hideLoader();
				setMenu(3);
				showGraphs(3);
				drawDrillDown(results.responseText);
			}
		});



	}

}

function drawDrillDown(dataJSON){
	//COMPLICATION CHART
	var outerJson = jQuery.parseJSON(dataJSON);
	var complClassJson = outerJson.comorb_class;
	var complDetailsJson = outerJson.comorb_details;
	var durationDetailsJson = outerJson.duration_details;
	var histJson = outerJson.hist_details;
	var complClassJsonData = complClassJson.chart_data;
	var complDetailsJsonData = complDetailsJson.chart_data;

	var drill_down_comorb_data = new google.visualization.DataTable(complClassJsonData);
	var drill_down_comorb_data_details = new google.visualization.DataTable(complDetailsJsonData);
	var drill_down_duration_details = new google.visualization.DataTable(durationDetailsJson);
	var drill_down_hist_details = new google.visualization.DataTable(histJson);

//	var drill_down_comorb_data = new google.visualization.DataTable(dataJSON);

	var drill_down_comorb_options = {
			chartArea:{top:20,width:"80%",height:"80%"},
			tooltip: { textStyle: { fontName: 'MyriadPro', fontSize: 14 } },
			legend: {position: 'right', alignment: 'center', textStyle: { fontName: 'MyriadPro', fontSize: 14 }},
			slices: {0: {color: '#015E84'}, 1:{color: '#90C8D1'},  2:{color: '#D4B667'},3:{color: '#927D62'},4:{color: '#D8C4A0'},
				5:{color: '#D18369'},6:{color: '#AF5E5E'},7:{color: '#BC7D7D'},8:{color: '#01827C'},9:{color: '#7CC3AE'},10:{color: '#015E84'}},
				pieSliceText: 'value'
	};

//	var drill_down_comorb_options = {
//	chartArea:{top:20,width:"80%",height:"80%"},
//	legend: {position: 'right', alignment: 'center'},
//	pieSliceText: 'value'
//	};

	var drill_down_comorb_chart = new google.visualization.PieChart(document.getElementById('drill_down_comorb_chart'));
	var drill_down_comorb_chart_details = new google.visualization.PieChart(document.getElementById('drill_down_comorb_chart_details'));
	drill_down_comorb_chart.draw(drill_down_comorb_data, drill_down_comorb_options);
	drill_down_comorb_chart_details.draw(drill_down_comorb_data_details, drill_down_comorb_options);
	//setting the process source of the drill down chart
	//$('#drill_down_comorb_chart').siblings('.chart_subtitle').text(processSource);

//	COMORBIDITY
//	comorb_chart_data_json = $.ajax({
//	url: "./i2b2Servlet/",
//	dataType:"json",
//	async: false,
//	data: {step: "1",chart_type: "comorbidity"}
//	}).responseText;

//	var outerJson = jQuery.parseJSON(comorb_chart_data_json);
//	var complClassJson = outerJson.comorb_class;
//	var complClassJsonData = complClassJson.chart_data;
//	complClassJsonRawValues = complClassJson.raw_data;
//	var comorb_chart_data = new google.visualization.DataTable(complClassJsonData);

//	//var comorb_chart_data = new google.visualization.DataTable(comorb_chart_data_json);

//	var comorb_options = {
//	chartArea:{top:20,width:"80%",height:"80%"},
//	tooltip: { textStyle: { fontName: 'MyriadPro', fontSize: 14 } },
//	legend: {position: 'right', alignment: 'center', textStyle: { fontName: 'MyriadPro', fontSize: 14 }},
//	slices: {0: {color: '#015E84'}, 1:{color: '#90C8D1'},  2:{color: '#D4B667'},3:{color: '#927D62'},4:{color: '#D8C4A0'},
//	5:{color: '#D18369'},6:{color: '#AF5E5E'},7:{color: '#BC7D7D'},8:{color: '#01827C'},9:{color: '#7CC3AE'},10:{color: '#015E84'}},
//	pieSliceText: 'value'
//	};

//	comorb_chart2 = new google.visualization.PieChart(document.getElementById('comorb_chart'));
//	comorb_chart2.draw(comorb_chart_data, comorb_options);



	//TIMETOCOMPLICATION

//	var ttc_data = google.visualization.arrayToDataTable([
//	['Complication', '0-6', '6-12', '12-18','18-24','24-30','30-36'],
//	['Hypertension',  7, 8,9,10,4,2],
//	['Nephropathy',  5,9,2,4,7,11],
//	['Neuropathy',  2,7,1,0,8,19],
//	['Retinopathy',  4,12,9,7,4,1]
//	]);

	var options_duration = {
			isStacked: true,
			vAxis: { title: "Days", textStyle:{fontSize: '14',fontName: 'MyriadPro' }, titleTextStyle:{fontSize: '14',fontName: 'MyriadPro' }},
			hAxis: {title: "Patients IdCod", textStyle:{fontSize: '14',fontName: 'MyriadPro' }},	
			legend: { position: 'none' },
			colors: ['#015E84'],
			explorer: { actions: ['dragToZoom', 'rightClickToReset'],  maxZoomIn: .01 },
			tooltip: { textStyle: { fontName: 'MyriadPro', fontSize: 14 } }
	};

//	var drill_down_timetocomp_chart = new google.visualization.ColumnChart(document.getElementById('drill_down_timetocomp_chart'));
//	drill_down_timetocomp_chart.draw(ttc_data, options);

	var bmi_chart = new google.visualization.ColumnChart(document.getElementById('drill_down_timetocomp_chart'));
//	var bmi_chart = new google.visualization.LineChart(document.getElementById('bmi_chart'));
	bmi_chart.draw(drill_down_duration_details, options_duration);

	var options_hist = {
			isStacked: false,
			vAxis: { title: "Patients Number", textStyle:{fontSize: '14',fontName: 'MyriadPro' }, titleTextStyle:{fontSize: '14',fontName: 'MyriadPro' }},
			hAxis: {title: "Days", textStyle:{fontSize: '14',fontName: 'MyriadPro' }},	
			legend: { position: 'none' },
			colors: ['#015E84'],
			explorer: { actions: ['dragToZoom', 'rightClickToReset'],  maxZoomIn: .01 },
			tooltip: { textStyle: { fontName: 'MyriadPro', fontSize: 14 } }
	};	

	var hist_duration_chart = new google.visualization.ColumnChart(document.getElementById('drill_down_histogram_chart'));
//	var bmi_chart = new google.visualization.LineChart(document.getElementById('bmi_chart'));
	hist_duration_chart.draw(drill_down_hist_details, options_hist);


}

function backToProcess(){
	hideFilters(2);
	hideFilters(3);
	showTooltip(2);
	setMenu(2);
	hideGraphs(3);
	showGraphs(2);
}



function bindSearchPatient(){
	$('#searchPatientBtn').click(function(){
		var patient = $("#patientTxt").val();

		if(patient==null || patient==""){
			alert("Please insert a patient name");
		}
		else{
			hideFilters();
			hideLoader();
			hideGraphs(0);
			hideGraphs(1);
			hideGraphs(2);
			hideGraphs(3);

			showSinglePatientData();
		}
	});
}

function showSinglePatientData(){

	//single patient page menu settings
	$("div", $("#singlePatientMenu")).each(function(){
		$(this).width($("#menu_return").width());
		$(this).height($("#menu_return").height());
	});

//	$("#patientDetailsIntro").html("<b>Charts for Patient " + $("#patientTxt").val().toUpperCase() +"</b>");

//	show status timeline
//	$("#singlePatientDataContainer").show();
//	$("#singlePatientDataContainer").load("single_patient_data.html");
//	selectPatientDataView($("#patientmenu1"));

//	$("#singlePatientDataContainer").load("trafficlights.html"); 
//	$("#singlePatientDataContainer").show();

//	designTrafficLights();

	//TOCHANGE: togli il commento a testJSONP;
	testJSONP();


	//Commenta questo:
//	$("#singlePatientDataContainer").load("trafficlights.html"); 
//	$("#singlePatientDataContainer").show();
//	patientIdSelected = 182;
//	patientCompleteNameSelected = "PROVA PROVA";
//	designTrafficLights();

//	selectPatientDataView($("#patientmenu1"));
}
function loadCenterProfilingSection(){
	hideFilters();
	hideLoader();
	hideGraphs(1);
	hideGraphs(2);
	hideGraphs(3);
	$("#center_profiling_div").load("dashboard2.html"); 
	renderContainerCP();
	drawChartsCP();
	
	
}
function selectPatientDataView(caller){
	var selected = $(".singlePatientMenuItemSelected"); 

	if(selected.attr("id")!=caller.attr("id")){
		selected.removeClass("singlePatientMenuItemSelected").addClass("singlePatientMenuItem");
		$("span",selected).removeClass("singlePatientMenuItemLabelSelected").addClass("singlePatientMenuItemLabel");
		caller.removeClass("singlePatientMenuItem").addClass("singlePatientMenuItemSelected");
		$("span",caller).removeClass("singlePatientMenuItemLabel").addClass("singlePatientMenuItemLabelSelected");
	}

	if(caller.attr("id").indexOf("0")>0){
		$('#singlePatientDataInnerContainer').hide();
		$('#trafficlights_container').show();
	}
	else if(caller.attr("id").indexOf("1")>0){
		$('#trafficlights_container').hide();
		$('#singlePatientDataInnerContainer').show();
		createHba1cChart();
		createWeightChart();
		createWeightRawChart();
		createDietChart();
		createLOCChart();
		createCVRChart();
		//createComplicationsChart();
		createComplicationsChart2();
		$("#clinicalDataChartContainer").show();
		$("#clinicalDataChartContainer").siblings().hide();
	}
	else if(caller.attr("id").indexOf("2")>0){
		$('#trafficlights_container').hide();
		$('#singlePatientDataInnerContainer').show();
		createTherapiesChart();
		//createTherapiesAdherenceChart();
		createTherapiesAdherenceChart2();
		$("#DrugChartContainer").show();
		$("#DrugChartContainer").siblings().hide();
	}
}

function selectStepTwoDataView(caller){
	var selected = $(".singleStepTwoMenuItemSelected"); 

	if(selected.attr("id")!=caller.attr("id")){
		selected.removeClass("singleStepTwoMenuItemSelected").addClass("singleStepTwoMenuItem");
		$("span",selected).removeClass("singleStepTwoMenuItemLabelSelected").addClass("singleStepTwoMenuItemLabel");
		caller.removeClass("singleStepTwoMenuItem").addClass("singleStepTwoMenuItemSelected");
		$("span",caller).removeClass("singleStepTwoMenuItemLabel").addClass("singleStepTwoMenuItemLabelSelected");
	}
	if(caller.attr("id").indexOf("1")>0){
		$("#div_container_COMPLICATION").show();
		$("#div_container_COMPLICATION").siblings().hide();
	}
	else if(caller.attr("id").indexOf("2")>0){
		$("#div_container_DRUG").show();
		$("#div_container_DRUG").siblings().hide();
	}
	else if(caller.attr("id").indexOf("3")>0){
		$("#div_container_LOC").siblings().hide();
		$("#div_container_LOC").show();
		$("#div_container_HOSPITALIZATION").show();
		$("#div_container_CVR").show();
	}
}

//function createTherapiesAdherenceChart(){
////Therapies Adherence
//$.ajax({
//url: "./i2b2Servlet/",
//dataType:"json",
//async: true,
//data: { step: "0",
//chart_type: "adherence2",
//patient_id: $("#patientTxt").val()
//},
//complete: function(results){
//var obj = $.parseJSON(results.responseText);
//var timelineData = new google.visualization.DataTable(obj.therapyData);
//var labelArray = obj.labelsArray;
//var colorsArray = [];
//var colorMap = {
////should contain a map of category -> color for every category
//'YES'	: '#90cad2',
//'NO'	: '#9a1c1f',
//'OVER'	: '#125e84',
//'INTERRUPTION'	: '#d3d3d2',
//};
//for (var i = 0; i < labelArray.length; i++) {
////var colorAdded = colorMap[timelineData.getValue(i, 1)];
////var index = $.inArray(colorAdded, colorsArray);
////if(index < 0){
////colorsArray.push(colorAdded);
////}
//colorsArray.push(colorMap[labelArray[i]]);
//}

//var timeLineChart_options = {
//timeline: { 
//groupByRowLabel: true
//},                          
//avoidOverlappingGridLines: true,
//height: 1600,
//width: 1600,
//colors: colorsArray,
//backgroundColor: '#ffd'
//};

//var view = new google.visualization.DataView(timelineData);
//view.setColumns([0, 1, 2, 3]);
//var timeline_chart = new  google.visualization.Timeline(document.getElementById('therapyAdherenceDiv2'));
//timeline_chart.draw(view, timeLineChart_options);
////timeline_chart.draw(timelineData, timeLineChart_options);
//}

//});

//}

function createTherapiesAdherenceChart2(){
	//Therapies Adherence
	$.ajax({
		url: "./i2b2Servlet/",
		dataType:"json",
		async: true,
		data: { step: "0",
			chart_type: "adherence3",
			patient_id: patientIdSelected
		},
		complete: function(results){
			$('.buttonTherapyDivClass').remove();
			var obj = $.parseJSON(results.responseText);
			var timelineData = new google.visualization.DataTable(obj.therapyData);
			var labelArray = obj.labelsArray;
			var atcListData = obj.atcListData;
			var colorsArray = [];
			var colorMap = {
//					'INTERRUPTION'	: '#7f9392',
//					'[0-40]'	: '#a8e9e7',
//					'[40-80]'	: '#48b5b0',
//					'[80-100]'	: '#0e8e89',
//					'OVER'	: '#226764',
					'INTERRUPTION'	: '#72818E',
					'[0-40]'	: '#B9E3E8',
					'[40-80]'	: '#61B3C6',
					'[80-100]'	: '#358FAA',
					'OVER'	: '#015E84',
			};
			for (var i = 0; i < labelArray.length; i++) {
//				var colorAdded = colorMap[timelineData.getValue(i, 1)];
//				var index = $.inArray(colorAdded, colorsArray);
//				if(index < 0){
//				colorsArray.push(colorAdded);
//				}
				colorsArray.push(colorMap[labelArray[i]]);
			}
			// Calculate height
			var rowHeight = 41;
			var chartHeight = (timelineData.getNumberOfRows() + 1) * rowHeight;

			var timeLineChart_options = {
					timeline: { 
						groupByRowLabel: true,
						rowLabelStyle: {fontName: 'MyriadPro', fontSize: 14},
						barLabelStyle: { fontName: 'MyriadPro', fontSize: 12 }
					},                          
					avoidOverlappingGridLines: true,
					height: chartHeight,
//					height: auto,
//					width: 1600,
					colors: colorsArray,
					tooltip: { textStyle: { fontName: 'MyriadPro', fontSize: 14 } },
					backgroundColor: '##F5F6F7'
			};

			if (timelineData.getNumberOfRows() == 0) {
				$('#therapyAdherenceDiv3').append("No therapy info to display");
			} else {	
				//Button Div
				var outerHtml = '<div class="buttonTherapyDivClass" id=outerDiv>';
				var myHtml ='<div  id=atcClassDiv>'+
				'<table class="example-table" width="75%" border="1"><tr>';
				var innerHtml='<div  id=atcListDiv>';
				for (var i = 0; i < atcListData.length; i++) {
					var myObj = atcListData[i];
					var atcList = myObj.atcList;
					var atcClass = myObj.atcClass;

					var myDivName = "atc"+i;
					var myTableName = "sub_atc"+i;
					myHtml = myHtml.concat("<td><div  class='atcItem'  id="+myDivName+" atcListLenght="+atcList.length+"><span><label style='cursor: pointer' onclick='showHideAtcs($(\"#"+myDivName+"\"))'>"+atcClass+
							"</label><input type='checkbox' id='"+myDivName+"_cb' checked onclick='handleClick(this);'/></span></div></td>");

					innerHtml = innerHtml.concat('<table id='+myTableName+' class="example-table" width="75%" border="1"><tr>');
					for (var j = 0; j < atcList.length; j++) {
						var myObj2 = atcList[j];
						var myDivName2 = myTableName+"_"+j+"_";
						innerHtml = innerHtml.concat("<td><div class='atcSelected' onclick='buildFilter($(\"#"+myDivName2+"\"))' id="+myDivName2+">"+myObj2+"</div></td>");
					}
					innerHtml = innerHtml.concat('</tr></table>');
				}
				myHtml = myHtml.concat('</tr></table></div>'); //chiudo table delle classi di farmaci
				innerHtml = innerHtml.concat("</div>"); //chiudo table dei singoli farmaci

				//outerHtml = outerHtml.concat(myHtml).concat(innerHtml).concat("<input onclick='applyFilter()' id=goFilter type='submit' value='Apply Filter' class='green-sea-flat-button'>");
				outerHtml = outerHtml.concat(myHtml).concat(innerHtml).concat("<div onclick='applyFilter()' id=goFilter class='filterBtn' align='right'>Apply Filter</div></div>");
				$('#therapyAdherenceFilterDiv').append(outerHtml);
				$('#atcListDiv').hide();
				var view = new google.visualization.DataView(timelineData);
				view.setColumns([0, 1, 2, 3]);
				var timeline_chart = new  google.visualization.Timeline(document.getElementById('therapyAdherenceDiv3'));
				timeline_chart.draw(view, timeLineChart_options);
				//timeline_chart.draw(timelineData, timeLineChart_options);
			}
		}

	});
}

function handleClick(cb) {
	//  alert("Clicked, new value = " + cb.checked+" "+cb.name);
	var cbName = cb.id.split("_")[0];
	if(cb.checked){
		//$("#"+cbName).removeClass("atcItem").addClass("atcItemSelected");
		$("[id^=sub_"+cbName+"][id$=_]").removeClass("atcUNSelected").addClass("atcSelected");		 
		// $("#sub_"+cb.name).removeClass("atcSelected").addClass("atcUNSelected");	
	}else{
		//$("#"+cbName).removeClass("atcItemSelected").addClass("atcItem");	
		//  $("#sub_"+cb.name).removeClass("atcUNSelected").addClass("atcSelected");	
		$("[id^=sub_"+cbName+"][id$=_]").removeClass("atcSelected").addClass("atcUNSelected");	
	}
	showHideAtcs($("#"+cbName));
//	var atcListLength = $("#"+cbName).attr('atcListLenght');
//	var classes = $("[id^=sub_"+cbName+"][id$=_]").attr('class');
//	var unselected = $(".atcUNSelected"); 
//	alert("Clicked, unselected num = " + unselected.length+ " atc Count: "+atcListLength+" classes:"+classes);
//	if(caller.hasClass("atcUNSelected")){
//	//selected.removeClass("atcUNSelected").addClass("atcSelected");

//	}else if(caller.hasClass("atcSelected")){
//	caller.removeClass("atcSelected").addClass("atcUNSelected");	
//	}

//	var selected = $(".atcItemSelected"); 
//	if(selected.attr("id")!=caller.attr("id")){
//	selected.removeClass("atcItemSelected").addClass("atcItem");
//	caller.removeClass("atcItem").addClass("atcItemSelected");	
//	$('#atcListDiv').show();
//	$("#sub_"+caller.attr("id")).siblings().hide();
//	$("#sub_"+caller.attr("id")).show();

//	}

}

function createTherapiesAdherenceChart2Filtered(atcFilter){
	//Therapies Adherence
	$.ajax({
		url: "./i2b2Servlet/",
		dataType:"json",
		async: true,
		data: { step: "0",
			chart_type: "adherence3Filtered",
			patient_id: patientIdSelected,
			atc_filter : atcFilter
		},
		complete: function(results){
			//$('.buttonTherapyDivClass').remove();
			var obj = $.parseJSON(results.responseText);
			var timelineData = new google.visualization.DataTable(obj.therapyData);
			var labelArray = obj.labelsArray;
			var atcListData = obj.atcListData;
			var colorsArray = [];
			var colorMap = {
//					'INTERRUPTION'	: '#7f9392',
//					'[0-40]'	: '#a8e9e7',
//					'[40-80]'	: '#48b5b0',
//					'[80-100]'	: '#0e8e89',
//					'OVER'	: '#226764',
					'INTERRUPTION'	: '#72818E',
					'[0-40]'	: '#B9E3E8',
					'[40-80]'	: '#61B3C6',
					'[80-100]'	: '#358FAA',
					'OVER'	: '#015E84',
			};
			for (var i = 0; i < labelArray.length; i++) {
//				var colorAdded = colorMap[timelineData.getValue(i, 1)];
//				var index = $.inArray(colorAdded, colorsArray);
//				if(index < 0){
//				colorsArray.push(colorAdded);
//				}
				colorsArray.push(colorMap[labelArray[i]]);
			}
			// Calculate height
			var rowHeight = 41;
			var chartHeight = (timelineData.getNumberOfRows() + 1) * rowHeight;
			var timeLineChart_options = {
					timeline: { 
						groupByRowLabel: true,
						rowLabelStyle: {fontName: 'MyriadPro', fontSize: 14},
						barLabelStyle: { fontName: 'MyriadPro', fontSize: 12 }
					},                          
					avoidOverlappingGridLines: true,
					height: chartHeight,
					//width: 1600,
					colors: colorsArray,
					tooltip: { textStyle: { fontName: 'MyriadPro', fontSize: 14 } },
					backgroundColor: '##F5F6F7'
			};

			//Button Div
//			var outerHtml = '<div class="buttonTherapyDivClass" id=outerDiv>';
//			var myHtml ='<div class="buttonTherapyDivClass" style="height: 200" id=atcClassDiv>'+
//			'<table class="example-table" width="75%" border="1"><tr>';
//			var innerHtml='<div class="buttonTherapyDivClass"  id=atcListDiv>';
//			for (var i = 0; i < atcListData.length; i++) {
//			var myObj = atcListData[i];
//			var atcList = myObj.atcList;
//			var atcClass = myObj.atcClass;

//			var myDivName = "atc"+i;
//			var myTableName = "sub_atc"+i;
//			myHtml = myHtml.concat("<td><div  class='atcItem' onclick='showHideAtcs($(\"#"+myDivName+"\"))' id="+myDivName+">"+atcClass+"</div></td>");

//			innerHtml = innerHtml.concat('<table id='+myTableName+' class="example-table" width="75%" border="1"><tr>');
//			for (var j = 0; j < atcList.length; j++) {
//			var myObj2 = atcList[j];
//			var myDivName2 = myTableName+"_"+j;
//			innerHtml = innerHtml.concat("<td><div class='atcSelected' onclick='buildFilter($(\"#"+myDivName2+"\"))' id="+myDivName2+">"+myObj2+"</div></td>");
//			}
//			innerHtml = innerHtml.concat('</tr></table>');
//			}
//			myHtml = myHtml.concat('</tr></table></div>'); //chiudo table delle classi di farmaci
//			innerHtml = innerHtml.concat("</div>"); //chiudo table dei singoli farmaci

//			outerHtml = outerHtml.concat(myHtml).concat(innerHtml).concat("<div onclick='applyFilter()' id=goFilter>Apply Filter</div></div>");
//			$('#therapyAdherenceFilterDiv').append(outerHtml);
//			$('#atcListDiv').hide();
			var view = new google.visualization.DataView(timelineData);
			view.setColumns([0, 1, 2, 3]);
			var timeline_chart = new  google.visualization.Timeline(document.getElementById('therapyAdherenceDiv3'));
			timeline_chart.draw(view, timeLineChart_options);
			//timeline_chart.draw(timelineData, timeLineChart_options);
		}

	});
}

function buildFilter(caller){
	var checkBoxName = caller.selector.split("_")[1].concat("_cb");
	if(caller.hasClass("atcUNSelected")){
		//selected.removeClass("atcUNSelected").addClass("atcSelected");
		caller.removeClass("atcUNSelected").addClass("atcSelected");	
	}else if(caller.hasClass("atcSelected")){
		caller.removeClass("atcSelected").addClass("atcUNSelected");

		$("#"+checkBoxName).attr("checked",false);		 
	}
	var atcListLength = $("#"+caller.selector.split("_")[1]).attr('atcListLenght');
	var classes = $("[id^=sub_"+caller.selector.split("_")[1]+"][id$=_]");
	var atcUnSelectedInThisClass=0;
	for (var i = 0; i < classes.length; i++) {
		var myAtcInner = $(classes[i]).hasClass('atcUNSelected');
		if(myAtcInner){
			atcUnSelectedInThisClass++;
		}
	}
	var unselected = $(".atcUNSelected"); 
	if(atcUnSelectedInThisClass==0){
		$("#"+checkBoxName).trigger('click');	
	}
	// alert("Clicked, unselected tot num = " + unselected.length+ " atc Count: "+atcListLength+" unselected in this AtcCat:"+atcUnSelectedInThisClass);
}

function applyFilter(){
	var unselected = $(".atcUNSelected"); 
	var selected =  $(".atcSelected"); 
	var msg="";
	for (var j = 0; j < unselected.length; j++) {
		msg = msg.concat(unselected[j].textContent).concat(",");
	}
	if(selected.length==0){
		alert("Please select at least one ATC in order to view data");
	}else{
		if(unselected.length>0){
			createTherapiesAdherenceChart2Filtered(msg);
		}else{
			//alert("Please select ATC to filter");
			createTherapiesAdherenceChart2();
		}
	}

}
function showHideAtcs(caller){
	var selected = $(".atcItemSelected"); 
	if(selected.attr("id")!=caller.attr("id")){
		selected.removeClass("atcItemSelected").addClass("atcItem");
		caller.removeClass("atcItem").addClass("atcItemSelected");	
		$('#atcListDiv').show();
		$("#sub_"+caller.attr("id")).siblings().hide();
		$("#sub_"+caller.attr("id")).show();
	}
}
function createTherapiesChart(){
	//set therapies submenu css
	$('#therapyChartTab').css("margin-left",$('#patientmenu1').width()+3);

	//Therapies
	$.ajax({
		url: "./i2b2Servlet/",
		dataType:"json",
		async: true,
		data: { step: "0",
			chart_type: "therapy",
			patient_id: patientIdSelected
		},
		complete: function(results){
			//	alert(results.responseText)
			$('.atcTitleClass').remove();
			$('.dynamicTherapyDiv').remove();
			$('.magicSquareDivClass').remove();
			var obj = $.parseJSON(results.responseText);
			var results = obj.results;
			var startYear = obj.startYear;
			var endYear = obj.endYear;
			var index;
			var myData;
			var atcClass;
			var chartData;
			var maxRoundedValue;
			//result4magicbox		
			var myDataMB = obj.result4MagicBox;
			var therapyHtml="";
			for (index = 0; index < results.length; ++index) {
				myData = results[index];
				atcClass = myData.atc_class;
				var myDivName = "thDiv_"+index;
				therapyHtml = therapyHtml.concat('<div class="atcTitleClass" >'+atcClass+'</div><div class="dynamicTherapyDiv"  id='+myDivName+'>'+atcClass+'</div>');

				var myObjMBOuter = myDataMB[index];
				var myObjMB = myObjMBOuter.atcBlob;
				var groupingClass = myObjMB.grouping_class;
				var atcClassMB = groupingClass.atc_class;
				var mediaPaz = groupingClass.csa_atc_class_paz_med;
				var mediaClass = groupingClass.csa_atc_class_med;
				var pValue = groupingClass.p_value_atc_class;
				var sign = groupingClass.sign_med_atc_class;
				var myDivNameMB = "msDiv_"+index;

				var myHtmlMB ='<div class="magicSquareDivClass" id='+myDivNameMB+'>'+
				'<div class="magicSquareItem magicSquareFirstRow"><label>patient median: '+mediaPaz+'</label></div><div class="magicSquareItem magicSquareFirstRow"><label>therapy class median: '+mediaClass+'</label></div>'+
				'<div style="clear:both;"></div>';
				if(sign<0){
					myHtmlMB = myHtmlMB.concat('<div class="magicSquareItem"><img src="images/arrow_down.png" title="Adherence lower compared with therapy group" width="63"></img></div>');
				}else{
					myHtmlMB = myHtmlMB.concat('<div class="magicSquareItem"><img src="images/arrow_up.png" title="Adherence greater compared with therapy group" width="63"></img></div>');
				}
				if(pValue>0.05){
					myHtmlMB = myHtmlMB.concat('<div class="magicSquareItem"><img src="images/approved.png" title="no significative difference between medians" width=35></img><br>p-value: '+pValue+'</div>');
				}else{
					myHtmlMB = myHtmlMB.concat('<div class="magicSquareItem"><img src="images/warning_rect.png" title="significative difference between medians" width=35></img><br>p-value: '+pValue+'</div>');
				}
				myHtmlMB = myHtmlMB.concat('<div style="clear:both;"></div></div>');
				therapyHtml = therapyHtml.concat(myHtmlMB);
				therapyHtml = therapyHtml.concat('<div style="clear:both;"></div>');

			}

			$('#therapyDiv').append(therapyHtml);

			//do ScatterChart
			for (index = 0; index < results.length; ++index) {
				myData = results[index];
				atcClass = myData.atc_class;
				maxRoundedValue = myData.max_value;
				chartData = myData.data;
				var scatterChartData = new google.visualization.DataTable(chartData);
				var scatterChartOptions = {
						//title: atcClass,
						tooltip: { textStyle: { fontName: 'MyriadPro', fontSize: 14 } },
						vAxis: {title: "DDD", minValue: 0, maxValue: maxRoundedValue ,textStyle:{fontSize: '14',fontName: 'MyriadPro' }, titleTextStyle:{fontSize: '14',fontName: 'MyriadPro' }},
						hAxis: {viewWindow: {  min: new Date(startYear,1,1),  max: new Date(endYear,12,31)},
							textStyle:{fontSize: '14',fontName: 'MyriadPro' },
							viewWindowMode: 'explicit'},
							explorer: { actions: ['dragToZoom', 'rightClickToReset'],  maxZoomIn: .01 },
							legend : { position:"bottom", textStyle: {color: 'gray', fontName: 'MyriadPro'}},
							series: [{color: '#015E84', visibleInLegend: true}, 
							         {color: '#90C8D1', visibleInLegend: true},
							         {color: '#BC7D7D', visibleInLegend: true},
							         {color: '#D4B667', visibleInLegend: true},
							         {color: '#D18369', visibleInLegend: true},
							         {color: '#7CC3AE', visibleInLegend: true},
							         {color: '#01827C', visibleInLegend: true}]
				};
				var myDivName = "thDiv_"+index;
				var scatter_chart = new google.visualization.ScatterChart(document.getElementById(myDivName));
				scatter_chart.draw(scatterChartData, scatterChartOptions);
			}
		}
	});
}

function createHba1cChart(){
	//Hba1c
	$.ajax({
		url: "./i2b2Servlet/",
		dataType:"json",
		async: true,
		data: { step: "0",
			chart_type: "hba1c",
			patient_id: patientIdSelected
		},
		complete: function(results){
			var scatterChartData = new google.visualization.DataTable(results.responseText);
			var scatterChartOptions = {
					//title: 'Hba1c' ,
					tooltip: { textStyle: { fontName: 'MyriadPro', fontSize: 14 } },
					vAxis: { title: "mmol/mol", minValue: 0, textStyle:{fontSize: '14',fontName: 'MyriadPro' }, titleTextStyle:{fontSize: '14',fontName: 'MyriadPro' }},
					hAxis: {textStyle:{fontSize: '14',fontName: 'MyriadPro' }},	
					lineDashStyle: [2, 2],
					colors: ['#015E84'],
					pointSize: 5,
					pointShape: 'circle',
					legend: {position: 'none'},
					explorer: { actions: ['dragToZoom', 'rightClickToReset'],  maxZoomIn: .01 },
			};
			var scatter_chart = new google.visualization.LineChart(document.getElementById('hba1c_chart'));
			scatter_chart.draw(scatterChartData, scatterChartOptions);
		}
	});
}

function createWeightRawChart(){
	//Hba1c
	$.ajax({
		url: "./i2b2Servlet/",
		dataType:"json",
		async: true,
		data: { step: "0",
			chart_type: "weightraw",
			patient_id: patientIdSelected
		},
		complete: function(results){
			var scatterChartData = new google.visualization.DataTable(results.responseText);
			var scatterChartOptions = {
					//title: 'Hba1c' ,
					tooltip: { textStyle: { fontName: 'MyriadPro', fontSize: 14 } },
					vAxis: { title: "kg", minValue: 0, textStyle:{fontSize: '14',fontName: 'MyriadPro' }, titleTextStyle:{fontSize: '14',fontName: 'MyriadPro' }},
					hAxis: {textStyle:{fontSize: '14',fontName: 'MyriadPro' }},	
					lineDashStyle: [2, 2],
					colors: ['#015E84'],
					pointSize: 5,
					pointShape: 'circle',
					legend: {position: 'none'},
					explorer: { actions: ['dragToZoom', 'rightClickToReset'],  maxZoomIn: .01 },
			};
			var scatter_chart = new google.visualization.LineChart(document.getElementById('weightraw_chart'));
			scatter_chart.draw(scatterChartData, scatterChartOptions);
		}
	});
}

function createLOCChart(){
	$.ajax({
		url: "./i2b2Servlet/",
		dataType:"json",
		async: true,
		data: { step: "0",
			chart_type: "loc",
			patient_id: patientIdSelected
		},
		complete: function(results){
			var obj = $.parseJSON(results.responseText);
			var timelineData = new google.visualization.DataTable(obj.locData);
			var labelArray = obj.locLabels;
			if(labelArray.length>0){
				var colorsArray = [];
				var colorMap = {
						'1st Level': '#7CC3AE',
						'2nd Level': '#DDBF79',
						'Stable': '#B9E3E8',
						'3rd Level': '#D18369'
				};
				for (var i = 0; i < labelArray.length; i++) {
					colorsArray.push(colorMap[labelArray[i]]);
				}

				var timeLineChart_options = {
						timeline: { 
							groupByRowLabel: true,
							rowLabelStyle: {fontName: 'MyriadPro', fontSize: 14},
							barLabelStyle: { fontName: 'MyriadPro', fontSize: 12 }
						},                          
						avoidOverlappingGridLines: true,
						height: 200,
						//width: 1600,
						colors: colorsArray,
						tooltip: { textStyle: { fontName: 'MyriadPro', fontSize: 14 } },
						backgroundColor: '#E6E6E8'
				};
				var view = new google.visualization.DataView(timelineData);
				view.setColumns([0, 1, 2, 3]);
				var timeline_chart = new  google.visualization.Timeline(document.getElementById('loc_chart'));
				timeline_chart.draw(view, timeLineChart_options);
				//timeline_chart.draw(timelineData, timeLineChart_options);
			}else{
				$("#loc_chart").empty();
			}
		}
	});
}

function createWeightChart(){
	//Therapies Adherence
	$.ajax({
		url: "./i2b2Servlet/",
		dataType:"json",
		async: true,
		data: { step: "0",
			chart_type: "weight",
			patient_id: patientIdSelected
		},
		complete: function(results){
			var obj = $.parseJSON(results.responseText);
			var timelineData = new google.visualization.DataTable(obj.weightData);
			var labelArray = obj.weightLabels;
			if(labelArray.length>0){
				var colorsArray = [];
				var colorMap = {
						'Decrease': '#B9E3E8',
						'TimeToTarget': '#358FAA',
						'Increase': '#D18369',
						'Stationary': '#DDBF79'
				};
				for (var i = 0; i < labelArray.length; i++) {
					colorsArray.push(colorMap[labelArray[i]]);
				}

				var timeLineChart_options = {
						timeline: { 
							groupByRowLabel: true,
							rowLabelStyle: {fontName: 'MyriadPro', fontSize: 14},
							barLabelStyle: { fontName: 'MyriadPro', fontSize: 12 }
						},                          
						avoidOverlappingGridLines: true,
						height: 200,
						//width: 1600,
						colors: colorsArray,
						tooltip: { textStyle: { fontName: 'MyriadPro', fontSize: 14 } },
						backgroundColor: '#E6E6E8'
				};
				var view = new google.visualization.DataView(timelineData);
				view.setColumns([0, 1, 2, 3]);
				var timeline_chart = new  google.visualization.Timeline(document.getElementById('weight_chart'));
				timeline_chart.draw(view, timeLineChart_options);
				//timeline_chart.draw(timelineData, timeLineChart_options);
			}else{
				$("#weight_chart").empty();
			}
		}
	});
}

function createDietChart(){
	$.ajax({
		url: "./i2b2Servlet/",
		dataType:"json",
		async: true,
		data: { step: "0",
			chart_type: "diet",
			patient_id: patientIdSelected
		},
		complete: function(results){
			var obj = $.parseJSON(results.responseText);
			var timelineData = new google.visualization.DataTable(obj.dietData);
			var labelArray = obj.dietLabels;
			if(labelArray.length>0){
				var colorsArray = [];
				var colorMap = {
						'Good': '#B9E3E8',
						'Bad': '#D18369'
				};
				for (var i = 0; i < labelArray.length; i++) {
					colorsArray.push(colorMap[labelArray[i]]);
				}

				var timeLineChart_options = {
						timeline: { 
							groupByRowLabel: true,
							rowLabelStyle: {fontName: 'MyriadPro', fontSize: 14},
							barLabelStyle: { fontName: 'MyriadPro', fontSize: 12 }
						},                          
						avoidOverlappingGridLines: true,
						height: 200,
						//width: 1600,
						colors: colorsArray,
						tooltip: { textStyle: { fontName: 'MyriadPro', fontSize: 14 } },
						backgroundColor: '#E6E6E8'
				};
				var view = new google.visualization.DataView(timelineData);
				view.setColumns([0, 1, 2, 3]);
				var timeline_chart = new  google.visualization.Timeline(document.getElementById('diet_chart'));
				timeline_chart.draw(view, timeLineChart_options);
				//timeline_chart.draw(timelineData, timeLineChart_options);
			}else{
				$("#diet_chart").empty();
			}
		}
	});
}

function createComplicationsChart(){
	//Hba1c
	$.ajax({
		url: "./i2b2Servlet/",
		dataType:"json",
		async: true,
		data: { step: "0",
			chart_type: "complication",
			patient_id: patientIdSelected
		},
		
	

		complete: function(results){
			var scatterChartData = new google.visualization.DataTable(results.responseText);
			var scatterChartOptions = {
					//title: 'Complications' ,
					vAxis: { minValue: 0, textStyle:{fontSize: '14',fontName: 'MyriadPro' },
						ticks: [{v:1.25, f:'Non vascular'}, {v:3.75, f:'Micro'}, {v:8.75, f:'Macro'}]},
						hAxis: {textStyle:{fontSize: '14',fontName: 'MyriadPro' }},
						//	lineWidth: 0,
//						lineDashStyle: [2, 2],
//						colors: ['#4a9ecf'],
						//pointSize: 5,
						//pointShape: 'circle',
						explorer: { actions: ['dragToZoom', 'rightClickToReset'],  maxZoomIn: .01 },
						lineWidth: 0,
						pointSize: 5,
						pointShape: 'circle',
						colors: ['#015e84'],
						tooltip: { textStyle: { fontName: 'MyriadPro', fontSize: 14 } },
						legend: {position: 'none'},
						annotations: {
							textStyle: {
								fontName: 'MyriadPro',
								fontSize: 14,
								bold: false,
								italic: false,
								color: '#015e84',     // The color of the text.
							}

						},


						seriesType: "line",
						series: {1: {type: "area", isStacked: true, pointSize: 0,lineWidth:0, color:"#bae2e0", visibleInLegend: false, enableInteractivity: false, tooltip: 'none' },
							2: {type: "area", isStacked: true, pointSize: 0,lineWidth:0, color:"#e2a971", visibleInLegend: false , enableInteractivity: false, tooltip: 'none'},
							3: {type: "area", isStacked: true, pointSize: 0,lineWidth:0, color:"#e7dc71", visibleInLegend: false , enableInteractivity: false, tooltip: 'none'}}
			};
			var scatter_chart = new google.visualization.ComboChart(document.getElementById('complication_chart'));
			scatter_chart.draw(scatterChartData, scatterChartOptions);
		}
	});
}

function createComplicationsChart2(){
	//Hba1c
	$.ajax({
		url: "./i2b2Servlet/",
		dataType:"json",
		async: true,
		data: { step: "0",
			chart_type: "complication2",
			patient_id: patientIdSelected
		},

		complete: function(results){
			var scatterChartData = new google.visualization.DataTable(results.responseText);
			var scatterChartOptions = {
					//title: 'Complications' ,
					vAxis: { minValue: 0, textStyle:{fontSize: '14',fontName: 'MyriadPro' }
			,ticks: [{v:1.25, f:''}, {v:3.75, f:''}, {v:8.75, f:''}]
					},
					hAxis: {textStyle:{fontSize: '14',fontName: 'MyriadPro' }},
					//	lineWidth: 0,
//					lineDashStyle: [2, 2],
//					colors: ['#4a9ecf'],
					//pointSize: 5,
					//pointShape: 'circle',
					explorer: { actions: ['dragToZoom', 'rightClickToReset'],  maxZoomIn: .01 },
//					lineWidth: 0,
//					pointSize: 5,
//					pointShape: 'circle',
//					colors: ['#015e84'],
					tooltip: { textStyle: { fontName: 'MyriadPro', fontSize: 14 } },
					legend: {position: 'bottom'},
					annotations: {
						position: 'right',
						textStyle: {
							fontName: 'MyriadPro',
							fontSize: 12,
							bold: false,
							italic: false,
							color: '#015e84',     // The color of the text.
						}
					},
					seriesType: "line",
					series: {
						0: {type: "line", isStacked: true, pointSize: 5,lineWidth:0, color:"#90C8D1", visibleInLegend: true },
						1: {type: "line", isStacked: true, pointSize: 5,lineWidth:0, color:"#BC7D7D", visibleInLegend: true },
						2: {type: "line", isStacked: true, pointSize: 5,lineWidth:0, color:"#D4B667", visibleInLegend: true },
						3: {type: "line", isStacked: true, pointSize: 0,lineWidth:1, color:"#015e84", visibleInLegend: false , enableInteractivity: false, tooltip: 'none'},
						4: {type: "line", isStacked: true, pointSize: 0,lineWidth:1, color:"#015e84", visibleInLegend: false , enableInteractivity: false, tooltip: 'none'},
						5: {type: "line", isStacked: true, pointSize: 0,lineWidth:1, color:"#015e84", visibleInLegend: false , enableInteractivity: false, tooltip: 'none'}
					}
			};
			var scatter_chart = new google.visualization.ComboChart(document.getElementById('complication_chart2'));
			scatter_chart.draw(scatterChartData, scatterChartOptions);
		}
	});
}

function createCVRChart(){
	$.ajax({
		url: "./i2b2Servlet/",
		dataType:"json",
		async: true,
		data: { step: "0",
			chart_type: "cvr",
			patient_id: patientIdSelected
		},
		complete: function(results){
			$('.legend').remove();
			var scatterChartData = new google.visualization.DataTable(results.responseText);
			var scatterChartOptions = {
					//title: 'CVR' ,
					vAxis: { title: "Percentage",textStyle:{fontSize: '14',fontName: 'MyriadPro'},titleTextStyle:{fontSize: '14',fontName: 'MyriadPro' }, minValue: 0, maxValue: 7},
					hAxis: {textStyle:{fontSize: '14',fontName: 'MyriadPro' }},					
					lineDashStyle: [2, 2],
					colors: ['#015e84'],
					pointSize: 5,
					pointShape: 'circle',
					height: 300,
					//width: 1000,
					explorer: { actions: ['dragToZoom', 'rightClickToReset'],  maxZoomIn: .01 },
					tooltip: { textStyle: { fontName: 'MyriadPro', fontSize: 14 } },
					legend : { position:"none"}
			};
			var scatter_chart = new google.visualization.LineChart(document.getElementById('pat_cvr_chart'));
			scatter_chart.draw(scatterChartData, scatterChartOptions);
			var myLegendHtml = '<ul class="legend"><li><span class="Irisk"></span>0 - 5%</li>'+
			'<li><span class="IIrisk"></span>5%-10%</li>'+
			'<li><span class="IIIrisk"></span>10%-15%</li>'+
			'<li><span class="IVrisk"></span>15%-20%</li>'+
			'<li><span class="Vrisk"></span>20%-30%</li>'+
			'<li><span class="VIrisk"></span>30%-100%</li></ul> ';

			//LINK PROGETTO CUORE

//			'<div class="legend">'+
//			'<a href="http://www.cuore.iss.it/" target="_blank">'+
//			'<img src="images/progettoCuore.gif"  width="170" height="30" style="cursor: pointer;"/>'+
//			'</a>'+
//			'</div>';
			$('#pat_cvr_chart_legend').append(myLegendHtml);
		}
	});
}

function designTrafficLights(){

	$.ajax({
		url: "./i2b2Servlet/",
		dataType:"json",
		async: true,
		data: { step: "0",
			chart_type: "trafficlights",
			patient_id: patientIdSelected
		},
		complete: function(results){
			$('#tl_header').html("");
			$('.content_tl', $('#hba1c_tl')).html("");

			var tldata =  jQuery.parseJSON(results.responseText);

			$('#tl_header').append('<b>PATIENT:</b>&nbsp;' + patientCompleteNameSelected+'&nbsp;<b>ONSET YEAR:</b>&nbsp;'+tldata.onset_year+'&nbsp;<b>LAST VISIT:</b>&nbsp;'+ tldata.last_visit);
			var hba1ctracker = true;
			var diastolicPresstracker = true;
			var systolicPresstracker = true;
			var diettracker = true;
			var bmitracker = true;
			var physicalActivitytracker = true;
			var cvrtracker = true;
			var loctracker = true;
			var hba1c_cat_difference;
			var diastolicPress_cat_difference;
			var systolicPress_cat_difference;
			var diet_cat_difference;
			var bmi_cat_difference;
			var physicalActivity_cat_difference;
			var cvr_cat_difference;
			var loc_cat_difference;
			var hba1c_string="";
			var diastolicPress_string="";
			var systolicPress_string="";
			var diet_string="";
			var bmi_string="";
			var physicalActivity_string="";
			var cvr_string="";
			var loc_string="";
			for(var i=0; i< tldata.traffic_light_array.length; i++){
				if(tldata.traffic_light_array[i].id=="BLOOD_PRESS_DIASTOLIC"){
					diastolicPress_string = diastolicPress_string.concat('Value: '+tldata.traffic_light_array[i].obs_value + 'mm Hg - Date: ' + tldata.traffic_light_array[i].obs_date + '<br/>');
					if(diastolicPresstracker){
						diastolicPresstracker = false;
						diastolicPress_cat_difference = tldata.traffic_light_array[i].category;
						addCategoryBackground($('#bloodpressurediast_tl'), tldata.traffic_light_array[i].category);
					}else{
						diastolicPress_cat_difference = diastolicPress_cat_difference - tldata.traffic_light_array[i].category;
						addTrend($('#bloodpressurediast_tl'), diastolicPress_cat_difference,diastolicPresstracker);
					}
				}
				else if(tldata.traffic_light_array[i].id=="BLOOD_PRESS_SYSTOLIC"){
					systolicPress_string = systolicPress_string.concat('Value: '+tldata.traffic_light_array[i].obs_value + 'mm Hg - Date: ' + tldata.traffic_light_array[i].obs_date + '<br/>');
					if(systolicPresstracker){
						systolicPresstracker = false;
						systolicPress_cat_difference = tldata.traffic_light_array[i].category;
						addCategoryBackground($('#bloodpressuresyst_tl'), tldata.traffic_light_array[i].category);
					}else{
						systolicPress_cat_difference = systolicPress_cat_difference - tldata.traffic_light_array[i].category;
						addTrend($('#bloodpressuresyst_tl'), systolicPress_cat_difference,systolicPresstracker);
					}
				}
				else if(tldata.traffic_light_array[i].id=="DIET"){
					diet_string = diet_string.concat('Value: '+tldata.traffic_light_array[i].obs_value + ' - Date: ' + tldata.traffic_light_array[i].obs_date + '<br/>');
					if(diettracker){
						diettracker = false;
						diet_cat_difference = tldata.traffic_light_array[i].category;
						$('#diet_tl').append('<div class="tl_details" align="center" onclick="openUC3Chart(\'diet_tl\')">View Details</div>');
						addCategoryBackground($('#diet_tl'), tldata.traffic_light_array[i].category);
					}else{
						diet_cat_difference = diet_cat_difference - tldata.traffic_light_array[i].category;
						addTrend($('#diet_tl'), diet_cat_difference,diettracker);
					}
				}
				else if(tldata.traffic_light_array[i].id=="BMI"){
					bmi_string = bmi_string.concat(	'Value: '+tldata.traffic_light_array[i].obs_value + ' - Date: ' + tldata.traffic_light_array[i].obs_date + '<br/>');
					if(bmitracker){
						bmitracker = false;
						bmi_cat_difference = tldata.traffic_light_array[i].category;
						addCategoryBackground($('#bmi_tl'), tldata.traffic_light_array[i].category);
					}else{
						bmi_cat_difference = bmi_cat_difference - tldata.traffic_light_array[i].category;
						addTrend($('#bmi_tl'), bmi_cat_difference,bmitracker);
					}
				}
				else if(tldata.traffic_light_array[i].id=="PHISICAL_ACTIVITY"){
					physicalActivity_string = physicalActivity_string.concat('Value: '+tldata.traffic_light_array[i].obs_value + ' - Date: ' + tldata.traffic_light_array[i].obs_date + '<br/>');
					if(physicalActivitytracker){
						physicalActivitytracker = false;
						physicalActivity_cat_difference = tldata.traffic_light_array[i].category;
						addCategoryBackground($('#phisicalactivity_tl'), tldata.traffic_light_array[i].category);
					}else{
						physicalActivity_cat_difference = physicalActivity_cat_difference - tldata.traffic_light_array[i].category;			
						addTrend($('#phisicalactivity_tl'), physicalActivity_cat_difference,physicalActivitytracker);
					}
				}
				else if(tldata.traffic_light_array[i].id=="Hba1c"){
					hba1c_string = hba1c_string.concat('Value: '+Number(tldata.traffic_light_array[i].obs_value.replace(",",".")).toFixed(2) + 'mmol/mol - Date: ' + tldata.traffic_light_array[i].obs_date + '<br/>');
					if(hba1ctracker){
						hba1ctracker = false;
						hba1c_cat_difference = tldata.traffic_light_array[i].category;
						$('#hba1c_tl').append('<div class="tl_details" align="center" onclick="openUC3Chart(\'hba1c_tl\')">View Details</div>');
						addCategoryBackground($('#hba1c_tl'), tldata.traffic_light_array[i].category);
					}else{
						hba1c_cat_difference = hba1c_cat_difference - tldata.traffic_light_array[i].category;
						addTrend($('#hba1c_tl'), hba1c_cat_difference,hba1ctracker);
					}
				}
				else if(tldata.traffic_light_array[i].id=="CVR"){
					cvr_string = cvr_string.concat('Value: '+tldata.traffic_light_array[i].obs_value + ' - Date: ' + tldata.traffic_light_array[i].obs_date + '<br/>');
					if(cvrtracker){
						cvrtracker = false;
						cvr_cat_difference = tldata.traffic_light_array[i].category;
						$('#cvr_tl').append('<div class="tl_details" align="center" onclick="openUC3Chart(\'cvr_tl\')">View Details</div>');
						addCategoryBackground($('#cvr_tl'), tldata.traffic_light_array[i].category, cvr_cat_difference);
					}else{
						cvr_cat_difference = cvr_cat_difference - tldata.traffic_light_array[i].category;
						addTrend($('#cvr_tl'), cvr_cat_difference,cvrtracker);
					}
				}
				else if(tldata.traffic_light_array[i].id=="LOC"){
					loc_string = loc_string.concat('Value: '+tldata.traffic_light_array[i].obs_value + ' - Date: ' + tldata.traffic_light_array[i].obs_date + '<br/>');
					if(loctracker){
						loctracker = false;
						loc_cat_difference = tldata.traffic_light_array[i].category;
						$('#loc_tl').append('<div class="tl_details" align="center" onclick="openUC3Chart(\'loc_tl\')">View Details</div>');
						addCategoryBackground($('#loc_tl'), tldata.traffic_light_array[i].category, loc_cat_difference);
					}else{
						loc_cat_difference = loc_cat_difference - tldata.traffic_light_array[i].category;
						addTrend($('#loc_tl'), loc_cat_difference,loctracker);
					}
				}
			} 
			$('.content_tl', $('#bloodpressurediast_tl')).append(diastolicPress_string);
			$('.content_tl', $('#bloodpressuresyst_tl')).append(systolicPress_string);
			$('.content_tl', $('#diet_tl')).append(diet_string);
			$('.content_tl', $('#bmi_tl')).append(bmi_string);
			$('.content_tl', $('#phisicalactivity_tl')).append(physicalActivity_string);
			$('.content_tl', $('#hba1c_tl')).append(hba1c_string);	
			$('.content_tl', $('#cvr_tl')).append(cvr_string);
			$('.content_tl', $('#loc_tl')).append(loc_string);

			var delay = 500;
			$(".trafficlight_box").each(function(i){
				$(this).delay(i*delay).fadeIn(1000);
			});
		}
	});	
}

function addCategoryBackground(parentObj, category){
	if(category==0){
		$('.tl_category', parentObj).append("<img src='images/trafficlight_green.png' width='45'/>");
	}
	else if (category==1){
		$('.tl_category', parentObj).append("<img src='images/trafficlight_yellow.png' width='45'/>");
	}
	else{
		$('.tl_category', parentObj).append("<img src='images/trafficlight_red.png' width='45'/>");
	}
}

function openUC3Chart(callerId){
	$('#dialogUC3chart_chart').html("");
//	var input_json = '{"onset_year": 1981,"last_visit": "30/05/2014","traffic_light_array": [{"id": "BLOOD_PRESS_DIASTOLIC","category": 0,"obs_date": "24/10/2013","obs_value": "70"},{"id": "BLOOD_PRESS_SYSTOLIC","category": 1,"obs_date": "24/10/2013","obs_value": "120"},{"id": "DIET","category": 0,"obs_date": "24/10/2013","obs_value": "Good"},{"id": "BMI","category": 2,"obs_date": "24/10/2013","obs_value": "35,88"},{"id": "PHISICAL_ACTIVITY","category": 2,"obs_date": "24/10/2013","obs_value": "No"},{"id": "Hba1c","category": null,"obs_date": "16/08/2013","obs_value": "50,81985"},{"id": "Hba1c","category": null,"obs_date": "17/10/2013","obs_value": "50,81985"},{"id": "CVR","category": 1,"obs_date": "24/10/2013","obs_value": "II"},{"id": "LOC","category": 2,"obs_date": "13/08/2010","obs_value": "3rd Level"}]}';

//	var tldata =  jQuery.parseJSON(input_json);
//	var output = "";

//	for(var i=0; i< tldata.traffic_light_array.length; i++){
//	output = output.concat(
//	'<div class="trafficlight_box" id="'+tldata.traffic_light_array[i].id.toLowerCase()+'_tl">'+
//	'<div class="title_tl">'+tldata.traffic_light_array[i].id+'</div> '+
//	'<div class="content_tl"></div>'+ 
//	'</div>'
//	);
//	}

//	$('#trafficlights_container').append(output);

	$('#trafficlights_container').append('<div style="clear: both;"></div>');


	if(callerId=="hba1c_tl"){
		//Hba1c
		$.ajax({
			url: "./i2b2Servlet/",
			dataType:"json",
			async: true,
			data: { step: "0",
				chart_type: "hba1c",
				patient_id: patientIdSelected
			},
			complete: function(results){
				var scatterChartData = new google.visualization.DataTable(results.responseText);
				var scatterChartOptions = {
						//title: 'Hba1c' ,
						tooltip: { textStyle: { fontName: 'MyriadPro', fontSize: 14 } },
						vAxis: { title: "Percentage", minValue: 0, textStyle:{fontSize: '14',fontName: 'MyriadPro' }, titleTextStyle:{fontSize: '14',fontName: 'MyriadPro' }},
						hAxis: {textStyle:{fontSize: '14',fontName: 'MyriadPro' }},	
						lineDashStyle: [2, 2],
						colors: ['#015E84'],
						pointSize: 5,
						pointShape: 'circle',
						legend: {position: 'none'},
						height: 200,
						width: Math.floor($('#dashboard_container').innerWidth()/2),
						explorer: { actions: ['dragToZoom', 'rightClickToReset'],  maxZoomIn: .01 },
				};
				var scatter_chart = new google.visualization.LineChart(document.getElementById('dialogUC3chart_chart'));
				scatter_chart.draw(scatterChartData, scatterChartOptions);

				$( "#dialogUC3chart" ).dialog({
					title: "Hba1b"
				});

				$( "#dialogUC3chart" ).dialog("open");
			}
		});
	}else if(callerId=="cvr_tl"){
		$.ajax({
			url: "./i2b2Servlet/",
			dataType:"json",
			async: true,
			data: { step: "0",
				chart_type: "cvr",
				patient_id: patientIdSelected
			},
			complete: function(results){
				$('.legend').remove();
				var scatterChartData = new google.visualization.DataTable(results.responseText);
				var scatterChartOptions = {
						//title: 'CVR' ,
						vAxis: { title: "Percentage",textStyle:{fontSize: '14',fontName: 'MyriadPro'},titleTextStyle:{fontSize: '14',fontName: 'MyriadPro' }, minValue: 0, maxValue: 7},
						hAxis: {textStyle:{fontSize: '14',fontName: 'MyriadPro' }},					
						lineDashStyle: [2, 2],
						colors: ['#015e84'],
						pointSize: 5,
						pointShape: 'circle',
						height: 200,
						width: Math.floor($('#dashboard_container').innerWidth()/2),
						explorer: { actions: ['dragToZoom', 'rightClickToReset'],  maxZoomIn: .01 },
						tooltip: { textStyle: { fontName: 'MyriadPro', fontSize: 14 } },
						legend : { position:"none"}
				};
				var scatter_chart = new google.visualization.LineChart(document.getElementById('dialogUC3chart_chart'));
				scatter_chart.draw(scatterChartData, scatterChartOptions);
				var myLegendHtml = '<ul class="legend"><li><span class="Irisk"></span>0 - 5%</li>'+
				'<li><span class="IIrisk"></span>5%-10%</li>'+
				'<li><span class="IIIrisk"></span>10%-15%</li>'+
				'<li><span class="IVrisk"></span>15%-20%</li>'+
				'<li><span class="Vrisk"></span>20%-30%</li>'+
				'<li><span class="VIrisk"></span>30%-100%</li></ul> ';
				$('#dialogUC3chart_chart').append(myLegendHtml);
				$( "#dialogUC3chart" ).dialog({
					title: "CVR"
				});

				$( "#dialogUC3chart" ).dialog("open");
			}
		});

	}else if(callerId=="diet_tl"){
		$.ajax({
			url: "./i2b2Servlet/",
			dataType:"json",
			async: true,
			data: { step: "0",
				chart_type: "diet",
				patient_id: patientIdSelected
			},
			complete: function(results){
				var obj = $.parseJSON(results.responseText);
				var timelineData = new google.visualization.DataTable(obj.dietData);
				var labelArray = obj.dietLabels;
				if(labelArray.length>0){
					var colorsArray = [];
					var colorMap = {
							'Good': '#B9E3E8',
							'Bad': '#D18369'
					};
					for (var i = 0; i < labelArray.length; i++) {
						colorsArray.push(colorMap[labelArray[i]]);
					}

					var timeLineChart_options = {
							timeline: { 
								groupByRowLabel: true,
								rowLabelStyle: {fontName: 'MyriadPro', fontSize: 14},
								barLabelStyle: { fontName: 'MyriadPro', fontSize: 12 }
							},                          
							avoidOverlappingGridLines: true,
							height: 100,
							width: Math.floor(($('#dashboard_container').innerWidth()/4)*3),
							colors: colorsArray,
							tooltip: { textStyle: { fontName: 'MyriadPro', fontSize: 14 } },
							backgroundColor: '#E6E6E8'
					};
					var view = new google.visualization.DataView(timelineData);
					view.setColumns([0, 1, 2, 3]);
					var timeline_chart = new  google.visualization.Timeline(document.getElementById('dialogUC3chart_chart'));
					timeline_chart.draw(view, timeLineChart_options);
					//timeline_chart.draw(timelineData, timeLineChart_options);
					$( "#dialogUC3chart" ).dialog({
						title: "DIET"
					});
					$( "#dialogUC3chart" ).dialog("open");
				}else{
					$("#dialogUC3chart_chart").empty();
				}
			}
		});
		
	}else if(callerId=="loc_tl"){
		$.ajax({
			url: "./i2b2Servlet/",
			dataType:"json",
			async: true,
			data: { step: "0",
				chart_type: "loc",
				patient_id: patientIdSelected
			},
			complete: function(results){
				var obj = $.parseJSON(results.responseText);
				var timelineData = new google.visualization.DataTable(obj.locData);
				var labelArray = obj.locLabels;
				if(labelArray.length>0){
					var colorsArray = [];
					var colorMap = {
							'1st Level': '#7CC3AE',
							'2nd Level': '#DDBF79',
							'Stable': '#B9E3E8',
							'3rd Level': '#D18369'
					};
					for (var i = 0; i < labelArray.length; i++) {
						colorsArray.push(colorMap[labelArray[i]]);
					}

					var timeLineChart_options = {
							timeline: { 
								groupByRowLabel: true,
								rowLabelStyle: {fontName: 'MyriadPro', fontSize: 14},
								barLabelStyle: { fontName: 'MyriadPro', fontSize: 12 }
							},                          
							avoidOverlappingGridLines: true,
							height: 100,
							width: Math.floor(($('#dashboard_container').innerWidth()/4)*3),
							colors: colorsArray,
							tooltip: { textStyle: { fontName: 'MyriadPro', fontSize: 14 } },
							backgroundColor: '#E6E6E8'
					};
					var view = new google.visualization.DataView(timelineData);
					view.setColumns([0, 1, 2, 3]);
					var timeline_chart = new  google.visualization.Timeline(document.getElementById('dialogUC3chart_chart'));
					timeline_chart.draw(view, timeLineChart_options);
					//timeline_chart.draw(timelineData, timeLineChart_options);
					$( "#dialogUC3chart" ).dialog({
						title: "LOC"
					});

					$( "#dialogUC3chart" ).dialog("open");
				}else{
					$("#dialogUC3chart_chart").empty();
				}
			}
		});
	}
}

function addTrend(parentObj, cat_diff){
	if(cat_diff < 0){
		$('.tl_category', parentObj).append("<img src='images/decreasing_state.png' width='70' style='margin-left: 25px; margin-bottom: 10px;'/>");
	}
	else if(cat_diff==0){
		$('.tl_category', parentObj).append("<img src='images/steady_state.png' width='80' style='margin-left: 25px; margin-bottom: 20px;'/>");
	}
	else if (cat_diff > 0){
		$('.tl_category', parentObj).append("<img src='images/increasing_state.png'width='70' style='margin-left: 25px; margin-bottom: 10px;'/>");
	}
}

function testJSONP(){
	selectTablePatient();
//	//get the form data and then serialize that
//	//var patientIdVar = $("#patientTxt").val();
//	patientIdSelected = $("#patientTxt").val();
//	//patientCompleteNameSelected = data.patients[0].patientName+" "+data.patients[0].patientSurname;
//	patientCompleteNameSelected = "PATIENT NAME - PATIENT SURNAME";
//	designTrafficLights();
	
	
	//make the ajax request to get url from properties
//	$.ajax({
//		url: "./i2b2Servlet/",
//		dataType:"text",
//		async: true,
//		data: { step: "4",
//			chart_type: "getUrl"
//		},
//		complete: function(results){
//				$.ajax({
//					type: "POST",
//					url: results.responseText+"?patientName="+patientIdVar+"&callback=?", 
//					dataType: 'jsonp',
//					jsonp: 'callback',    
//
//					//if received a response from the server
//					success: function( data) {
//						if(data.patients.length==0){
//							alert("No patient found");
//							patientIdSelected = null;
//							patientCompleteNameSelected = null;
//							$("#singlePatientDataContainer").hide();
//						}else if (data.patients.length==1){
//							$("#singlePatientDataContainer").load("trafficlights.html"); 
//							$("#singlePatientDataContainer").show();
//							patientIdSelected = data.patients[0].patientId;
//							patientCompleteNameSelected = data.patients[0].patientName+" "+data.patients[0].patientSurname;
//							designTrafficLights();
//						}else{
//							$("#singlePatientDataContainer").html("");
//							$("#singlePatientDataContainer").show();
//							if($("#tablePatientdialog").length==0){
//								var dialogHTML = "<div id='tablePatientdialog' title='Choose a patient'>";
//								var tablePatient = dialogHTML.concat("<table class='dialog_table' border='none'><tr><th>Surname</th><th>Name</th><th>Birth Date</th><th>Select</th></tr>");		
//								for (var i = 0; i < data.patients.length; i++) {
//									var singlePatient = data.patients[i];
//									var patientSelectedInfo = singlePatient.patientId+"@"+singlePatient.patientName+" "+singlePatient.patientSurname;
//									tablePatient = tablePatient.concat("<tr><td>"+singlePatient.patientSurname+"</td><td>"+singlePatient.patientName+"</td><td>"+singlePatient.patientDOB+"</td>" +
//											"<td><input id='selectTP' type='button' onclick='selectTablePatient(this);' value='select' name='"+patientSelectedInfo+"'/></td></tr>");
//								}
//								tablePatient = tablePatient.concat("</table></div>"); 
//								$("#singlePatientDataContainer").append(tablePatient);
//								$("#tablePatientdialog").dialog({
//									autoOpen: true,
//									height: 600,
//									width: 500,
//									modal: true,
//									resizable: true,
//									closeOnEscape: false,
//									dialogClass: "noclose"
//								});
//							}else{
//								$("#tablePatientdialog").html('');
//								var tablePatient = "<table class='dialog_table' border='none'><tr><th>Surname</th><th>Name</th><th>Birth Date</th><th>Select</th></tr>";		
//								for (var i = 0; i < data.patients.length; i++) {
//									var singlePatient = data.patients[i];
//									var patientSelectedInfo = singlePatient.patientId+"@"+singlePatient.patientName+" "+singlePatient.patientSurname;
//									tablePatient = tablePatient.concat("<tr><td>"+singlePatient.patientSurname+"</td><td>"+singlePatient.patientName+"</td><td>"+singlePatient.patientDOB+"</td>" +
//											"<td><input id='selectTP' type='button' onclick='selectTablePatient(this);' value='select' name='"+patientSelectedInfo+"'/></td></tr>");
//								}
//								tablePatient = tablePatient.concat("</table>"); 
//								$("#tablePatientdialog").append(tablePatient);
//								$("#tablePatientdialog").dialog('open');
//							}
//						}
//					},
//					error: function(){
//						alert("Error. Please try another patient or contact the administrators");
//					},
//				}); 
//		
//		}
//	});
}

function selectTablePatient(form){
	$("#singlePatientDataContainer").load("trafficlights.html"); 
	$("#singlePatientDataContainer").show();
	patientIdSelected = $("#patientTxt").val();
	//MODIFY HERE IF YOU WANT PATIENTNAME
	patientCompleteNameSelected = "PATIENT NAME";
	designTrafficLights();
	$("#tablePatientdialog").dialog('close');

}
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">


<html xmlns="http://www.w3.org/1999/xhtml">


<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<link href="css/damco-min.css?ver=21.01" rel="stylesheet" type="text/css" />
<link href="css/picdef-min.css?ver=21.00" rel="stylesheet" type="text/css" />
<link href="css/jquery-ui-1.7.2.custom-min.css?ver=t.01" rel="stylesheet" type="text/css" />
<link href="css/booking-min.css?ver=t.01" rel="stylesheet" type="text/css" />
<link rel="icon" type="image/x-icon" href="./favicon.ico?ver=25.02" >

<link href="css/maersk-theme.css" rel="stylesheet" type="text/css">

<script language="javascript" src="js/jquery/jquery-1.3.2.min.js"></script>
<script language="javascript" src="js/jquery/jquery-ui-1.7.2.custom.min.js"></script>
<script language="javascript" src="js/jquery/jquery.corner.js"></script>
<script language="javascript" src="js/jquery/jquery.bgiframe.min.js"></script>
 <script language="javascript" type="text/javascript" src="js/jquery/jquery-1.3.2.js"></script>
  <script language="javascript" src="js/mydropdown.js?ver=t.01"></script>
<script language="javascript" src="js/docman.js?ver=19.00"></script>
<script type="text/javascript" src="js/timeout.js?ver=2.5"></script>
<title>Document Management</title>
<script langauge="JavaScript" type="text/javascript">
var markFlg = ''; 
var popupWindow;
var progressbarPopupWindow;
function showPopup(){
		if(validateFileNameBeforeUpload()) {
			document.hiddenForm.selectedShipperId.value=document.docmanform.shipper.value;
			document.hiddenForm.selectedConsigneeId.value=document.docmanform.consignee.value;
			popupWindow = window.open ("","popupWindow",'width=500,height=450,resize=1,scrollbars=yes');
			var form2 = document.forms[2];
			form2.target = "popupWindow";
			form2.submit();
		}
	}


function removeUploadProgress() {
	if (progressbarPopupWindow != null && !progressbarPopupWindow.closed) {
		progressbarPopupWindow.close();
		if(popupWindow != null){
			popupWindow.focus();
		}
	}
}

function uploadDocuments()
{
	progressbarPopupWindow = window.open ("DocManUploadProgressAction","progressbarPopupWindow","width=500,height=450,resize=1,scrollbars=yes");
	document.docmanUploadForm.selectedShipperId.value=document.docmanform.selectedShipperId.value;
	document.docmanUploadForm.selectedConsigneeId.value=document.docmanform.selectedConsigneeId.value;
	//progressbarPopupWindow = window.open ("","progressbarPopupWindow","width=500,height=450,resize=1,scrollbars=yes");
	document.forms[1].target = "popupWindow";
	document.docmanUploadForm.action="DocManUploadConfirmAction";
	document.forms[1].submit();
	document.forms[1].target = "";
	if(progressbarPopupWindow != null){
		progressbarPopupWindow.focus();
	}

}

function callAction (actionName)
{			
	document.docmanform.action=actionName;				
	document.forms[0].submit();	
}	
function getShipperInfo()
{
	callAction("get_shipper_info");
}

function submitSearch()
{
	document.docmanform.selectedShipperId.value=document.docmanform.shipper.value;
	document.docmanform.selectedConsigneeId.value=document.docmanform.consignee.value;
	
	var ship=document.getElementById("shipperList").value;
	var con=document.getElementById("consigneeList").value;

	if(ship!='0' && con!='0' && validateDocMan()==true)
	{
		//callAction("search_PO_SO");
		document.docmanform.action = "search_PO_SO";
		return true;
	}
	else
	{
		document.getElementById("error1").style.display = 'inline';
		document.getElementById('DocManUploadOption').style.display='none';
		document.getElementById('DocManSearchOption').style.display='none';
		document.getElementById("error2").style.display = 'none';
		document.getElementById("error3").style.display = 'none';
	}
	return false;
}

function validateDocMan()
{
	var ship=document.getElementById("shipperList").value;
	var con=document.getElementById("consigneeList").value;
	
	if(ship=='0' || con=='0'){
		return false;
	}
		return true;
}

function downloadDoc(documentId)
{
//	alert("documentId"+documentId);
	document.docmanform.poSoDocLinkId.value = documentId;
	callAction("download_doc");
}

function deleteNode(elem)
	{
		var tdElem = document.getElementById("newcrit");
		alert("tdElem"+tdElem);
		alert("tdElem.childNodes.length"+tdElem.childNodes.length);
		if(tdElem.childNodes.length>2)		   				
		tdElem.removeChild(elem.parentNode.parentNode.parentNode.parentNode);
	}

function toggleMe (elem, id)
{
	if(	$(elem).hasClass('plus')){
		$(elem).removeClass('plus').addClass('minus');
		//$(divEm).next().hide();
		$('#'+id).show();
		
	}else{
		$(elem).removeClass('minus').addClass('plus');
		//$(divEm).next().show();
		$('#'+id).hide();
	}
}

/*Function for check all */
function checkedAll(chkFld) 
{
	var checked=chkFld.checked;
	alert("checked"+checked);
	var tblId=document.getElementById("poDetail");
	alert("tblId"+tblId);
	var chkElems=$("#"+tblId+" :checkbox").show();
	alert("chkElems"+chkElems);
	alert("chkElems.length"+chkElems.length);
		
	for (var index =0; index < chkElems.length; index++) 
	{
		alert("Entered into for loop");
			chkElems[index].checked = checked;
	}				
	}

function checkAll(elem, parentId)
{
	var selected=elem.checked;	
	var elemList = $("#"+parentId+" :checkbox").show();
	for (var index=0; index < elemList.length; index++)
	{
		elemList[index].checked=selected;
	}	
}

function addNewLine (){	$("#UpdTblId").append($("#TMPUpdTblId tr").clone(true).show()); return false;}
function deleteLine (elem){ if ($("#UpdTblId tr").show().length > 1){$(elem.parentNode.parentNode).remove();} return false;}
var newwindow;

function deleteDoc(){
	var deleteDocID = '';
	var status = false;
	//alert('here');
	var chkList = document.getElementsByName("documents");
	for ( var i = chkList.length - 1; i >= 0; i-- ) {
		if(chkList[i].checked==true){
			// added this line RQ: 24264 
			var tempdoclinkid=chkList[i].value ;
			// changed "^" to "::" RQ: 24264 
			deleteDocID = deleteDocID + tempdoclinkid+'::';
			status = true;
		}
	}
	if(status== true){
	// form docsdeleteFormId has been added below : RQ:24264
	//submit form id =docsdeleteFormId , input id = doclinksinputid
	var delupWindow	= window.open ("","delupWindow",'height=500,width=550,scrollbars=yes');
	document.getElementById("doclinksinputid").value=deleteDocID;
	var deldocsfrm=	document.getElementById("docsdeleteFormId");
	deldocsfrm.target = "delupWindow";
	deldocsfrm.submit();
	// commented below 2 lines RQ:24264
	//newwindow=window.open("confDeleteDocument.action?docLinkID="+deleteDocID,'name','height=500,width=550');
	//if (window.focus) {newwindow.focus();}
	}
	else{
		alert('Please select a document');
	}
	//window.showModalDialog("confDeleteDocument.action?docLinkID="+deleteDocID,'', ''); 
	
	//alert(deleteDocID);
}


	function markComplete(){
		var posos ='';
		var status = false;
		var chkList = document.getElementsByName("SOLevel");
		for ( var i = chkList.length - 1; i >= 0; i-- ) {
			if(chkList[i].checked==true){
				if(validateMarkeComplete(chkList[i].id)=='N'){
				posos = posos + chkList[i].id+'|';
				status = true;
				}
			}
	}
		if(status== true){
			newwindow=window.open("confMarkComplete.action?posoList="+posos,'name','height=500,width=550,scrollbars=yes,resizable=true');
			if (window.focus) {newwindow.focus()}
			}
			else{
				if(markFlg!="Y")
					{
						alert('Please select a PO_SO ');
					}
			}
		//alert(posos);
		//posoList
	}

	function validateUpload(){
		alert('Hi')
	}
	function validateMarkeComplete(data )
	{
		var info = data.split('^');
		var mark = info[1];
		//alert(mark);
		if(mark==''||mark=='N'){
			return 'N';
			}
			else{
				markFlg="Y";
				alert(info[0]+' already Mark Complete');
				return 'Y';
			}
	}

	var xmlHttpOb;
	function docManUploadValidate()
	{
		var ship=document.getElementById("shipperList").value;
		var con=document.getElementById("consigneeList").value;
		document.getElementById('DocManUploadOption').style.display='none';
		document.getElementById('DocManSearchOption').style.display='inline';
		disableUpload(true);
		if(ship != '0' && con != '0')
		{
			 xmlHttpOb = GetXmlHttpObject();
			  if (xmlHttpOb == null){
				 alert ("Your browser does not support AJAX!");
				 return false;
			  }
			  var url="DocManActiveClientSearch";
			  url=url+"?conId="+con;
			  xmlHttpOb.onreadystatechange=getActiveClientData; 
			  xmlHttpOb.open("GET",url,true);
			  xmlHttpOb.send(null); 
		}
	}

	function getActiveClientData()
	{ 
		if (xmlHttpOb.readyState==4 && xmlHttpOb.status == 200)
		{
			var str = xmlHttpOb.responseText;
			if(str == 'OK')
			{
				document.getElementById('DocManUploadOption').style.display='inline';
			}
		}
	}

	function GetXmlHttpObject(){
		var xmlHttp=null;
		try{
			// Firefox, Opera 8.0+, Safari
			xmlHttp=new XMLHttpRequest();
		}
		catch (e){
			// Internet Explorer
			try{
				xmlHttp=new ActiveXObject("Msxml2.XMLHTTP");
			}
			catch (e){
				xmlHttp=new ActiveXObject("Microsoft.XMLHTTP");
			}
		}
		return xmlHttp;
	}
	//OIL-1465 RQ-23029 starts here
	function addTitleAttributes(dropDownName)
	{
	  numOptions = document.getElementById(dropDownName).options.length;
	  for (i = 0; i < numOptions; i++)
	  document.getElementById(dropDownName).options[i].title =
	  document.getElementById(dropDownName).options[i].text;
	}
	//OIL-1465 RQ-23029 ends here
	
	//RQ-23853 OIL-1424
	var checkflag = "false";
	function selectAllPO(field){
		if(document.getElementById('selectAllCheckBox').checked){
			checkflag = "false";
		}				
		if(field!=null && field!=undefined && field.length>1){
			if (checkflag == "false") {
			    for (i = 0; i < field.length; i++) {
			      field[i].checked = true;
			      handleCheckboxes('PO',field[i].id,'dummy');
			      
			      document.getElementById('POToggle'+i).className="but minus";
			      document.getElementById('mainPo'+i).style.display="inline";
			    }
			    checkflag = "true";
			    return "Uncheck All";
			}
			else{
				for (i = 0; i < field.length; i++) {
				      field[i].checked = false;
				      handleCheckboxes('PO',field[i].id,'dummy');
				}
				checkflag = "false";
				return "Check All";			  						
			}
			
		}
		else if(field!=null && field!=undefined){
			if (checkflag == "false") {			    
			      field.checked = true;
			      handleCheckboxes('PO',field.id,'dummy');			      
			      document.getElementById('POToggle0').className="but minus";
			      document.getElementById('mainPo0').style.display="inline";			    
			      checkflag = "true";
			      return "Uncheck All";
			}
			else{
				field.checked = false;
				handleCheckboxes('PO',field.id,'dummy');
				checkflag = "false";
				return "Check All";			  						
			}
		}
	}
	//RQ-23853 OIL-1424
	
	
</script> 


	<script type="text/javascript">			
		
			(function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
			(i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
			m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
			})(window,document,'script','https://www.google-analytics.com/analytics.js','ga');
			
			ga('create', 'UA-81408626-2', 'auto');
			ga('send', 'pageview');

			var clientId = '';
				ga(function(tracker) {
				  clientId = tracker.get('clientId');
				}); 
			
		function handleGaEvents(category, action, label) {
			label = label + '_'+clientId;
		  ga('send', 'event', {
			    eventCategory: category,
			    eventAction: action,
			    eventLabel: label
			  }); 
		}
		  
	
	</script>


</head>


<body onload="timeout();docManUploadValidate()">

<div class="page">
	<form id="DocManSearchPOSOAction" name="docmanform" action="/ShipperPortalWeb/DocManSearchPOSOAction.action" method="post">
	<input type="hidden" name="selectedShipperId" value="" id="DocManSearchPOSOAction_selectedShipperId"/>
	<input type="hidden" name="selectedConsigneeId" value="" id="DocManSearchPOSOAction_selectedConsigneeId"/>
	<input type="hidden" name="poSoDocLinkId" value="" id="DocManSearchPOSOAction_poSoDocLinkId"/>
		
		<table width="100%" border="0" cellspacing="0" cellpadding="0">
			<tr>
				<td class="pageline">Document Management</td>
				<td width="800" align="right" class="fade">
				<table border="0" cellspacing="0" cellpadding="0" class="mainmenu paddingMainMenu">
					<tr>
						<td>
							<!-- a href="DocumentManagementAction.action">Document Management</a-->
							
									<a href="ViewDashboardAction.action">Dashboard</a>
							
							<a href="SearchAction">Search</a> 
							<a href="PreferenceViewAction.action">Settings</a>
						</td>
					</tr>
					</table>
				</td>
				</tr>
		</table>
		
		<div class="message" id="message">
		</div>
		 <div style="display: none;" id="error1"><li>Please select shipper and consignee.</li></div>
    	<div id="error2"></div>
		<div id="error3"></div>
		<div><font color="red" > </font></div>
		<div class="section" style="margin-top:13px;">
			<div class="message" id="MsgDivId"></div>
		
			<div class="bar">
				<div>
					<table border="0" style="display:inline" cellspacing="0" cellpadding="0">
						<tr>
							<th style="padding-right: 10px;vertical-align: middle">Shipper</th>
							<td>
								<select name="shipper" id="shipperList" style="width: 380px" onmouseover="addTitleAttributes(&quot;shipperList&quot;);" onchange="javascript:getConsigneeList();">
    <option value="0"
    >Please Select</option>
    <option value="729258">IMPRESS NEWTEX COMPOSITE TEXTILES LT [BDIMPRESSNVDR]</option>
    <option value="536491">NEWTEX DESIGN LTD [BDNEWTEXDEVDR]</option>


</select> 
							</td>
							<th style="padding-left:50px;padding-right: 10px;vertical-align: middle">Consignee</th>
							<td>
								<select name="consignee" id="consigneeList" style="width: 340px" onmouseover="addTitleAttributes(&quot;consigneeList&quot;);" onchange="javascript:getDashboardCount();">
    <option value="0"
    >Please Select</option>


</select>
							</td>
							<td><img src="images/c.gif" width="20" /></td>
						</tr>
					</table>
				</div>
			</div>
			
			<div class="content" style="margin-top:16px;">
			
				
				<table border="0"  style="border-collapse:collapse;">
					<tr>
						<th style="padding-right: 10px;">PO Number</th>
						<td class="data"> <textarea name="poNumber" cols="" rows="4" id="poNumber" style="width:170px;"></textarea></td>
						<th style="padding-right: 10px;padding-left:47px;">Booking Conf. Number</th> 
						<td class="data"><textarea name="soNumber" cols="" rows="4" id="soNumber" style="width:170px;"></textarea></td>
						<th style="padding-right: 10px;padding-left:47px;">SO Number</th> 
						<td class="data"><textarea name="soID" cols="" rows="4" id="soID" style="width:170px;"></textarea></td>
						<th style="padding-right: 10px;padding-left:47px;">Booking Reference</th>    
						<td class="data"><textarea name="soRefInvNumber" cols="" rows="4" id="soRefInvNumber" style="width:170px;"></textarea></td>	</tr>	</table>	
	
				<div class="submitbar" >
					<input type="submit" id="search_po" value="Search" class="submit" onclick="return submitSearch()" style="margin-top:13px;margin-bottom:15px;"/>

	</div>	
				
			</div>
			<div class="section" id="DocManSearchOption">
				<table width="100%" border="0" cellspacing="0" cellpadding="0" class="section-header" style="padding-right:3px">
					<tr>
						<td class="sectionstart"><img src="images/c.gif"></img></td>
						<td class="sectionline"><span class="cap">Select Purchase Order 
						/ Booking combination to Manage</span></td>
						<td class="section-icon">
						<img src="images/c.gif" class="minus"></img></td>
					</tr>
				</table>
				
				<div class="bar" id="POSearchMenuBar" style="padding-right:0px;">
					<div class="barline">
					<input type="hidden" id="deleteDocButton"/>
						<a href="#" id="markCompleteButton" onclick="markComplete()">Mark complete</a> 
						<a href="#" id="deleteDocButton1" onclick="deleteDoc()">
										Delete document(s)</a>
					</div>
				</div> 
				
				<div class="secbody">
					<div class="content" style="padding-right:0px;margin-top:8px;">
					
					<table width="100%" border="0" cellspacing="0" cellpadding="0" class="section-header" style="padding-right:3px">
					<tr>
						<td class="sectionstart"><img src="images/c.gif"></img></td>
						<td class="sectionline"><span class="cap">Purchase Orders</span></td>
						<td class="section-icon">
						<img src="images/c.gif" class="minus"></img></td>
					</tr>
					</table>
					
					
						<table border="0" width="100%"  style="padding-right: 1px;padding-top:7px;">
							
	<tr>	<td>&nbsp;</td>	<td >	
								</td>
							</tr>
						</table>
						
						<!-- <div class="submitbar">
							<input type="submit" id="settings_preferences" value="Add" class="submit"/>

						</div> -->
					</div>
				</div>
			</div>
		</div>	
		 <!-- CSRF -->
 <input type="hidden" name="csrfPreventionSalt" value= hQveVja4rzDjHVlkasAx /> <!-- CSRF -->	</form>




	
	<form id="DocManUploadDocumentAction" name="docmanUploadForm" action="/ShipperPortalWeb/DocManUploadDocumentAction.action" method="post" enctype="multipart/form-data">
		<input type="hidden" name="poNumber" value="not_set" />
		<input type="hidden" name="soNumber" value="not_set" />
		<input type="hidden" name="poSoCombos" value="not_set" />
		<input type="hidden" name="selectedShipperId" value="" id="DocManUploadDocumentAction_selectedShipperId"/>
	<input type="hidden" name="selectedConsigneeId" value="" id="DocManUploadDocumentAction_selectedConsigneeId"/>
		<div id="DocManUploadOption" class="section">
			<table width="100%" border="0" cellspacing="0" cellpadding="0" class="section-header" style="padding-right:3px;">
				<tr>
					<td class="sectionstart"><img src="images/c.gif" /></td>
					<td class="sectionline"><span class="cap">Upload Documents</span></td>
					<td class="section-icon">
					<img src="images/c.gif" class="plus" /></td>
				</tr>
			</table>
			<table id="TMPUpdTblId" style="display:none">
				<tr>
					<td class="data">
						<select name="document" disabled="disabled" id="DocManUploadDocumentAction_document" style="width: 120px">
    <option value="0"
    >-- Select --</option>


</select>

					</td>
					<td class="data">
						<input type="file" name="upload" size="30" value="" id="DocManUploadDocumentAction_upload" class="text" onchange="checkSupportedType(this)"/>
					</td>
					<td class="data">
						<input src="images/c.gif" type="image" class="but delete" 
							title="Delete" name="I4" onclick="javascript:return deleteLine(this)"/>
					</td>
				</tr>
			</table>

			<div class="secbody1" style="padding-left:0px;">
				<table border="0" cellspacing="2" cellpadding="0">
					<tr>
						<td valign="middle" style="padding-bottom:6px">
							<input type="image" src="images/c.gif" class="but plus" onclick="javascript:return addNewLine()"/>
						</td>
						<td>
							
								<table cellspacing="5px">

									<tr>
										<th style="width: 121px; text-align: left; padding-left: 4px;">Type</th>
										<th style="text-align:left;">File</th>
									</tr>
									<tr>
										<td colspan=2>
											<div class="scrolly" style="height:65px;overflow-y:auto;overflow-x:hidden;">
											<table id="UpdTblId">
												<tr>
													<td><select name="document" disabled="disabled" id="DocManUploadDocumentAction_document" style="width: 120px">
    <option value="0"
    >-- Select --</option>


</select></td>
													<td class="data"><input type="file" name="upload" size="30" value="" id="DocManUploadDocumentAction_upload" class="text" onchange="checkSupportedType(this)"/></td>
													<td class="data"><input src="images/c.gif" type="image"
														class="but delete" title="Delete" name="I4"
														onclick="javascript:return deleteLine(this)" /></td>
												</tr>
											</table>
											</div>
										</td>
								</tr>
								</table>
						</td>
					</tr>
				</table> 
				<div class="submitbar">
					<input type="button" style="margin-top: 4px; margin-bottom: 18px;" class="submit" value="Upload" id="uploadButton" onclick="if (copyFormData('document', 'upload')) showPopup();" />
				</div>
			</div>
		</div>
		 <!-- CSRF -->
 <input type="hidden" name="csrfPreventionSalt" value= hQveVja4rzDjHVlkasAx /> <!-- CSRF -->	</form>




	
	
	<fieldset style="width:307px;border:2px solid;border-color:#a8e0ee;">
	<legend style="font-size:11;font-weight:bold;padding:2px;">Upload information</legend>	
	<table border=0>
		<tr>
			<td>
			<a onclick="hideByID('view_types');" style="cursor:help;text-align:right;">View...</a>		
			</td>
		</tr>
		<tr style="text-align:justify;display:none;" id="view_types">
			<td >
			<b>The following file types are supported:</b>
			<br>
			doc, docx, dot, gif, jfif, jpe, jpeg, jpg, pdf, pgp, pjp, pjpeg, png, 			
ppt, pptx, tif, tiff, txt, xla, xll, xlm, xls, xlsx, xlt, xlw, mdi
			<hr style="color:#a8e0ee;">
			Note that maximum file size is not to exceed 5.0 MB
			
			</td>
		</tr>
	</table>
</fieldset>

</div>

<form action="DocManUploadDocumentAction" name="hiddenForm" method="post">
	<input type="hidden" name="poSoCombos" value="not_set" />
	<input type="hidden" name="selectedShipperId" value="" id="selectedShipperId"/>
	<input type="hidden" name="selectedConsigneeId" value="" id="selectedConsigneeId"/>
	<input type="hidden" name="docTypes"/>
	<input type="hidden" name="fileNames"/>
	<input type="hidden" name="totalRows"/>
	 <!-- CSRF -->
 <input type="hidden" name="csrfPreventionSalt" value= hQveVja4rzDjHVlkasAx /> 
 <!-- CSRF -->
</form>

<form action="confDeleteDocument.action"  id="docsdeleteFormId" name="docsdeleteForm" method="post">
<input type="hidden" id="doclinksinputid" name="docLinkID" value="" />
 <!-- CSRF -->
 <input type="hidden" name="csrfPreventionSalt" value= hQveVja4rzDjHVlkasAx /> <!-- CSRF -->
</form>
</body>
<div>



	

</div>
</html>

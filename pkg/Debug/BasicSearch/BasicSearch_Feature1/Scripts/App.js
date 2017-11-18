var context;
var web;
var user;
var results;
var resultColumns = [];

// This function is executed after the DOM is ready and SharePoint scripts are loaded
// Place any code you want to run when Default.aspx is loaded in this function
// The code creates a context object which is needed to use the SharePoint object model
function sharePointReady() {
    context = new SP.ClientContext.get_current();
    web = context.get_web();
    getUserName();
}

// This function prepares, loads, and then executes a SharePoint query to get the current users information
function getUserName() {
    user = web.get_currentUser();
    context.load(user);
    context.executeQueryAsync(onGetUserNameSuccess, onGetUserNameFail);
}

// This function is executed if the above OM call is successful
// It replaces the content of the 'welcome' element with the user name
function onGetUserNameSuccess() {
    $('#message').text('Hello ' + user.get_title());
}

// This function is executed if the above OM call fails
function onGetUserNameFail(sender, args) {
    alert('Failed to get user name. Error:' + args.get_message());
}

function convertResults(data) {

    var queryResults = data.d.query.PrimaryQueryResult.RelevantResults.Table.Rows.results;
    var tempResults = [];
    var cellValues = [];
    var tempColumns = [];
    
    for (var i = 0; i < queryResults.length; i++)
    {
        cellValues = [];

        for (var h = 0; h < queryResults[i].Cells.results.length; h++)
        {
                cellValues.push(queryResults[i].Cells.results[h].Value);
        }

        tempResults.push(cellValues);
    }

    results = tempResults;
  
}


function setManagedProperties(data) {
    var colName;
    var queryResults = data.d.query.PrimaryQueryResult.RelevantResults.Table.Rows.results;
    var options = $("#managedProperties");

    for (var h = 0; h < queryResults[0].Cells.results.length; h++) {
        colName = queryResults[i].Cells.results[h].Key;
        options.append($("<option />").val(colName).text(colName));
        resultColumns.push({ "sTitle": colName });
    }
 
}
function getDisplayManagedProperties() {
    var array;
    var selectedManagedProps = $("#selectedManagedProperties option");
    var managedProps = $("#managedProperties option");

    if (selectedManagedProps.length > 0)
        array = $.map(selectedManagedProps, function (elem) {
            return elem.text;
        });
    else
        array = $.map(managedProps, function (elem) {
            return elem.text;
        });

    return array;

}

function getAllHostlistProps() {
    
    $.ajax(
        {
            url:
                _spPageContextInfo.webAbsoluteUrl +
            "/_api/SP.AppContextSite(@target)/web/lists/?$filter=BaseTemplate eq 100&@target='" + encodeURIComponent("http://basesmc15") + "'",
            method: "GET",
            headers: { "accept": "application/json; odata=verbose" },
            success: function (data) {
                var nice = data.body;
            },
            error: function (err) {
                alert(JSON.stringify(err));
            }
        }
    );
}

function doSearch() {
    var searchRestSource = _spPageContextInfo.webAbsoluteUrl + "/_api/search/query?querytext='"
        + $get('searchText').value + "'"
        + "&rowlimit=500";

    $.ajax(
           {
               url: searchRestSource,
               method: "GET",
               headers: {
                   "accept": "application/json; odata=verbose",
               },
               success: function (data) {
                   if (data.d.query.PrimaryQueryResult.RelevantResults.RowCount > 0)
                   {
                       convertResults(data);
                       var displayColumns = getDisplayManagedProperties();
                       var columnDefs = [];

                       for (var h = 0; h < resultColumns.length; h++) {
                           var columns = $.grep(displayColumns, function (e) {
                               return e == resultColumns[h].sTitle;
                           });

                           if (columns.length > 0)
                               columnDefs.push({ "bVisible": true, "aTargets": [h] });
                           else
                               columnDefs.push({ "bSearchable": false, "bVisible": false, "aTargets": [h] });
                               
                       }
                       
                       var oTable = $('#searchResults').dataTable({
                           "bDestroy": true,
                           "aoColumnDefs": columnDefs,
                           "bStateSave":false,
                           "bPaginate": true,
                           "bLengthChange": true,
                           "bFilter": false,
                           "bSort": true,
                           "bInfo": true,
                           "bAutoWidth": false,
                           "aaData": results,
                           "aoColumns": resultColumns
                       });

                   }
                   else
                   {
                       $('#searchResults').dataTable().fnClearTable();
                   }
                   
               },
               error: function (err) {
                   alert(JSON.stringify(err));
               },
           }
       );

}


function getSearchSchemaNotSupported() {
    var webServiceURL = _spPageContextInfo.webAbsoluteUrl + "/_vti_bin/search.asmx?op=GetSearchMetadata";
    var schemaSoapMessage = '<soap12:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap12="http://www.w3.org/2003/05/soap-envelope"><soap12:Body><GetSearchMetadata xmlns="http://microsoft.com/webservices/OfficeServer/QueryService" /></soap12:Body></soap12:Envelope>';
    $.ajax({
        url: webServiceURL,
        type: "POST",
        dataType: "xml",
        data: schemaSoapMessage,
        contentType: "text/xml; charset=\"utf-8\"",
        success: function (data) {
            var nice = data;
        },
        error: function (err) {
            alert(JSON.stringify(err));
        }
    });

    return false;
}


function getSearchSchema() {
    var searchRestSource = _spPageContextInfo.webAbsoluteUrl + "/_api/search/query?querytext='"
        + "Microsoft" + "'"
        + "&rowlimit=1";

    $.ajax(
           {
               url: searchRestSource,
               method: "GET",
               headers: {
                   "accept": "application/json; odata=verbose",
               },
               success: function (data) {
                   if (data.d.query.PrimaryQueryResult.RelevantResults.RowCount > 0) {                      
                       setManagedProperties(data);
                   }
                 
               },
               error: function (err) {
                   alert(JSON.stringify(err));
               },
           }
       );

}

function addManagedProperty() {
    var compCol =  $("#managedProperties option:selected").text();
    var exists = false;

    $('#selectedManagedProperties option').each(function () {
        if (this.value == compCol) {
            exists = true;
        }
    });

    if (exists == false)
    {
        var options = $("#selectedManagedProperties");
        options.append("<option>" + $("#managedProperties option:selected").text() + "</option>");

    }
        
}
function removeManagedProperty() {

    $("#selectedManagedProperties option:selected").remove();

}


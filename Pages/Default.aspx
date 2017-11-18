<%-- The following 4 lines are ASP.NET directives needed when using SharePoint components --%>
<%@ Page Inherits="Microsoft.SharePoint.WebPartPages.WebPartPage, Microsoft.SharePoint, Version=15.0.0.0, Culture=neutral, PublicKeyToken=71e9bce111e9429c" MasterPageFile="~masterurl/default.master" language="C#" %>
<%@ Register Tagprefix="SharePoint" Namespace="Microsoft.SharePoint.WebControls" Assembly="Microsoft.SharePoint, Version=15.0.0.0, Culture=neutral, PublicKeyToken=71e9bce111e9429c" %>
<%@ Register Tagprefix="Utilities" Namespace="Microsoft.SharePoint.Utilities" Assembly="Microsoft.SharePoint, Version=15.0.0.0, Culture=neutral, PublicKeyToken=71e9bce111e9429c" %>
<%@ Register Tagprefix="WebPartPages" Namespace="Microsoft.SharePoint.WebPartPages" Assembly="Microsoft.SharePoint, Version=15.0.0.0, Culture=neutral, PublicKeyToken=71e9bce111e9429c" %>

<%-- The markup and script in the following Content element will be placed in the <head> of the page --%>
<asp:Content ContentPlaceHolderId="PlaceHolderAdditionalPageHead" runat="server">
    <script type="text/javascript" src="../Scripts/jquery-1.7.1.min.js"></script>
    <script type="text/javascript" src="../Scripts/jquery.dataTables.min.js"></script>

    <!-- Add your CSS styles to the following file -->
    <link rel="Stylesheet" type="text/css" href="../Content/App.css" />
    <link rel="Stylesheet" type="text/css" href="../Content/demo_page.css" />
    <link rel="Stylesheet" type="text/css" href="../Content/demo_table.css" />
    <link rel="Stylesheet" type="text/css" href="../Content/jquery-ui-1.8.4.custom.css" />
   

    <!-- Add your JavaScript to the following file -->
    <script type="text/javascript" src="../Scripts/App.js"></script>

    <!-- The following script runs when the DOM is ready. The inline code uses a SharePoint feature to ensure -->
    <!-- The SharePoint script file sp.js is loaded and will then execute the sharePointReady() function in App.js -->
    <script type="text/javascript">
        $(document).ready(function () {
            SP.SOD.executeFunc('sp.js', 'SP.ClientContext', function () { sharePointReady(); });
            getSearchSchema();
        });
      
    </script>
</asp:Content>

<%-- The markup and script in the following Content element will be placed in the <body> of the page --%>
<asp:Content ContentPlaceHolderId="PlaceHolderMain" runat="server">

    <div style="margin:10px">
        <table>
            <tr>
                <td><input type="text" id="searchText" />
                    <input type="button" id="search" value="Search" onclick="doSearch()" />
                </td>
                <td><p><label>Managed Properties</label></p><select id="managedProperties" size="10" style="width:230px"/></td>
                <td>
                    <table cellspacing="10">
                        <tr><td><input type="button" id="addProp" value="Add" onclick="addManagedProperty()"/></td></tr>
                        <tr><td><input type="button" id="removeProp" value="Remove" onclick="removeManagedProperty();"/></td></tr>
                    </table>  
                </td>
                <td><p><label>Result Columns</label></p><select id="selectedManagedProperties" size="10" style="width:230px"/></td>
            </tr>
        </table>       
    </div>
    <div>
       <table id="searchResults" class="display" style="max-width:none">
         
      </table>
    </div>
      
</asp:Content>

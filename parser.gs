function docParser(newDriveFileId, parserpayload) {

  var mimeType = DriveApp.getFileById(newDriveFileId).getMimeType(); // 'application/vnd.google-apps.document'

  if (mimeType == 'application/vnd.google-apps.document') {
      Logger.log("Got to doc find and replace")
      var revisedDocumentFile = DocumentApp.openById(newDriveFileId);
      for (var i in parserpayload) {
      var regexer = parserpayload[i].toString().split('::');
      revisedDocumentFile.getBody().replaceText('(\W|)'+regexer[0]+'(\W|)', regexer[1]);
    } 
  revisedDocumentFile.saveAndClose();  
  return revisedDocumentFile.getBlob();
  }
  else if (mimeType == 'application/vnd.google-apps.spreadsheet') {
      Logger.log("Got to spreadsheet find and replace")
      var revisedSpreadsheetFile = SpreadsheetApp.openById(newDriveFileId);

      sheetlist = revisedSpreadsheetFile.getSheets();

      for (var sheet = 0; sheet < revisedSpreadsheetFile.getSheets().length ; sheet++ ) {        
        var thissheet = revisedSpreadsheetFile.getSheetByName(sheetlist[sheet].getSheetName());
        for (var parse = 0 ; parse < parserpayload.length ; parse++) {
          var regexer = parserpayload[parse].toString().split('::');
          sheetParser(thissheet, regexer[0], regexer[1]);
          revisedSpreadsheetFile.waitForAllDataExecutionsCompletion;
          // sheets really make me nervous sometimes:
          Utilities.sleep(1000);
          } 
      }

    // spreadsheets seem 'hot' so let's reopen the file handle and get latest blob
    hotfile = DriveApp.getFileById(newDriveFileId);
    return hotfile.getBlob();
    
    }

}

function sheetParser(sheet, to_replace, replace_with) {
  //get the current data range values as an array
  var values = sheet.getDataRange().getValues();

  //loop over the rows in the array
  for(var row in values){

    //use Array.map to execute a replace call on each of the cells in the row.
    var replaced_values = values[row].map(function(original_value){
      return original_value.toString().replace(to_replace,replace_with);
    });

    //replace the original row values with the replaced values
    values[row] = replaced_values;
  }

  //write the updated values to the sheet
  sheet.getDataRange().setValues(values);
}
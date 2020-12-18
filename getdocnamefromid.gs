function getFileName(e) {
  
  var theSource =       e.source;
  var theSheet =        theSource.getActiveSheet();
  var theActiveRange =  theSheet.getActiveRange();
  var theActiveRow =    theActiveRange.getRow();

  var thisDocID = theSheet.getRange(theActiveRow,2).getValue();
  var thisDocName = DriveApp.getFileById(thisDocID).getName();
  var thisDocType = DriveApp.getFileById(thisDocID).getMimeType();
  
  if (thisDocName.toUpperCase().indexOf("[EXTERNAL]") > -1) {

    theSheet.getRange(theActiveRow,4).setValue(thisDocName);
    theSheet.getRange(theActiveRow,5).setValue(thisDocType);
    theSheet.getRange(theActiveRow,9).setValue("Accepted");

  } else {

    theSheet.getRange(theActiveRow,4).setValue("FAILURE");
    theSheet.getRange(theActiveRow,5).setValue(thisDocType);
    theSheet.getRange(theActiveRow,9).setValue("Rejected");

  }


}

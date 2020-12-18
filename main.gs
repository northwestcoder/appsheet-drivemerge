function main(e) {

var FARMODE = false;

var theSource =       e.source;
var theSheet =        theSource.getActiveSheet();
var theActiveRange =  theSheet.getActiveRange();
var theActiveRow =    theActiveRange.getRow();

// this entire next section solves for people rearranging columns in their Google Sheet. 
// Instead of hardwiring column numbers, we refer them by name by creating a dictionary of columnsname:numbers
// The names below are those we expect from the Appsheet app's Google Sheet data source
// some of them are arrays that we split - also see columndictionary.gs

// there are also various hardwired strings in the code below which correlate to the companion Appsheet app for this example

for (i in requiredColumns) {
  columnMap[i] = getColumnNumberByName(theSheet,requiredColumns[i]);
}
var theemailsubject =            theSheet.getRange(theActiveRow,columnMap["Request Subject"]).getValue();
var fromemail =                  theSheet.getRange(theActiveRow,columnMap["RequestedBy"]).getValue();
var toemail =                    theSheet.getRange(theActiveRow,columnMap["SendTo"]).getValue();
var lastSent =                   theSheet.getRange(theActiveRow,columnMap["LastSent"]).getValue();
var documentList =               theSheet.getRange(theActiveRow,columnMap["DocumentList"]).getValue().split(" , ");
var documentNames =              theSheet.getRange(theActiveRow,columnMap["DocumentNames"]).getValue().split(" , ");
var zippedOrNot =                theSheet.getRange(theActiveRow,columnMap["AttachmentType"]).getValue();
var inboundEmailBody =           theSheet.getRange(theActiveRow,columnMap["EmailBody"]).getValue();
var documentDescriptions =       theSheet.getRange(theActiveRow,columnMap["DocumentDescriptions"]).getValue().split(" , ");
var ludicrousMode =              theSheet.getRange(theActiveRow,columnMap["Ludicrous Mode"]).getValue();
var findAndReplace =             theSheet.getRange(theActiveRow,columnMap["FindAndReplace"]).getValue().split("\n");
var outputFolder =               theSheet.getRange(theActiveRow,columnMap["OutputFolder"]).getValue();
var emaillinks =                 theSheet.getRange(theActiveRow,columnMap["Links"]).getValue().split(" , ");
var emaillinknames =             theSheet.getRange(theActiveRow,columnMap["LinkNames"]).getValue().split(" , ");
var emaillinkdetails =           theSheet.getRange(theActiveRow,columnMap["LinkDescriptions"]).getValue().split(" , ");
// ok we're finished getting colummn values using named columns


// if we are doing find/replace aka ludicrous mode we also need the following
if (ludicrousMode == "ON" && outputFolder.length > 0) {
  FARMODE = true;
  var destinationFolder =     DriveApp.getFolderById(outputFolder);
  var fileDatestampPart =     new Date().toLocaleDateString();
  var fileTimestampPart=      new Date().toLocaleTimeString();
  var fileTimestamp =         fileDatestampPart + " " + fileTimestampPart;
}

// main checkpoint
if (lastSent == "SENDING EMAIL" && fromemail.length > 0 && toemail.length > 0) {
      Logger.log("we have a send request")

    // if there is at least one document reference, launch our various file-related stuff
    // else skip to email and attach any links
        if (documentList[0].length > 0) {
        var blobs = [];
          for (var i in documentList) {

            thisfile = DriveApp.getFileById(documentList[i]);
            thisfileMimeType = DriveApp.getFileById(documentList[i]).getMimeType();
            thisFileName = thisfile.getName();

              // server side check to ensure we only ever send files whose name contains '[External]'
              if( thisFileName.toUpperCase().indexOf('[EXTERNAL]') > -1) { 

                  // only going to run find/replace on Google Docs currently
                  if ( FARMODE && (thisfileMimeType == 'application/vnd.google-apps.document' ||
                                  thisfileMimeType == 'application/vnd.google-apps.spreadsheet')
                  ) {
                      var newDriveFile = thisfile.makeCopy(thisFileName + " " + fileTimestamp, destinationFolder);
                      var newDriveFileId = newDriveFile.getId();
                      Logger.log("We're going to find/replace now")
                      parseResult = docParser(newDriveFileId, findAndReplace);
                      blobs.push(parseResult);
                  }  else {
                      Logger.log("No find/replace was found")
                      blobs.push(thisfile.getBlob());
                  }
              } else {
                Logger.log("Skipped " + thisFileName + " as it did not include the phrase '[External]'");
              }
          }
        }

    // generate an email
    var emailbody = createEmailBody(inboundEmailBody, 
                                    documentNames, 
                                    documentDescriptions, 
                                    emaillinks, 
                                    emaillinknames, 
                                    emaillinkdetails);
                                    
    if (zippedOrNot == "Zipped PDF's" ) {
      var zippedBlobs = Utilities.zip(blobs,'yourfiles.zip');
      sendNotification(theemailsubject, fromemail, toemail, zippedBlobs, emailbody);
      } 
    else {
      sendNotification(theemailsubject, fromemail, toemail, blobs, emailbody);
      }

    // once we're done, let's set this row/cell value back from "SENDING EMAIL" to "Pending"
    theSheet.getRange(theActiveRow,6).setValue("Pending");

    }

else {
    Logger.log("no action taken");
}

}



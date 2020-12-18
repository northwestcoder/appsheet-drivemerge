// the column names - in any order - that we expect from the Google Sheet

var requiredColumns = [
  'Request Subject',
  'RequestedOn',
  'RequestedBy',
  'SendTo', 
  'LastSent', 
  'ReasonCode', 
  'DocumentList', 
  'DocumentNames',  
  'AttachmentType', 
  'Category', 
  'EmailBody',  
  'DocumentDescriptions', 
  'RequestIsActive',  
  'Ludicrous Mode', 
  'FindAndReplace', 
  'OutputFolder', 
  'Links',  
  'LinkNames',  
  'LinkDescriptions'
  ];

var columnMap = {};

function getColumnNumberByName(sheet, name) {

  var range = sheet.getRange(1, 1, 1, sheet.getMaxColumns());
  var values = range.getValues();
  for (var row in values) {
    for (var col in values[row]) {
      if (values[row][col] == name) {
        columnMap[name] = parseInt(col)+1;
      }
    }
  }
}
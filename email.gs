// returns our final email, will error on gmail max attachments > 25mb
// a lot of hardwired html in here.. but it could be worse.

function sendNotification(theemailsubject, fromemail, toemail, attachmentFiles, emailbody) {
Logger.log("sending email now");
GmailApp.sendEmail(toemail, theemailsubject, '', {
                  replyTo: fromemail,
                  htmlBody: emailbody,
                  attachments: attachmentFiles
} )
}

function createEmailBody(inboundEmailBody, 
                        documentNames, 
                        documentDescriptions, 
                        emaillinks, 
                        emaillinknames, 
                        emaillinkdetails) {

      var outboundEmailBody = inboundEmailBody.replace(/\n/g, '<br/>');

if(emaillinks.length > 0) {

}

      if(emaillinks[0].length > 0) {
      outboundEmailBody += createLinkTable(emaillinks, emaillinknames, emaillinkdetails);
      }

      if(documentNames[0].length > 0) {
        outboundEmailBody += `<br/><br/><br/><b>List of files attached here individually or as a zip file:</b><br/><br/>`;  
        for (var i in documentNames) {

        outboundEmailBody += "<i>" + documentNames[i] + "</i> - ";
        outboundEmailBody += documentDescriptions[i];
        outboundEmailBody += "<br/><br/>";
        }
    }

      outboundEmailBody += `<br/><br/><br/><p style='color:#4286F5;font-size:10px;'>
      <img width='32' height='32' src='https://yt3.ggpht.com/ytc/AAUvwngsr0BRSNUF23KEwnFrdMZk6rK38VkVaXCFPhIqlA=s900-c-k-c0x00ffffff-no-rj'/>
      <br/><i>This email was generated with Google Workspace and the Appsheet no-code platform.</i></p><br/><br/>`;

      return outboundEmailBody

}


function createLinkTable(emaillinks, emaillinknames, emaillinkdetails) {

    var finallinktable = `
    <br/><br/><br/>
    <b>Some links that you might be interested in:</b><br/><br/>
    <table>
    <tr>
    <td>Name</td>
    <td>Details</td>
    </tr>
    `;

    for (var i in emaillinks) {
    finallinktable += "<tr>";
    finallinktable += "<td><a href="+ emaillinks[i] + ">" + emaillinknames[i] + "</a></td>";
    finallinktable += "<td>" + emaillinkdetails[i] + "</td></tr>";
    }

    finallinktable += "</table>";
    return finallinktable

}
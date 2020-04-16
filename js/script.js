function fadeInPage() {
    if(!window.AnimationEvent) { return; }
    var fader = document.getElementById('fader');
    fader.classList.add('fade-out');
}

document.addEventListener('DOMContentLoaded', function() {
    if (!window.AnimationEvent) { return; }
    var anchors = document.getElementsByTagName('a');
    
    for (var idx=0; idx<anchors.length; idx+=1) {
        if (anchors[idx].hostname !== window.location.hostname ||
            anchors[idx].pathname === window.location.pathname) {
            continue;
        }
        anchors[idx].addEventListener('click', function(event) {
            var fader = document.getElementById('fader'),
                anchor = event.currentTarget;
            
            var listener = function() {
                window.location = anchor.href;
                fader.removeEventListener('animationend', listener);
            };
            fader.addEventListener('animationend', listener);
            
            event.preventDefault();
            fader.classList.add('fade-in');
        });
    }
});

document.getElementById('issueInputForm').addEventListener('submit', saveIssue);

  function saveIssue(e) {
    var issueId = chance.guid();
    var issueDesc = document.getElementById('issueDescInput').value;
    var issueSeverity = document.getElementById('issueSeverityInput').value;
    var issueAssignedTo = document.getElementById('issueAssignedToInput').value;
    var issueStatus = 'Open';
    var issue = {
      id: issueId,
      description: issueDesc,
      severity: issueSeverity,
      assigned: issueAssignedTo,
      status: issueStatus
    }
    
    if (localStorage.getItem('issues') === null) {
      var issues = [];
      issues.push(issue);
      localStorage.setItem('issues', JSON.stringify(issues));
    } else {
      var issues = JSON.parse(localStorage.getItem('issues'));
      issues.push(issue);
      localStorage.setItem('issues', JSON.stringify(issues));
    }
    
    document.getElementById('issueInputForm').reset();
   
    fetchIssues();
    
    e.preventDefault(); 
  }

  
  function setStatusClosed (id) {
    var issues = JSON.parse(localStorage.getItem('issues'));
    
    for(var i = 0; i < issues.length; i++) {
      if (issues[i].id == id) {
        issues[i].status = "Closed";
      }
    }
      
    localStorage.setItem('issues', JSON.stringify(issues));
    
    fetchIssues();
  }

  function deleteIssue (id) {
    var issues = JSON.parse(localStorage.getItem('issues'));
    
    for(var i = 0; i < issues.length; i++) {
      if (issues[i].id == id) {
        issues.splice(i, 1);
      }
    }
    
    localStorage.setItem('issues', JSON.stringify(issues));
    
    fetchIssues();
  }

  function fetchDatabaseInfo (database) {
    //Data Object Change Listener
    const preObject = document.getElementById('issuesList');
    const dbRefObject = database.ref().child('issues');
    
    dbRefObject.on('value', function(snap) {
        snap.forEach(function(childNodes){
            preObject.innerHTML +=   '<div class="well">'+
            '<hr>' +
            '<h6>Issue ID: ' + childNodes.val().issueId + '</h6>'+
            '<p><span class="label label-info">' + childNodes.val().issueStatu + '</span></p>'+
            '<h3>' + childNodes.val().issueDesc + '</h3>'+
            '<p><span class="glyphicon glyphicon-time"></span> ' + childNodes.val().issueSeverity + ' | '+
            '<span class="glyphicon glyphicon-user"></span> ' + childNodes.val().issueAssignedTo + '</p>'+
            '<a href="#content" class="btn btn-warning js-scroll-trigger" onclick="setStatusClosed(\''+childNodes.val().issueId+'\')">Close</a> '+
            '<a href="#content" class="btn btn-danger js-scroll-trigger" onclick="deleteIssue(\''+childNodes.val().issueId+'\')">Delete</a>'+
            '<hr><br>' +
            '</div>';
        })    
    }, function(error) {
      // The fetch failed.
      console.error(error);
    }); 
  }

  function writeToDatabase (issue, database) {

  }
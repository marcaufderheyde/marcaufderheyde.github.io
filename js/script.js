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

function fetchIssuesFirebase () {
    var issues = firebase.database().ref('issues').once('value');
    var issuesList = document.getElementById('issuesList');
    
    issuesList.innerHTML = '';
    
    for (var i = 0; i < issues.length; i++) {
      var id = issues[i].id;
      var desc = issues[i].description;
      var severity = issues[i].severity;
      var assignedTo = issues[i].assignedTo;
      var status = issues[i].status;
      
      issuesList.innerHTML +=   '<div class="well">'+
                                '<h6>Issue ID: ' + id + '</h6>'+
                                '<p><span class="label label-info">' + status + '</span></p>'+
                                '<h3>' + desc + '</h3>'+
                                '<p><span class="glyphicon glyphicon-time"></span> ' + severity + ' '+
                                '<span class="glyphicon glyphicon-user"></span> ' + assignedTo + '</p>'+
                                '<a href="#content" class="btn btn-warning js-scroll-trigger" onclick="setStatusClosedFirebase(\''+id+'\')">Close</a> '+
                                '<a href="#content" class="btn btn-danger js-scroll-trigger" onclick="deleteIssueFirebase(\''+id+'\')">Delete</a>'+
                                '</div>';
    }
  }

document.getElementById('issueInputForm').addEventListener('submit', saveToFirebaseIssue());

  function saveToFirebaseIssue(e) {
    var issueId = chance.guid();
    var issueDesc = document.getElementById('issueDescInput').value;
    var issueSeverity = document.getElementById('issueSeverityInput').value;
    var issueAssignedTo = document.getElementById('issueAssignedToInput').value;
    var issueStatus = 'Open';
    var issue = {
      id: issueId,
      description: issueDesc,
      severity: issueSeverity,
      assignedTo: issueAssignedTo,
      status: issueStatus
    }
    if(firebase.database().ref('issues').once('value') == Null) {
        var issues = []
        issues.push(issue)
        firebase.database().ref('issues').push().set(issues).then(function(snapshot) {
            print("Success!")
        }, function(error) {
            console.log('error' + error);
        });
    }
    else {
        var issues = firebase.database().ref('issues').once('value')
        issues.push(issue);
        firebase.database().ref('issues').push().set(issues);
    }

    document.getElementById('issueInputForm').reset();
   
    fetchIssuesFirebase();
    
    e.preventDefault();
}

saveToFirebaseIssue(e)
  
  function setStatusClosedFirebase (id) {
    var issues = firebase.database().ref('issues').once('value');
    
    for(var i = 0; i < issues.length; i++) {
      if (issues[i].id == id) {
        issues[i].status = "Closed";
      }
    }
      
    firebase.database().ref('issues').push().set(issues);
    
    fetchIssuesFirebase();
  }

  function deleteIssueFirebase (id) {
    var issues = firebase.database().ref('issues').once('value');
    
    for(var i = 0; i < issues.length; i++) {
      if (issues[i].id == id) {
        issues.splice(i, 1);
      }
    }
    
    firebase.database().ref('issues').push().set(issues);
    
    fetchIssuesFirebase();
  }

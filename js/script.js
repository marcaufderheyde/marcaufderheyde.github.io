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


// Your web app's Firebase configuration
function firebaseSetup() {
    var firebaseConfig = {
        apiKey: "AIzaSyDOz6IE7U5GTnsUA4k2y0VSgOpQdND8J2Q",
        authDomain: "aufderheyde-4fbae.firebaseapp.com",
        databaseURL: "https://aufderheyde-4fbae.firebaseio.com",
        projectId: "aufderheyde-4fbae",
        storageBucket: "aufderheyde-4fbae.appspot.com",
        messagingSenderId: "392147905138",
        appId: "1:392147905138:web:f6d47f074a1b8f916230eb",
        measurementId: "G-7NZJ6HL34T"
    };
    // Initialize Firebase
    firebase.initializeApp(firebaseConfig);
    var database = firebase.database();
    return database;
}

function loginDetails() {
  // Get Login elements
  const txtEmail = document.getElementById('txtEmail');
  const txtPassword = document.getElementById('txtPassword');
  const btnLogin = document.getElementById('btnLogin');
  const btnSignUp = document.getElementById('btnSignUp');
  const btnLogout = document.getElementById('btnLogout');

  // Add login event
  btnLogin.addEventListener('click', e => {
    const email = txtEmail.value;
    const pass = txtPassword.value;
    const auth = firebase.auth();
    const promise = auth.signInWithEmailAndPassword(email, pass);
    promise.catch(e => console.log(e.message));
  });

  // Add signup event
  btnSignUp.addEventListener('click', e => {
    // TODO: Check that emil is input
    const email = txtEmail.value;
    const pass = txtPassword.value;
    const auth = firebase.auth();
    const promise = auth.createUserWithEmailAndPassword(email, pass);
    promise.catch(e => console.log(e.message));
  });

  btnLogout.addEventListener('click', e => {
    firebase.auth().signOut();
  });

  // Add a realtime Listener
  firebase.auth().onAuthStateChanged(firebaseUser => {
    if(firebaseUser) {
      document.getElementById('issueInput').innerHTML = '<h3>Add New Issue:</h3><form id="issueInputForm"><div class="form-group"><label for="issueDescInput">Description</label><input type="text" class="form-control" id="issueDescInput" placeholder="Describe the issue ..."></div><div class="form-group"><label for="issueDescInput">Severity</label><select class="form-control" id="issueSeverityInput"><option value="Low">Low</option><option value="Medium">Medium</option><option value="High">High</option></select></div><div class="form-group"><label for="issueDescInput">Assigned To</label><input type="text" class="form-control" id="issueAssignedToInput" placeholder="Enter responsible ..."></div><button type="submit" class="btn btn-primary">Add</button>';
      document.getElementById('btnLogout').innerHTML = '<button id="btnSignUp" class="btn btn-danger">Log out</button>';
      document.getElementById('issueInputForm').addEventListener('submit', saveIssue);
    } else {
      console.log('not logged in');
      document.getElementById('issueInput').innerHTML = '<h3>Current Issues:</h3>';
      document.getElementById('btnLogout').innerHTML = '<button id="btnSignUp" class="btn btn-danger" hidden>Log out</button>';
    }
  });
}

  function saveIssue(e) {
    var issueId = chance.guid();
    var issueDesc = document.getElementById('issueDescInput').value;
    var issueSeverity = document.getElementById('issueSeverityInput').value;
    var issueAssignedTo = document.getElementById('issueAssignedToInput').value;
    var issueStatus = 'Open';
    database.ref().child('issues').push({
        issueId: issueId,
        issueDesc: issueDesc,
        issueSeverity: issueSeverity,
        issueAssignedTo: issueAssignedTo,
        issueStatus: issueStatus
    })
    document.getElementById('issueInputForm').reset();
   
    fetchDatabaseInfo();
    
    e.preventDefault(); 
  }

  
  function setStatusClosed (key) {
    database.ref().child('issues').orderByKey().equalTo(key).on('value', function(snapshot) {
        console.log(snapshot.val()[key]);
    })
    var updates = {};
    updates['/issues/' + key + '/issueStatus'] = 'Closed';
    database.ref().update(updates)
    fetchDatabaseInfo();
  }

  function deleteIssue (key) {
    database.ref('/issues/' + key).remove();
    fetchDatabaseInfo();
  }

  function fetchDatabaseInfo (database) {
    //Data Object Change Listener
    const preObject = document.getElementById('issuesList');
    const dbRefObject = database.ref().child('issues');
    preObject.innerHTML = "";
    dbRefObject.on('value', function(snap) {
        snap.forEach(function(childNodes){
            preObject.innerHTML +=   '<div class="well">'+
            '<hr>' +
            '<h6>Issue ID: ' + childNodes.val().issueId + '</h6>'+
            '<p><span class="label label-info">' + childNodes.val().issueStatus + '</span></p>'+
            '<h3>' + childNodes.val().issueDesc + '</h3>'+
            '<p><span class="glyphicon glyphicon-time"></span> ' + childNodes.val().issueSeverity + ' | '+
            '<span class="glyphicon glyphicon-user"></span> ' + childNodes.val().issueAssignedTo + '</p>'+
            '<a href="#content" class="btn btn-warning js-scroll-trigger" onclick="setStatusClosed(\''+childNodes.key+'\')">Close</a> '+
            '<a href="#content" class="btn btn-danger js-scroll-trigger" onclick="deleteIssue(\''+childNodes.key+'\')">Delete</a>'+
            '<hr><br>' +
            '</div>';
        })    
    }, function(error) {
      // The fetch failed.
      console.error(error);
    }); 
  }

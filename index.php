<html>
<head>
	<title>aufderheyde.me</title>
	<link rel=stylesheet type="text/css" href="style1.css">
	<meta name="viewport" content="width=device-width, initial-scale=1" /> 
	</head>
<body>
	<center><h1>What's cracking?</h1></center>
	<div id="menu">
	<ul>
	  <b><li><a href="index.html">Home</a></li></b>
	  <li><a href="marc.html">Marc</a></li>
	  <li><a href="sorting.html">Sorting algorithms in Java</a></li>
	  <li><a href="login.html">Login</a></li>
	</ul>
	</div>

<div id="sensitive"></div>

    <?php
    echo "
    <script type="text/javascript">
		var baseUrl = 'https://dev-329155.okta.com';
		var xhr = new XMLHttpRequest();
		if ("withCredentials" in xhr) {
			xhr.onerror = function() {
				alert('Invalid URL or Cross-Origin Request Blocked.  You must explicitly add this site (' + window.location.origin + ') to the list of allowed websites in the administrator UI');
		}
		xhr.onload = function() {
			var data = this.responseText;
			var jsonResponse = JSON.parse(data);
			if (jsonResponse["status"] == "ACTIVE") {
				document.getElementById("sensitive").innerHTML = "<pre><code>You are now logged into aufderheyde.me<br>Thank you for taking your time to visit this website.<br>If you have noticed any bugs or issues with the website,<br>Please contact Marc at marcaufderheyde@gmail.com.<br>Thank you :)<br>Will hopefully make a lot of cool things be happening here soon!<br>- Marc</code></pre>";
			}
			else{
				document.getElementById("sensitive").innerHTML = "<pre><code>Please login for full site access.</code></pre>";
			}
		};
		xhr.open('GET', baseUrl + '/api/v1/sessions/me', true);
		xhr.withCredentials = true;
		xhr.send();
	} else {
		alert("CORS is not supported for this browser!")
	}

    </script>
    ";
    ?>

	<center><img src="goofy.JPG" alt="This is a picture of my father and me."></center>
</body>
</html>
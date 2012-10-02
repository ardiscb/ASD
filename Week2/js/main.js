/*
Author: Courtney Ardis 
Project: ASD Project 2
Term: 1210
*/

$('#home').on('pageinit', function(){
	//code needed for home page goes here

});	
		
$('#addItem').on('pageinit', function(){
		delete $.validator.methods.date;
		var myForm = $('#comicForm');
		    myForm.validate({
			invalidHandler: function(form, validator) {
			},
			submitHandler: function() {
		var data = myForm.serializeArray();
			storeData(this.key);
		}
	});
	
	//any other code needed for addItem page goes here

 	//Variable defaults
	 var //comicGenre = ["--Choose A Genre--", "Superhero", "Horror", "Sci-Fi", "Western", "Romance"],
		styleValue,
		errMsg = $('#errors');

	//Find value of the selected radio button for the storeData function
	var getSelectedRadio = function(){
		var radios = $('#illStyle');
		for(var i=0; i<radios.length; i++){
			if(radios[i].checked){
				styleValue = radios[i].val();
			}
		}
	};

	//Auto Popluate Local Storage
	var autofillData = function (){
		//The actual JSON OBJECT data required for this to work is coming from our json.js file, which is loaded from our HTML page
		//Store JSON OBJECT into Local Storage
		for(var n in json){
			var id = Math.floor(Math.random()*100000000001);
			localStorage.setItem(id, JSON.stringify(json[n]));
		}
	};

	//Get the image for the right category
	var getImage = function(catName, makeSubList){
		var imageLi = $('<li>');
		makeSubList.appendTo(imageLi);
		var newImg = $('<img>');
		var setSrc = newImg.attr("src", "images/" + catName + ".png");
		newImg.appendTo(imageLi);
	};

	var getData = function(){
		if(localStorage.length === 0){
			alert("There is no data in Local Storage so default data was added.");
			autofillData();
		}
		//Write Data from Local Storage to the browser
		var makeDiv = $('#data');
		var makeList = $('<ul>'); 
		makeList.appendTo(makeDiv);
		for(var i=0, j=localStorage.length; i<j; i++){
			var makeLi = $('<li>');
			var linksLi = $('<li>');
			makeLi.appendTo(makeList);
			var key = localStorage.key(i);
			var value = localStorage.getItem(key);
			//Convert the string from local storage value back to an object by using JSON.parse()
			var obj = JSON.parse(value);
			var makeSubList = $('<ul>');
			makeLi.appendTo(makeSubList);
			getImage(obj.genre[1], makeSubList);
			for (var n in obj){
				var makeSubLi = $('<li>');
				makeSubLi.appendTo(makeSubList);
				var optSubText = obj[n][0] + " " + obj[n][1];
				makeSubLi.html(optSubText);
				linksLi.appendTo(makeSubList);
			}
			makeItemLinks(localStorage.key(i), linksLi);//Function call for our edit and delete buttons/links
		}
	};

	var storeData = function(key){
		//If there is no key, this is a brand new item and we need to generate a key
		if(!key){
			var id    			= Math.floor(Math.random()*100000000001);	
		}else{
			//Set the id to the existing key that we are editing so that it will save over the data
			//The key is the same key that's been passed along from the editSubmit event
			//to the validate function, and then passed here, into the storeData function
			id = key;
		}
		//Gather up all our form field values and store in an object
		//Object properties contain an array with the form label and input value
		getSelectedRadio();
		var item 				= {};
			item.comicTitle		= ["Title of Comic:", $('#comicTitle').val()];
			item.seriesTitle	= ["Title of Series:", $('#seriesTitle').val()];
			item.issueNum		= ["Issue Number:", $('#issueNum').val()];
			item.dateReleased	= ["Date Released:", $('#dateReleased').val()];
			item.publisher		= ["Publisher:", $('#publisher').val()];
			item.rateIssue		= ["Rate of Issue:", $('#rateIssue').val()];
			item.genre 			= ["Genre:", $('#genre').val()];
			item.illStyle		= ["Illustration Style:", styleValue];
			item.comments		= ["Comments:", $('#comments').val()];
		//Save data into Local Storage: Use Stringify to convert our object to a string
		localStorage.setItem(id, JSON.stringify(item));
		alert("Comic saved to index!");
	}; 

	//Make Item Links
	//Create the edit and delete links for each stored item when displayed
	var makeItemLinks = function(key, linksLi){
		//add edit single item link
		var editLink = $('<a>');
		editLink.href = $("#addItem");
		editLink.key = key;
		var editText = "Edit Comic";
		editLink.on("click", editItem)
				.html(editText)
				.appendTo(linksLi);

		//add line break for links
		var breakTag = $('<br>');
		breakTag.appendTo(linksLi);

		//add delete single item link
		var deleteLink = $('<a>');
		deleteLink.attr("id", "deleteA")
		deleteLink.href = "#";
		deleteLink.key = key;
		var deleteText = "Delete Comic";
		deleteLink.on("click", deleteItem)
				  .html(deleteText)
				  .appendTo(linksLi);

		//Creates a horizontal line/separator after each item
		var hr = $('<hr>');
		hr.appendTo(linksLi);
	};

	var	editItem = function (){
		//Grab the data from our item in Local Storage
		var value = localStorage.getItem(this.key);
		var item = JSON.parse(value);

		//populate the form fields with current Local Storage values
		$('#comicTitle').val() 	= item.comicTitle[1];
		$('#seriesTitle').val() 	= item.seriesTitle[1];
		$('#issueNum').val() 	= item.issueNum[1];
		$('#dateReleased').val() = item.dateReleased[1];
		$('#publisher').val() 	= item.publisher[1];
		$('#rateIssue').val() 	= item.rateIssue[1];
		$('#genre').val() 		= item.genre[1];
		var radios = $('#illStyle');
		for(var i=0; i<radios.length; i++){		
			if(radios[i].val() == "Full Color" && item.illStyle[1] == "Full Color"){
				radios[i].attr("checked", "checked");
			}else if(radios[i].val() == "Black & White" && item.illStyle[1] == "Black & White"){
				radios[i].attr("checked", "checked");
			}else if(radios[i].val() == "Combination" && item.illStyle[1] == "Combination"){
				radios[i].attr("checked", "checked");
			}
		}
		$('#comments').val() 	= item.comments[1];

		//Remove the initial listener from the input 'save comic' button
		//Change Submit button value to Edit button
		$('#submit').val() = "Edit Comic";
		var editSubmit = $('#submit');
		//Save the key value established in this function as a property of the editSubmit event
		//so we can use that value when we save the data we edited
	 	editSubmit.on("click", storeData)
	 			  .key(this.key);
	};

	var	deleteItem = function (){
		var ask = confirm("Are you sure you want to delete this comic?");
		if(ask){
			localStorage.removeItem(this.key);
			alert("Comic was deleted!");
			window.location.reload();
		}else{
			alert("Comic was NOT deleted!");
		}		
	};
						
	var clearLocal = function(){
		if(localStorage.length === 0){
			alert("There is no data to clear.");
		}else{
			localStorage.clear();
			alert("All comics were deleted!");
			window.location.reload();
			return false;
		}
	};

	//Set Link and Submit Click Events
	var displayLink = $('#displayData');
	displayLink.on("click", getData);
	var clearLink = $('#clearData');
	clearLink.on("click", clearLocal);
	var save = $('#submit');
	save.on("click", storeData);

});

//Display Data page functions
$('#dataDisplay').on('pageinit', function(){

	//Display JSON data
	$("#jsonBtn").on("click", function(){
		console.log("Starting JSON");
		$("#list").empty();
		//AJAX call for JSON data
		$.ajax({
			url: "xhr/data.json",
			type: "GET",
			dateType: "json",
			success: function(json, status){
				var list = $("#list");
				console.log(status, json);
				$.each(json, function(i, comics, styleValue, catName, item){
					//Insert parsing code here
					//Parse data - WORK ON THIS!!!
				//     var makeLi = $("<li id='listItem"+i+"'></li>");
				//     var optSubText = $( "<img src='images/"+ catName +".jpg'/>"+
		  //   				"<p>"+comics.comicTitle[0]+" "+comics.comicTitle[1]+"</p>"+
		  //   				"<p>"+seriesTitle[0]+" "+seriesTitle[1]+"</p>"+
		  //   				"<p>"+issueNum[0]+" "+issueNum[1]+"</p>"+
		  //   				"<p>"+dateReleased[0]+" "+dateReleased[1]+"</p>"+
		  //   				"<p>"+publisher[0]+" "+publisher[1]+"</p>"+
		  //   				"<p>"+rateIssue[0]+" "+rateIssue[1]+"</p>"+
		  //   				"<p>"+genre[0]+" "+genre[1]+"</p>"+
		  //   				"<p>"+comments[0]+" "+comments[1]+"</p>");
			  	})
				$("#list").listview('refresh');
			},
			error: function(result){
				console.log(result);
			}
		});
	});

// 	//Display XML data
// 	$("#xmlBtn").on("click", function(){
// 		console.log("Starting XML");
// 		$("#list").empty();
// 		//AJAX call for XML data
// 		$.ajax({
// 			url: "xhr/data.xml",
// 			type: "GET",
// 			dataType: "xml"
// 			success: function(xml){
// 				console.log(xml.list);
// 				for(var i=0; i<localStorage.length; i++){
// 					//Insert parsing code here
// 				}
// 			},
// 			error: function(result){
// 				console.log(result);
// 			}
// 		});
// 	});

// 	//Display WDDX data
// 	$("#wddxBtn").on("click", function(){
// 		console.log("Starting WDDX");
// 		$("#list").empty();
// 		//AJAX call for XML data
// 		$.ajax({
// 			url: "xhr/data.wddx",
// 			type: "GET",
// 			dataType: "wddx"
// 			success: function(wddx){
// 				console.log(wddx.list);
// 				for(var i=0; i<localStorage.length; i++){
// 					//Insert parsing code here
// 				}
// 			},
// 			error: function(result){
// 				console.log(result);
// 			}
// 		});
// 	});

}); //END Display Data page functions

$('#superhero').on('pageinit', function(){
	//code needed for superhero page goes here

});

$('#western').on('pageinit', function(){
	//code needed for western page goes here

});

$('#horror').on('pageinit', function(){
	//code needed for horror page goes here

});

$('#romance').on('pageinit', function(){
	//code needed for romance page goes here

});

$('#scifi').on('pageinit', function(){
	//code needed for scifi page goes here

});

$('#covers').on('pageinit', function(){
	//code needed for covers page goes here

});

$('#about').on('pageinit', function(){
	//code needed for about page goes here

});

$('#construction').on('pageinit', function(){
	//code needed for construction page goes here

});


/*
Author: Courtney Ardis 
Project: ASD Project 3
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
		$("#jsonContent").empty();
		//AJAX call for JSON data
		$.ajax({
			url: "xhr/data.json",
			type: "GET",
			dateType: "json",
			success: function(json, status){
				alert("JSON data retrieved successfully!");
				console.log(status, json);
				for(var i in data.json){
                    var whatComic = data.json[i];
                    $('' +
                    	'<div id="jsonComicList">' +
	                    	'<ul>' +
			                    '<li>' + "Title of Comic:" + ' ' + whatComic.comicTitle[0] + '</li>'+
			                    '<li>' + "Title of Series:" + ' ' + whatComic.seriesTitle[0] + '</li>'+
			                    '<li>' + "Issue Number:" + ' ' + whatComic.issueNum[0] + '</li>'+
			                    '<li>' + "Date Released:" + ' ' + whatComic.dateReleased[0] + '</li>'+
			                    '<li>' + "Publisher:" + ' ' + whatComic.publisher[0] + '</li>'+
			                    '<li>' + "Rate Issue:" + ' ' + whatComic.rateIssue[0] + '</li>'+
			                    '<li>' + "Genre:" + ' ' + whatComic.genre[0] + '</li>'+
			                    '<li>' + "Illustration Style:" + ' ' + whatComic.illStyle[0] + '</li>'+
			                    '<li>' + "Comments:" + ' ' + whatComic.comments[0] + '</li>' +
		                    '</ul>' +
	                    '</div>'
                    ).appendTo('#jsonContent');   
                }
				// $("#jsonContent").listview('refresh');
			},
			error: function(result){
				console.log(result);
			}
		});
	});

	//Display XML data
	$("#xmlBtn").on("click", function(){
		console.log("Starting XML");
		$("#xmlContent").empty();
		//AJAX call for XML data
		$.ajax({
			url: "xhr/data.xml",
			type: "GET",
			dataType: "xml",
			success: function(xml, status, data){
				alert("XML data retrieved successfully!");
				console.log(status, xml);          
	            $(xml).find("comic").each(function(){
	                var comicTitle = $(this).find('comicTitle').text(),
	                	seriesTitle = $(this).find('seriesTitle').text(),
	                	issueNum = $(this).find('issueNum').text(),
	                	dateReleased = $(this).find('dateReleased').text(),
	                	publisher = $(this).find('publisher').text(),
	                	rateIssue = $(this).find('rateIssue').text(),
	                	genre = $(this).find('genre').text(),
	                	illStyle = $(this).find('illStyle').text(),
	                	comments = $(this).find('comments').text();
	                $('' +
	                	'<div id="xmlComicList">' +
		                	'<ul>' +
		                        '<li>' + comicTitle + '</li>' +
		                        '<li>' + seriesTitle + '</li>' +
		                        '<li>' + issueNum + '</li>' +
		                        '<li>' + dateReleased + '</li>' +
		                        '<li>' + publisher + '</li>' + 
		                        '<li>' + rateIssue + '</li>' +
		                        '<li>' + genre + '</li>' +
		                        '<li>' + illStyle + '</li>' +
		                        '<li>' + comments + '</li>' +
	                        '</ul>' +
	                    '</div>'
	                ).appendTo('#xmlContent');
	            });
				// $("#xmlContent").listview('refresh');
			},
			error: function(status, result){
				console.log(status, result);
			}
		});
	});

	//Display CSV data
	$("#csvBtn").on("click", function(){
		console.log("Starting CSV");
		$("#csvContent").empty();
		//AJAX call for CSV data
		$.ajax({
			url: "xhr/data.csv",
			type: "GET",
			dataType: "text",
			success: function(status, csv){
				alert("CSV data retrieved successfully!");
				console.log(csv, status);
                var comics = [];
                var pulledCSV = csv.split(/\r\n|\n/);
                var labels = pulledCSV[0].split(',');
                for(var i=2; i<pulledCSV.length; i++) {
                    var comic = pulledCSV[i].split(',');
                    if (comic.length == labels.length) {
                        var comicData = [];
                        for (var j=0; j<labels.length; j++){
                            comicData.push(comic[j]);
                        }
                        comics.push(comicData);
                    }
                }
                for(var k=0; k<comics.length; k++){
                    var comicCat = comics[k];
                    $('' +
                    '<div id="csvComicList">'+
	                    '<ul>'+
	                        '<li>Title of Comic: ' + comicCat[0] + '</li>'+
	                        '<li>Title of Series: ' + comicCat[1] + '</li>'+
	                        '<li>Issue Number: ' + comicCat[2] + '</li>'+
	                        '<li>Date Released: ' + comicCat[3] + '</li>'+
	                        '<li>Publisher: ' + comicCat[4] + '</li>'+
	                        '<li>Rate Issue: ' + comicCat[5] + '</li>'+
	                        '<li>Genre: ' + comicCat[6] + '</li>'+
	                        '<li>illStyle: ' + comicCat[7] + '</li>'+
	                        '<li>Comments: ' + comicCat[8] + '</li>' +
	                    '</ul>' +
                    '</div>'
                    ).appendTo('#csvContent');
                }
                // $("#csvContent").listview('refresh');
			},
			error: function(status, result){
				console.log(status, result);
			}
		});
	});
}); //END Data functions

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


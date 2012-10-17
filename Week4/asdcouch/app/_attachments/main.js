/*
Author: Courtney Ardis 
Project: ASD Project 4
Term: 1210
*/

$('#home').on('pageinit', function(){
	//code needed for home page goes here
	
});	
		
$('#addItem').on('pageinit', function(){
	delete $.validator.methods.date;
	var validate = function(){
		var myForm = $('#comicForm');
		    myForm.validate({
			invalidHandler: function(form, validator) {
			},
			submitHandler: function() {
				var data = myForm.serializeArray();
					storeData();
				}
		    });
	};
	
	//any other code needed for addItem page goes here

 	//Variable defaults
	 var //comicGenre = ["--Choose A Genre--", "Superhero", "Horror", "Sci-Fi", "Western", "Romance"],
		styleValue,
		errMsg = $('#errors');

	//Change Page function
	 var changePage = function(pageID){
         $('#' + pageID).trigger('pageinit');
         $.mobile.changePage($('#' + pageID),{transition:'slide'});
	 }
	 
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
	
//	//Display JSON on Display Data page
//	var jsonCall = function(){
//		console.log("Starting JSON");
//		$.couch.db("asdproject").view("app/comic", {
//		success: function(data){
//			$("#jsonComicList").empty();
//			alert("JSON data retrieved successfully!");
//			console.log(data);
//			$.each(data.rows, function(index, comic){
//	            $('' +
//	            		'<li><p> Title of Comic: ' + comic.value.comicTitle + '</p>'+
//	                    '<p> Title of Series: ' + comic.value.seriesTitle + '</p>'+
//	                    '<p> Issue Number: ' + comic.value.issueNum + '</p>'+
//	                    '<p> Date Released: ' + comic.value.dateReleased + '</p>'+
//	                    '<p> Publisher: ' + comic.value.publisher + '</p>'+
//	                    '<p> Rate Issue: ' + comic.value.rateIssue + '</p>'+
//	                    '<p> Genre: ' + comic.value.genre + '</p>'+
//	                    '<p> Illustration Style: ' + comic.value.illStyle + '</p>'+
//	                    '<p> Comments: ' + comic.value.comments + '</p></li>'
//	            ).appendTo('#jsonComicList');   
//	        });
//			$("#jsonComicList").listview('refresh');
//		},
//		error: function(result){
//			console.log(result);
//		}
//		});//END JSON AJAX call
//	};

	var storeData = function(key){	
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
			//Changes id to the correct format in CouchDB
			item["_id"] = "comic:" + $('#seriesTitle').val() + ":" + $('#genre').val();
		$.couch.db("asdproject").saveDoc(item, {
			success: function(data) {
				//Console logs the id in the correct format
				//Doesn't change it in CouchDB
				data.id = "comic:" + $('#seriesTitle').val() + ":" + $('#genre').val();
//				console.log(data);
			},
			error: function(status) {
				console.log(status);
			}
		});
		alert("Comic saved to index!");
		changePage("dataDisplay");
		window.location.reload();
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

		//Change Submit button value to Edit button
		$('#submit').val() = "Edit Comic";
		var editSubmit = $('#submit');
		//Save the key value established in this function as a property of the editSubmit event
		//so we can use that value when we save the data we edited
	 	editSubmit.on("click", storeData)
	 			  .key(this.key);
	};

	var	deleteItem = function (item){
		var ask = confirm("Are you sure you want to delete this comic?");
		if(ask){
			$.couch.db("asdproject").removeDoc(item, {
				success: function(data){
					console.log(data);
				},
				error: function(status){
					console.log(status);
				}
			});
			alert("Comic was deleted!");
			window.location.reload();
		}else{
			alert("Comic was NOT deleted!");
		}	
	};
						
//	var clearLocal = function(){
//		if(localStorage.length === 0){
//			alert("There is no data to clear.");
//		}else{
//			localStorage.clear();
//			alert("All comics were deleted!");
//			window.location.reload();
//			return false;
//		}
//	};

	//Set Link and Submit Click Events
//	var displayLink = $('#displayData');
//	displayLink.on("click", jsonCall);
//	var clearLink = $('#clearData');
//	clearLink.on("click", clearLocal);
	var save = $('#submit');
	save.on("click", validate);

});

//Display Data page functions
$('#dataDisplay').on('pageinit', function(){
	
	//Display JSON on Display Data page
		console.log("Starting JSON");
		$.couch.db("asdproject").view("app/comic", {
		success: function(data){
			$("#jsonComicList").empty();
//			alert("JSON data retrieved successfully!");
			console.log(data);
			$.each(data.rows, function(index, comic){
	            $('' +
	            		'<li><p> Title of Comic: ' + comic.value.comicTitle + '</p>'+
	                    '<p> Title of Series: ' + comic.value.seriesTitle + '</p>'+
	                    '<p> Issue Number: ' + comic.value.issueNum + '</p>'+
	                    '<p> Date Released: ' + comic.value.dateReleased + '</p>'+
	                    '<p> Publisher: ' + comic.value.publisher + '</p>'+
	                    '<p> Rate Issue: ' + comic.value.rateIssue + '</p>'+
	                    '<p> Genre: ' + comic.value.genre + '</p>'+
	                    '<p> Illustration Style: ' + comic.value.illStyle + '</p>'+
	                    '<p> Comments: ' + comic.value.comments + '</p></li>'
	            ).appendTo('#jsonComicList');   
	        });
			$("#jsonComicList").listview('refresh');
		},
		error: function(result){
			console.log(result);
		}
		});//END

}); //END Display Data Page

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


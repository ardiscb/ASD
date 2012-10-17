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
	
	//Display JSON on Display Data page
	var jsonCall = function(){
		console.log("Starting JSON");
		$.couch.db("asdproject").view("app/comic", {
		success: function(data){
			$("#jsonComicList").empty();
			alert("JSON data retrieved successfully!");
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
		});//END JSON AJAX call
	};

	var storeData = function(key){	
		getSelectedRadio();
		var item 				= {};
			item.comicTitle		= $('#comicTitle').val();
			item.seriesTitle	= $('#seriesTitle').val();
			item.issueNum		= $('#issueNum').val();
			item.dateReleased	= $('#dateReleased').val();
			item.publisher		= $('#publisher').val();
			item.rateIssue		= $('#rateIssue').val();
			item.genre 			= $('#genre').val();
			item.illStyle		= styleValue;
			item.comments		= $('#comments').val();	
			//Changes id to the correct format in CouchDB
			item["_id"] = "comic:" + $('#seriesTitle').val() + ":" + $('#genre').val();
		$.couch.db("asdproject").saveDoc(item, {
			success: function(data) {
				//Console logs the id in the correct format
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

	var save = $('#submit');
	save.on("click", validate);

});

//Display Data page functions
$('#dataDisplay').on('pageinit', function(){
	
	var	editItem = function (){
		//Grab the data from our item in Local Storage
		var value = localStorage.getItem(this.key);
		var item = JSON.parse(value);

		//populate the form fields with current Local Storage values
		$('#comicTitle').val() 	= comic.value.comicTitle;
		$('#seriesTitle').val() 	= comic.value.seriesTitle;
		$('#issueNum').val() 	= comic.value.issueNum;
		$('#dateReleased').val() = comic.value.dateReleased;
		$('#publisher').val() 	= comic.value.publisher;
		$('#rateIssue').val() 	= comic.value.rateIssue;
		$('#genre').val() 		= comic.value.genre;
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
					data.id = "comic:" + $('#seriesTitle').val() + ":" + $('#genre').val();
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
	
	var urlVars = function() {
		var urlData = $($.mobile.activePage).data("url");
		var urlParts = urlData.split('?');
		var urlPairs = urlParts[1].split('&');
		var urlValues = {};
		for (var pair in urlPairs) {
			var keyVAlue = urlPairs[pair].spllit('=');
			var key = decodeURIComponent(keyValue[0]);
			var value = decodeURIComponent(keyValue[1]);
			urlValues[key] = value;
 		}
		return urlValues;
	}
	
	//Display JSON on Display Data page
		console.log("Starting JSON");
//		var comic = urlVars()["id"];
		$.couch.db("asdproject").view("app/comic", {
		success: function(data){
			$("#jsonComicList").empty();
//			key: "id:" + comic;
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
	                    '<p> Comments: ' + comic.value.comments + '</p>' +
	                    '<p><a href="#addItem" id="editItemLink">Edit Comic</a></p>'+
	                    '<p><a href="#" id="deleteItemLink">Delete Comic</a></p></li>'
	            ).appendTo('#jsonComicList'); 
	            var editLink = $("#editItemLink");
//				editItem.id = item["_id"];
				editLink.on('click', editItem);
				var deleteLink = $("#deleteItemLink");
//				deleteItem.id = item["_id"];
				deleteLink.on('click', deleteItem);
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

	//Display JSON on Supehero browse page
	console.log("Starting JSON");
	$.couch.db("asdproject").view("app/superhero", {
	success: function(data){
		$("#superheroComics").empty();
//		alert("JSON data retrieved successfully!");
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
            ).appendTo('#superheroComics');   
        });
		$("#superheroComics").listview('refresh');
	},
	error: function(result){
		console.log(result);
	}
	});//END
});

$('#western').on('pageinit', function(){
	//code needed for western page goes here
	//Display JSON on Display Data page
	console.log("Starting JSON");
	$.couch.db("asdproject").view("app/western", {
	success: function(data){
		$("#westernComics").empty();
//		alert("JSON data retrieved successfully!");
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
            ).appendTo('#westernComics');   
        });
		$("#westernComics").listview('refresh');
	},
	error: function(result){
		console.log(result);
	}
	});//END
});

$('#horror').on('pageinit', function(){
	//Display JSON on Display Data page
	console.log("Starting JSON");
	$.couch.db("asdproject").view("app/horror", {
	success: function(data){
		$("#horrorComics").empty();
//		alert("JSON data retrieved successfully!");
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
            ).appendTo('#horrorComics');   
        });
		$("#horrorComics").listview('refresh');
	},
	error: function(result){
		console.log(result);
	}
	});//END
});

$('#romance').on('pageinit', function(){
	//code needed for romance page goes here
	//Display JSON on Display Data page
	console.log("Starting JSON");
	$.couch.db("asdproject").view("app/romance", {
	success: function(data){
		$("#romanceComics").empty();
//		alert("JSON data retrieved successfully!");
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
            ).appendTo('#romanceComics');   
        });
		$("#romanceComics").listview('refresh');
	},
	error: function(result){
		console.log(result);
	}
	});//END
});

$('#scifi').on('pageinit', function(){
	//code needed for scifi page goes here
	//Display JSON on Display Data page
	console.log("Starting JSON");
	$.couch.db("asdproject").view("app/scifi", {
	success: function(data){
		$("#scifiComics").empty();
//		alert("JSON data retrieved successfully!");
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
            ).appendTo('#scifiComics');   
        });
		$("#scifiComics").listview('refresh');
	},
	error: function(result){
		console.log(result);
	}
	});//END
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


function(doc) {
  if (doc._id.substr(0,6)==="comic:"){
    emit(doc._id.substr(6),{
    		"comicTitle": doc.comicTitle,
    		"seriesTitle": doc.seriesTitle,
    		"issueNum": doc.issueNum,
    		"dateReleased": doc.dateReleased,
    		"publisher": doc.publisher,
    		"rateIssue": doc.rateIssue,
    		"genre": doc.genre,
    		"illStyle": doc.illStyle,
    		"comments": doc.comments
    });
  }
};
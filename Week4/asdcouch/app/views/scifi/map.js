function(doc) {
  if (doc._id.match("scifi")) {
    emit(doc._id.match("scifi"),{
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
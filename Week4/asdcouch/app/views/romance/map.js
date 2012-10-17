function(doc) {
  if (doc._id.match("romance")) {
    emit(doc._id.match("romance"),{
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
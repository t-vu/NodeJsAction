var qs = require('querystring');

exports.sendHtml = function(res, html) { 
  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.setHeader('Content-Length', Buffer.byteLength(html));
//  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.end(html);
}

exports.parseReceivedData = function(req, cb) { 
  var body = '';
  req.setEncoding('utf8');
  req.on('data', function(chunk){ body += chunk });
  req.on('end', function() {
    var data = qs.parse(body);
    cb(data);
  });
};

exports.actionForm = function(id, path, label) { 
  var html = '<form method="POST" action="' + path + '">' +
    '<input type="hidden" name="id" value="' + id + '">' +
    '<input type="submit" value="' + label + '" />' +
    '</form>';
  return html;
};

exports.add = function(db, req, res) {
  exports.parseReceivedData(req, function(work) { 
    db.query(
      "INSERT INTO work (hours, date, description) " + 
      " VALUES (?, ?, ?)",
      [work.hours, work.date, work.description], 
      function(err) {
        if (err) throw err;
        exports.show(db, res); 
      }
    );
  });
};

exports.delete = function(db, req, res) {
  exports.parseReceivedData(req, function(work) { 
    db.query(
      "DELETE FROM work WHERE id=?", 
      [work.id], 
      function(err) {
        if (err) throw err;
        exports.show(db, res); 
      }
    );
  });
};

exports.archive = function(db, req, res) {
  exports.parseReceivedData(req, function(work) { 
    db.query(
      "UPDATE work SET archived=1 WHERE id=?", 
      [work.id], 
      function(err) {
        if (err) throw err;
        exports.show(db, res); 
      }
    );
  });
};

exports.showSearch = function(db, req, res){
	exports.parseReceivedData(req, function(work){
		db.query("Select * From work "+ "Where description LIKE ?",
				["%"+work.description +"%"],
				function(err, rows){
			if(err) throw err;
			  html =  '<a href="/search">Result Work</a><br/>';
		      html += exports.workHitlistHtml(rows); 
		      html += exports.workFormHtml();
		      html += exports.workSearchForm("search", "Search");
		      exports.sendHtml(res, html); 
		});
	});
}

exports.show = function(db, res, showArchived) {
  var query = "SELECT * FROM work " + 
    "WHERE archived=? " +
    "ORDER BY date DESC";
  var archiveValue = (showArchived) ? 1 : 0;
  db.query(
    query,
    [archiveValue], 
    function(err, rows) {
      if (err) throw err;
      html = (showArchived)
        ? ''
        : '<a href="/archived">Archived Work</a><br/>';
      html += exports.workHitlistHtml(rows); 
      html += exports.workFormHtml();
      html += exports.workSearchForm("search", "Search");
      exports.sendHtml(res, html); 
    }
  );
};

exports.showArchived = function(db, res) {
  exports.show(db, res, true); 
};

exports.workHitlistHtml = function(rows) {
  var html = '<table>';
  for(var i in rows) { 
    html += '<tr>';
    html += '<td>' + rows[i].date + '</td>';
    html += '<td>' + rows[i].hours + '</td>';
    html += '<td>' + rows[i].description + '</td>';
    if (!rows[i].archived) { 
      html += '<td>' + exports.workArchiveForm(rows[i].id) + '</td>';
    }
    html += '<td>' + exports.workDeleteForm(rows[i].id) + '</td>';
    html += '</tr>';
  }
  html += '</table>';
  return html;
};

exports.workFormHtml = function() {
  var html = '<form method="POST" action="/">' + 
    '<p>Date (YYYY-MM-DD):<br/><input name="date" type="text"><p/>' +
    '<p>Hours worked:<br/><input name="hours" type="text"><p/>' +
    '<p>Description:<br/>' +
    '<textarea name="description"></textarea></p>' +
    '<input type="submit" value="Add" />' +
    '</form>';
  return html;
};

exports.workArchiveForm = function(id) { 
  return exports.actionForm(id, '/archive', 'Archive');
}

exports.workDeleteForm = function(id) { 
  return exports.actionForm(id, '/delete', 'Delete');
}


exports.workSearchForm = function(search_path, label){ 
	  var html = '<form method="POST" action="' + search_path + '">' +
	    '<input type="text" name="description">' +
	    '<input type="submit" value="' + label + '" />' +
	    '</form>';
	  return html;
}
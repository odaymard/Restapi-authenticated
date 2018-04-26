router.post('/book', passport.authenticate('jwt', { session: false}), function(req, res) {
    var token = getToken(req.headers);
    if (token) {
      console.log(req.body);
      var newBook = new Book({
        isbn: req.body.isbn,
        title: req.body.title,
        author: req.body.author,
        publisher: req.body.publisher
      });
  
      newBook.save(function(err) {
        if (err) {
          return res.json({success: false, msg: 'Save book failed.'});
        }
        res.json({success: true, msg: 'Successful created new book.'});
      });
    } else {
      return res.status(403).send({success: false, msg: 'Unauthorized.'});
    }
  });

  router.get('/book', passport.authenticate('jwt', { session: false}), function(req, res) {
    var token = getToken(req.headers);
    if (token) {
      Book.find(function (err, books) {
        if (err) return next(err);
        res.json(books);
      });
    } else {
      return res.status(403).send({success: false, msg: 'Unauthorized.'});
    }
  });

  getToken = function (headers) {
    if (headers && headers.authorization) {
      var parted = headers.authorization.split(' ');
      if (parted.length === 2) {
        return parted[1];
      } else {
        return null;
      }
    } else {
      return null;
    }
  };

  module.exports = router;
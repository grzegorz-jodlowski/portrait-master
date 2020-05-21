const requestIp = require('request-ip');

const Photo = require('../models/photo.model');
const Voter = require('../models/voter.model');

/****** SUBMIT PHOTO ********/

exports.add = async (req, res) => {

  try {
    const { title, author, email } = req.fields;
    const file = req.files.file;
    const acceptedExtensions = ['gif', 'jpg', 'png'];

    if (title && title.length <= 25 && author && author.length <= 50 && email && file) { // if fields are not empty...

      const stringPattern = new RegExp(/(<*>(([A-z]|\s)*)<*\/*>)|(([A-z]|\s|\.)*)/, 'g');
      const emailPattern = new RegExp(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/, 'g');

      const titleMatched = title.match(stringPattern).join('');
      const authorMatched = title.match(stringPattern).join('');
      const emailMatched = email.match(emailPattern).join('');

      if (titleMatched.length < title.length || authorMatched.length < author.length) throw new Error('Invalid characters...');
      if (emailMatched.length < email.length) throw new Error('Invalid email address');

      const fileName = file.path.split('/').slice(-1)[0]; // cut only filename from full path, e.g. C:/test/abc.jpg -> abc.jpg
      const fileExt = fileName.split('.').slice(-1)[0];

      if (!acceptedExtensions.some(ext => ext === fileExt)) throw new Error('Wrong photo extension!');

      const newPhoto = new Photo({ title, author, email, src: fileName, votes: 0 });
      await newPhoto.save(); // ...save new photo in DB
      res.json(newPhoto);

    } else {
      throw new Error('Wrong input!');
    }

  } catch (err) {
    res.status(500).json(err);
  }

};

/****** LOAD ALL PHOTOS ********/

exports.loadAll = async (req, res) => {

  try {
    res.json(await Photo.find());
  } catch (err) {
    res.status(500).json(err);
  }

};

/****** VOTE FOR PHOTO ********/

exports.vote = async (req, res) => {

  try {
    const photoToUpdate = await Photo.findOne({ _id: req.params.id });
    if (!photoToUpdate) res.status(404).json({ message: 'Not found' });
    else {
      const clientIp = requestIp.getClientIp(req);
      try {
        const votedUser = await Voter.findOne({ user: clientIp });

        if (!votedUser) {
          const newUser = new Voter({ user: clientIp, votes: [req.params.id] });
          await newUser.save();

          photoToUpdate.votes++;
          photoToUpdate.save();
          res.send({ message: 'OK' });
        } else {
          if (votedUser.votes.some(vote => vote == req.params.id)) {
            res.status(500).json(err);
          } else {
            votedUser.votes.push(req.params.id)
            await votedUser.save();
            photoToUpdate.votes++;
            photoToUpdate.save();
            res.send({ message: 'OK' });
          }
        }

      } catch (err) {
        res.status(500).json(err);
      }

    }
  } catch (err) {
    res.status(500).json(err);
  }

};

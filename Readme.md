<p align="center">
<a href="https://portrait-master.herokuapp.com/"><img src="public/logo.jpg" title="portrait-master" alt="snippet of portrait master app"></a>
</p>



# <p align="center">📷 Portrait master website</p>
<p align="center">Project for learning web application security</p>

</br>

## Table of Contents

- [What's this project about?](#ab)
- [Technologies used](#tech)
- [What I learned?](#what)
- [Interesting code snippet](#inter)
- [Installation and quick start](#install)
- [Website (on Heroku)](#si)

</br>

## <a name="ab"></a>What's this project about?

This is a photo contest website created to test hacker attacks and learn how to secure frontend applications. Thanks to security, it is not possible to damage the application with, for example, injection attacks or Cross Site Scripting. The application also has protection against multiple voting by one person (thanks to the database-side collecting IP addresses of voting users).

</br>

## <a name="tech"></a>Technologies used
- HTML
- CSS
- SCSS
- Bootstrap/Reactstrap
- JavaScript
- React
- React Router
- Redux
- Axios
- Thunk
- Express
- MongoDB
- MongoDB Atlas
- Mongoose
- GIT

</br>

## <a name="what"></a>What I learned?

- the most common types of threats and how to defend against them:
  - Injection
    - all data should be validated not only on the client side but also on the server side,
  - Broken Authentication
    - use ready and secure user authorization solutions, e.g. Auth0 and Passport,
  - Sensitive Data Exposure
    - do not keep site settings (e.g. database passwords) in public files,
    - use environment variables,
    - for users' data use some popular and valued service that will ensure their security,
  - Broken Access Control
    - use an authorization system that has no security holes and is able to hide sensitive subpages well depending on user permissions,
    - make sure to set the correct permissions for specific parts of the page or application,
  - Security Misconfigurations
    - make every effort to properly configure the application, especially at the initial and final stages of production,
  - Cross Site Scripting (XSS)
    - do not use suspicious plugins or packages,
    - check the origin of dependencies,
  - Insecure Deserialization
    - check what exactly we get from outside,
    - use checksums to check that the data has not been falsified,
  - Using Components with Known Vulnerabilities
    - choose only known and still supported packages,
    - use tools that will periodically review all dependencies for security vulnerabilities,
  - Insufficient Logging and Monitoring
    - use mechanisms that will inform about successful and failed attack attempts.




</br>

## <a name="inter"></a>Interesting code snippet (for me of course 😉)
- add photo endpoint validation:

```js
exports.add = async (req, res) => {

  try {
    const { title, author, email } = req.fields;
    const file = req.files.file;
    const acceptedExtensions = ['gif', 'jpg', 'png'];

    if (title && title.length <= 25 && author && author.length <= 50 && email && file) {

      const stringPattern = new RegExp(/(<*>(([A-z]|\s)*)<*\/*>)|(([A-z]|\s|\.)*)/, 'g');
      const emailPattern = new RegExp(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/, 'g');

      const titleMatched = title.match(stringPattern).join('');
      const authorMatched = title.match(stringPattern).join('');
      const emailMatched = email.match(emailPattern).join('');

      if (titleMatched.length < title.length || authorMatched.length < author.length) throw new Error('Invalid characters...');
      if (emailMatched.length < email.length) throw new Error('Invalid email address');

      const fileName = file.path.split('/').slice(-1)[0];
      const fileExt = fileName.split('.').slice(-1)[0];

      if (!acceptedExtensions.some(ext => ext === fileExt)) throw new Error('Wrong photo extension!');

      const newPhoto = new Photo({ title, author, email, src: fileName, votes: 0 });
      await newPhoto.save();
      res.json(newPhoto);

    } else {
      throw new Error('Wrong input!');
    }

  } catch (err) {
    res.status(500).json(err);
  }
};
```

</br>

## <a name="install"></a>Installation and quick start

- use the package manager [npm](https://www.npmjs.com/get-npm) or [yarn](https://classic.yarnpkg.com/en/) to install dependencies:

```bash
npm install // yarn install

or

npm i // yarn
```
- run server with nodemon (after nodemon installation) and run watch mode to constantly refreshing react client:

```bash
npm start

or

yarn start
```


<br/>


## <a name="si"></a>Website (on Heroku)
[Portrait master website](https://portrait-master.herokuapp.com/)
- if the page loads slowly, wait a moment, the server is waking up because it is hosted on a free platform Heroku.

</br>
</br>

  *mostly individual project implemented as part of the 9-month [Web Developer Plus](https://kodilla.com/pl/bootcamp/webdeveloper/?type=wdp&editionId=309) course organized by [Kodilla](https://drive.google.com/file/d/1AZGDMtjhsHbrtXhRSIlRKKc3RCxQk6YY/view?usp=sharing)



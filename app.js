const express = require("express");
const morgan = require ("morgan")
const postBank = require("./postBank")
const path = require('path');

const app = express();
app.use(morgan('dev'));


app.get('/', (_req, res) => {
  const posts = postBank.list();
  const HTML =  `<!DOCTYPE html>
  <html>
  <head>
    <title>Wizard News</title>
    <link rel="stylesheet" href="/style.css" />
  </head>
  <body>
    <div class="news-list">
      <header><img src="/logo.png"/>Wizard News</header>
      ${posts.map(post => `
        <div class='news-item'>
          <p>
            <span class="news-position">${post.id}. ▲</span>
            <a href="/posts/${post.id}">${post.title}</a>
            <small>(by ${post.name})</small>
          </p>
          <small class="news-info">
            ${post.upvotes} upvotes | ${post.date}
          </small>
        </div>`
      ).join('')}
    </div>
  </body>
</html>`
res.sendFile(path.join(__dirname, 'public', 'style.css'));
 res.send(HTML);
 
});

// say that a client GET requests the path /posts/7
app.get( '/posts/:id', (req, res) => {
  const id = req.params.id  
  const post = postBank.find(id);
  if (!post.id) {
    // If the post wasn't found, set the HTTP status to 404 and send Not Found HTML
    res.status(404)
    const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>Wizard News</title>
      <link rel="stylesheet" href="/style.css" />
    </head>
    <body>
      <header><img src="/logo.png"/>Wizard News</header>
      <div class="not-found">
        <p>404: Page Not Found</p>
      </div>
    </body>
    </html>`
    res.send(html)
  } else {
  const HTML = `<!DOCTYPE html>
  <html>
  <head>
    <title>Wizard News</title>
    <link rel="stylesheet" href="/style.css" />
  </head>
  <body>
    <div class="news-list">
      <header><img src="/logo.png"/>Wizard News</header>
      
        <div class='news-item'>
          <p>
            ${post.title}
            <small>(by ${post.name})</small>
          </p>
          <small class="news-info">
            ${post.content} 
          </small>
    </div>
  </body>
</html>`
  res.send(HTML);
  }
});


app.get('/logo.png', (_req,res) => {
  res.sendFile(path.join(__dirname, 'public', 'logo.png'));
})


app.use(express.static(path.join(__dirname, 'public')));
const PORT = 1337;

app.listen(PORT, () => {
  console.log(`App listening in port ${PORT}`);
});

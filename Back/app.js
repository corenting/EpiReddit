import createError from 'http-errors';
import express from 'express';
import path from 'path';
import logger from 'morgan';
import validator from 'express-validator';
import usersRouter from './routes/users';
import categoriesRouter from './routes/categories';
import postsRouter from './routes/posts';
import commentsRouter from './routes/comments';
import votesRouter from './routes/votes';
import playgroundRouter from './routes/playground';

const app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(validator());
app.use(express.static(path.join(__dirname, 'public')));

// CORS
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Methods', 'GET,HEAD,OPTIONS,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Access-Control-Allow-Headers, Authorization, Origin, Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers',
  );
  next();
});

app.use('/users', usersRouter);
app.use('/categories', categoriesRouter);
app.use('/playground', playgroundRouter);
app.use('/posts', postsRouter);
app.use('/votes', votesRouter);
app.use('/comments', commentsRouter);

// catch 404 and forward to error handler
app.use((req, res, next) => {
  next(createError(404));
});

// error handler
app.use((err, req, res) => {
  // Return error or 500
  res.status(err.status || 500);
  res.send();
});

module.exports = app;

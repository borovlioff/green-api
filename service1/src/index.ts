import express from 'express';
import 'dotenv/config';
import routes from "./routes"
import { v4 as uuidv4 } from 'uuid';
import morgan from 'morgan';

const app = express();
const port = process.env.PORT || 3000;

app.use((req, res, next) => {
  req.headers['request_id'] = uuidv4();
  next();
});


app.use(
  morgan(
    (tokens, req, res) =>
    [
      tokens.method(req, res),
      tokens.url(req, res),
      tokens['response-time'](req, res),
      'HTTP/' + tokens['http-version'](req, res),
      tokens.status(req, res),
      tokens.res(req, res, 'content-length'),
      req.headers['user-agent'],
      `"request_id":"${req.headers["request_id"]}"`
    ].join(' ')
  )
);

app.use(express.json());
app.use(routes);


app.listen(port, () => {
  console.log(`Microservice M1 listening on port ${port}`);
});

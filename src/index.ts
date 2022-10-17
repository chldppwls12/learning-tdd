import express from 'express';
import routes from '../routes/index';
import mongoose from 'mongoose';
import * as dotenv from 'dotenv';
dotenv.config();

mongoose
  .connect(
    `mongodb+srv://${process.env.MONGODB_USER}:${process.env.MONGODB_PASSWORD}@cluster0.mxtkuch.mongodb.net/cluster0?retryWrites=true&w=majority`
  )
  .then(() => console.log('MongoDB Conneted...'))
  .catch(err => console.log(err));

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use('/api', routes);
app.listen(3000, () => {
  console.log(`Server is running`);
});

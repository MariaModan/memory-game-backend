const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const knex = require('knex');

//connecting to the database in heroku
const db = knex({
    client: 'pg',
    connection: {
        connectionString: process.env.DATABASE_URL,
        ssl: true,
    }
  });


const app = express();

app.use(bodyParser.json());
app.use(cors());

app.get('/', (req,res) => {
    res.json('is working');
})

app.get('test', (req,res) => {
    db.select('*').from('top_score')
        .then(data => res.json(data))
})

app.get('/topScore', (req,res) => {

    //gets the top score from the database so tht we can display it on the frontend
    db.select('score').from('top_score')
        .then(data => {
            console.log(data);
            return res.json(data[0])
        })
        .catch(err => res.json('unable to get top score'))
})

app.put('/updateTopScore', (req,res) => {
    const { score } = req.body;

    //gets the top score form the database, if the current score is lower it will update the database
    db.select('score').from('top_score')
        .then( data => {
            const topScore = data[0].score;
            if (score < topScore) {
                return db('top_score').update({
                    score: score
                }).returning('score')
                .then( score => res.json(`The new top score is ${score}`))
                .catch(err => res.status(400).json('Unable to update top score'))
            }
        })
        .catch( err => res.status(400).json('Unable to get top score'))
    

})

app.listen(process.env.PORT||5000, ()=> {console.log('app is running')})
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const knex = require('knex');


const db = knex({
    client: 'pg',
    connection: {
      host : '127.0.0.1',
      user : 'postgres',
      password : 'aA123adata',
      database : 'memory_game'
    }
  });

const app = express();

app.use(bodyParser.json());
app.use(cors());

app.get('/', (req,res) => {
    res.json('is working');
})

app.get('/topScore', (req,res) => {
    db.select('score').from('top_score')
        .then(data => {
            return res.json(data[0])
        })
        .catch(err => res.json('unable to get top score'))
})

app.put('/updateTopScore', (req,res) => {
    //have the front end send the score
    // update it in the database
    //send back confirmation its successful
    const { score } = req.body;
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

app.listen(3005, ()=> {console.log('app is running')})
const express = require('express');
const bodyParser = require('body-parser');
const { graphqlHTTP } = require('express-graphql');
const mongoose = require('mongoose');
const graphqlSchema = require('./graphql/schema/index');
const graphqlResolvers = require('./graphql/resolvers/index');
const isAuth = require('./middleWare/is-auth')

const app = express();

app.use(bodyParser.json());

app.use(isAuth);

app.use(
    '/graphql',
    graphqlHTTP({
        schema: graphqlSchema,
        rootValue: graphqlResolvers,
        graphiql: true
    }));

mongoose.connect(`mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@cluster0.skf3q.mongodb.net/${process.env.MONGO_DB}?retryWrites=true&w=majority`)
    .then(() => app.listen(5000))
    .catch(e => console.log(e))


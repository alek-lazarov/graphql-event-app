const express = require('express');
const bodyParser = require('body-parser');
const graphqlHttp = require('express-graphql').graphqlHTTP;
const { buildSchema } = require('graphql');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const Event = require('./models/event');
const User = require('./models/user')

const app = express();

app.use(bodyParser.json());

app.use('/graphql', graphqlHttp({
    schema: buildSchema(`
        type Event {
            _id: ID!
            title: String!
            description: String!
            price: Float!
            date: String!
        }

        type User {
            _id: ID!
            email: String!
            password: String
        }

        input UserInput {
            email: String!
            password: String!
        }

        input EventInput {
            title: String!
            description: String!
            price: Float!
            date: String!
        }

        type RootQuery {
            events: [Event!]!
        }

        type RootMutation {
            createEvent(eventInput: EventInput): Event
            createUser(userInput: UserInput): User
        }

        schema {
            query: RootQuery
            mutation: RootMutation
        }
    `),
    rootValue: {
        events: () => {
            return Event.find()
            .then(response => {
                return response.map(event => {
                    return {...event._doc}
                })
            })
            .catch(err => {
                throw err;
            })
        },

        createEvent: (args) => {

            const newEvent = new Event({
                title: args.eventInput.title,
                description: args.eventInput.description,
                price: +args.eventInput.price,
                date: new Date(args.eventInput.date),
                creator: '62ac8b222b03712d1dee883f'
            });

            let createdEvent;

            return newEvent
                .save()
                .then(result => {
                    createdEvent = {...result._doc};
                    return User.findById('62ac8b222b03712d1dee883f')
                })
                .then(user => {
                    if(user){
                        user.createdEvents.push(newEvent);
                        return user.save();
                    }
                })
                .then(result => {
                    return createdEvent;
                })
                .catch(err => {
                    
                    throw err;
                });

        },

        createUser: (args) => {
            return User.findOne({
                email: args.userInput.email
            })
            .then(user => {
                if(user){
                    throw new Error('User exists already')
                }
                return bcrypt.hash(args.userInput.password, 12)
            })
            .then(hashedPassword => {
                    const newUser = new User({
                        email: args.userInput.email,
                        password: hashedPassword
                    });

                    return newUser.save()
                        .then(createdUser => {
                            return {...createdUser._doc, password: null}
                        })
                        .catch(err => {throw err})
                })
                .catch(err => {
                    throw err
                })

        }
    },
    graphiql: true
})
);

mongoose.connect(`mongodb+srv://admin:bKen847TA0fc54lM@cluster1.jme3x.mongodb.net/events-react-dev?retryWrites=true&w=majority`)
    .then(() => {
        app.listen(3000);
    })
    .catch(err => {
        console.log(err)
    });


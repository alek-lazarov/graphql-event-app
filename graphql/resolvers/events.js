const Event = require('../../models/event');
const User = require('../../models/user')
const { transformEvent } = require('./merge')

module.exports = {
    events: async () => {
        try{
            var events = await Event.find();
            return events.map(event => {
                return transformEvent(event)
            })
        }
        catch(err) {
            throw err
        }
    
    },

    createEvent: async (args, req) => {
        if(!req.isAuth){
            throw new Error('Unauthenticated');
        }

        const newEvent = new Event({
            title: args.eventInput.title,
            description: args.eventInput.description,
            price: +args.eventInput.price,
            date: new Date(args.eventInput.date),
            creator: req.userId
        });
        let createdEvent;

        try{  
            const result = await newEvent.save();
            createdEvent = transformEvent(result);
            const creator = await User.findById(req.userId);
    
             if(creator){
                creator.createdEvents.push(newEvent); 
                await creator.save();
             }
            
             return createdEvent;
            
    
        }
        catch(err) {
            throw err;
        }
    }
}
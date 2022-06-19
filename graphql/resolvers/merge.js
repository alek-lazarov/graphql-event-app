const Event = require('../../models/event')
const User = require('../../models/user')
const { dateToString } = require('../../helpers/date')

const transformEvent = event => {
    return {
        ...event._doc,
        date: dateToString(event._doc.date),
        creator: user.bind(this, event.creator)
    }
}
const transformBooking = booking => {
    return {
        ...booking._doc, 
        createdAt: dateToString(booking._doc.createdAt), 
        updatedAt: dateToString(booking._doc.updatedAt),
        user: user.bind(this, booking._doc.user),
        event: getEventById.bind(this, booking._doc.event)
    }
}

const user = async userId => {
    try {
    const user = await User.findById(userId)
        return {
            ...user._doc,
            createdEvents: events.bind(this, user.createdEvents)
        }
    }
    catch(err) {
        throw err
    }
};

const events = async eventIds => {
    try
    {
        const events = await Event.find({_id: {$in: eventIds}})

        events.map(event => {
                return transformEvent(event)
            })
        return events;
    }
    catch(err){
        throw err
    }
};

const getEventById = async eventId => {
    try{
        const event = await Event.findById(eventId);

        return transformEvent(event)
    }
    catch(err){
        throw err;
    }
};

// exports.user = user;
// exports.events = events;
// exports.getEventById = getEventById;
exports.transformEvent = transformEvent;
exports.transformBooking = transformBooking;
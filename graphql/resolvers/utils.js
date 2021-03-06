const Event = require('../../models/event');
const User = require('../../models/user');
const { dateToString } = require('../helpers/date');

const events = async eventIds => {
    try {
        const events = await Event.find({ _id: { $in: eventIds } })
        return events.map(event => transformEvent(event));
    } catch (err) {
        console.log(err)
        throw err
    }
}

const user = userId => {
    return User.findById(userId)
        .then(user => {
            return {
                ...user._doc,
                _id: user.id,
                createdEvents: events.bind(this, user._doc.createdEvents)
            }
        })
        .catch(err => {
            console.log(err)
            throw err
        })
}

const singleEvent = async eventId => {
    try {
        const event = await Event.findById(eventId);
        return transformEvent(event);
    } catch (err) {
        throw err
    }
}

const transformBooking = booking => ({
    ...booking._doc,
    _id: booking.id,
    createdAt: dateToString(booking._doc.createdAt),
    updateAt: dateToString(booking._doc.createdAt),
    user: user.bind(this, booking._doc.user),
    event: singleEvent.bind(this, booking._doc.event)
})

const transformEvent = event => ({
    ...event._doc,
    _id: event.id,
    date: dateToString(event._doc.date),
    creator: user.bind(this, event.creator)
})

// exports.user = user;
// exports.events = events;
// exports.singleEvent = singleEvent;

exports.transformBooking = transformBooking;
exports.transformEvent = transformEvent;
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const subscriberSchema = mongoose.Schema({
    userTo: { //구독하려는 채널
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    userFrom: { //구독하려는 회원
        type: Schema.Types.ObjectId,
        ref: 'User'
    }
    
    
}, {timestamps: true})

const Subscriber = mongoose.model('Subscriber', subscriberSchema);

module.exports = { Subscriber }
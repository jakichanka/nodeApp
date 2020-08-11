const { Schema, model } = require('mongoose');

const schema = new Schema({
    text: {
        type: String,
        required: true,
    },
    creator: {
        type: String,
        required: true
    }
});

module.exports = model('Todos', schema)
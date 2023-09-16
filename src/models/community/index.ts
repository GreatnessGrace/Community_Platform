import { Schema , Types, model } from 'mongoose';
import { Snowflake } from '@theinternetfolks/snowflake';
const schema = new Schema({
    name:{
        type: String,
        unique: true,
        required: true,
        minLength: 2,
    },
    slug:{
        type: String,
        unique: true,
        required: true,
    },
    _id: {
        type: String,
        unique: true
    },
    owner: {
        type: String,
        ref: 'user',
        required: true,
    }
},{
    timestamps: true
});

export const COMMUNITY = model('community', schema) ;
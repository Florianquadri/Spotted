import mongoose from 'mongoose';
import users from './user.js';
import places from './place.js';

const Schema = mongoose.Schema;
// Define the schema for notes
const noteSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User'
      },
      place: {
        type: Schema.Types.ObjectId,
        ref: 'Place'
      },
      stars: {
        type: Number,
          required: true,
          validate: {
            validator: validateANote,
            message: '{VALUE} is not a valid note'
          }
        },
      text: {
        type: String
      }
    });

// Validate a note
function validateANote(value) {
  return Number.isNumber(value) && isBetween1And5(value);
}

function isBetween1And5(value) {
  return value >= 1 && value <= 5;
}


// Create the model from the schema and export it



export default mongoose.model('Note', noteSchema);
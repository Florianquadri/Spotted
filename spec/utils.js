import User from "../models/user.js"
import {jwtSecret} from "../config.js"
import Place from '../models/place.js'



export const cleanUpDatabase = async function() {
  await Promise.all([
    User.deleteMany(),
    Place.deleteMany()
  ]);
};

export function textFormat(text){
  let textLowerCase = text.toLowerCase();
  let finalText = textLowerCase.charAt(0).toUpperCase() + textLowerCase.slice(1);
  return finalText;
  }

  export function textFormatToCompare(text){
    return text.trim().toUpperCase();
   }


import jwt from "jsonwebtoken"
// ...
export function generateValidJwt(user) {
  // Generate a valid JWT which expires in 7 days.
  const exp = (new Date().getTime() + 7 * 24 * 3600 * 1000) / 1000;
  const claims = { sub: user._id.toString(), exp: exp };
  return new Promise((resolve, reject) => {
    jwt.sign(claims, jwtSecret, function(err, token) {
      if (err) {
        return reject(err);
      }
      resolve(token);
    });
  });
}


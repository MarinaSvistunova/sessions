const {	Schema,	model	}	= require('../conn');
const UserSchema	= new Schema({
  "login": {
    "type": "String"
  },
  "password": {
    "type": "String"
 }
},
);	 //	{"collection":	"users"} не	дописываем	потому	что	соглашение
const u	= model('User',	UserSchema);
module.exports = {	u };

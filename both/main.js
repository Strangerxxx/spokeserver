import { Meteor } from 'meteor/meteor';
import api from '../imports/api';
app = {
    api,
    Meteor
};
Meteor.methods(api.users.methods.toMeteorMethods());
Meteor.methods(api.phrases.methods.toMeteorMethods());
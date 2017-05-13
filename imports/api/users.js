//todo: exports: api.users
// import { Meteor } from 'meteor/meteor';
import SimpleSchema from 'simpl-schema';
import Methods from "../lib/methods";
/*
//todo: roles and user administration
Meteor.users.allow({
    update: (userId) => {
        if(Roles.userHasRole(userId , 'admin'))
            return !!userId;
    }
});
*/

let UserSchema = new SimpleSchema({
    username: {
        type: String,
        // For accounts-password, either emails or username is required, but not both. It is OK to make this
        // optional here because the accounts-password package does its own validation.
        // Third-party login packages may not require either. Adjust this schema as necessary for your usage.
        optional: true
    },
    emails: {
        type: Array,
        // For accounts-password, either emails or username is required, but not both. It is OK to make this
        // optional here because the accounts-password package does its own validation.
        // Third-party login packages may not require either. Adjust this schema as necessary for your usage.
        optional: true
    },
    "emails.$": {
        type: Object
    },
    "emails.$.address": {
        type: String,
        regEx: /^[-a-z0-9~!$%^&*_=+}{\'?]+(\.[-a-z0-9~!$%^&*_=+}{\'?]+)*@([a-z0-9_][-a-z0-9_]*(\.[-a-z0-9_]+)*\.(aero|arpa|biz|com|coop|edu|gov|info|int|mil|museum|name|net|org|pro|travel|mobi|[a-z][a-z])|([0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}))(:[0-9]{1,5})?$/i
    },
    "emails.$.verified": {
        type: Boolean
    },
    createdAt: {
        type: Date,
    },
    // Make sure this services field is in your schema if you're using any of the accounts packages
    services: {
        type: Object,
        optional: true,
        blackbox: true
    },
    // Add `roles` to your schema if you use the meteor-roles package.
    // Option 1: Object type
    // If you specify that type as Object, you must also specify the
    // `Roles.GLOBAL_GROUP` group whenever you add a user to a role.
    // Example:
    // Roles.addUsersToRoles(userId, ["admin"], Roles.GLOBAL_GROUP);
    // You can't mix and match adding with and without a group since
    // you will fail validation in some cases.
    // roles: {
    //     type: Object,
    //     optional: true,
    //     blackbox: true
    // },
    // Option 2: [String] type
    // If you are sure you will never need to use role groups, then
    // you can specify [String] as the type
    roles: {
        type: Array,
        optional: true,
    },
    'roles.$': {
        type: String
    },
    // In order to avoid an 'Exception in setInterval callback' from Meteor
    heartbeat: {
        type: Date,
        optional: true
    }
});

/*
//todo: new user form api extend
let NewUserSchema = new SimpleSchema({
    email: {
        type: String,
        regEx: /^[-a-z0-9~!$%^&*_=+}{\'?]+(\.[-a-z0-9~!$%^&*_=+}{\'?]+)*@([a-z0-9_][-a-z0-9_]*(\.[-a-z0-9_]+)*\.(aero|arpa|biz|com|coop|edu|gov|info|int|mil|museum|name|net|org|pro|travel|mobi|[a-z][a-z])|([0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}))(:[0-9]{1,5})?$/i
    },
    password: {
        type: String
    },
    profile: {
        type: Schema.UserProfile
    },
});
*/

let schemas = {
    UserSchema,
    /*//same
    NewUserSchema,*/
};

let methods = new Methods({
    CreateUserToken: {
        validate(args) {
            new SimpleSchema({
                userId: {type: Meteor.users}
            }).validate(args)
        },
        run({userId}){
            let stampedLoginToken = Accounts._generateStampedLoginToken();
            Accounts._insertLoginToken(userId, stampedLoginToken);
            return stampedLoginToken.token;
        },
        call(args, callback) {
            const options = {
                returnStubValue: true,
                throwStubExceptions: true
            };
            Meteor.apply(this.name, [args], options, callback);
        }
    }
}, 'users');

// console.log(methods);

Meteor.users.attachSchema(schemas.UserSchema);
export default {
    schemas,
    methods
}
/*if(Meteor.isServer){
    Meteor.publish("users", function (userId) {
        return Meteor.users.find();
    });

    Meteor.publish("currentUser", function (userId) {
        return Meteor.users.find(userId);
    });

    Meteor.methods({
        'users.createToken': (userId)=>{
            let stampedLoginToken = Accounts._generateStampedLoginToken();
            Accounts._insertLoginToken(userId, stampedLoginToken);
            return stampedLoginToken.token;
        },
        /!*!//same
        'users.create': (doc) => {
            let userId = Accounts.createUser({
                email: doc.email,
                password: doc.password,
                profile: doc.profile
            });
            let _variables = [];

            for(let _var in doc.variables){
                if(doc.variables.hasOwnProperty(_var))
                    _variables.push({
                        name: _var,
                        value: doc.variables[_var],
                        user: userId,
                    });
            }

            Meteor.call('variables.add', _variables);
            // if(userId === undefined) throw new Meteor.Error(403, 'Access denied!');
            return Meteor.call('users.createToken', userId);
        },*!/
        /!*!//same
        'users.delete': function (userId) {
            if(Roles.userHasRole(this.userId, 'admin') && this.userId != userId)
                Meteor.users.remove({_id: userId});
        },*!/
    });
}*/

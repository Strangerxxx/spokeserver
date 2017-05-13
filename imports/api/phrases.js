//todo: exports api.phrases
import SimpleSchema from 'simpl-schema';
import Methods from "../lib/methods";
let schemas = {
    PhraseSchema: new SimpleSchema({
        text: {
            type: String
        },
        audio: {
            type: String
        }
    })
};
let methods = new Methods({
    Say: {
        validate(args) {
            new SimpleSchema({
                text: {type: String}
            }).validate(args)
        },
        run({text}){
            console.log(text);
            return text;
        },
        call(args, callback) {
            const options = {
                returnStubValue: false,
                throwStubExceptions: false
            };
            Meteor.apply(this.name, [args], options, callback);
        }
    }
}, 'phrases');
export default {
    schemas,
    methods
}
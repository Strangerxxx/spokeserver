export default class {
    constructor(list, prefix){
        this.list = _.reduce(list, (methods, method, name)=>{
            methods[name] = _.extend(method, {name: prefix+'.'+name});
            return methods;
        }, {});
    }
    toMeteorMethods() {
        let list = this.list;
        return _.reduce(list, (functions, method, name)=>{
            functions[method.name] = function(args){
                method.validate.call(this, args);
                method.run.call(this, args);
            };
            return functions;
        }, {});
    }
}
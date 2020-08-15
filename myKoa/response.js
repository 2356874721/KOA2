module.exports = {
    set body(data){
        this._body = data
    },
    get body(){
        return this._body
    },
    get status (){
        return this.res.statusCode
    },
    set status(code){
        if(typeof code !== Number){
            throw new Error('statusCode必须是Number')
        }
        this.res.statusCode = code
    },
}
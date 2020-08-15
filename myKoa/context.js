let context = {}
let requestSet = []
let requestGet = ["query"]
let responseSet = ["body","status"]
let responseGet = responseSet

function delegateSet(property,name){
    context.__defineSetter__(name,function(val){
        this[property][name] = val
    })
}
function delegateGet(property,name){
    context.__defineGetter__(name,function(){
        return this[property][name]
    })
}
requestSet.forEach(item => {
    delegateSet('request',item)
})
requestGet.forEach(item => {
    delegateGet('request',item)
})
responseSet.forEach(item => {
    delegateSet('response',item)
})
responseGet.forEach(item => {
    delegateGet('response',item)
})

module.exports = context
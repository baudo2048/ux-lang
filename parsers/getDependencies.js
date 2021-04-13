/*
    RESTITUISCE una array di dependencies
*/

function isImport(t){
	const sentinel = t.substr(0,1)
	if (sentinel== "*")
		return true
	else
		return false
}

module.exports = function getDependencies(textCode) {

    var Lines = textCode.split('\n')
    var dependencies = []
    Lines.forEach( (v,i,a) => {
        var tokens = (v.trim()).split(' ')
        if(tokens.length==0 || tokens[0]==''){
            return
        }

        var leadToken = tokens[0]

        if(isImport(leadToken)){
            dependencies.push(leadToken.slice(1))
        }
    })
    return dependencies;
}



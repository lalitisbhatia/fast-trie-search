import parseRegex from "regex-parser";

type Options = {
    outputProps?: string[],
    addKey?: boolean,
    splitRegex?: string,
    excludeNodes?: string[]
 }

 class TrieNode{
    public map: any;
    public words: any;
    constructor(){
        this.map = {};
        this.words = []
    }    
}

const generateTrie = (objArray:any, searchProp:any, options: Options ={}) => {
    
    let expandedObjArray : any = []    
    let trieKey = 1;

    //Default Options
    const defaults = {
        outputProps : Object.keys(objArray[0]),
        splitRegex : "/[ ]/",
        addKey : false,
        excludeNodes : ["and","the","of","with","without","in","on","&","at","or","type","added","side","form","pre","unprepared","uncooked","solid","liquids","mix","cooked","raw","fresh"]
    }
    
    // assign defualts
    const opts = Object.assign({}, defaults, options);

    objArray.forEach((element: any) => {
        /*
        Expand the searchProp out. 
        If the search prop has a value "Stir-Fried Chicken with Jasmine rice", then create the following nodes:
        ->  "StirFried Chicken with Jasmine rice"
        ->  "Fried Chicken with Jasmine rice"
        ->  "Chicken with Jasmine rice"
        ->  "Jasmine rice"
        ->  "rice"
        and typing any of these values should return "Stir-Fried Chicken with Jasmine rice" as one of the results
        Note that there is no node starting with "with" since its part of the "excludeNodes" option
        */

        let expandedElement = element[searchProp].split(parseRegex(opts.splitRegex));     
        //now for each of the  expanded node, create the return object and push it into the expandedObjArray
        for(let i=0;i<expandedElement.length;i++){
            let nodeObj : any = {}
            opts.outputProps.forEach((prop:string) => {
                nodeObj[prop] = element[prop]
            })
            
            if(opts.addKey===true){
                nodeObj.key = trieKey++
            }

            if(!opts.excludeNodes.includes(expandedElement[i].toLowerCase())){
                expandedObjArray.push({node:expandedElement.slice(i).join(" ").toLowerCase(),nodeObj})
            }
        }
    })

    console.log( "total number of Trie words: ",expandedObjArray.length)
    
    //initialize the return Trie object
    const root = new TrieNode();
    //generate the Trie
    for (let i=0;i<expandedObjArray.length;i++){
        add (expandedObjArray[i],0,root);    
    }
    // empty out the top level array as it serves no purpose and adds to the size
    root.words=[] 
    return root;    
}

const add = (str:any,i:any, root:any) => {
    let node = str.node
    let name = str.name
    if(i=== node.length){
        root.words.push(str);
        return;
    }
    
    if(!root.map[node[i]]){        
        root.map[node[i]] = new TrieNode();
    }
    
    root.words.push(str);
    add(str,i+1,root.map[node[i]])
}

const search = (str:string,i:any,root: TrieNode):any => {
    str = str.toLowerCase();
    if(i===str.length && i!==0){
        // console.log(str, i,root.words)
        return root.words
    }
        
    if(!root.map[str[i]])
        return [];

    return search(str,i+1,root.map[str[i]]);
}

export {generateTrie, search, TrieNode, Options}
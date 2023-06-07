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
        excludeNodes : ["and","the","of","with","without","in","on","&","at","or","type"]
    }
    
    // Assign defualts
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
        // For each of the  expanded node, create the return object and push it into the expandedObjArray
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
    
    const root = new TrieNode();
    for (let i=0;i<expandedObjArray.length;i++){
        add (expandedObjArray[i],0,root);    
    }
    // empty out the top level array as it serves no purpose and adds to the size
    root.words=[] 
    return root;    
}

const add = (str:any,startIndex:any, root:TrieNode) => {
    let node = str.node

    if(startIndex=== node.length){
        root.words.push(str);
        return;
    }
    
    if(!root.map[node[startIndex]]){        
        root.map[node[startIndex]] = new TrieNode();
    }
    
    root.words.push(str);
    add(str,startIndex+1,root.map[node[startIndex]])
}

const search = (str: string, startIndex: number, root: TrieNode):any => {
    str = str.toLowerCase();
    if(startIndex===str.length && startIndex!==0){        
        return root.words
    }
        
    if(!root.map[str[startIndex]])
        return [];

    return search(str,startIndex+1,root.map[str[startIndex]]);
}

export {generateTrie, search, TrieNode, Options}
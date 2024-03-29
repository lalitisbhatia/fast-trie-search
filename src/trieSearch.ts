import parseRegex from "regex-parser";

type Options = {
    outputProps?: string[],
    addKey?: boolean,
    splitRegex?: string,
    searchStartIndex?:number,
    excludeNodes?: string[]
 }

 class TrieNode{
    public m: any; //map
    public w: any; //words 
    constructor(){
        this.m = {};
        this.w = []
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
        searchStartIndex: 0,
        excludeNodes : ["and","the","of","with","without","in","on","&","at","as","or","type"]
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
                nodeObj.k = trieKey++
            }

            if(!opts.excludeNodes.includes(expandedElement[i].toLowerCase())){
                expandedObjArray.push({node:expandedElement.slice(i).join(" ").toLowerCase(),nodeObj})
            }
        }
    })

    console.log( "total number of Trie words: ",expandedObjArray.length)
    
    const root = new TrieNode();
    for (let i=0;i<expandedObjArray.length;i++){
        add (expandedObjArray[i],0,root,opts.searchStartIndex);    
    }
    // empty out the top level array as it serves no purpose and adds to the size
    root.w=[] 
    return root;    
}

// searchStartIndex : the number of letters to type at which the search will return results. THis is 
// helpful in use cases where its unecessary to start at the first letter and helps reduce the trie size
const add = (str:any,startIndex:any, root:TrieNode, searchStartIndex:any) => {
    // console.log("STR: ", str)
    // console.log("str.nd: ", str.nd)
    // console.log("startIndex: ", startIndex)
    // console.log("-------------------------------------")
    let node = str.node

    if(startIndex=== node.length){     
        root["w"]=[]   
        root.w.push(str);
        return;
    }
    
    if(!root.m[node[startIndex]]){        
        root.m[node[startIndex]] = new TrieNode();
    }
    
    if(startIndex>=searchStartIndex) {        
        if(!root.w)
            root["w"]=[]
        root.w.push(str);        
    }        
    else{
        delete root.w
    }
    add(str,startIndex+1,root.m[node[startIndex]], searchStartIndex)
}

const search = (str: string, startIndex: number, root: TrieNode):any => {
    str = str.toLowerCase();
    if(startIndex===str.length && startIndex!==0){        
        return root.w
    }
        
    if(!root.m[str[startIndex]])
        return [];

    return search(str,startIndex+1,root.m[str[startIndex]]);
}

export {generateTrie, search, TrieNode, Options}
import {search, generateTrie, TrieNode, Options} from "../src/index"
const {books} = require("../src/data/sampleData");

describe('it should generate  trie object',() => {
    let opts : Options = {
        outputProps : ["title","author"],
        addKey:false,
        splitRegex:"/[ -]/"
    }

    let trie = generateTrie(books,'title',opts)
    it('should test that the map property exitst',() =>{
        expect(trie.map).toBeDefined()
    })
    it('should test that searching \'dogs\' should return 1 item',()=>{
        let results = search("dogs",0,trie);
        expect(results.length).toEqual(1)
    })
    it('should test that searching \'the\' should return 0 items',()=>{
        let results = search("the",0,trie);
        // console.log(results)
        expect(results.length).toEqual(0)
    })
    it('should test exclude nodes and that searching \'for\' should return 1 items',()=>{
        let results = search("for",0,trie);
        // console.log(results)
        expect(results.length).toEqual(1)
    })
    it('should test that search results to be an array  of objects with properties \'node\' and \'nodeObj\'',()=>{
        let results = search("the",0,trie);
        // console.log(results)
        results.forEach(res  =>{
            expect(res["node"]).toBeDefined();
            expect(res["nodeObj"]).toBeDefined();
        })                
    })

})

describe('it should test input options',() => {
    let opts : Options = {
        outputProps : ["title","author"],
        addKey:false,
        splitRegex:"/[ ]/",
        excludeNodes : ['the','a','for']
    }
    let trie = generateTrie(books,'title',opts)
    it('should test exclude nodes and that searching \'the\' should return 0 items',()=>{
        let results = search("the",0,trie);
        console.log(results)
        expect(results.length).toEqual(0)
    })
    it('should test exclude nodes and that searching \'for\' should return 0 items',()=>{
        let results = search("for",0,trie);
        // console.log(results)
        expect(results.length).toEqual(0)
    })
    it('should test splitRegex option and that searching \'road\' should return 0 items',()=>{
        let results = search("road",0,trie);
        // console.log(results)
        expect(results.length).toEqual(0)
    })    
    it('should test splitRegex option and that searching \'road\' should return 1 item',()=>{
        opts.splitRegex="/[ -]/"
        let trie = new TrieNode()
        trie = generateTrie(books,'title',opts)        
        // console.log(results)
        expect(search("road",0,trie).length).toEqual(1);
        expect(search("Star",0,trie).length).toEqual(1);
    })
    it('should test that search is case insensetive',()=>{
        expect(search("black d",0,trie).length).toEqual(1);
        expect(search("Black Dog",0,trie).length).toEqual(1);
        expect(search("Black Dog",0,trie).length).toEqual(1);
        expect(search("BLACk dOG",0,trie).length).toEqual(1);
    })
    it('should test output proerties',()=>{
        let results = search("rail",0,trie);
        // console.log(results)
        results.forEach(res =>{
            expect(res["node"]).toBeDefined();
            expect(res["nodeObj"]).toBeDefined();
            expect(res["nodeObj"]["title"]).toBeDefined();
            expect(res["nodeObj"]["author"]).toBeDefined();            
            expect(res["nodeObj"]["year"]).toBeUndefined();
        })  
    })
    it('should test default output proerties',()=>{
        delete opts.outputProps;
        let newTrie = new TrieNode()
        newTrie = generateTrie(books,'title',opts)
        let results = search("rail",0,newTrie);
        // console.log(results)
        results.forEach(res =>{
            expect(res["node"]).toBeDefined();
            expect(res["nodeObj"]).toBeDefined();
            expect(res["nodeObj"]["title"]).toBeDefined();
            expect(res["nodeObj"]["author"]).toBeDefined();            
            expect(res["nodeObj"]["year"]).toBeDefined();
        })  
    })
})











// console.log(search("herring",0,root))
// console.log(search("fish",0,root))
// console.log(search("cherries",0,root))
// console.log(search("ground",0,root))
// console.log(search("fresh",0,root))
// console.log(search("flour",0,root))
// console.log(search("goat",0,root))
// console.log(search("soft",0,root))

![](https://nodei.co/npm/fast-trie-search.png?downloads=True&stars=True)
# Fast-Trie-Search
This  package can be used to implement a super fast search-as-you-type funtionality using  a Trie data structure. It allow search on partial words and full or partial words within a sentence as well. For e.g in the phrase "how many roads must a man walk down", all these search inputs - many, how, wa, walk, do, dow, down, etc - will return the result. We can configure options so that preposition words or any words of choice are not searchable. For e.g words like 'a', 'on', 'the' etc. that we dont really care about searching on, can be eliminated in the optional params as described below - this is useful in keeping the size of the Trie object small. The list of such words is upto the user and depends on the context of the usage. 

The package contains 2 exposed methods and 2 types.
####        generateTrie()  
    This generates a  Trie object out of the input data source
###        search()        
    This is used for a super fast search-as-you-type on the Trie object
###        TrieNode        
    A class that defines the structre of the generated Trie object
###        Options         
    A type that defines the optional inputs to generating the Trie output for the generateTrie method 
    
# Install

```
npm i --save fast-trie-search
yarn add fast-trie-search
```
## Basic Usage (TypeScript)     
### GENERATE THE TRIE   
    generateTrie(args)    

    ARGS:
        objArray (Required):    This is the source data which is an array of objects - for e.g an array of recipes where 
                                each recipe object has various attributes like "name","description", "ingredients", etc.
        searchProp (Required):  This is the property on which the search is performed - in the above example, if the searchable 
                                attribute is "name" then pass that property as the input value
        options (optional params):                                
                outputProps :   Upon search, each returned item is an object and we dont have to return the entire object from the
                                from each object in objArray - only return what is needed for your specific use case
                                DEFAULT: return the entire object - Be careful as the returned Trie is a large object so only 
                                return the data that you need
                addKey :        Some use cases, say if you're ouputting a list on a React app, require a unique key for each item on the list
                                DEFAULT: false
                splitRegex :    This is the character on which to split the searchProp input. For eg, if the value of the input property, "name" 
                                is "Oven-fried pork chops" and we want to be able to type "pork" or "chops"  or "oven" to get this result back, then 
                                the input regex can be just "/[ ]/" ( just a space). 
                                BUT, if u want this result to come back for typing "fried" as well, 
                                then the splitRegex should include the "-" charactr , so the input value of splitRegex will be  "/[ -]/"
                                DEFAULT: " "  ( space character)
            
            excludeNodes :      List of words that we dont want to index out Trie object on. This is to help reduce the size os the Trie
                                DEFAULT:  ["and","of","with","without","in","on","&","at","or","type","side","form","pre","is","an","into"]


        USE CASE:            
            Make sure that you understand the structure of your data. 
            
            Say I have a collection of recipes:
            Each Recipe has this schema:
            {    
                "id": Number;
                "name": String;
                "description": String;
                "ingredients": any;
                "tags": String[];
                "difficultyLevel": String;                
                "instructions": any[];                
            }

            Requirements:
            1. Be able to search on the name field. For example for the recipe that has a name "Stir-Fried chicken with broccoli, red peppers and cashews"
            2. This result should return when the user types not just the start of the name but the start of ANY word in the name i.e it should return when 
                typing any of the dollowing:
                Sti.., fried, chi.. , broccoli, red, pepp... , cashe... etc
            3. In the search result, only the properties "name","id","ingredients" should be returned ( since the use case doesnt need other properties 
                and by specifying the specific properties, we save on the size of the Trie object)
            4. Show as a list on a React app so each item needs a unique key identifier

            To get the Trie object back, call the function thus:
    

    
```
import {search,generateTrie,Options, TrieNode} from "fast-trie-search" 
                
.... 
const myWrapperFuntion = () =.{ 
    const allRecipes = getAllMyRecipes()  // or any funciton call to fetch your data
    const searchProp = "name"
    const options: Options = {  /// all optional - see defaults above
        outputProps : ["name","id","ingredients"],
        addKey: true,
        splitRegex : "/[ -]/",
        excludeNodes : ['the','a','for','with','of','cooked','raw','solid','liquid'] 
    }
    const root:TrieNode generateTrie(recipesArray,searchProp,options)
}
```

#### Notes
        - This could be used in a backend service to return a Trie object on an api that a client can then use to search
        - WARNING: The Trie object can become pretty large for large data sets  - we're sacrificing space for speed so make sure that the Trie object is  generated only once and then cached if doesnt change too often, 

### SEARCH THE TRIE
   search(searchString, index, root) // default i=0, root is the full trie object

            If the Trie object is returned by an external service, then the client side will also need to import this package and in the onChange handler of the search input field, call the search method as shown in a React example below that is using useState for 2 properties: searchTerm and searchResults and using the corresponding setSearchResults method to update the component with the search results

#### Client Side Usage (React Example)             

```
import {search} from **"fast-trie-search"**
....
() => {
    let [searchTerm, setSearchTerm] = useState("")
    let [searchResults, setSearchResults] = useState([])
    // In this case theTrie object returned from an external service using a custom fetch component
                    
    const {data: recipeTrie} = useFetch("http://myApi/../../trie",true) 

    const searchHandler = (e) => {
        const str = e.target.value;                    
        setSearchTerm(str)

        let searchRes = **search(str, 0, recipeTrie)**.map(res => {
            return res.nodeObj;
        })
        setSearchResults(searchRes);                    
    }
}

...... 

{ 
    <input  
        className="search-input"
        type="text"
        required
        disabled={!recipeTrie}
        value= {searchTerm}
        placeholder="search more recipes"
        onChange={searchHandler}
    />
}
```

            
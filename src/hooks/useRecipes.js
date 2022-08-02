import { useState, useEffect } from 'react';
//API import

const useRecipes = (defaultSearchTerm) => {
    const [recipes, setRecipes] = useState([]);

    useEffect(() => {
        search(defaultSearchTerm);
    }, [defaultSearchTerm]);

    const search = async term => {
        // const response = await youtube.get('/search', {
        //     params: {
        //         q: term
        //     }
        // });
        console.log(term);
        //setRecipes(response.data.items);
    };

    return [recipes, search];
};

export default useRecipes;
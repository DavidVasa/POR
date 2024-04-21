const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');

const app = express();
const PORT = 5000;

// Middleware
app.use(bodyParser.json());

// Paths to JSON files
const pantryFilePath = './pantryList.json';
const recipeFilePath = './recipeList.json';

// Returns the names of all ingredients in pantryList
function getAllIngredientNames() {
    const pantryData = readJSONFile(pantryFilePath);
    const ingredientNames = Object.values(pantryData.pantryList).map(ingredient => ingredient.name);
    return ingredientNames;
}

// Adds a new ingredient and the atributes of it to the pantryList
function addIngredient(ingredientData) {
    const pantryData = readJSONFile(pantryFilePath);
    const ingredientId = Object.keys(pantryData.pantryList).length.toString(); // Generate ID
    pantryData.pantryList[ingredientId] = {
        id: ingredientId,
        name: ingredientData.name,
        quantity: ingredientData.quantity,
        unit: ingredientData.unit
    };
    writeJSONFile(pantryFilePath, pantryData);
}

// Removes an ingredient from pantryList
function deleteIngredient(ingredientId) {
    const pantryData = readJSONFile(pantryFilePath);
    if (pantryData.pantryList.hasOwnProperty(ingredientId)) {
        delete pantryData.pantryList[ingredientId];
        writeJSONFile(pantryFilePath, pantryData);
        return true; // Ingredient deleted successfully
    } else {
        return false; // Ingredient not found
    }
}


// Adds a new recipe and its ingredients to recipeList
function addRecipe(recipeData) {
    const recipeListData = readJSONFile(recipeFilePath);
    const recipeId = Object.keys(recipeListData.recipeList).length.toString(); // Generate recipe ID
    recipeListData.recipeList[recipeId] = {
        name: recipeData.name,
        ingredients: recipeData.ingredients
    };
    writeJSONFile(recipeFilePath, recipeListData);
}

// Deletes a recipe by its ID in recipeList
function deleteRecipeById(recipeId) {
    const recipeListData = readJSONFile(recipeFilePath);
    
    if (recipeListData.recipeList.hasOwnProperty(recipeId)) {
        delete recipeListData.recipeList[recipeId];
        writeJSONFile(recipeFilePath, recipeListData);
        return true; // Recipe deleted successfully
    } else {
        return false; // Recipe not found
    }
}


// Lists names of all recipes in recipeList
function getAllRecipeNames() {
    const recipeListData = readJSONFile(recipeFilePath);
    const recipeNames = Object.values(recipeListData.recipeList).map(recipe => recipe.name);
    return recipeNames;
}


// Returns recipes from recipeList that can be made with ingredients in pantryList
function getAvailableRecipes() {
    const pantryData = readJSONFile(pantryFilePath);
    const recipeListData = readJSONFile(recipeFilePath);

    const availableRecipes = [];

    // Iterate through each recipe
    for (const recipeId in recipeListData.recipeList) {
        if (recipeListData.recipeList.hasOwnProperty(recipeId)) {
            const recipe = recipeListData.recipeList[recipeId];
            let canMakeRecipe = true;

            // Check if all ingredients of the recipe are available in the pantry
            for (const ingredient of recipe.ingredients) {
                const pantryIngredient = pantryData.pantryList[ingredient.itemId];
                if (!pantryIngredient || pantryIngredient.quantity < ingredient.quantity) {
                    canMakeRecipe = false;
                    break;
                }
            }

            // If all ingredients are available, add the recipe to availableRecipes
            if (canMakeRecipe) {
                availableRecipes.push(recipe);
            }
        }
    }

    return availableRecipes;
}


//TODO replace the recipeID and ingredient ID to something that makes more sense (or maybe delete them).
// I am not sure about a way to automate the process of generating IDs reliably and having a track of what item corresponds to what ID at the same time.
// That would probably need another dictionary that holds these values together all the time
// Add app to functions


// Start server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
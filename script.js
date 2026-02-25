let inputItem = document.querySelector(".input-item")
let searchBtn = document.querySelector(".search")
let recipeContainer = document.querySelector(".recipe-container")
let recipeCloseBtn   = document.querySelector(".recipe-close")
let recipeDetailsContent = document.querySelector(".recipe-details-content")
async function fetchRecipes(query) {
    recipeContainer.innerHTML = "Fetching Recipes..."
    let url = `https://www.themealdb.com/api/json/v1/1/search.php?s=${query}`
    let response = await fetch(url)
    let data = await response.json()
    if (!data.meals) {
            recipeContainer.innerHTML = `
                <div class="error-state">
                    <div class="error-icon">❌</div>
                    <h2>Oops! No Meal Found</h2>
                    <p>We couldn't find any recipe with that name.</p>
                    <span>Try something like <b>"Pasta"</b>, <b>"Chicken"</b>, or <b>"Cake"</b>.</span>
                </div>
                `;
                return;
    }
    recipeContainer.innerHTML = ""
    data.meals.forEach(meal=>{
        const recipeDiv = document.createElement("div")
        recipeDiv.classList.add('recipe')
        recipeDiv.innerHTML = `<img src =${meal.strMealThumb}>
        <h3>${meal.strMeal}</h3>
        <p><span>${meal.strArea}</span> Dish</p>
        <p>Belongs to <span>${meal.strCategory}</span> Category</p>`
        let button = document.createElement("button")
        button.innerHTML = "View Recipe"
        recipeDiv.appendChild(button)
        button.addEventListener("click",function(){
            openRecipePopup(meal)
        })
        recipeContainer.appendChild(recipeDiv)
    })
}
searchBtn.addEventListener("click",function(e){
    e.preventDefault()
    let inputRecipe = inputItem.value.trim()
   if (!inputRecipe) {
    recipeContainer.innerHTML = `
        <div class="empty-state">
            <div class="empty-icon">🍽️</div>
            <h2>Ready to Cook?</h2>
            <p>Type the meal name in the search box to discover delicious recipes.</p>
        </div>
    `;
    return;
}
    fetchRecipes(inputRecipe)

})
function fetchIngredients(meal){
    let ingredients = ""
    for(let i=1;i<20;i++){
        let ingredient = meal[`strIngredient${i}`]
        let measure = meal[`strMeasure${i}`];
         if(ingredient && ingredient.trim() !== ""){
            ingredients += `<li>${measure ? measure : ""} ${ingredient}</li>`;
        }
    }

    return ingredients
}
function openRecipePopup(meal){
    recipeDetailsContent.innerHTML = `<h2 class="recipeName">${meal.strMeal}</h2>
    <h3>Ingredents:</h3>
    <ul class = "ingredientsList">${fetchIngredients(meal)}</ul>
    <div>
        <h3>Instructions: </h3>
        <p class="recipeInstructions">${meal.strInstructions}</p>
    </div>`
    
    recipeDetailsContent.parentElement.style.display = "block"
}
recipeCloseBtn.addEventListener("click",function(){
    recipeDetailsContent.parentElement.style.display = "none"
})

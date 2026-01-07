import { MainLayout, FilterSection, RecipeCard } from "../../components"
import { mockRecipes } from "../../data/mockRecipes"
function Dashboard()
{
    return (
        <div className="w-full pb-4">
            <MainLayout>
                <FilterSection/>
                <div className="recipes w-full sm:w-[95%] mx-auto px-3 sm:px-0">
                    <RecipeCard {...mockRecipes[0]}/>
                    <RecipeCard {...mockRecipes[1]}/>
                    <RecipeCard {...mockRecipes[1]}/>
                </div>
            </MainLayout>
        </div>
    )

}
export default Dashboard

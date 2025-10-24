import MainLayout from "../../components/mainLayout"
import FilterSection from "../../components/filterSection"
import Recipe from "../../components/recipe"
import { mockRecipes } from "../../data/mockRecipes"
function Dashboard()
{
    return (
        <div className="h-screen w-full bg-[#f9f6e8]">
            <MainLayout>
                <FilterSection/>
                <div className="recipes w-[95%] mx-auto">
                    <Recipe {...mockRecipes[0]}/>
                    <Recipe {...mockRecipes[1]}/>
                    <Recipe {...mockRecipes[1]}/>
                </div>
            </MainLayout>
        </div>
    )

}
export default Dashboard

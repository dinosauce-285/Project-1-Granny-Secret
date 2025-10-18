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
                <div className="recipes w-full mt-4">
                    <Recipe {...mockRecipes[0]}>
                            
                    </Recipe>
                </div>
            </MainLayout>
        </div>
    )

}
export default Dashboard

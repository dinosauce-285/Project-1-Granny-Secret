import MainLayout from "../../components/mainLayout"
import FilterSection from "../../components/filterSection"
function Dashboard()
{
    return (
        <div className="h-screen w-full bg-[#f9f6e8]">
            <MainLayout>
                <FilterSection/>
                <div className="recipes w-full h-[80vh] bg-gray-500"></div>
            </MainLayout>
        </div>
    )

}
export default Dashboard

import { Link } from "react-router-dom";
import { LuPlus } from "react-icons/lu";

function FloatingCreateButton() {
  return (
    <Link
      to="/create"
      className="lg:hidden fixed bottom-6 right-6 w-14 h-14 bg-primary text-white rounded-full shadow-lg hover:shadow-xl hover:scale-110 transition-all duration-300 flex items-center justify-center z-30 touch-manipulation group"
      aria-label="Create Recipe"
    >
      <LuPlus className="w-7 h-7 group-hover:rotate-90 transition-transform duration-300" />
    </Link>
  );
}

export default FloatingCreateButton;

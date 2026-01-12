import { useState } from "react";
import Heart from "../ui/Heart";
import MoreOptions from "../ui/MoreOptions";
import Dialog from "../ui/Dialog";
import api from "../../api/api";

function RecipeCard({
  id,
  imageUrl,
  title,
  createdAt,
  prepTime,
  cookTime,
  servings,
  difficulty,
  category,
  color,
  note,
  favourite,
}) {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const handleDeleteClick = (e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation(); 
    }
    setShowDeleteDialog(true);
  };

  const handleConfirmDelete = async (e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    try {
      await api.delete(`/recipes/${id}`);
      window.location.reload();
    } catch (error) { 
      console.error("Error deleting recipe:", error);
    }
  };

  return (
    <>
      <Dialog
        isOpen={showDeleteDialog}
        onClose={() => setShowDeleteDialog(false)}
        title="Delete Recipe"
        message={`Are you sure you want to delete "${title}"? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        confirmStyle="danger"
        onConfirm={handleConfirmDelete}
      />
      <div className="w-full min-h-56 sm:h-56 bg-white rounded-xl overflow-hidden flex flex-col sm:flex-row shadow-md my-4 sm:my-8 hover:-translate-y-1 hover:shadow-xl transition-transform duration-300 group">
        <img
          className="w-full sm:w-[25%] h-48 sm:h-full flex-shrink-0 object-cover object-center"
          src={imageUrl}
          alt={title}
        />

        <div className="main min-w-0 flex flex-1 flex-col px-3 sm:px-5 py-3 sm:py-5 justify-between">
          <div className="header w-full flex flex-col sm:flex-row items-start sm:items-center justify-between">
            <div className="title text-xl sm:text-2xl lg:text-3xl truncate w-full sm:w-auto font-medium font-inter">
              {title}
            </div>
            <div className="w-full sm:w-auto flex flex-row justify-between sm:justify-end items-center gap-3 text-gray-500">
              <div className="font-poppins text-xs sm:text-sm">
                Saved: {new Date(createdAt).toLocaleDateString()}
              </div>
              <Heart
                size="medium"
                className="bg-white/20 backdrop-blur-sm rounded-full hover:bg-white/40 hover:scale-110"
                recipeId={id}
                initialFavourite={favourite}
              />
              <MoreOptions onDelete={handleDeleteClick} />
            </div>
          </div>
          <div className="info flex flex-wrap sm:flex-nowrap gap-3 sm:gap-4 lg:gap-6 font-poppins text-xs sm:text-sm w-full">
            <div className="flex flex-row gap-1 sm:gap-2 items-center">
              <svg
                className="w-4 h-4 sm:w-5 sm:h-5 "
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                />
              </svg>
              <div>
                Prep: {prepTime}m | Cook: {cookTime}m
              </div>
            </div>
            <div className="flex flex-row gap-1 sm:gap-2 items-center">
              <svg
                className="w-4 h-4 sm:w-5 sm:h-5 "
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z"
                />
              </svg>
              <div>{servings}</div>
            </div>
            <div className="flex flex-row gap-1 sm:gap-2 items-center">
              <svg
                className="w-4 h-4 sm:w-5 sm:h-5 "
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15.362 5.214A8.252 8.252 0 0 1 12 21 8.25 8.25 0 0 1 6.038 7.047 8.287 8.287 0 0 0 9 9.601a8.983 8.983 0 0 1 3.361-6.867 8.21 8.21 0 0 0 3 2.48Z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 18a3.75 3.75 0 0 0 .495-7.468 5.99 5.99 0 0 0-1.925 3.547 5.975 5.975 0 0 1-2.133-1.001A3.75 3.75 0 0 0 12 18Z"
                />
              </svg>
              <div>{difficulty}</div>
            </div>
            <div className="flex flex-row gap-1 sm:gap-2 items-center">
              <svg
                className="w-4 h-4 sm:w-5 sm:h-5 "
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="m7.875 14.25 1.214 1.942a2.25 2.25 0 0 0 1.908 1.058h2.006c.776 0 1.497-.4 1.908-1.058l1.214-1.942M2.41 9h4.636a2.25 2.25 0 0 1 1.872 1.002l.164.246a2.25 2.25 0 0 0 1.872 1.002h2.092a2.25 2.25 0 0 0 1.872-1.002l.164-.246A2.25 2.25 0 0 1 16.954 9h4.636M2.41 9a2.25 2.25 0 0 0-.16.832V12a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 12V9.832c0-.287-.055-.57-.16-.832M2.41 9a2.25 2.25 0 0 1 .382-.632l3.285-3.832a2.25 2.25 0 0 1 1.708-.786h8.43c.657 0 1.281.287 1.709.786l3.284 3.832c.163.19.291.404.382.632M4.5 20.25h15A2.25 2.25 0 0 0 21.75 18v-2.625c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125V18a2.25 2.25 0 0 0 2.25 2.25"
                />
              </svg>
              <div>{category?.name || "Recipe"}</div>
            </div>
          </div>
          <div className="note font-inter font-light text-sm sm:text-md italic line-clamp-2">
            {note}
          </div>
        </div>
        <div
          style={{ backgroundColor: color }}
          className="w-full h-2 sm:w-[3%] sm:h-full flex-shrink-0"
        ></div>
      </div>
    </>
  );
}
export default RecipeCard;

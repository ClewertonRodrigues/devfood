interface FilterProps {
    nameFilter: string;
    onClick: () => void;
    active?: boolean;
}

export function FilterButton({ nameFilter, onClick, active }: FilterProps){
    return(
        <button
            type="button"
            onClick={onClick} 
            className={`rounded-full px-4 md:px-6 py-2 select-none shadow-md transition-all duration-300 
                ${active ? "bg-[#FA2828] text-white" : "bg-white text-gray-800 cursor-pointer hover:bg-[#e69a9a] hover:text-white active:scale-95"}`}
        >
            {nameFilter}
        </button>
    )
}
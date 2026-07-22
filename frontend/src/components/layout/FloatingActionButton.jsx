import { FaPlus } from "react-icons/fa";

const FloatingActionButton = () => {
    return (
        <button
            className="
                fixed
                bottom-24
                right-5
                z-50
                flex
                h-14
                w-14
                items-center
                justify-center
                rounded-full
                bg-blue-600
                text-white
                shadow-lg
                transition
                hover:bg-blue-700
                hover:scale-105
                active:scale-95
                lg:bottom-8
                lg:right-8
            "
        >
            <FaPlus className="text-lg" />
        </button>
    );
};

export default FloatingActionButton;
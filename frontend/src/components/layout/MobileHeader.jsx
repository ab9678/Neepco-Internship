import { FaBell } from "react-icons/fa";
import { HiOutlineSearch } from "react-icons/hi";

const MobileHeader = () => {
    return (
        <header className="sticky top-0 z-50 flex items-center justify-between border-b border-gray-200 bg-white px-4 py-3 shadow-sm">

            <h1 className="text-2xl font-bold text-blue-600">
                ISNS
            </h1>

            <div className="flex items-center gap-4">

                <button className="text-2xl text-gray-600 transition hover:text-blue-600">
                    <HiOutlineSearch />
                </button>

                <button className="relative text-2xl text-gray-600 transition hover:text-blue-600">
                    <FaBell />

                    <span className="absolute -right-1 -top-1 h-2.5 w-2.5 rounded-full bg-red-500"></span>
                </button>

            </div>

        </header>
    );
};

export default MobileHeader;
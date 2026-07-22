import {
    FaHome,
    FaUser,
    FaUsers,
    FaBell,
} from "react-icons/fa";

const BottomNavigation = () => {
    return (
        <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-gray-200 bg-white shadow-lg lg:hidden">

            <div className="flex items-center justify-around py-3">

                <button className="flex flex-col items-center text-blue-600">
                    <FaHome className="text-xl" />
                    <span className="mt-1 text-xs font-medium">
                        Feed
                    </span>
                </button>

                <button className="flex flex-col items-center text-gray-600 hover:text-blue-600">
                    <FaUsers className="text-xl" />
                    <span className="mt-1 text-xs font-medium">
                        Groups
                    </span>
                </button>

                <button className="flex flex-col items-center text-gray-600 hover:text-blue-600">
                    <FaBell className="text-xl" />
                    <span className="mt-1 text-xs font-medium">
                        Alerts
                    </span>
                </button>

                <button className="flex flex-col items-center text-gray-600 hover:text-blue-600">
                    <FaUser className="text-xl" />
                    <span className="mt-1 text-xs font-medium">
                        Profile
                    </span>
                </button>

            </div>

        </nav>
    );
};

export default BottomNavigation;
import {
    FaHome,
    FaSearch,
    FaUser,
    FaUsers,
    FaBell,
    FaSignOutAlt,
} from "react-icons/fa";

const menuItems = [
    {
        name: "Feed",
        icon: <FaHome />,
        path: "/feed",
    },
    {
        name: "Search",
        icon: <FaSearch />,
        path: "/search",
    },
    {
        name: "Profile",
        icon: <FaUser />,
        path: "/profile",
    },
    {
        name: "Groups",
        icon: <FaUsers />,
        path: "/groups",
    },
    {
        name: "Notifications",
        icon: <FaBell />,
        path: "/notifications",
    },
];
const DesktopSidebar = () => {
    return (
        <aside className="sticky top-0 flex h-screen w-72 flex-col border-r border-gray-200 bg-white px-6 py-8">

            <h1 className="mb-10 text-3xl font-bold text-blue-600">
                ISNS
            </h1>

            <nav className="flex flex-1 flex-col gap-2">

                {menuItems.map((item) => (
                    <button
                        key={item.name}
                        className="flex items-center gap-4 rounded-xl px-4 py-3 text-left text-gray-700 transition hover:bg-blue-50 hover:text-blue-600"
                    >
                        <span className="text-xl">
                            {item.icon}
                        </span>

                        <span className="font-medium">
                            {item.name}
                        </span>
                    </button>
                ))}

            </nav>

            <button
                className="mt-6 flex items-center gap-4 rounded-xl px-4 py-3 text-red-500 transition hover:bg-red-50"
            >
                <FaSignOutAlt className="text-xl" />

                <span className="font-medium">
                    Logout
                </span>
            </button>

        </aside>
    );
};

export default DesktopSidebar;
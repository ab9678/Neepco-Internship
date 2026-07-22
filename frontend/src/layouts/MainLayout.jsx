import DesktopSidebar from "../components/layout/DesktopSidebar";
import MobileHeader from "../components/layout/MobileHeader";
import BottomNavigation from "../components/layout/BottomNavigation";
import FloatingActionButton from "../components/layout/FloatingActionButton";

const MainLayout = ({ children }) => {
    return (
        <div className="min-h-screen bg-gray-100">

            {/* Mobile Header */}
            <div className="lg:hidden">
                <MobileHeader />
            </div>

            <div className="flex">

                {/* Desktop Sidebar */}
                <aside className="hidden lg:block w-72 shrink-0">
                    <DesktopSidebar />
                </aside>

                {/* Main Content */}
                <main className="flex-1 min-h-screen px-4 py-6 lg:px-8 lg:py-8">
                    {children}
                </main>

            </div>

            {/* Mobile Bottom Navigation */}
            <div className="lg:hidden">
                <BottomNavigation />
            </div>

            {/* Floating Action Button */}
            <FloatingActionButton />

        </div>
    );
};

export default MainLayout;
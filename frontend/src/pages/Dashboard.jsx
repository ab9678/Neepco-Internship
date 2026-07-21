import { useAuth } from "../contexts/AuthContext";

const Dashboard = () => {

    const { user } = useAuth();

    return (

        <div className="min-h-screen bg-slate-100">

            <header className="border-b bg-white shadow-sm">

                <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">

                    <h1 className="text-2xl font-bold text-blue-600">
                        ISNS
                    </h1>

                    <div className="text-right">

                        <p className="font-semibold text-slate-800">
                            {user?.fullName || "Employee"}
                        </p>

                        <p className="text-sm text-slate-500">
                            {user?.employeeId}
                        </p>

                    </div>

                </div>

            </header>

            <main className="mx-auto max-w-7xl p-6">

                <div className="rounded-xl border bg-white p-10 shadow">

                    <h2 className="text-3xl font-bold">
                        Welcome to ISNS 👋
                    </h2>

                    <p className="mt-3 text-slate-600">
                        Authentication is working successfully.
                    </p>

                </div>

            </main>

        </div>

    );

};

export default Dashboard;
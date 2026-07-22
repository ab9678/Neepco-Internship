const AuthHeader = ({ title, subtitle }) => {
    return (
        <div className="mb-8 text-center">

            <div className="mb-4 flex justify-center">

                <div
                    className="
                        flex
                        h-16
                        w-16
                        items-center
                        justify-center
                        rounded-full
                        bg-blue-600
                        text-sm
                        font-bold
                        text-white
                    "
                >
                    NEEPCO Social
                </div>

            </div>

            <h1 className="text-3xl font-bold text-slate-900">
                {title}
            </h1>

            {subtitle && (
                <p className="mt-2 text-sm text-slate-500">
                    {subtitle}
                </p>
            )}

        </div>
    );
};

export default AuthHeader;
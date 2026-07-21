const AuthInput = ({
    label,
    icon,
    error,
    required = false,
    ...props
}) => {
    return (
        <div className="mb-5">

            <label className="mb-2 flex items-center gap-1 text-sm font-medium text-slate-700">

                {label}

                {required && (
                    <span className="text-red-500">*</span>
                )}

            </label>

            <div
                className={`
                    flex
                    items-center
                    rounded-lg
                    border
                    bg-white
                    px-4
                    transition-all
                    ${
                        error
                            ? "border-red-500"
                            : "border-slate-300 focus-within:border-blue-600"
                    }
                    focus-within:ring-2
                    focus-within:ring-blue-200
                `}
            >

                {icon && (
                    <div className="mr-3 text-slate-400">
                        {icon}
                    </div>
                )}

                <input
                    {...props}
                    className="w-full bg-transparent py-3 outline-none"
                />

            </div>

            {error && (
                <p className="mt-1 text-sm text-red-500">
                    {error}
                </p>
            )}

        </div>
    );
};

export default AuthInput;
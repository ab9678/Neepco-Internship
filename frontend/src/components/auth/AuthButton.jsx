const AuthButton = ({
    children,
    loading = false,
    type = "submit",
    ...props
}) => {
    return (
        <button
            type={type}
            disabled={loading}
            {...props}
            className="
                mt-2
                w-full
                rounded-lg
                bg-blue-600
                py-3
                font-semibold
                text-white
                transition-all
                duration-200
                hover:bg-blue-700
                hover:shadow-lg
                disabled:cursor-not-allowed
                disabled:opacity-70
            "
        >
            {loading ? (
                <div className="flex items-center justify-center gap-2">

                    <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />

                    <span>Please wait...</span>

                </div>
            ) : (
                children
            )}
        </button>
    );
};

export default AuthButton;
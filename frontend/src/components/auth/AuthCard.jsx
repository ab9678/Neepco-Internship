const AuthCard = ({ children }) => {
    return (
        <div
            className="
                w-full
                max-w-md
                rounded-2xl
                border
                border-slate-200
                bg-white
                p-10
                shadow-xl
            "
        >
            {children}
        </div>
    );
};

export default AuthCard;
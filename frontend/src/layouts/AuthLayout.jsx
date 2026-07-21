const AuthLayout = ({ children }) => {
    return (
        <div
            className="
                flex
                min-h-screen
                items-center
                justify-center
                bg-gradient-to-br
                from-slate-100
                via-slate-50
                to-blue-100
                px-4
            "
        >
            {children}
        </div>
    );
};

export default AuthLayout;
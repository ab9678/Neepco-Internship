const CommentCard = ({ comment }) => {
    const employee = comment.author?.employee;

    return (
        <div className="flex gap-3 py-3">
            <img
                src={
                    employee?.profilePicture ||
                    `https://ui-avatars.com/api/?name=${encodeURIComponent(
                        `${employee?.firstName || ""} ${employee?.lastName || ""}`
                    )}`
                }
                alt="Profile"
                className="h-9 w-9 rounded-full object-cover border"
            />

            <div className="flex-1 rounded-xl bg-gray-100 px-4 py-3">
                <div className="flex items-center gap-2">
                    <span className="font-medium text-sm">
                        {employee?.firstName} {employee?.lastName}
                    </span>

                    <span className="text-xs text-gray-500">
                        {new Date(comment.createdAt).toLocaleString()}
                    </span>
                </div>

                <p className="mt-1 whitespace-pre-wrap break-words text-sm text-gray-800">
                    {comment.content}
                </p>
            </div>
        </div>
    );
};

export default CommentCard;
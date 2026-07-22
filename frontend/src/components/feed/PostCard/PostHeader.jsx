import { MoreHorizontal } from "lucide-react";

const PostHeader = ({ post }) => {
    const employee = post.author?.employee;

    return (
        <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
                <img
                    src={
                        employee?.profilePicture ||
                        "https://ui-avatars.com/api/?name=" +
                            encodeURIComponent(
                                `${employee?.firstName || ""} ${employee?.lastName || ""}`
                            )
                    }
                    alt={`${employee?.firstName} ${employee?.lastName}`}
                    className="h-11 w-11 rounded-full object-cover border"
                />

                <div>
                    <h3 className="font-semibold text-gray-900">
                        {employee?.firstName} {employee?.lastName}
                    </h3>

                    <p className="text-sm text-gray-500">
                        {employee?.designation} • {employee?.department}
                    </p>

                    <p className="text-xs text-gray-400">
                        {new Date(post.createdAt).toLocaleString()}
                    </p>
                </div>
            </div>

            <button className="rounded-full p-2 transition hover:bg-gray-100">
                <MoreHorizontal size={18} />
            </button>
        </div>
    );
};

export default PostHeader;
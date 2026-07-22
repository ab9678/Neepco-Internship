import { useState } from "react";

import { useAuth } from "../../../../contexts/AuthContext";

const CommentCard = ({
    comment,
    onEdit,
    onDelete,
}) => {
    const { user } = useAuth();

    const employee = comment.author?.employee;


    console.log("typeof:", typeof comment);
    console.log("isArray:", Array.isArray(comment));
    console.log("value:", comment);

    const [isEditing, setIsEditing] = useState(false);
    const [content, setContent] = useState(comment.content);
    const [loading, setLoading] = useState(false);

    const isOwner =
        user?._id === comment.author?._id;

    const handleSave = async () => {
        if (!content.trim()) return;

        try {
            setLoading(true);

            await onEdit(comment._id, content);

            setIsEditing(false);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async () => {
        const confirmDelete = window.confirm(
            "Delete this comment?"
        );

        if (!confirmDelete) return;

        await onDelete(comment._id);
    };

    return (
        <div className="flex gap-3 py-3">
            <img
                src={
                    employee?.profilePicture ||
                    `https://ui-avatars.com/api/?name=${encodeURIComponent(
                        employee?.fullName || ""
                    )}`
                }
                alt="Profile"
                className="h-9 w-9 rounded-full border object-cover"
            />

            <div className="flex-1 rounded-xl bg-gray-100 px-4 py-3">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <span className="text-sm font-medium">
                            {employee?.fullName}
                        </span>

                        <span className="text-xs text-gray-500">
                            {new Date(
                                comment.createdAt
                            ).toLocaleString()}
                        </span>
                    </div>

                    {isOwner && !isEditing && (
                        <div className="flex gap-3 text-xs">
                            <button
                                onClick={() =>
                                    setIsEditing(true)
                                }
                                className="text-blue-600 hover:text-blue-700"
                            >
                                Edit
                            </button>

                            <button
                                onClick={handleDelete}
                                className="text-red-600 hover:text-red-700"
                            >
                                Delete
                            </button>
                        </div>
                    )}
                </div>

                {isEditing ? (
                    <>
                        <textarea
                            value={content}
                            onChange={(e) =>
                                setContent(
                                    e.target.value
                                )
                            }
                            rows={3}
                            className="mt-3 w-full rounded-lg border border-gray-300 p-2 text-sm focus:border-blue-500 focus:outline-none"
                        />

                        <div className="mt-2 flex gap-2">
                            <button
                                onClick={handleSave}
                                disabled={loading}
                                className="rounded bg-blue-600 px-3 py-1 text-sm text-white hover:bg-blue-700 disabled:opacity-50"
                            >
                                Save
                            </button>

                            <button
                                onClick={() => {
                                    setContent(
                                        comment.content
                                    );
                                    setIsEditing(false);
                                }}
                                className="rounded bg-gray-300 px-3 py-1 text-sm hover:bg-gray-400"
                            >
                                Cancel
                            </button>
                        </div>
                    </>
                ) : (
                    <p className="mt-1 whitespace-pre-wrap break-words text-sm text-gray-800">
                        {comment.content}
                    </p>
                )}
            </div>
        </div>
    );
};

export default CommentCard;
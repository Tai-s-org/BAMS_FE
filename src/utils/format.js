export const formatDate = (dateString) => {
    if (!dateString) return "Chưa cập nhật"
    return new Date(dateString).toLocaleDateString("vi-VN", {
        year: "numeric",
        month: "long",
        day: "numeric",
    })
}


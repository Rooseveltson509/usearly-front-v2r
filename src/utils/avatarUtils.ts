export const getFullAvatarUrl = (path: string | null): string => {
    if (!path) return "/default-avatar.png";

    // URL absolue (ex: Cloudinary)
    if (path.startsWith("http://") || path.startsWith("https://")) {
        return path;
    }

    // Fichier local (ex: 'uploads/avatars/users/xxx.jpg')
    return `${import.meta.env.VITE_API_BASE_URL}/${path}`;
};


export const getResizedAvatarUrl = (url: string, width = 100, height = 100): string => {
    if (!url || !url.includes("res.cloudinary.com")) return url;

    return url.replace("/upload/", `/upload/w_${width},h_${height},c_thumb/`);
};

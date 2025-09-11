export const getFullAvatarUrl = (path: string | null | undefined): string => {
    if (!path) return ""; 

    if (path.startsWith("http://") || path.startsWith("https://")) {
        return path;
    }

    return `${import.meta.env.VITE_API_BASE_URL}/${path}`;
};

export const getResizedAvatarUrl = (url: string, width = 100, height = 100): string => {
    if (!url || !url.includes("res.cloudinary.com")) return url;

    return url.replace("/upload/", `/upload/w_${width},h_${height},c_thumb/`);
};


export const getDisplayName = (
    pseudo?: string,
    email?: string
): string => {
    return pseudo || email?.split("@")[0] || "?";
};

import type { PublicGroupedReport } from "@src/types/Reports";

export function mergeReportsByBrand(data: PublicGroupedReport[]): Record<string, PublicGroupedReport> {
    const merged: Record<string, PublicGroupedReport> = {};

    data.forEach(report => {
        if (!merged[report.marque]) {
            // Créer une copie profonde de report
            merged[report.marque] = {
                ...report,
                subCategories: [],
                totalCount: 0,
            };
        }

        report.subCategories.forEach(sc => {
            const existingSubCategory = merged[report.marque].subCategories.find(
                existing => existing.subCategory === sc.subCategory
            );

            if (existingSubCategory) {
                // Ajouter seulement les nouvelles descriptions (par id)
                sc.descriptions.forEach(desc => {
                    if (!existingSubCategory.descriptions.find(d => d.id === desc.id)) {
                        existingSubCategory.descriptions.push(desc);
                    }
                });

                // Mettre à jour le count avec le nombre réel de descriptions uniques
                existingSubCategory.count = existingSubCategory.descriptions.length;
            } else {
                // Ajouter la sous-catégorie entière
                merged[report.marque].subCategories.push({
                    subCategory: sc.subCategory,
                    count: sc.descriptions.length,
                    descriptions: [...sc.descriptions],
                });
            }
        });

        // Mettre à jour le totalCount en somme réelle des descriptions uniques
        merged[report.marque].totalCount = merged[report.marque].subCategories.length;

        /*         merged[report.marque].totalCount = merged[report.marque].subCategories.reduce(
                    (acc, sc) => acc + sc.descriptions.length,
                    0
                ); */
    });

    return merged;
}

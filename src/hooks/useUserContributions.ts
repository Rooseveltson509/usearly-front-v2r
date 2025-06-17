import { useEffect, useState } from "react";
import { getGroupedReportsByUser, getUserCoupsDeCoeur, getUserSuggestions } from "@src/services/feedbackService";
import { apiService } from "@src/services/apiService";

export const useUserContributions = () => {
    const [loading, setLoading] = useState(true);
    const [feedbacks, setFeedbacks] = useState(0);
    const [adoptedIdeas, setAdoptedIdeas] = useState(0);
    const [solutions, setSolutions] = useState(0);
    const [checks, setChecks] = useState(0);
    const [collaborations, setCollaborations] = useState(0);

    useEffect(() => {
        const fetchAll = async () => {
            try {
                const [reportsRes, coupsRes, suggestionsRes] = await Promise.all([
                    getGroupedReportsByUser(1, 100),
                    getUserCoupsDeCoeur(1, 100),
                    getUserSuggestions(1, 100),
                ]);

                // 📣 Feedbacks = total de tous les types
                const totalReports = reportsRes.results.length;
                const totalCdc = coupsRes.coupdeCoeurs.length;
                const totalSuggestions = suggestionsRes.suggestions.length;
                setFeedbacks(totalReports + totalCdc + totalSuggestions);

                // ✨ Idées adoptées (ex: suggestions avec .isAdopted = true)
                const adopted = suggestionsRes.suggestions.filter(s => s.isAdopted).length;
                setAdoptedIdeas(adopted);

                // 💡 Solutions proposées
                setSolutions(suggestionsRes.suggestions.length); // ou un champ `type: "solution"` si dispo

                // 🔍 Checks (nombre de bugs populaires confirmés)
                const { data: checksData } = await apiService.get("/user/confirmed-checks");

                setChecks(checksData.count || 0);

                // 👥 Collaborations (signalements avec plusieurs descriptions)
                const collabCount = reportsRes.results.filter(r => {
                    return r.subCategories?.some(sub => (sub.descriptions || []).length > 1);
                }).length;
                setCollaborations(collabCount);
            } catch (err) {
                console.error("❌ Erreur dans useUserContributions :", err);
            } finally {
                setLoading(false);
            }
        };

        fetchAll();
    }, []);

    return {
        loading,
        feedbacks,
        adoptedIdeas,
        solutions,
        checks,
        collaborations,
    };
};

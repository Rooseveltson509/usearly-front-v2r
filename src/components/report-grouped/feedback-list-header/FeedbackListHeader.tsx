interface Props {
    viewMode: "grouped" | "flat" | "chrono" | "filtered";
    onChange: (mode: "grouped" | "flat" | "chrono" | "filtered") => void;
}

const FeedbackListHeader = ({ viewMode, onChange }: Props) => {
    return (
        <div className="view-toggle">
            <button className={viewMode === "grouped" ? "active" : ""} onClick={() => onChange("grouped")}>
                Vue par marque
            </button>
            <button className={viewMode === "flat" ? "active" : ""} onClick={() => onChange("flat")}>
                Vue simple
            </button>
            <button className={viewMode === "chrono" ? "active" : ""} onClick={() => onChange("chrono")}>
                Tri par date
            </button>
            <button className={viewMode === "filtered" ? "active" : ""} onClick={() => onChange("filtered")}>
                Filtrer
            </button>
        </div>

    );
};

export default FeedbackListHeader;

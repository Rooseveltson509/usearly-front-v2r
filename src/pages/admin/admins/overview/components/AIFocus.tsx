import "./AIFocus.scss";

type AIFocusProps = {
  focus?: {
    brands?: string[];
    categories?: string[];
  };
};

export function AIFocus({ focus }: AIFocusProps) {
  if (!focus) return null;

  const { brands = [], categories = [] } = focus;

  return (
    <section className="ai-focus-card">
      <header className="ai-focus-header">
        <span className="ai-focus-badge">Priorité AI</span>
        <h3>Focus prioritaire</h3>
        <p>Zones nécessitant une attention immédiate</p>
      </header>

      <div className="ai-focus-content">
        {brands.length > 0 && (
          <div className="focus-group danger">
            <h4>🔥 Marques critiques</h4>
            <ul>
              {brands.map((brand) => (
                <li key={brand}>
                  <span className="dot danger" />
                  <strong>{brand}</strong>
                </li>
              ))}
            </ul>
          </div>
        )}

        {categories.length > 0 && (
          <div className="focus-group warning">
            <h4>⚠️ Catégories sensibles</h4>
            <ul>
              {categories.map((cat) => (
                <li key={cat}>
                  <span className="dot warning" />
                  {cat}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </section>
  );
}

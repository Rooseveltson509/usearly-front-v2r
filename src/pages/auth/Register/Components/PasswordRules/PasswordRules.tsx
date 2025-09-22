import { useMemo } from "react";
import "./styles/PasswordRules.scss";

export type RuleKey = "length" | "lowercase" | "uppercase" | "number" | "special";
type Rule = { label: string; test: (val: string) => boolean };

type Props = {
  value: string;
  enabled?: RuleKey[];
  rules?: Partial<Record<RuleKey, Rule>>;
  forceVisible?: boolean; 
  allowedSpecialChars?: string;
  className?: string;
};

const allowedSpecialCharsDefault = "@$!%*?&";

function escapeForRegex(s: string) {
  return s.replace(/[-/\\^$*+?.()|[\]{}]/g, "\\$&");
}

function makeDefaultRules(minLength: number, allowed: string): Record<RuleKey, Rule> {
  const invalidSpecial = new RegExp(`[^\\w${escapeForRegex(allowed)}]`);
  return {
    length:    { label: `Au moins ${minLength} caractères.`,  test: value => value.length >= minLength },
    lowercase: { label: "Au moins une lettre minuscule.",     test: value => /[a-z]/.test(value) },
    uppercase: { label: "Au moins une lettre majuscule.",     test: value => /[A-Z]/.test(value) },
    number:    { label: "Au moins un chiffre.",               test: value => /\d/.test(value) },
    special:   {
      label: `Au moins un caractère spécial (${allowed}).`,
      test: value => /[^A-Za-z0-9]/.test(value) && !invalidSpecial.test(value),
    },
  };
}

export default function PasswordRules({
  value,
  enabled,
  rules,
  forceVisible = false,
  allowedSpecialChars = allowedSpecialCharsDefault,
  className,
}: Props) {
  const defaults = useMemo(
    () => makeDefaultRules(8, allowedSpecialChars),
    [allowedSpecialChars]
  );

  const merged = useMemo(() => ({ ...defaults, ...rules }), [defaults, rules]);

  const entries = useMemo(
    () =>
      (Object.entries(merged) as [RuleKey, Rule][])
        .filter(([k]) => !enabled || enabled.includes(k)),
    [merged, enabled]
  );

  const disallowed = useMemo(() => {
    const re = new RegExp(`[^\\w${escapeForRegex(allowedSpecialChars)}]`);
    return re.test(value);
  }, [value, allowedSpecialChars]);

  // ✅ Vérifier si toutes les règles passent
  const allValid = entries.every(([_, rule]) => rule.test(value));

  // ✅ Afficher si : valeur saisie ET (pas valide OU forçage)
  const shouldShow = value.length > 0 && (!allValid || forceVisible);

  if (!shouldShow) return null;

  return (
    <div className={className}>
      <div className="password-rules">
        {entries.map(([key, rule]) => (
          <span key={key} className={rule.test(value) ? "valid" : "invalid"}>
            {rule.label}
          </span>
        ))}
      </div>
      {disallowed && (
        <p className="invalid-special">
          Caractère non autorisé détecté. Seuls{" "}
          <strong>{allowedSpecialChars.split("").join(" ")}</strong> sont permis.
        </p>
      )}
    </div>
  );
}

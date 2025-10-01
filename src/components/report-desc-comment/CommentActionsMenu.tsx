import { useState, useRef, useEffect } from "react";
import { MoreHorizontal, Trash2 } from "lucide-react";

const CommentActionsMenu = ({ onDelete }: { onDelete: () => void }) => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="comment-actions-menu" ref={menuRef}>
      <button className="menu-toggle-btn" onClick={() => setIsOpen(!isOpen)}>
        <MoreHorizontal size={18} />
      </button>
      {isOpen && (
        <div className="menu-dropdown">
          <button className="menu-item delete" onClick={onDelete}>
            <Trash2 size={14} /> Supprimer
          </button>
          {/* <button className="menu-item">
                        <Edit3 size={14} /> Modifier
                    </button>
                    <button className="menu-item">
                        <Link size={14} /> Copier le lien
                    </button> */}
        </div>
      )}
    </div>
  );
};

export default CommentActionsMenu;

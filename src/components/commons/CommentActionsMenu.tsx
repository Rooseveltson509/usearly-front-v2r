import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { MoreHorizontal, Trash2 } from "lucide-react";
import "./CommentActionsMenu.scss"; // styles ci-dessous

interface Props {
  onDelete: () => void;
}

const CommentActionsMenu: React.FC<Props> = ({ onDelete }) => {
  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <button
          className="comment-actions-trigger"
          aria-label="Actions commentaire"
        >
          <MoreHorizontal size={18} />
        </button>
      </DropdownMenu.Trigger>

      <DropdownMenu.Portal>
        <DropdownMenu.Content
          className="comment-actions-content"
          sideOffset={4}
          align="end"
        >
          <DropdownMenu.Item
            className="comment-actions-item delete"
            onSelect={onDelete}
          >
            <Trash2 size={14} /> Supprimer
          </DropdownMenu.Item>
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
};

export default CommentActionsMenu;

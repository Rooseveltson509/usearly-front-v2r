import "./UserBrandBlock.scss";

interface ImageModalProps {
  imageUrl: string;
  onClose: () => void;
}

const ImageModal: React.FC<ImageModalProps> = ({ imageUrl, onClose }) => {
  return (
    <div className="image-modal-overlay" onClick={onClose}>
      <img
        src={imageUrl}
        alt="capture agrandie"
        className="image-modal"
        onClick={(e) => e.stopPropagation()}
      />
    </div>
  );
};

export default ImageModal;

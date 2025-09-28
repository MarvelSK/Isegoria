interface ImageMessageProps {
  src: string;
  alt: string;
}

export default function ImageMessage({ src, alt }: ImageMessageProps) {
  const handleImageClick = () => {
    console.log('Image clicked:', src);
    // TODO: Implement image modal/preview
  };

  return (
    <div className="relative group">
      <img
        src={src}
        alt={alt}
        className="max-w-full h-auto rounded-xl border-2 border-white/20 shadow-lg cursor-pointer hover:shadow-xl transition-all duration-200 hover:scale-[1.02]"
        onClick={handleImageClick}
        data-testid="image-message"
        style={{ maxHeight: '300px', objectFit: 'cover' }}
      />
      {/* Image overlay for better visibility */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none" />
    </div>
  );
}
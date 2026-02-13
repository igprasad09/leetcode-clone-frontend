interface GradientButtonProps {
  text?: string;
  onClick?: () => void;
}

const GradientButton = ({ text = "Join now", onClick }: GradientButtonProps) => {
  return (
    <button
      onClick={onClick}
      className="w-[150px] py-3 text-white font-bold text-[1em] rounded 
      bg-neutral-600 transition-all duration-200
      hover:scale-110 hover:-translate-y-[1px]
      hover:bg-[linear-gradient(to_right,
      rgb(250,82,82),
      rgb(250,82,82)_16.65%,
      rgb(190,75,219)_16.65%,
      rgb(190,75,219)_33.3%,
      rgb(76,110,245)_33.3%,
      rgb(76,110,245)_49.95%,
      rgb(64,192,87)_49.95%,
      rgb(64,192,87)_66.6%,
      rgb(250,176,5)_66.6%,
      rgb(250,176,5)_83.25%,
      rgb(253,126,20)_83.25%,
      rgb(253,126,20)_100%,
      rgb(250,82,82)_100%)]
      hover:bg-[length:150px_100%]
      hover:animate-dance"
    >
      {text}
    </button>
  );
};

export default GradientButton;



export default function AuthButtons({ onButtonClick }) {
  return (
    <div className="flex gap-4">
      <button
        onClick={() => onButtonClick('login')}
        className="px-4 py-2 border border-blue-400 text-blue-400 rounded-lg hover:bg-blue-400/10 transition-colors"
      >
        Login
      </button>
      <button
        onClick={() => onButtonClick('signup')}
        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
      >
        Signup
      </button>
    </div>
  );
}
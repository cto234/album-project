import cows from '../images/cows.jpg';

const Header = () => {
  return (
    <div
      className="relative text-2xl font-bold p-8 m-2 rounded-lg bg-cover bg-center min-h-[500px] flex items-center justify-center"
      style={{ backgroundImage: `url(${cows})` }}
    >
      {/* Title stays centered */}
      <h1 className="text-yellow-400 text-7xl relative inline-block after:block">
        Out of Five
      </h1>

      {/* Paragraph anchored near the bottom */}
      <p className="absolute bottom-[2%] text-white px-8 font-normal text-center" style={{ fontSize: "1.2rem" }}>
        It's a well known fact that cows love music. I've compiled some of the brightest artistic minds in the cattle community to find, once and for all, the definitive ratings for this handful of albums.
      </p>
    </div>
  );
};



export default Header;


